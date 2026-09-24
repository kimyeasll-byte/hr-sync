const fs = require('fs');
const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the buggy single() polling line with a cache-buster version
content = content.replace(
  /const { data } = await supabase\.from\('tasks'\)\.select\('status'\)\.eq\('id', taskId\)\.single\(\);/g,
  "const { data } = await supabase.from('tasks').select('status').eq('id', taskId).neq('status', 'bypass_' + Date.now()).single();"
);

fs.writeFileSync(path, content);
console.log('Fixed polling cache bug');
