const fs = require('fs');
const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the automatic reset timeout
const autoResetCode = `setTimeout(() => {
            setOnStatus("idle");
            setOnName("");
            setOnDept("");
            setOnDate("");
            fetchEmployees();
            fetchHistory();
          }, 1500);`;
content = content.replace(autoResetCode, 'fetchEmployees();\n            fetchHistory();');

// 2. Change the 'completed' UI to show the business card button
const oldCompletedUI = `{onStatus === "completed" && (
                <div className="mt-4 text-right">
                  <button onClick={() => { setOnStatus("idle"); setOnName(""); setOnDept(""); setOnDate(""); }} className="text-sm font-bold flex items-center gap-1 justify-end ml-auto hover:opacity-70 transition-opacity" style={{ color: 'var(--color-text-muted)' }}>
                    <RefreshCw size={14} /> 다른 입사자 추가하기
                  </button>
                </div>
              )}`;

const newCompletedUI = `{onStatus === "completed" && (
                <div className="mt-6 flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <IdCard size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-900">명함을 바로 만드시겠어요?</h4>
                      <p className="text-xs text-blue-700">입사자 정보가 자동 입력된 명함 스튜디오로 이동합니다.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setOnStatus("idle"); setOnName(""); setOnDept(""); setOnDate(""); }} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
                      닫기
                    </button>
                    <button onClick={() => setActiveTab("card")} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors flex items-center gap-2">
                      명함 제작 이동
                    </button>
                  </div>
                </div>
              )}`;

content = content.replace(oldCompletedUI, newCompletedUI);

// 3. Pass props to BusinessCardGenerator
content = content.replace(
  /<BusinessCardGenerator \/>/,
  '<BusinessCardGenerator initialName={onName} initialDept={onDept} key={onName + onDept} />'
);

fs.writeFileSync(path, content);
console.log('Dashboard updated with new UX flow');
