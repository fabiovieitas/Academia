import subprocess
import shutil
import os
import zipfile

jar_path = r"C:\Program Files\Android\Android Studio\jbr\bin\jar.exe"
java_path = r"C:\Program Files\Android\Android Studio\jbr\bin\java.exe"

apks = ["openGym-Fabio-Adlai.apk", "openGym-Lite.apk"]
files_to_inject = [
    "assets/public/index.html",
    "assets/public/assets/index-B4q3TEPH.js",
    "assets/public/assets/index-ZRw35rlE.css",
    "assets/public/assets/useStore-Cw7P0W3T.js",
    "assets/public/assets/Settings-DVVmscCy.js"
]

for apk in apks:
    if not os.path.exists(apk):
        print(f"Pulando {apk} (não encontrado).")
        continue

    print(f"\n=== Processando {apk} ===")
    print("1. Injetando arquivos atualizados no APK...")
    cmd1 = [jar_path, "-uf", apk] + files_to_inject
    res1 = subprocess.run(cmd1, capture_output=True, text=True)
    if res1.returncode != 0:
        raise RuntimeError(f"Falha ao atualizar {apk}: {res1.stderr}")
    if res1.stdout or res1.stderr:
        print(res1.stdout, res1.stderr)

    # Garante que resources.arsc e .so nunca fiquem compactados (regra estrita do Android)
    with zipfile.ZipFile(apk, 'r') as zin:
        info = zin.getinfo("resources.arsc")
        needs_repack = info.compress_type != 0 or any(
            i.filename.endswith('.so') and i.compress_type != 0 for i in zin.infolist()
        )
    if needs_repack:
        print(f"Corrigindo compressão de resources.arsc / .so em {apk}...")
        tmp_apk = apk + ".tmp"
        with zipfile.ZipFile(apk, 'r') as zin, zipfile.ZipFile(tmp_apk, 'w') as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)
                method = zipfile.ZIP_STORED if (item.filename == 'resources.arsc' or item.filename.endswith('.so')) else item.compress_type
                zout.writestr(item.filename, data, compress_type=method)
        os.remove(apk)
        os.rename(tmp_apk, apk)

    print(f"2. Assinando {apk} com uber-apk-signer...")
    cmd2 = [java_path, "-jar", "uber-apk-signer.jar", "-a", apk, "--overwrite", "--allowResign"]
    res2 = subprocess.run(cmd2, capture_output=True, text=True)
    print(res2.stdout, res2.stderr)
    if res2.returncode != 0:
        raise RuntimeError(f"Falha ao assinar {apk}")

    print(f"3. Distribuindo {apk}...")
    shutil.copyfile(apk, os.path.join("assets", "public", apk))
    for desk in [r"C:\Users\fabiovieitas\Desktop", r"C:\Users\Administrator\Desktop"]:
        if os.path.isdir(desk):
            dst = os.path.join(desk, apk)
            shutil.copyfile(apk, dst)
            print(f"Copiado para {dst}")
