# 📜 Log de Atualizações & Novidades - openGym (Fábio & Adlai)

## [Versão 1.5.8] - 2026-11-24
### 🚀 Correção Definitiva de Rolagem Vertical (Scroll & Touch)
- **🔓 Remoção de Conflito de Containers CSS:** Removidas as sobrescritas de `overflow-x: hidden`, `overflow-y: auto` e `height: auto !important` em `html`, `body`, `#root`, `#app`, `.page` e `.page-in`, que criavam contêineres de rolagem aninhados sem altura livre no Android WebView/Chromium e bloqueavam o arrasto vertical.
- **📱 Ajuste Fino da Barra Superior:** Redução leve de espaçamentos para caber integralmente em telas de `360px` ou maiores sem cortar ícones e com `z-index` abaixo de modais e tour guiado.
- **⚡ Reativação da Store em Tempo Real:** Restaurado o vínculo `window.__useStore` no bundle principal para sincronização e troca instantânea entre os perfis Fábio e Adlai.

## [Versão 1.5.5] - 2026-11-23
### 🚀 Novidades & Correções Críticas
- **🔓 Destravamento Definitivo do Scroll Vertical:**
  - Removido o lock nativo de `body.style.position = 'fixed'` e `overscroll-behavior-y: none`.
  - Aplicado `position: static !important; overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; touch-action: pan-y !important;` em `html`, `body`, `#root`, `#app` e `.page`, destravando 100% a rolagem de tela para ver todos os exercícios e cards abaixo do topo.
  - Otimização do CSS compilado eliminando `overflow-x: clip` que bloqueava o cálculo de scroll em WebViews Android.

## [Versão 1.5.4] - 2026-11-23
### 🚀 Novidades & Correções Críticas
- **🔓 Destravamento de Rolagem (Scroll Vertical):** Correção completa de `touch-action: pan-y`, `overflow-y: auto` e remoção de restrições de altura fixa no `body` e `#root`, permitindo descer e subir a tela livremente.
- **🛡️ Remoção Imediata de Overlays:** Desativação agressiva de backdrops invisíveis em primeiro plano para garantir que os toques alcancem o conteúdo.

## [Versão 1.5.3] - 2026-11-23
### 🚀 Novidades & Correções Críticas
- **📱 Barra Superior Compacta (Sem overflow):** Redesenhada com botões compactos e ícones (`[🏋️‍♂️ Fábio | 🏋️‍♀️ Adlai]`, `[📋 Treino IA]`, `[💬 Chat IA]`, `[📊]`, `[🔄]`), eliminando completamente a necessidade de arrastar para o lado.
- **🔓 Desbloqueio Geral de Toques:** Correção do z-index e eliminação definitiva do overlay de splash (`#boot`), destravando todos os cliques em cards, exercícios e rotinas do `#root`.
- **🔄 Atualização OTA Direta no Próprio APK:** Bootstrap dinâmico no carregamento que aplica versões mais recentes do GitHub instantaneamente pelo botão `[🔄]`.

## [Versão 1.5.2] - 2026-11-23
### 🚀 Novidades & Correções
- **📱 Correção Visual de Cabeçalho:** Header fixo e espaçamento seguro contra sobreposição do card de próximo treino.
- **📋 Montador de Treino IA:** Botão dedicado e direto no topo da tela para criação e reformulação de rotinas personalizadas.
- **💬 Treinador IA:** Assistente autônomo com Gemini 2.5 Flash, tira-dúvidas e demonstração com vídeo/GIF animado.
- **🔄 Auto-Update OTA:** Atualização automática em tempo real direto pelo aplicativo.

## [Versão 1.5.0] - 2026-11-21
### 🚀 Novidades
- **🧠 Treinador IA Unificado:** Sistema único de prescrição esportiva e suporte tira-dúvidas.
- **📋 Anamnese Clínica Completa:** Avaliação detalhada de limitações articulares (lombar, ombros, joelhos), histórico esportivo, tempo disponível e preferência de equipamentos.
- **🎯 Banners Interativos de Planos:** Clique direto para carregar planos de força (StrongLifts 5x5, P.H.U.L. e Plano Individualizado com IA).
- **🔄 Modo de Rotação Contínua de Treinos:** Os treinos não ficam presos a dias da semana fixos (A -> B -> C rotativo).
- **📊 Painel de Bioimpedância Integrado:** Acompanhamento de peso, gordura corporal, massa muscular e evolução histórica.
- **🇧🇷 Idioma 100% PT-BR:** Limpeza de 62 arquivos de idiomas estrangeiros não utilizados.
- **⚡ Compressão de Mídia WebP:** Otimização do peso das animações mantendo os movimentos visuais dos exercícios.
