import React, { useState, useMemo } from 'react';
import { MOCK_USERS, MOCK_PROFILES } from '../../services/mockData';
import { AdminRole, UserStatus, User, UserProfile, Gender } from '../../types';
import { ICONS } from '../../constants';

interface UserManagementProps {
  role: AdminRole;
}

interface AuditItem {
  id: string;
  user: User;
  photo: string;
  submitTime: string;
  aiSuggestion?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'audit'>('list');
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);
  const [matchingResults, setMatchingResults] = useState<{ user: User; results: any[] } | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  
  // Audit Queue States
  const [auditQueue, setAuditQueue] = useState<AuditItem[]>([
    { id: '1', user: MOCK_USERS[10], photo: 'https://picsum.photos/seed/audit1/600/800', submitTime: '10:30', aiSuggestion: '人脸识别匹配度 98%，建议通过。' },
    { id: '2', user: MOCK_USERS[15], photo: 'https://picsum.photos/seed/audit2/600/800', submitTime: '11:15', aiSuggestion: '照片背景过于杂乱，建议提醒用户更换。' },
    { id: '3', user: MOCK_USERS[22], photo: 'https://picsum.photos/seed/audit3/600/800', submitTime: '12:00', aiSuggestion: '检测到非真实照片嫌疑，请人工重点核查。' },
  ]);
  const [reviewingItem, setReviewingItem] = useState<AuditItem | null>(null);
  const [rejectionModal, setRejectionModal] = useState<AuditItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Pagination & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterAgeRange, setFilterAgeRange] = useState<string>('all');
  const [filterEdu, setFilterEdu] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // 格式化所属区域显示 - 剥离默认前缀并截断详细地点（只保留到村/社区/居委会）
  const formatVillage = (villageName?: string) => {
    if (!villageName) return '未登记';
    let cleaned = villageName.replace('娄底市', '').replace('娄星区', '').trim();
    
    // 自动截断村/社区/居委会之后的详细信息（如：某某组、某某号）
    const keywords = ['村', '社区', '居委会'];
    for (const keyword of keywords) {
      const index = cleaned.indexOf(keyword);
      if (index !== -1) {
        return cleaned.substring(0, index + keyword.length);
      }
    }
    return cleaned;
  };

  // 提取库内所有唯一区域供筛选
  const uniqueRegions = useMemo(() => {
    const regions = new Set<string>();
    MOCK_USERS.forEach(u => {
      const formatted = formatVillage(u.village_name);
      if (formatted && formatted !== '未登记') regions.add(formatted);
    });
    return Array.from(regions).sort();
  }, []);

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(user => {
      const profile = MOCK_PROFILES[user.id];
      const age = 2026 - parseInt(user.birth_date.split('-')[0]);

      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.user_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.includes(searchTerm);
      const matchesGender = filterGender === 'all' || user.gender.toString() === filterGender;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesRegion = filterRegion === 'all' || formatVillage(user.village_name) === filterRegion;
      const matchesEdu = filterEdu === 'all' || (profile?.education || '').includes(filterEdu);
      
      let matchesAge = true;
      if (filterAgeRange !== 'all') {
        if (filterAgeRange === '18-25') matchesAge = age >= 18 && age <= 25;
        else if (filterAgeRange === '26-30') matchesAge = age >= 26 && age <= 30;
        else if (filterAgeRange === '31-35') matchesAge = age >= 31 && age <= 35;
        else if (filterAgeRange === '36-40') matchesAge = age >= 36 && age <= 40;
        else if (filterAgeRange === '41+') matchesAge = age >= 41;
      }

      return matchesSearch && matchesGender && matchesStatus && matchesRegion && matchesEdu && matchesAge;
    });
  }, [searchTerm, filterGender, filterStatus, filterRegion, filterAgeRange, filterEdu]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleAuditApprove = (id: string) => {
    setAuditQueue(prev => prev.filter(item => item.id !== id));
    setReviewingItem(null);
    alert('【操作成功】资料审核通过');
  };

  const handleAuditReject = () => {
    if (!rejectReason) {
      alert('请填写驳回原因');
      return;
    }
    setAuditQueue(prev => prev.filter(item => item.id !== rejectionModal?.id));
    setRejectionModal(null);
    setReviewingItem(null);
    setRejectReason('');
    alert('【操作成功】已驳回并下发通知');
  };

  const handleQuickMatch = (user: User) => {
    setIsMatching(true);
    setTimeout(() => {
      const results = Array.from({ length: 4 }, (_, i) => ({
        id: `cand-${i}`,
        name: user.gender === 1 ? `女嘉宾 ${i + 1}` : `男嘉宾 ${i + 1}`,
        age: 22 + Math.floor(Math.random() * 10),
        score: 98 - i * 5,
        edu: ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)],
        job: ['公务员', '教师', '医生', '设计师'][Math.floor(Math.random() * 4)],
        avatar: user.gender === 1 ? `https://picsum.photos/seed/fm${i}/200/200` : `https://picsum.photos/seed/ml${i}/200/200`,
        dimensions: {
          personality: 85 + Math.floor(Math.random() * 15),
          lifestyle: 80 + Math.floor(Math.random() * 20),
          values: 90 + Math.floor(Math.random() * 10)
        },
        summary: i === 0 
          ? "该嘉宾与案主在‘早起作息’与‘购房规划’上表现出惊人的一致性，且性格测评中‘细腻’与‘开朗’完美互补。"
          : "同城生活圈交集度高，学历背景匹配，且双方父母均表现出极高的开明度。"
      }));
      setMatchingResults({ user, results });
      setIsMatching(false);
    }, 1500);
  };

  const getStatusDisplay = (status: UserStatus) => {
    switch (status) {
      case UserStatus.MATCHING: return { label: '匹配中', class: 'bg-indigo-50 text-indigo-600' };
      case UserStatus.PENDING_PROFILE: return { label: '待完善资料', class: 'bg-amber-50 text-amber-600' };
      case UserStatus.MEETING: return { label: '见面安排中', class: 'bg-rose-50 text-rose-600' };
      case UserStatus.PAUSED: return { label: '已暂停', class: 'bg-slate-100 text-slate-400' };
      default: return { label: '休息中', class: 'bg-slate-50 text-slate-400' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">用户与审核管理</h2>
          <p className="text-xs text-slate-500 font-medium">维护平台 {MOCK_USERS.length} 位嘉宾的核心数据资产</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
            <button onClick={() => setActiveTab('list')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'list' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>用户库</button>
            <button onClick={() => setActiveTab('audit')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'audit' ? 'bg-rose-50 text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>待审队列 <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full animate-pulse">{auditQueue.length}</span></button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="space-y-4">
            {/* 增强后的筛选工具栏 */}
            <div className="bg-white px-6 py-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4 overflow-x-auto no-scrollbar">
              <div className="flex flex-wrap items-center gap-4 flex-1">
                <div className="relative w-64 flex-shrink-0">
                  <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
                  <input type="text" placeholder="搜索姓名/编号/手机号" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none text-[12px] font-bold focus:ring-2 focus:ring-indigo-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-600 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="all">性别不限</option>
                    <option value="1">男嘉宾</option>
                    <option value="2">女嘉宾</option>
                  </select>

                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-600 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="all">状态不限</option>
                    <option value={UserStatus.MATCHING}>匹配中</option>
                    <option value={UserStatus.PENDING_PROFILE}>待完善资料</option>
                    <option value={UserStatus.MEETING}>见面安排中</option>
                    <option value={UserStatus.PAUSED}>已暂停</option>
                  </select>

                  <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-600 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none max-w-[140px]">
                    <option value="all">所属区域</option>
                    {uniqueRegions.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                  </select>

                  <select value={filterAgeRange} onChange={(e) => setFilterAgeRange(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-600 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="all">年龄区间</option>
                    <option value="18-25">18-25岁</option>
                    <option value="26-30">26-30岁</option>
                    <option value="31-35">31-35岁</option>
                    <option value="36-40">36-40岁</option>
                    <option value="41+">41岁以上</option>
                  </select>

                  <select value={filterEdu} onChange={(e) => setFilterEdu(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-600 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="all">学历要求</option>
                    <option value="专科">专科</option>
                    <option value="本科">本科</option>
                    <option value="硕士">硕士</option>
                    <option value="博士">博士</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                        <tr>
                        <th className="px-6 py-5 w-20">序号</th>
                        <th className="px-6 py-5 w-48">嘉宾/性别</th>
                        <th className="px-6 py-5 w-64">核心画像</th>
                        <th className="px-6 py-5 w-80">所属区域</th>
                        <th className="px-6 py-5 w-32 text-center">资料进度</th>
                        <th className="px-6 py-5 w-40 text-center">状态</th>
                        <th className="px-6 py-5 text-right w-48">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedUsers.map((user, index) => {
                            const profile = MOCK_PROFILES[user.id];
                            const age = 2026 - parseInt(user.birth_date.split('-')[0]);
                            return (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-6 text-slate-400 font-mono text-xs truncate">
                                      {((currentPage-1)*pageSize + index + 1).toString().padStart(4, '0')}
                                    </td>
                                    <td className="px-6 py-6">
                                      <div className="flex items-center gap-2 truncate">
                                        <span className="font-black text-slate-800">{user.name}</span>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black shrink-0 ${user.gender === 1 ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>{user.gender === 1 ? '男' : '女'}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-6 text-[11px] text-slate-500 font-bold truncate">
                                      {age}岁 • {profile?.education} • {profile?.career_category}
                                    </td>
                                    <td className="px-6 py-6 text-[11px] text-slate-500 font-bold">
                                      <div className="flex items-center gap-1.5 truncate">
                                        <i className="fas fa-map-marker-alt text-slate-300 text-[9px]"></i>
                                        {formatVillage(user.village_name)}
                                      </div>
                                    </td>
                                    <td className="px-6 py-6">
                                      <div className="flex items-center justify-center gap-2">
                                        <div className="w-10 bg-slate-100 h-1 rounded-full overflow-hidden shrink-0">
                                          <div className={`bg-emerald-500 h-full`} style={{width: `${user.profile_completeness}%`}}></div>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-400 shrink-0">{user.profile_completeness}%</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                      <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-black whitespace-nowrap ${getStatusDisplay(user.status).class}`}>{getStatusDisplay(user.status).label}</span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                      <div className="flex justify-end gap-1.5">
                                        <button onClick={() => setSelectedUserForDetail(user)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black hover:bg-slate-200 transition-all shrink-0">查看</button>
                                        <button onClick={() => handleQuickMatch(user)} className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all shrink-0 active:scale-95">智能匹配</button>
                                      </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className="flex justify-between items-center px-8 py-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase">共 {totalPages} 页 / 每页 {pageSize} 行</p>
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold disabled:opacity-30">上一页</button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold disabled:opacity-30">下一页</button>
              </div>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
           {auditQueue.map(item => (
             <div key={item.id} onClick={() => setReviewingItem(item)} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all cursor-pointer">
                <div className="h-48 bg-slate-100 relative">
                  <img src={item.photo} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-black">{item.user.name}</p>
                    <p className="text-[10px] opacity-70">提交于 {item.submitTime}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>待核验资料</span>
                   <i className="fas fa-arrow-right text-slate-200 group-hover:text-rose-500 transition-colors"></i>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* 嘉宾资料详情窗 */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              <div className="w-full md:w-1/3 bg-slate-100 relative">
                 <img src={MOCK_PROFILES[selectedUserForDetail.id]?.photos[0]} className="w-full h-full object-cover" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                 <div className="absolute bottom-8 left-8 right-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="text-3xl font-black">{selectedUserForDetail.name}</h3>
                       <span className={`px-2 py-1 rounded-lg text-[10px] font-black border border-white/20 backdrop-blur-md ${selectedUserForDetail.gender === 1 ? 'bg-blue-500/20' : 'bg-rose-500/20'}`}>
                          {selectedUserForDetail.gender === 1 ? '男嘉宾' : '女嘉宾'}
                       </span>
                    </div>
                    <p className="text-sm font-bold opacity-80">{formatVillage(selectedUserForDetail.village_name)}</p>
                    <div className="mt-6 space-y-3">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                          <span>资料完善度</span>
                          <span>{selectedUserForDetail.profile_completeness}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{width: `${selectedUserForDetail.profile_completeness}%`}}></div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex-1 flex flex-col bg-white">
                 <div className="p-8 border-b flex justify-between items-center">
                    <div>
                       <h4 className="text-lg font-black text-slate-800">全量画像数据资产</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {selectedUserForDetail.user_code}</p>
                    </div>
                    <button onClick={() => setSelectedUserForDetail(null)} className="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-300 hover:text-rose-500 transition-all flex items-center justify-center active:scale-90">
                       <i className="fas fa-times-circle text-2xl"></i>
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                    <section className="space-y-4">
                       <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                          <span className="w-1 h-3 bg-indigo-600 rounded-full"></span>
                          第一层：核心基础资料
                       </h5>
                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            {l: '年龄', v: `${2026 - parseInt(selectedUserForDetail.birth_date.split('-')[0])}岁`},
                            {l: '身高', v: `${MOCK_PROFILES[selectedUserForDetail.id]?.height}cm`},
                            {l: '学历', v: MOCK_PROFILES[selectedUserForDetail.id]?.education},
                            {l: '职业类别', v: MOCK_PROFILES[selectedUserForDetail.id]?.career_category},
                            {l: '所属村镇', v: formatVillage(selectedUserForDetail.village_name)},
                            {l: '联系电话', v: selectedUserForDetail.phone}
                          ].map(i => (
                            <div key={i.l} className="p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                               <p className="text-[9px] font-black text-slate-400 mb-1">{i.l}</p>
                               <p className="text-xs font-black text-slate-700">{i.v || '未填'}</p>
                            </div>
                          ))}
                       </div>
                    </section>
                 </div>
                 
                 <div className="p-8 border-t bg-slate-50 flex justify-end gap-3">
                    <button onClick={() => setSelectedUserForDetail(null)} className="px-8 py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[11px] font-black hover:bg-slate-50 transition-all active:scale-95">返回列表</button>
                    <button onClick={() => { setSelectedUserForDetail(null); handleQuickMatch(selectedUserForDetail); }} className="px-8 py-3 bg-rose-600 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95">为此嘉宾智能匹配</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 智能匹配结果 */}
      {matchingResults && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-50 w-full max-w-5xl max-h-[90vh] rounded-[4rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
            <div className="p-10 bg-gradient-to-r from-rose-600 to-rose-500 text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black border border-white/20">
                  <i className="fas fa-magic animate-pulse"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight">AI 智能匹配分析报告</h3>
                  <p className="text-sm opacity-80 mt-1 font-bold">针对嘉宾 {matchingResults.user.name} 的库内全局检索已完成</p>
                </div>
              </div>
              <button onClick={() => setMatchingResults(null)} className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-all relative z-10 active:scale-90"><i className="fas fa-times"></i></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {matchingResults.results.map((res, idx) => (
                  <div key={res.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col gap-6 hover:shadow-xl transition-all relative group">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">#{idx+1}</div>
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-slate-100 overflow-hidden shadow-inner flex-shrink-0">
                        <img src={res.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                           <h4 className="text-xl font-black text-slate-800">{res.name}</h4>
                           <div className="text-right">
                              <span className="text-3xl font-black text-rose-600 tracking-tighter">{res.score}%</span>
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">契合度指数</p>
                           </div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-black mt-1 uppercase">{res.age}岁 • {res.edu} • {res.job}</p>
                      </div>
                    </div>
                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black hover:bg-rose-600 transition-all active:scale-95 shadow-xl shadow-slate-100">下发匹配推荐</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 审核详情 */}
      {reviewingItem && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-slate-100"><img src={reviewingItem.photo} className="w-full h-full object-cover" alt="" /></div>
            <div className="flex-1 p-8 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div><h3 className="text-xl font-black text-slate-800">资料核验详情</h3><p className="text-xs text-slate-400 mt-1 uppercase font-bold">USER CODE: {reviewingItem.user.user_code}</p></div>
                <button onClick={() => setReviewingItem(null)} className="text-slate-300 hover:text-slate-500 flex items-center justify-center active:scale-90"><i className="fas fa-times-circle text-xl"></i></button>
              </div>
              <div className="pt-8 flex gap-3">
                <button onClick={() => setRejectionModal(reviewingItem)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[11px] font-black hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95">驳回资料</button>
                <button onClick={() => handleAuditApprove(reviewingItem.id)} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">确认通过</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 驳回原因 */}
      {rejectionModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
              <h4 className="text-lg font-black text-slate-800 mb-4">标注驳回理由</h4>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="说明原因，将直接推送到嘉宾端..." className="w-full p-4 rounded-2xl bg-slate-50 border-none text-xs h-32 resize-none focus:ring-2 focus:ring-rose-500 font-medium" />
              <div className="flex gap-3 mt-6">
                 <button onClick={() => setRejectionModal(null)} className="flex-1 py-3 text-slate-400 font-bold text-xs active:scale-95">取消</button>
                 <button onClick={handleAuditReject} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-black text-xs active:scale-95">确认并驳回</button>
              </div>
           </div>
        </div>
      )}

      {isMatching && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-rose-600 font-black text-lg">正在运行红娘算法全局检索...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;