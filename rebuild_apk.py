import subprocess
import shutil
import os

jar_path = r"C:\Program Files\Android\Android Studio\jbr\bin\jar.exe"
java_path = r"C:\Program Files\Android\Android Studio\jbr\bin\java.exe"

print("1. Injetando arquivos atualizados no APK...")
cmd1 = [jar_path, "-uf", "openGym-Fabio-Adlai.apk", "assets/public/index.html", "assets/public/assets/useStore-Cw7P0W3T.js"]
res1 = subprocess.run(cmd1, capture_output=True, text=True)
print(res1.stdout, res1.stderr)

print("2. Assinando APK com uber-apk-signer...")
cmd2 = [java_path, "-jar", "uber-apk-signer.jar", "-a", "openGym-Fabio-Adlai.apk", "--overwrite"]
res2 = subprocess.run(cmd2, capture_output=True, text=True)
print(res2.stdout, res2.stderr)

print("3. Distribuindo APK...")
shutil.copyfile("openGym-Fabio-Adlai.apk", "assets/public/openGym-Fabio-Adlai.apk")
desktop_dest = os.path.expanduser(r"~\Desktop\openGym-Fabio-Adlai.apk")
shutil.copyfile("openGym-Fabio-Adlai.apk", desktop_dest)
print(f"Sucesso! APK copiado para {desktop_dest} e assets/public.")

