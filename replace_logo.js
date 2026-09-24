const fs = require('fs');
const path = 'src/components/BusinessCardGenerator.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetHtml = `<div className="text-2xl mt-1 tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                  <span className="font-black italic text-[#083a81]">POWER</span>
                  <span className="font-black italic text-[#f15a24]">NET</span>
                </div>`;

const replaceHtml = `<div className="w-[110px] mt-1">
                  <img src="/logo.png" alt="POWER NET" className="w-full h-auto" />
                </div>`;

content = content.replace(targetHtml, replaceHtml);

fs.writeFileSync(path, content);
console.log('Logo replaced');
