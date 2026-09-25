"use client";

import React, { useState, useEffect } from "react";
import { 
  Laptop, 
  Monitor, 
  Wifi, 
  KeyRound, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Building2, 
  User, 
  FileText,
  ShieldAlert,
  ArrowRightLeft,
  X,
  Save,
  Check
} from "lucide-react";

export interface ITAsset {
  id: string;
  empId?: string;
  empName: string;
  department: string;
  category: "DESKTOP" | "LAPTOP" | "MONITOR" | "NETWORK" | "SECURITY_CARD";
  modelName: string;
  serialNumber: string;
  assignedDate: string;
  fixedIp?: string;
  macAddress?: string;
  status: "ACTIVE" | "PENDING_RETURN" | "RETURNED";
  returnDate?: string;
  notes?: string;
}

// Initial realistic seed assets for (주)파워넷
const INITIAL_ASSETS: ITAsset[] = [
  {
    id: "ast-001",
    empName: "김예슬",
    department: "경영지원실 인사기획P",
    category: "LAPTOP",
    modelName: "삼성 갤럭시북4 Pro 16인치",
    serialNumber: "SN-PWN-2024-0891",
    assignedDate: "2024-03-01",
    fixedIp: "192.168.10.42",
    macAddress: "00:E0:4C:68:02:11",
    status: "ACTIVE",
    notes: "인사/전산 관리자용 고성능 노트북"
  },
  {
    id: "ast-002",
    empName: "김예슬",
    department: "경영지원실 인사기획P",
    category: "MONITOR",
    modelName: "삼성 27인치 FHD 모니터 (듀얼)",
    serialNumber: "SN-MON-27-0412 / 0413",
    assignedDate: "2024-03-01",
    status: "ACTIVE",
    notes: "HDMI 듀얼 포트 연결 완료"
  },
  {
    id: "ast-003",
    empName: "박수석",
    department: "전력전자연구소 HW개발1팀",
    category: "DESKTOP",
    modelName: "HP Z4 Workstation G5",
    serialNumber: "SN-WS-2023-7721",
    assignedDate: "2023-11-15",
    fixedIp: "192.168.20.105",
    macAddress: "B4:2E:99:A1:33:09",
    status: "ACTIVE",
    notes: "회로 시뮬레이션용 워크스테이션"
  },
  {
    id: "ast-004",
    empName: "이대리",
    department: "글로벌영업본부 해외영업팀",
    category: "LAPTOP",
    modelName: "LG 그램 15 (15ZD90R)",
    serialNumber: "SN-GRAM-2024-1029",
    assignedDate: "2024-05-10",
    fixedIp: "192.168.10.78",
    status: "ACTIVE",
    notes: "해외 출장용 지급"
  },
  {
    id: "ast-005",
    empName: "정주임",
    department: "생산기술센터 제조기획팀",
    category: "DESKTOP",
    modelName: "삼성 슬림 PC DB400TDA",
    serialNumber: "SN-DB4-2022-3341",
    assignedDate: "2022-08-01",
    fixedIp: "192.168.30.22",
    macAddress: "70:85:C2:55:1A:BC",
    status: "PENDING_RETURN",
    notes: "퇴사 예정자로 인한 반납 회수 대기"
  },
  {
    id: "ast-006",
    empName: "정주임",
    department: "생산기술센터 제조기획팀",
    category: "SECURITY_CARD",
    modelName: "에스원(S1) 보안 출입카드",
    serialNumber: "S1-KEY-99482",
    assignedDate: "2022-08-01",
    status: "PENDING_RETURN",
    notes: "수원사업장 정문/연구동 출입 카드"
  },
  {
    id: "ast-007",
    empName: "최과장",
    department: "품질보증실 신뢰성시험팀",
    category: "MONITOR",
    modelName: "LG 24인치 IPS 모니터",
    serialNumber: "SN-LG-24-9021",
    assignedDate: "2023-01-10",
    status: "RETURNED",
    returnDate: "2024-08-31",
    notes: "장비 교체 및 반납 후 전산 창고 보관"
  }
];

export default function AssetManagement() {
  const [assets, setAssets] = useState<ITAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "PENDING_RETURN" | "RETURNED">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  
  // Modal State for adding/editing asset
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);

  // Form inputs
  const [formEmpName, setFormEmpName] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formCategory, setFormCategory] = useState<ITAsset["category"]>("LAPTOP");
  const [formModel, setFormModel] = useState("");
  const [formSerial, setFormSerial] = useState("");
  const [formAssignedDate, setFormAssignedDate] = useState(new Date().toISOString().split("T")[0]);
  const [formFixedIp, setFormFixedIp] = useState("");
  const [formMac, setFormMac] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Load from localStorage or seed
  useEffect(() => {
    try {
      const saved = localStorage.getItem("powernet_it_assets");
      if (saved) {
        setAssets(JSON.parse(saved));
      } else {
        setAssets(INITIAL_ASSETS);
        localStorage.setItem("powernet_it_assets", JSON.stringify(INITIAL_ASSETS));
      }
    } catch (e) {
      setAssets(INITIAL_ASSETS);
    }
  }, []);

  const saveAssets = (updated: ITAsset[]) => {
    setAssets(updated);
    try {
      localStorage.setItem("powernet_it_assets", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Open modal for creation
  const handleOpenCreate = () => {
    setEditingAssetId(null);
    setFormEmpName("");
    setFormDept("");
    setFormCategory("LAPTOP");
    setFormModel("");
    setFormSerial(`SN-PWN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormAssignedDate(new Date().toISOString().split("T")[0]);
    setFormFixedIp("192.168.10.");
    setFormMac("");
    setFormNotes("");
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (item: ITAsset) => {
    setEditingAssetId(item.id);
    setFormEmpName(item.empName);
    setFormDept(item.department);
    setFormCategory(item.category);
    setFormModel(item.modelName);
    setFormSerial(item.serialNumber);
    setFormAssignedDate(item.assignedDate);
    setFormFixedIp(item.fixedIp || "");
    setFormMac(item.macAddress || "");
    setFormNotes(item.notes || "");
    setIsModalOpen(true);
  };

  // Submit modal form
  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmpName.trim() || !formModel.trim()) {
      alert("직원 이름과 모델명을 입력해주세요.");
      return;
    }

    if (editingAssetId) {
      // Edit
      const updated = assets.map(a => {
        if (a.id === editingAssetId) {
          return {
            ...a,
            empName: formEmpName.trim(),
            department: formDept.trim(),
            category: formCategory,
            modelName: formModel.trim(),
            serialNumber: formSerial.trim(),
            assignedDate: formAssignedDate,
            fixedIp: formFixedIp.trim() || undefined,
            macAddress: formMac.trim() || undefined,
            notes: formNotes.trim() || undefined,
          };
        }
        return a;
      });
      saveAssets(updated);
    } else {
      // Create new
      const newAsset: ITAsset = {
        id: `ast-${Date.now()}`,
        empName: formEmpName.trim(),
        department: formDept.trim() || "부서 미지정",
        category: formCategory,
        modelName: formModel.trim(),
        serialNumber: formSerial.trim() || `SN-${Date.now()}`,
        assignedDate: formAssignedDate,
        fixedIp: formFixedIp.trim() || undefined,
        macAddress: formMac.trim() || undefined,
        status: "ACTIVE",
        notes: formNotes.trim() || undefined,
      };
      saveAssets([newAsset, ...assets]);
    }

    setIsModalOpen(false);
  };

  // Toggle return status
  const handleToggleReturn = (id: string) => {
    const updated = assets.map(a => {
      if (a.id === id) {
        if (a.status === "RETURNED") {
          return { ...a, status: "ACTIVE" as const, returnDate: undefined };
        } else {
          return { ...a, status: "RETURNED" as const, returnDate: new Date().toISOString().split("T")[0] };
        }
      }
      return a;
    });
    saveAssets(updated);
  };

  // Set pending return
  const handleSetPendingReturn = (id: string) => {
    const updated = assets.map(a => {
      if (a.id === id) {
        return { ...a, status: "PENDING_RETURN" as const };
      }
      return a;
    });
    saveAssets(updated);
  };

  // Batch return all assets for an employee
  const handleBatchReturn = (empName: string) => {
    if (!confirm(`${empName} 님의 모든 대여 장비를 일괄 반납 완료 처리하시겠습니까?`)) return;
    const today = new Date().toISOString().split("T")[0];
    const updated = assets.map(a => {
      if (a.empName === empName && a.status !== "RETURNED") {
        return { ...a, status: "RETURNED" as const, returnDate: today };
      }
      return a;
    });
    saveAssets(updated);
  };

  // Delete asset
  const handleDeleteAsset = (id: string, model: string) => {
    if (!confirm(`'${model}' 자산 내역을 삭제하시겠습니까?`)) return;
    const updated = assets.filter(a => a.id !== id);
    saveAssets(updated);
  };

  // Category helpers
  const getCategoryBadge = (category: ITAsset["category"]) => {
    switch (category) {
      case "LAPTOP":
        return { label: "노트북", icon: Laptop, color: "text-blue-700 bg-blue-50 border-blue-200" };
      case "DESKTOP":
        return { label: "데스크탑/WS", icon: Laptop, color: "text-cyan-700 bg-cyan-50 border-cyan-200" };
      case "MONITOR":
        return { label: "모니터", icon: Monitor, color: "text-indigo-700 bg-indigo-50 border-indigo-200" };
      case "NETWORK":
        return { label: "네트워크/IP", icon: Wifi, color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
      case "SECURITY_CARD":
        return { label: "보안 출입카드", icon: KeyRound, color: "text-amber-700 bg-amber-50 border-amber-200" };
    }
  };

  // Filtered Assets
  const filteredAssets = assets.filter(a => {
    const matchesSearch = 
      a.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.fixedIp && a.fixedIp.includes(searchQuery));
    if (!matchesSearch) return false;

    if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
    if (categoryFilter !== "ALL" && a.category !== categoryFilter) return false;

    return true;
  });

  // Summary counts
  const totalCount = assets.length;
  const activeCount = assets.filter(a => a.status === "ACTIVE").length;
  const pendingReturnCount = assets.filter(a => a.status === "PENDING_RETURN").length;
  const returnedCount = assets.filter(a => a.status === "RETURNED").length;

  return (
    <div className="space-y-6">
      
      {/* 1. 상단 통계 요약 대시보드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>총 등록 IT 자산</span>
            <Laptop size={15} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div className="text-2xl font-black" style={{ color: 'var(--color-text-title)' }}>
            {totalCount}<span className="text-xs font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>대/건</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-emerald-600">정상 운용 중 (Active)</span>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {activeCount}<span className="text-xs font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>대</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-amber-600">반납 대기 (회수 대상)</span>
            <AlertTriangle size={15} className="text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {pendingReturnCount}<span className="text-xs font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>대</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>반납 완료 / 창고 보관</span>
            <RotateCcw size={15} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div className="text-2xl font-black" style={{ color: 'var(--color-text-muted)' }}>
            {returnedCount}<span className="text-xs font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>대</span>
          </div>
        </div>
      </div>

      {/* 2. 퇴사 예정자 미반납 알림 배너 (있을 경우) */}
      {pendingReturnCount > 0 && (
        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                퇴사 예정자 자산 회수 대기 안내 ({pendingReturnCount}건)
              </h4>
              <p className="text-xs text-amber-700">
                퇴사 처리 시 사내 보안 규정(ITGC)에 따라 PC 포맷 및 보안 출입카드 반납이 완료되어야 합니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter("PENDING_RETURN")}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            회수 대상 목록 보기
          </button>
        </div>
      )}

      {/* 3. 검색 및 필터 바 & 신규 등록 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* 검색창 */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="직원명, 부서, 기종, S/N, IP 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl outline-none transition-all"
              style={{
                backgroundColor: '#F5F5F7',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-title)'
              }}
            />
          </div>

          {/* 상태 필터 */}
          <div className="flex gap-1 p-1 rounded-xl border text-xs" style={{ backgroundColor: '#EBEBED', borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                statusFilter === "ALL" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                statusFilter === "ACTIVE" ? "bg-white text-emerald-700 shadow-xs" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              운용 중
            </button>
            <button
              onClick={() => setStatusFilter("PENDING_RETURN")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                statusFilter === "PENDING_RETURN" ? "bg-white text-amber-700 shadow-xs" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              반납 대기
            </button>
            <button
              onClick={() => setStatusFilter("RETURNED")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                statusFilter === "RETURNED" ? "bg-white text-neutral-800 shadow-xs" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              반납 완료
            </button>
          </div>

          {/* 분류 필터 */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl outline-none cursor-pointer border"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-title)'
            }}
          >
            <option value="ALL">모든 자산 분류</option>
            <option value="LAPTOP">노트북</option>
            <option value="DESKTOP">데스크탑/워크스테이션</option>
            <option value="MONITOR">모니터</option>
            <option value="SECURITY_CARD">보안 출입카드</option>
            <option value="NETWORK">네트워크/IP</option>
          </select>
        </div>

        {/* 신규 자산 지급 등록 버튼 */}
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0071E3] hover:bg-blue-600 text-white transition-colors flex items-center gap-1.5 shadow-xs self-end sm:self-auto"
        >
          <Plus size={15} /> 신규 자산 지급 등록
        </button>
      </div>

      {/* 4. 자산 목록 테이블 */}
      <div className="rounded-2xl border overflow-hidden shadow-xs" style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--color-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b text-neutral-500 uppercase tracking-wider text-[11px] font-semibold" style={{ borderColor: 'var(--color-border)', backgroundColor: '#F8F9FA' }}>
                <th className="py-3 px-4">사용자 / 소속</th>
                <th className="py-3 px-4">자산 분류 & 기종</th>
                <th className="py-3 px-4">시리얼 번호 (S/N)</th>
                <th className="py-3 px-4">네트워크 (IP / MAC)</th>
                <th className="py-3 px-4">지급일자</th>
                <th className="py-3 px-4">상태</th>
                <th className="py-3 px-4 text-right">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 font-medium">
                    등록된 IT 자산이 없거나 검색 결과와 일치하는 항목이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const cat = getCategoryBadge(asset.category);
                  const CatIcon = cat.icon;

                  return (
                    <tr 
                      key={asset.id} 
                      className={`hover:bg-neutral-50/80 transition-colors ${
                        asset.status === 'PENDING_RETURN' ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* 사용자 & 부서 */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                          {asset.empName}
                          {asset.status === 'PENDING_RETURN' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                              퇴사 예정
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[160px]">
                          {asset.department}
                        </div>
                      </td>

                      {/* 자산 분류 & 기종 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${cat.color}`}>
                            <CatIcon size={11} /> {cat.label}
                          </span>
                        </div>
                        <div className="font-bold text-neutral-800">
                          {asset.modelName}
                        </div>
                        {asset.notes && (
                          <div className="text-[10px] text-neutral-400 truncate max-w-[200px]">
                            {asset.notes}
                          </div>
                        )}
                      </td>

                      {/* 시리얼 번호 (S/N) */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-700">
                        {asset.serialNumber || "-"}
                      </td>

                      {/* 네트워크 IP & MAC */}
                      <td className="py-3.5 px-4">
                        {asset.fixedIp ? (
                          <div className="font-mono text-[11px] text-blue-600 font-semibold">
                            {asset.fixedIp}
                          </div>
                        ) : (
                          <span className="text-neutral-400">-</span>
                        )}
                        {asset.macAddress && (
                          <div className="font-mono text-[10px] text-neutral-400">
                            {asset.macAddress}
                          </div>
                        )}
                      </td>

                      {/* 지급일자 */}
                      <td className="py-3.5 px-4 text-neutral-600">
                        <div>{asset.assignedDate}</div>
                        {asset.returnDate && (
                          <div className="text-[10px] text-neutral-400">
                            반납: {asset.returnDate}
                          </div>
                        )}
                      </td>

                      {/* 상태 배지 */}
                      <td className="py-3.5 px-4">
                        {asset.status === 'ACTIVE' && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            운용 중
                          </span>
                        )}
                        {asset.status === 'PENDING_RETURN' && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                            <AlertTriangle size={11} />
                            반납 대기
                          </span>
                        )}
                        {asset.status === 'RETURNED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                            <Check size={11} />
                            반납 완료
                          </span>
                        )}
                      </td>

                      {/* 작업 액션 버튼들 */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {asset.status === 'RETURNED' ? (
                            <button
                              onClick={() => handleToggleReturn(asset.id)}
                              title="반납 취소 (운용 복구)"
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 transition-colors shadow-xs"
                            >
                              재지급
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleReturn(asset.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors shadow-xs ${
                                asset.status === 'PENDING_RETURN'
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                  : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200'
                              }`}
                            >
                              반납 확인
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(asset)}
                            title="정보 수정"
                            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={() => handleDeleteAsset(asset.id, asset.modelName)}
                            title="자산 삭제"
                            className="p-1 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. 신규 등록 / 수정 모달 다이얼로그 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <Laptop size={18} />
                </div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text-title)' }}>
                  {editingAssetId ? "IT 자산 정보 수정" : "신규 IT 자산 지급 등록"}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* 사용자 이름 */}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--color-text-title)' }}>
                    지급 대상 직원명 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 김예슬"
                    value={formEmpName}
                    onChange={(e) => setFormEmpName(e.target.value)}
                    className="w-full p-2.5 rounded-lg outline-none"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-title)'
                    }}
                  />
                </div>

                {/* 부서 */}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--color-text-title)' }}>
                    소속 부서
                  </label>
                  <input
                    type="text"
                    placeholder="예: 경영지원실 인사기획P"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full p-2.5 rounded-lg outline-none"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-title)'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 자산 분류 */}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--color-text-title)' }}>
                    자산 분류 *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg outline-none cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-title)'
                    }}
                  >
                    <option value="LAPTOP">노트북 (Laptop)</option>
                    <option value="DESKTOP">데스크탑 / 워크스테이션</option>
                    <option value="MONITOR">모니터 (Monitor)</option>
                    <option value="SECURITY_CARD">에스원 보안 출입카드</option>
                    <option value="NETWORK">네트워크 전용 장비</option>
                  </select>
                </div>

                {/* 지급 일자 */}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--color-text-title)' }}>
                    지급 일자
                  </label>
                  <input
                    type="date"
                    value={formAssignedDate}
                    onChange={(e) => setFormAssignedDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg outline-none font-sans"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-title)'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 모델명 */}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--color-text-title)' }}>
                    기기 모델명 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 갤럭시북4 Pro, HP Z4"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    className="w-full p-2.5 rounded-lg outline-none"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-title)'
                    }}
                  />
                </div>

                {/* 시리얼 S/N */}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--color-text-title)' }}>
                    시리얼 번호 (S/N)
                  </label>
                  <input
                    type="text"
                    placeholder="예: SN-PWN-2024-0012"
                    value={formSerial}
                    onChange={(e) => setFormSerial(e.target.value)}
                    className="w-full p-2.5 rounded-lg outline-none font-mono"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-title)'
                    }}
                  />
                </div>
              </div>

              {/* 네트워크 설정 (IP / MAC) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--color-text-title)' }}>
                    사내 고정 IP (할당)
                  </label>
                  <input
                    type="text"
                    placeholder="192.168.10.xxx"
                    value={formFixedIp}
                    onChange={(e) => setFormFixedIp(e.target.value)}
                    className="w-full p-2.5 rounded-lg outline-none font-mono"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-title)'
                    }}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--color-text-title)' }}>
                    이더넷 MAC 주소
                  </label>
                  <input
                    type="text"
                    placeholder="00:1A:2B:3C:4D:5E"
                    value={formMac}
                    onChange={(e) => setFormMac(e.target.value)}
                    className="w-full p-2.5 rounded-lg outline-none font-mono"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-title)'
                    }}
                  />
                </div>
              </div>

              {/* 특이사항 메모 */}
              <div>
                <label className="block font-semibold mb-1" style={{ color: 'var(--color-text-title)' }}>
                  특이사항 및 메모
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 듀얼 모니터 지급 완료, 신규 미개봉 박스 지급"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg outline-none resize-none"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-title)'
                  }}
                />
              </div>

              {/* 버튼 그룹 */}
              <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Save size={14} /> 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
