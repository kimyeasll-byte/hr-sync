import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://bztayftfnfrdrfnyhwvw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6dGF5ZnRmbmZyZHJmbnlod3Z3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDE5NTM3NywiZXhwIjoyMTA1NzcxMzc3fQ.KD_MQNZpVSTNJ8xWuTp0EGd69g2YGZel495P8FpeeNg');
async function run() {
  const { data } = await supabase.auth.admin.listUsers();
  const user = data.users.find(u => u.email === 'yskim@gopowernet.com');
  if (user) {
    await supabase.auth.admin.updateUserById(user.id, { password: 'password123!', email_confirm: true });
    console.log('Password set!');
  } else {
    await supabase.auth.admin.createUser({ email: 'yskim@gopowernet.com', password: 'password123!', email_confirm: true });
    console.log('User created!');
  }
}
run();
