const fs = require('fs');
const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('import BusinessCardGenerator')) {
  content = content.replace(
    /"use client";/,
    `"use client";\nimport BusinessCardGenerator from "@/components/BusinessCardGenerator";`
  );
  fs.writeFileSync(path, content);
  console.log('Import added successfully.');
} else {
  console.log('Import already exists.');
}
