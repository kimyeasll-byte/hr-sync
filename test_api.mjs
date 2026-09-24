const test = async () => {
  const res = await fetch('https://hr-sync-delta.vercel.app/api/onboarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', department: 'Test', target_date: '2026-09-26' })
  });
  console.log(res.status, await res.text());
};
test();
