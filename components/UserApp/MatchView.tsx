
import React, { useState, useEffect } from 'react';
import { ICONS, COLORS } from '../../constants';
import { analyzeMatch } from '../../services/geminiService';
import { MOCK_PROFILES } from '../../services/mockData';

const MatchView: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  useEffect(() => {
    // Simulate loading AI recommendations
    setTimeout(() => {
      setCandidates([
        { id: '2', name: '王小美', code: 'U20260002', age: 26, height: 165, education: '本科', job: '教育行业', city: '娄底市', matchScore: 88, portrait: 'https://picsum.photos/seed/girl1/400/600' },
        { id: '4', name: '李佳', code: 'U20260004', age: 28, height: 168, education: '硕士', job: '公务员', city: '娄底市', matchScore: 92, portrait: 'https://picsum.photos/seed/girl2/400/600' },
        { id: '5', name: '陈悦', code: 'U20260005', age: 25, height: 162, education: '本科', job: '医疗行业', city: '娄底市', matchScore: 84, portrait: 'https://picsum.photos/seed/girl3/400/600' },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const handleShowAnalysis = async (candidate: any) => {
    setAnalyzing(true);
    const userA = MOCK_PROFILES['1']; // Current User
    const userB = MOCK_PROFILES[candidate.id] || MOCK_PROFILES['2']; // Mocking B if not found
    
    const analysis = await analyzeMatch(userA, userB);
    setSelectedMatch({ ...candidate, analysis });
    setAnalyzing(false);
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-medium">AI 正在匹配库中为您筛选...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">今日推荐</h2>
        <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded-full">
          剩 3 次推荐
        </span>
      </div>

      <div className="space-y-4">
        {candidates.map(candidate => (
          <div key={candidate.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col">
            <div className="h-64 relative">
              <img src={candidate.portrait} className="w-full h-full object-cover grayscale-[0.2]" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold">{candidate.age}岁</span>
                  <span className="text-xs opacity-80">{candidate.city}</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">{candidate.education}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">{candidate.job}</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl">
                <span className="text-rose-600 text-xs font-black">{candidate.matchScore}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Match %</span>
              </div>
            </div>
            
            <div className="p-4 flex flex-col gap-4">
              <div className="bg-rose-50/50 p-3 rounded-2xl">
                <p className="text-[10px] font-bold text-rose-600 uppercase mb-1">AI 推荐理由</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "双方均为早起型作息，且对家庭规划有共识。对方温柔细腻的性格能很好地包容您的幽默风趣。"
                </p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleShowAnalysis(candidate)}
                  className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  查看深度分析
                </button>
                <button className="flex-[1.5] py-3 bg-rose-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-rose-200 active:scale-95 transition-all">
                  我感兴趣
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analysis Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-slate-800">AI 深度分析报告</h3>
              <button onClick={() => setSelectedMatch(null)} className="text-slate-400">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(selectedMatch.analysis.dimensions).map(([key, value]: [string, any]) => (
                  <div key={key} className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-2 text-rose-500 font-black text-sm">
                      {value.score}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase leading-tight">
                      {key.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {Object.entries(selectedMatch.analysis.dimensions).map(([key, value]: [string, any]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{key.replace('_', ' ')}</p>
                    <p className="text-xs text-slate-700 leading-relaxed italic">"{value.reason}"</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-[10px] font-bold text-amber-700 uppercase mb-1">潜在关注点</p>
                <p className="text-xs text-amber-600 leading-relaxed">
                  {selectedMatch.analysis.potential_friction}
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t">
              <button className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-100">
                申请线下见面
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analyzing Loader */}
      {analyzing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-rose-600 font-bold">数字红娘分析中...</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Running De-identified Match Algorithm</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchView;
