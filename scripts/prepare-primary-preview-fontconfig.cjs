// Isolated temporary browser configuration, no global Fontconfig changes.
const fs=require('node:fs');
const dir='/tmp/hermes-browser';
fs.accessSync('/tmp/browser-libs/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf');
fs.mkdirSync(dir+'/font-cache',{recursive:true});
fs.writeFileSync(dir+'/fonts.conf',`<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig><dir>/tmp/browser-libs/usr/share/fonts</dir><cachedir>/tmp/hermes-browser/font-cache</cachedir><alias><family>sans-serif</family><prefer><family>DejaVu Sans</family></prefer></alias><alias><family>serif</family><prefer><family>DejaVu Serif</family></prefer></alias><alias><family>monospace</family><prefer><family>DejaVu Sans Mono</family></prefer></alias></fontconfig>
`);
console.log('FONTCONFIG_FILE='+dir+'/fonts.conf');
