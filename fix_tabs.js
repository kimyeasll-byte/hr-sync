const fs = require('fs');
const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const newTabHtml = `<button onClick={() => setActiveTab("card")} className="px-6 py-2 text-sm font-bold transition-all" style={{ backgroundColor: activeTab === "card" ? 'var(--color-surface)' : 'transparent', color: activeTab === "card" ? 'var(--color-text-title)' : 'var(--color-text-muted)', borderRadius: 'calc(var(--radius-sm) - 2px)', boxShadow: activeTab === "card" ? 'var(--shadow-subtle)' : 'none' }}>명함 제작</button>`;

if (!content.includes('setActiveTab("card")')) {
  content = content.replace(
    /onClick=\{\(\) => setActiveTab\("history"\)\}[^>]+>Log<\/button>/,
    match => match + '\n        ' + newTabHtml
  );
}

fs.writeFileSync(path, content);
console.log('Fixed tabs');
