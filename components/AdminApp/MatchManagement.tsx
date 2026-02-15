
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants';

type MatchStatus = 'idle' | 'pushed' | 'a_confirmed' | 'b_confirmed' | 'both_confirmed';

const MatchManagement: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<any | null>(null);
  const [dailyQuota, setDailyQuota] = useState<number>(10);
  const [isRecalculating, setIsRecalculating] = useState(false);
  
  const generateMockMatches = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      rank: i + 1,
      score: Math.max(70, 98 - Math.floor(i * (25 / count))), 
      status: 'idle' as MatchStatus,
      userA: { name: `男嘉宾${i + 1}`, age: 24 + (i % 12), edu: ['本科', '硕士', '博士', '大专'][i % 4], job: ['公务员', '教师', 'IT工程师', '医生'][i % 4], lifestyle: '早起型', personality: '外向幽默' },
      userB: { name: `女嘉宾${i + 1}`, age: 22 + (i % 10), edu: ['硕士', '本科', '博士', '大专'][i % 4], job: ['教师', '设计师', '公务员', '医生'][i % 4], lifestyle: '早起型', personality: '温柔细腻' },
      reason: i % 2 === 0 
        ? "双方均为早起型作息，且对家庭规划有共识。对方温柔细腻的性格能很好地包容您的幽默风趣。" 
        : "性格互补，且地理位置接近。双方在职业规划和未来居住意向上表现出高度一致。",
      details: {
        personality: { score: 12 + Math.floor(Math.random() * 3), max: 15, reason: "性格维度匹配良好，具备长久相处的性格基础。" },
        lifestyle: { score: 10 + Math.floor(Math.random() * 2), max: 12, reason: "生活方式契合度极高，尤其是作息时间。 " },
        values: { score: 11 + Math.floor(Math.random() * 2), max: 13, reason: "价值观高度对齐，对家庭建设有共同目标。" },
        friction: "目前主要沟通差异点在于居住地的细微通勤距离。"
      }
    }));
  };

  const [recommendations, setRecommendations] = useState(generateMockMatches(10));

  const handleQuotaChange = (newQuota: number) => {
    setDailyQuota(newQuota);
    setIsRecalculating(true);
    // 模拟 AI 重新计算过程
    setTimeout(() => {
      setRecommendations(generateMockMatches(newQuota));
      setIsRecalculating(false);
    }, 1200);
  };

  const handlePush = (id: number) => {
    setRecommendations(prev => prev.map(p => p.id === id ? { ...p, status: 'pushed' } : p));
    setTimeout(() => {
      setRecommendations(prev => prev.map(p => p.id === id ? { ...p, status: 'b_confirmed' } : p));
    }, 2000);
  };

  const getButtonContent = (pair: any) => {
    switch (pair.status) {
      case 'idle':
        return (
          <button 
            onClick={() => handlePush(pair.id)}
            className="px-8 py-3 bg-indigo-600 text-white text-xs font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <i className="fas fa-paper-plane"></i>
            确认并推送
          </button>
        );
      case 'pushed':
        return (
          <span className="text-[10px] font-black text-amber-500 animate-pulse tracking-widest"><i className="fas fa-spinner fa-spin mr-1"></i> 推送成功，等待确认</span>
        );
      case 'b_confirmed':
        return (
          <button 
            onClick={() => setRecommendations(prev => prev.map(p => p.id === pair.id ? { ...p, status: 'both_confirmed' } : p))}
            className="px-6 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all"
          >
            手动核实通过
          </button>
        );
      case 'both_confirmed':
        return (
          <span className="px-6 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl border border-emerald-100"><i className="fas fa-check-double mr-1"></i> 已达成意向</span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">智能匹配建议</h2>
          <p className="text-sm text-slate-500">预览由算法生成的潜在匹配对象并管理推送流程</p>
        </div>
        
        {/* 每日推荐额度选择器 */}
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">推荐额度</span>
          {[10, 20, 50, 100].map(q => (
            <button
              key={q}
              onClick={() => handleQuotaChange(q)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${
                dailyQuota === q 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {q}对
            </button>
          ))}
          <div className="w-px h-6 bg-slate-100 mx-1"></div>
          <button 
            onClick={() => handleQuotaChange(dailyQuota)}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <i className={`fas fa-sync-alt ${isRecalculating ? 'fa-spin' : ''}`}></i>
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-4 transition-all duration-500 ${isRecalculating ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
        {recommendations.map(pair => (
          <div key={pair.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row group hover:shadow-lg transition-all relative">
            
            <div className="w-12 bg-slate-50 flex items-center justify-center border-r border-slate-100 font-mono text-slate-300 text-sm italic">
              #{pair.rank}
            </div>

            <div className="flex-1 p-6 flex items-center justify-between border-b md:border-b-0 md:border-r bg-slate-50/20">
              <div className="flex items-center gap-6 w-full px-4">
                <div className="text-center flex-1">
                  <div className="w-16 h-16 rounded-3xl bg-blue-100 border-4 border-white shadow-sm mb-2 flex items-center justify-center text-blue-600 font-black text-xl mx-auto uppercase">{pair.userA.name[0]}</div>
                  <p className="text-xs font-bold text-slate-700">{pair.userA.name}</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black ${pair.score > 90 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-200 text-slate-600'}`}>
                    {pair.score}%
                  </div>
                  <div className="w-12 h-px bg-slate-200"></div>
                  <span className="text-[8px] font-black text-slate-300 uppercase">匹配度</span>
                </div>

                <div className="text-center flex-1">
                  <div className="w-16 h-16 rounded-3xl bg-rose-100 border-4 border-white shadow-sm mb-2 flex items-center justify-center text-rose-600 font-black text-xl mx-auto uppercase">{pair.userB.name[0]}</div>
                  <p className="text-xs font-bold text-slate-700">{pair.userB.name}</p>
                </div>
              </div>
            </div>

            <div className="flex-[1.5] p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <i className="fas fa-magic text-rose-500 text-[10px]"></i>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI 算法溯源</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-indigo-100 pl-4">
                  "{pair.reason}"
                </p>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => setSelectedPair(pair)} className="text-[10px] font-bold text-indigo-600 hover:underline">查看多维契合报告</button>
                {getButtonContent(pair)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isRecalculating && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm pointer-events-none">
              <div className="text-center animate-in zoom-in-95">
                 <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-sm">正在调整推荐规模...</p>
                 <p className="text-[10px] text-slate-400 font-bold mt-2">红娘 AI 正在为您重新平衡全局最优匹配对</p>
              </div>
           </div>
        )}

      {selectedPair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-800">核心契合维度</h3>
              <button onClick={() => setSelectedPair(null)} className="w-10 h-10 rounded-full hover:bg-white text-slate-400 transition-all"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between p-6 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                <div className="flex items-center gap-4">
                   <div className="text-3xl font-black">{selectedPair.score}%</div>
                   <div>
                     <p className="text-sm font-black">综合评分</p>
                     <p className="text-[10px] opacity-70">Louxing AI Protocol V2.5</p>
                   </div>
                </div>
                <i className="fas fa-microchip text-4xl opacity-20"></i>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <span className="text-[10px] font-black text-blue-600 block mb-2">性格兼容</span>
                  <p className="text-[11px] text-blue-800 italic">"{selectedPair.details.personality.reason}"</p>
                </div>
                <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] font-black text-emerald-600 block mb-2">生活方式</span>
                  <p className="text-[11px] text-emerald-800 italic">"{selectedPair.details.lifestyle.reason}"</p>
                </div>
                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100">
                  <span className="text-[10px] font-black text-amber-600 block mb-2">价值观</span>
                  <p className="text-[11px] text-amber-800 italic">"{selectedPair.details.values.reason}"</p>
                </div>
              </div>
            </div>
            <div className="p-8 border-t flex justify-end">
              <button onClick={() => setSelectedPair(null)} className="px-10 py-3 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black">关闭详情</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchManagement;
