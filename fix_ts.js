const fs = require('fs');
const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix the useState type definition
content = content.replace(
  /const \[activeTab, setActiveTab\] = useState<"onboard" \| "offboard" \| "history">/,
  'const [activeTab, setActiveTab] = useState<"onboard" | "offboard" | "history" | "card">'
);

// 2. Add the missing import for BusinessCardGenerator
if (!content.includes('import BusinessCardGenerator')) {
  content = content.replace(
    /import \{ supabase \} from '@\/utils\/supabase\/client';/,
    `import { supabase } from '@/utils/supabase/client';\nimport BusinessCardGenerator from '@/components/BusinessCardGenerator';`
  );
}

fs.writeFileSync(path, content);
console.log('Fixed typescript errors');
