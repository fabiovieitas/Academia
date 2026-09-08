import fs from 'fs';
import path from 'path';

const src = path.resolve('public/icon-512.png');
const res = path.resolve('android/app/src/main/res');

const mipmaps = ['mipmap-hdpi', 'mipmap-mdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
for (const m of mipmaps) {
    const targetDir = path.join(res, m);
    if (fs.existsSync(targetDir)) {
        fs.copyFileSync(src, path.join(targetDir, 'ic_launcher.png'));
        fs.copyFileSync(src, path.join(targetDir, 'ic_launcher_round.png'));
        fs.copyFileSync(src, path.join(targetDir, 'ic_launcher_foreground.png'));
    }
}

const drawables = [
    'drawable-port-hdpi', 'drawable-port-mdpi', 'drawable-port-xhdpi', 'drawable-port-xxhdpi', 'drawable-port-xxxhdpi',
    'drawable-land-hdpi', 'drawable-land-mdpi', 'drawable-land-xhdpi', 'drawable-land-xxhdpi', 'drawable-land-xxxhdpi'
];
for (const d of drawables) {
    const targetDir = path.join(res, d);
    if (fs.existsSync(targetDir)) {
        fs.copyFileSync(src, path.join(targetDir, 'splash.png'));
    }
}

console.log('✅ Android icons and splash assets updated successfully!');
