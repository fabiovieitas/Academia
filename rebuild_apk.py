import subprocess
import shutil
import os
import zipfile

jar_path = r"C:\Program Files\Android\Android Studio\jbr\bin\jar.exe"
java_path = r"C:\Program Files\Android\Android Studio\jbr\bin\java.exe"

print("1. Injetando arquivos atualizados no APK...")
cmd1 = [
    jar_path, "-uf", "openGym-Fabio-Adlai.apk",
    "assets/public/index.html",
    "assets/public/assets/index-B4q3TEPH.js",
    "assets/public/assets/index-ZRw35rlE.css",
    "assets/public/assets/useStore-Cw7P0W3T.js"
]
res1 = subprocess.run(cmd1, capture_output=True, text=True)
print(res1.stdout, res1.stderr)

# Garante que resources.arsc e .so nunca fiquem compactados (regra estrita do Android)
with zipfile.ZipFile("openGym-Fabio-Adlai.apk", 'r') as zin:
    info = zin.getinfo("resources.arsc")
    if info.compress_type != 0:
        print("Corrigindo compressao de resources.arsc...")
        with zipfile.ZipFile("openGym-temp.apk", 'w') as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)
                method = zipfile.ZIP_STORED if (item.filename == 'resources.arsc' or item.filename.endswith('.so')) else item.compress_type
                zout.writestr(item.filename, data, compress_type=method)
        os.remove("openGym-Fabio-Adlai.apk")
        os.rename("openGym-temp.apk", "openGym-Fabio-Adlai.apk")

print("2. Assinando APK com uber-apk-signer...")
cmd2 = [java_path, "-jar", "uber-apk-signer.jar", "-a", "openGym-Fabio-Adlai.apk", "--overwrite"]
res2 = subprocess.run(cmd2, capture_output=True, text=True)
print(res2.stdout, res2.stderr)

print("3. Distribuindo APK...")
shutil.copyfile("openGym-Fabio-Adlai.apk", "assets/public/openGym-Fabio-Adlai.apk")
desktop_dest = os.path.expanduser(r"~\Desktop\openGym-Fabio-Adlai.apk")
shutil.copyfile("openGym-Fabio-Adlai.apk", desktop_dest)
print(f"Sucesso! APK copiado para {desktop_dest} e assets/public.")
