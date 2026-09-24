const fs = require('fs');
const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /import \{ UserPlus, UserMinus, Calendar, Briefcase, Loader2, AlertCircle, CheckCircle2, Clock, Search, RefreshCw, FileText \} from "lucide-react";/,
  'import { UserPlus, UserMinus, Calendar, Briefcase, Loader2, AlertCircle, CheckCircle2, Clock, Search, RefreshCw, FileText, IdCard } from "lucide-react";'
);

fs.writeFileSync(path, content);
console.log('Import IdCard fixed');
