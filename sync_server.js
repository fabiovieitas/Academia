/**
 * Servidor de Sincronização em Nuvem / Local para Fábio e Adlai
 * Sincroniza bi-direcionalmente Notebook <-> Celular APK
 * Suporte a Bioimpedância (Visão OCR com FreeLLMAPI e Gemini)
 */
import http from 'node:http';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5174;
const DB_FILE = path.join(__dirname, 'sync_database.json');

// Inicializa banco de dados
let db = {
  Fabio: { state: null, ts: 0 },
  Adlai: { state: null, ts: 0 }
};

if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch(e) {}
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

const server = http.createServer((req, res) => {
  // CORS para permitir conexões do Notebook (localhost:5173) e Celular (APK / IP / Túnel)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Bypass-Tunnel-Reminder');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Endpoint de Saúde
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', time: Date.now() }));
  }

  // Endpoint de IA com Failover Inteligente (FreeLLMAPI + Gemini) e suporte a Visão/Bioimpedância
  if (url.pathname === '/ai/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const userPrompt = payload.prompt || '';
        const profile = payload.profile || 'Fabio';
        const imageBase64 = payload.image || null; // base64 da imagem da balança

        const sysPrompt = 'Você é o Personal Trainer de elite e especialista em fisiologia de ' + profile + ' no openGym. ' +
          'Responda sempre em Português do Brasil com orientações técnicas, empáticas e motivadoras.\n\n' +
          'REGRAS ESPECIAIS DE RESPOSTA:\n' +
          '1. CRIAÇÃO DE TREINO: Se o usuário pedir para criar ou sugerir um treino/rotina, inclua no final exatamente um bloco ```json com: {"action":"add_routine","name":"Nome do Treino","exercises":[{"name":"Supino Reto com Barra","sets":4,"reps":10,"weight":20}]}\n' +
          '2. LEITURA DE BIOIMPEDÂNCIA / BALANÇA: Se o usuário enviar uma foto/imagem de relatório de bioimpedância ou exame, analise todos os números visíveis e forneça um resumo clínico completo (evolução, pontos de atenção, estratégias de treino e cardio recomendadas). Além disso, inclua OBRIGATORIAMENTE no final da resposta um bloco com a tag ```bio_data e ``` no formato JSON rigoroso:\n' +
          '```bio_data\n{\n' +
          '  "weight": 78.5,\n' +
          '  "bodyFat": 18.2,\n' +
          '  "muscleMass": 35.4,\n' +
          '  "visceralFat": 5,\n' +
          '  "water": 58.1,\n' +
          '  "bmr": 1720,\n' +
          '  "bmi": 24.3\n' +
          '}\n```\n' +
          '(Preencha com os valores numéricos reais lidos na imagem; omita ou defina como null apenas os campos não visíveis).\n' +
          '3. PROGRESSÃO DE CARGA & DELOAD: Sempre que avaliar desempenho recente, recomende acréscimos progressivos de 1 a 2kg se as séries foram completadas com facilidade, ou semanas de Deload (-30% volume) caso haja queixa de estagnação prolongada ou dores articulares.';

        let aiText = '';

        // 1. Se tem imagem, tenta o Gemini 2.5 Flash Vision primeiro (precisão cirúrgica de OCR)
        if (imageBase64) {
          try {
            const cleanB64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

            const geminiKey = process.env.GEMINI_API_KEY || '';
            const gUrl = geminiKey ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiKey : '';
            
            const gReq = await fetch(gUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: sysPrompt }] },
                contents: [{
                  role: 'user',
                  parts: [
                    { text: userPrompt || 'Por favor, analise este relatório da minha balança de bioimpedância. Extraia todas as métricas para o formato bio_data e me dê o diagnóstico clínico com ajustes no treino.' },
                    { inlineData: { mimeType: mimeType, data: cleanB64 } }
                  ]
                }]
              })
            });

            if (gReq.ok) {
              const gData = await gReq.json();
              aiText = gData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            }
          } catch(vErr) {
            console.log('Gemini Vision falhou ou sem rede externa, tentando FreeLLMAPI...', vErr.message);
          }
        }

        // 2. Se for texto puro ou se o vision precisou de fallback, usa FreeLLMAPI local
        if (!aiText) {
          try {
            const messages = [{ role: 'system', content: sysPrompt }];
            if (Array.isArray(payload.history)) {
              payload.history.forEach(item => {
                messages.push({
                  role: item.role === 'model' ? 'assistant' : 'user',
                  content: item.text || ''
                });
              });
            }

            if (imageBase64) {
              messages.push({
                role: 'user',
                content: [
                  { type: 'text', text: userPrompt || 'Analise este relatório de bioimpedância e extraia os dados em bio_data.' },
                  { type: 'image_url', image_url: { url: imageBase64 } }
                ]
              });
            } else {
              messages.push({ role: 'user', content: userPrompt });
            }

            // Usa o FreeLLMAPI local na porta 3001 com gemini-2.5-flash / auto
            const flReq = await fetch('http://127.0.0.1:3001/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer freellmapi-0af93b3a0e1cbe45a5785fd84071080555fc11b147d6f7f2'
              },
              body: JSON.stringify({
                model: 'gemini-2.5-flash',
                messages: messages
              })
            });
            if (flReq.ok) {
              const flData = await flReq.json();
              aiText = flData?.choices?.[0]?.message?.content || '';
            }
          } catch(flErr) {
            console.log('FreeLLMAPI indisponível, tentando Gemini texto...', flErr.message);
          }
        }

        // 3. Fallback final para texto se ainda não respondeu
        if (!aiText) {
          const geminiKey = process.env.GEMINI_API_KEY || '';
          const gUrl = geminiKey ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiKey : '';
          const gReq = await fetch(gUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                role: 'user',
                parts: [{ text: sysPrompt + '\n\n' + userPrompt }]
              }]
            })
          });
          if (gReq.ok) {
            const gData = await gReq.json();
            aiText = gData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          }
        }

        if (!aiText) {
          aiText = 'Não consegui obter uma resposta dos servidores de IA no momento. Por favor tente novamente.';
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ text: aiText }));
      } catch(e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Puxar estado: GET /sync/pull?profile=Fabio
  if (url.pathname === '/sync/pull' && req.method === 'GET') {
    const profile = url.searchParams.get('profile') || 'Fabio';
    const clientTs = Number(url.searchParams.get('ts')) || 0;
    const serverData = db[profile] || { state: null, ts: 0 };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      hasUpdate: serverData.ts > clientTs,
      serverTs: serverData.ts,
      state: serverData.state
    }));
  }

  // Enviar estado: POST /sync/push
  if (url.pathname === '/sync/push' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const profile = payload.profile || 'Fabio';
        const clientTs = Number(payload.ts) || Date.now();
        const clientState = payload.state;

        if (!db[profile]) db[profile] = { state: null, ts: 0 };

        // Se o que o cliente mandou é mais recente ou o servidor está vazio
        if (clientTs >= db[profile].ts || !db[profile].state) {
          db[profile].state = clientState;
          db[profile].ts = clientTs;
          saveDB();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ status: 'saved', ts: clientTs }));
        } else {
          // Servidor tem versão mais recente
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            status: 'conflict_server_newer',
            serverTs: db[profile].ts,
            serverState: db[profile].state
          }));
        }
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Endpoints de Atualização de APK Direto pelo App
  if (url.pathname === '/apk/info' && req.method === 'GET') {
    try {
      const variant = (url.searchParams.get('variant') || 'full').toLowerCase();
      const fileName = variant === 'lite' ? 'openGym-Lite.apk' : 'openGym-Fabio-Adlai.apk';
      const apkPath = path.join(__dirname, fileName);
      if (!fs.existsSync(apkPath)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'APK não encontrado no servidor local' }));
      }
      const stat = fs.statSync(apkPath);
      const changelogPath = path.join(__dirname, 'CHANGELOG.md');
      let version = '1.5.9';
      if (fs.existsSync(changelogPath)) {
        const cl = fs.readFileSync(changelogPath, 'utf-8');
        const m = cl.match(/\[Versão\s+([0-9.]+)\]/);
        if (m && m[1]) version = m[1];
      }
      if (!globalThis.__apkHashCache) globalThis.__apkHashCache = {};
      const cached = globalThis.__apkHashCache[fileName];
      let sha256 = null;
      if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
        sha256 = cached.sha256;
      } else {
        const hash = crypto.createHash('sha256');
        hash.update(fs.readFileSync(apkPath));
        sha256 = hash.digest('hex');
        globalThis.__apkHashCache[fileName] = { mtimeMs: stat.mtimeMs, size: stat.size, sha256 };
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        version,
        variant,
        fileName,
        size: stat.size,
        sha256,
        downloadPath: '/apk/download/' + fileName
      }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  if (url.pathname.startsWith('/apk/download/') && req.method === 'GET') {
    const fileName = path.basename(url.pathname);
    if (fileName !== 'openGym-Lite.apk' && fileName !== 'openGym-Fabio-Adlai.apk') {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Forbidden');
    }
    const apkPath = path.join(__dirname, fileName);
    if (!fs.existsSync(apkPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('APK not found');
    }
    const stat = fs.statSync(apkPath);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${fileName}"`
    });
    fs.createReadStream(apkPath).pipe(res);
    return;
  }

  // 404 para outras rotas
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor de Sincronização & IA openGym rodando em http://0.0.0.0:${PORT}`);
});
