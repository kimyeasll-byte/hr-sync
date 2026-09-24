"use client";
import BusinessCardGenerator from "@/components/BusinessCardGenerator";

import { useState, useEffect, useRef } from "react";
import { UserPlus, UserMinus, Calendar, Briefcase, Loader2, AlertCircle, CheckCircle2, Clock, Search, RefreshCw, FileText } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"onboard" | "offboard" | "history" | "card">("onboard");

  // Onboarding States
  const [onName, setOnName] = useState("");
  const [onDept, setOnDept] = useState("");
  const [onDate, setOnDate] = useState("");
  const [onStatus, setOnStatus] = useState<"idle" | "loading" | "in_progress" | "completed" | "error">("idle");
  const [onErrorMessage, setOnErrorMessage] = useState("");
  const [onTaskId, setOnTaskId] = useState<string | null>(null);

  // Offboarding States
  const [offName, setOffName] = useState("");
  const [offDept, setOffDept] = useState("");
  const [offDate, setOffDate] = useState("");
  const [offStatus, setOffStatus] = useState<"idle" | "loading" | "scheduled" | "error">("idle");
  const [offErrorMessage, setOffErrorMessage] = useState("");
  
  // Search States (Offboarding)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // History(Log) States
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const logSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (onStatus !== "in_progress" || !onTaskId) return;
    const channel = supabase.channel(`task-${onTaskId}`).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks', filter: `id=eq.${onTaskId}` }, (payload) => {
      if (payload.new.status === 'COMPLETED') setOnStatus("completed");
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [onStatus, onTaskId]);

  const fetchEmployees = async (query = "") => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/employees/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!showDropdown) return;
    searchTimeoutRef.current = setTimeout(() => {
      fetchEmployees(searchQuery);
    }, 300);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchQuery, showDropdown]);

  const fetchHistory = async (nameQuery = "") => {
    setIsHistoryLoading(true);
    try {
      let query = supabase
        .from('tasks')
        .select(`
          id,
          task_type,
          status,
          created_at,
          employees!inner ( name, department ),
          logs ( result_message, created_at )
        `)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (nameQuery.trim() !== "") {
        query = query.ilike('employees.name', `%${nameQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (!error && data) {
        setHistoryData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      if (logSearchTimeoutRef.current) clearTimeout(logSearchTimeoutRef.current);
      logSearchTimeoutRef.current = setTimeout(() => {
        fetchHistory(logSearchQuery);
      }, 300);
    }
    return () => { if (logSearchTimeoutRef.current) clearTimeout(logSearchTimeoutRef.current); };
  }, [activeTab, logSearchQuery]);

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnErrorMessage("");
    if (!onName || !onDept || !onDate) return setOnStatus("error"), setOnErrorMessage("모든 정보를 입력해주세요.");
    
    setOnStatus("loading");
    try {
      const res = await fetch('/api/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: onName, department: onDept, targetDate: onDate }) });
      if (!res.ok) throw new Error('DB Error');
      const data = await res.json();
      setOnTaskId(data.taskId);
      setOnStatus("in_progress");
    } catch (error) {
      setOnStatus("error"); setOnErrorMessage("서버 통신 중 오류가 발생했습니다.");
    }
  };

  const handleOffboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOffErrorMessage("");
    if (!offName || !offDept || !offDate) return setOffStatus("error"), setOffErrorMessage("모든 정보를 입력해주세요.");
    
    setOffStatus("loading");
    try {
      const res = await fetch('/api/offboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: offName, department: offDept, targetDate: offDate }) });
      if (!res.ok) throw new Error('DB Error');
      setOffStatus("scheduled");
    } catch (error) {
      setOffStatus("error"); setOffErrorMessage("서버 통신 중 오류가 발생했습니다.");
    }
  };

  const selectEmployee = (emp: any) => {
    setOffName(emp.name);
    setOffDept(emp.department);
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text-title)', letterSpacing: '-1px' }}>오늘의 할 일</h1>

      <div className="flex gap-2 mb-8 p-1" style={{ backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', width: 'fit-content' }}>
        <button onClick={() => setActiveTab("onboard")} className="px-6 py-2 text-sm font-bold transition-all" style={{ backgroundColor: activeTab === "onboard" ? 'var(--color-surface)' : 'transparent', color: activeTab === "onboard" ? 'var(--color-text-title)' : 'var(--color-text-muted)', borderRadius: 'calc(var(--radius-sm) - 2px)', boxShadow: activeTab === "onboard" ? 'var(--shadow-subtle)' : 'none' }}>신규 입사자 세팅</button>
        <button onClick={() => setActiveTab("offboard")} className="px-6 py-2 text-sm font-bold transition-all" style={{ backgroundColor: activeTab === "offboard" ? 'var(--color-surface)' : 'transparent', color: activeTab === "offboard" ? 'var(--color-text-title)' : 'var(--color-text-muted)', borderRadius: 'calc(var(--radius-sm) - 2px)', boxShadow: activeTab === "offboard" ? 'var(--shadow-subtle)' : 'none' }}>퇴사자 권한 회수</button>
        <button onClick={() => setActiveTab("history")} className="px-6 py-2 text-sm font-bold transition-all" style={{ backgroundColor: activeTab === "history" ? 'var(--color-surface)' : 'transparent', color: activeTab === "history" ? 'var(--color-text-title)' : 'var(--color-text-muted)', borderRadius: 'calc(var(--radius-sm) - 2px)', boxShadow: activeTab === "history" ? 'var(--shadow-subtle)' : 'none' }}>Log</button>
        <button onClick={() => setActiveTab("card")} className="px-6 py-2 text-sm font-bold transition-all" style={{ backgroundColor: activeTab === "card" ? 'var(--color-surface)' : 'transparent', color: activeTab === "card" ? 'var(--color-text-title)' : 'var(--color-text-muted)', borderRadius: 'calc(var(--radius-sm) - 2px)', boxShadow: activeTab === "card" ? 'var(--shadow-subtle)' : 'none' }}>명함 제작</button>
      </div>

      {activeTab === "onboard" && (
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-6)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-subtle)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-success-bg)' }}><UserPlus size={24} style={{ color: 'var(--color-success-text)' }} strokeWidth={1.5} /></div>
            <div><h2 className="text-xl font-bold" style={{ color: 'var(--color-text-title)' }}>신규 입사자 준비</h2><p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>그룹웨어 및 ERP 계정을 자동으로 생성합니다.</p></div>
          </div>
          {onStatus === "error" && ( <div className="flex items-center gap-2 p-4 mb-6 text-sm" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error-text)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--color-error-text)' }}><AlertCircle size={18} strokeWidth={1.5} /><span className="font-medium">{onErrorMessage}</span></div> )}
          
          {(onStatus === "in_progress" || onStatus === "completed") ? (
            <div>
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <div><div className="flex items-center gap-2 mb-1"><span className="font-bold text-lg" style={{ color: 'var(--color-text-title)' }}>{onName}</span></div><p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>{onDept} · {onDate} 출근 예정</p></div>
                {onStatus === "in_progress" ? ( <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold" style={{ backgroundColor: 'var(--color-progress-bg)', color: 'var(--color-progress-text)', border: '1px solid currentColor' }}><Loader2 size={16} strokeWidth={2} className="animate-spin" /><span>작업 중 30%</span></div> ) : ( <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)', border: '1px solid currentColor' }}><CheckCircle2 size={16} strokeWidth={2} /><span>100% 완료</span></div> )}
              </div>
              {onStatus === "completed" && (
                <div className="mt-4 text-right">
                  <button onClick={() => { setOnStatus("idle"); setOnName(""); setOnDept(""); setOnDate(""); }} className="text-sm font-bold flex items-center gap-1 justify-end ml-auto hover:opacity-70 transition-opacity" style={{ color: 'var(--color-text-muted)' }}>
                    <RefreshCw size={14} /> 다른 입사자 추가하기
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleOnboardSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative"><UserPlus className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} size={18} strokeWidth={1.5} /><input type="text" value={onName} onChange={(e) => setOnName(e.target.value)} placeholder="입사자 이름" className="w-full pl-10 pr-4 py-3 outline-none" style={{ backgroundColor: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-title)', fontSize: '15px' }} /></div>
                <div className="relative"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} size={18} strokeWidth={1.5} /><input type="text" value={onDept} onChange={(e) => setOnDept(e.target.value)} placeholder="소속 팀" className="w-full pl-10 pr-4 py-3 outline-none" style={{ backgroundColor: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-title)', fontSize: '15px' }} /></div>
                <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} size={18} strokeWidth={1.5} /><input type="date" value={onDate} onChange={(e) => setOnDate(e.target.value)} className="w-full pl-10 pr-4 py-3 outline-none" style={{ backgroundColor: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-title)', fontSize: '15px' }} /></div>
              </div>
              <div className="flex justify-end mt-6"><button type="submit" disabled={onStatus === "loading"} className="px-6 py-3 flex items-center justify-center gap-2" style={{ backgroundColor: onStatus === "loading" ? 'var(--color-disabled-bg)' : 'var(--color-primary-bg)', color: onStatus === "loading" ? 'var(--color-disabled-text)' : 'var(--color-primary-text)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>{onStatus === "loading" ? <><Loader2 size={18} className="animate-spin" /> 처리 중...</> : "입사 세팅하기"}</button></div>
            </form>
          )}
        </div>
      )}

      {activeTab === "offboard" && (
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-6)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-subtle)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-error-bg)' }}><UserMinus size={24} style={{ color: 'var(--color-error-text)' }} strokeWidth={1.5} /></div>
            <div><h2 className="text-xl font-bold" style={{ color: 'var(--color-text-title)' }}>퇴사자 권한 회수 예약</h2><p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>지정한 퇴사일의 다음 날(D+1)에 모든 계정을 안전하게 차단합니다.</p></div>
          </div>

          {offStatus === "error" && ( <div className="flex items-center gap-2 p-4 mb-6 text-sm" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error-text)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--color-error-text)' }}><AlertCircle size={18} strokeWidth={1.5} /><span className="font-medium">{offErrorMessage}</span></div> )}

          {offStatus === "scheduled" ? (
            <div>
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <div><div className="flex items-center gap-2 mb-1"><span className="font-bold text-lg" style={{ color: 'var(--color-text-title)' }}>{offName}</span></div><p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>{offDept} · {offDate} 퇴사 예정</p></div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-title)', border: '1px solid var(--color-border)' }}><Clock size={16} strokeWidth={2} /><span>{new Date(new Date(offDate).getTime() + 86400000).toISOString().split('T')[0]} 차단 예약됨</span></div>
              </div>
              <div className="mt-4 text-right">
                <button onClick={() => { setOffStatus("idle"); setOffName(""); setOffDept(""); setOffDate(""); setSearchQuery(""); setShowDropdown(false); }} className="text-sm font-bold flex items-center gap-1 justify-end ml-auto hover:opacity-70 transition-opacity" style={{ color: 'var(--color-text-muted)' }}>
                  <RefreshCw size={14} /> 다른 직원 추가 예약하기
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleOffboardSubmit} className="space-y-4">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} size={18} strokeWidth={1.5} />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }} 
                  onFocus={() => { setShowDropdown(true); fetchEmployees(searchQuery); }}
                  placeholder="클릭하면 전체 명단이 뜹니다. (이름/부서로 검색도 가능)" 
                  className="w-full pl-10 pr-4 py-4 outline-none" 
                  style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-title)', fontSize: '16px', fontWeight: 'bold' }} 
                />
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 py-2 shadow-lg max-h-60 overflow-y-auto" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    {searchResults.map((emp) => (
                      <div key={emp.id} onClick={() => selectEmployee(emp)} className="px-4 py-3 cursor-pointer flex justify-between items-center transition-colors hover:bg-gray-100" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <span className="font-bold" style={{ color: 'var(--color-text-title)' }}>{emp.name}</span>
                        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{emp.department}</span>
                      </div>
                    ))}
                  </div>
                )}
                {showDropdown && searchResults.length === 0 && !isSearching && (
                  <div className="absolute z-10 w-full mt-2 py-4 px-4 text-center shadow-lg text-sm" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)' }}>검색 결과가 없습니다.</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ opacity: offName ? 1 : 0.5, pointerEvents: offName ? 'auto' : 'none' }}>
                <div className="relative"><UserMinus className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} size={18} strokeWidth={1.5} /><input type="text" value={offName} readOnly placeholder="선택된 이름" className="w-full pl-10 pr-4 py-3 outline-none bg-transparent" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-title)' }} /></div>
                <div className="relative"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} size={18} strokeWidth={1.5} /><input type="text" value={offDept} readOnly placeholder="선택된 소속" className="w-full pl-10 pr-4 py-3 outline-none bg-transparent" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-title)' }} /></div>
                <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} size={18} strokeWidth={1.5} /><input type="date" value={offDate} onChange={(e) => setOffDate(e.target.value)} required className="w-full pl-10 pr-4 py-3 outline-none bg-transparent" style={{ border: '1px solid var(--color-error-text)', borderRadius: 'var(--radius-sm)', color: 'var(--color-error-text)', fontWeight: 'bold' }} /></div>
              </div>

              <div className="flex justify-end mt-6">
                <button type="submit" disabled={!offName || offStatus === "loading"} className="px-6 py-3 flex items-center justify-center gap-2" style={{ backgroundColor: (!offName || offStatus === "loading") ? 'var(--color-disabled-bg)' : 'var(--color-error-bg)', color: (!offName || offStatus === "loading") ? 'var(--color-disabled-text)' : 'var(--color-error-text)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                  {offStatus === "loading" ? <><Loader2 size={18} className="animate-spin" /> 예약 중...</> : "권한 회수 예약하기"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      
      {/* 명함 제작 탭 */}
      {activeTab === 'card' && (
        <BusinessCardGenerator />
      )}


      {/* Log 탭 내용 */}
      {activeTab === "history" && (
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-6)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-subtle)' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}><FileText size={24} style={{ color: 'var(--color-text-title)' }} strokeWidth={1.5} /></div>
              <div><h2 className="text-xl font-bold" style={{ color: 'var(--color-text-title)' }}>Log</h2><p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>최대 3년간 안전하게 보존되는 계정 세팅 및 회수 작업 로그입니다.</p></div>
            </div>
            <button onClick={() => fetchHistory(logSearchQuery)} className="p-2 rounded-lg transition-colors hover:bg-gray-100" style={{ color: 'var(--color-text-muted)' }}>
              <RefreshCw size={20} className={isHistoryLoading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* 로그 필터링 검색바 */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} size={16} strokeWidth={1.5} />
            <input 
              type="text" 
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              placeholder="직원 이름으로 로그 필터링 (예: 김)" 
              className="w-full pl-10 pr-4 py-2 outline-none" 
              style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-title)', fontSize: '14px' }} 
            />
          </div>

          <div className="space-y-3">
            {historyData.map((task) => (
              <div key={task.id} className="p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold" style={{ color: 'var(--color-text-title)' }}>{task.employees?.name}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>({task.employees?.department})</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ 
                      backgroundColor: task.task_type === 'ONBOARDING' ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                      color: task.task_type === 'ONBOARDING' ? 'var(--color-success-text)' : 'var(--color-error-text)'
                    }}>
                      {task.task_type === 'ONBOARDING' ? '입사 세팅' : '퇴사 차단'}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-text-title)' }}>
                    {task.logs?.[0]?.result_message || (task.status === 'PENDING' ? '예약 대기 중 (D+1 실행 예정)' : '작업 진행 중')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: 'var(--color-text-title)' }}>
                    {new Date(task.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {historyData.length === 0 && !isHistoryLoading && (
              <div className="py-12 text-center text-sm font-bold" style={{ color: 'var(--color-text-muted)' }}>
                아직 기록된 작업 이력이 없거나 검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
