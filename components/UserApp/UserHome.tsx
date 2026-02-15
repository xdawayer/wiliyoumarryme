
import React from 'react';
import { User, UserStatus } from '../../types';
import { ICONS, UI_STRINGS } from '../../constants';
import { useNavigate } from 'react-router-dom';

const UserHome: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();

  const getStatusDisplay = (status: UserStatus) => {
    switch (status) {
      case UserStatus.PENDING_PROFILE: return { label: '待完善资料', color: 'bg-amber-100 text-amber-700' };
      case UserStatus.MATCHING: return { label: '匹配中', color: 'bg-green-100 text-green-700' };
      case UserStatus.MEETING: return { label: '见面安排中', color: 'bg-indigo-100 text-indigo-700' };
      default: return { label: '暂不参与', color: 'bg-slate-100 text-slate-700' };
    }
  };

  const status = getStatusDisplay(user.status);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-400 rounded-3xl p-6 text-white shadow-lg shadow-rose-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">你好，{user.name}</h2>
            <p className="text-rose-50 text-xs opacity-90">欢迎来到官方公益婚恋平台</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
            {status.label}
          </span>
        </div>
        
        <div className="mt-8 flex gap-4">
          <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-[10px] font-bold opacity-80 uppercase">信用分</div>
            <div className="text-2xl font-bold">{user.credit_score}</div>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-[10px] font-bold opacity-80 uppercase">资料完善度</div>
            <div className="text-2xl font-bold">{user.profile_completeness}%</div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/user/matches')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3 transition-transform active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl">
            {ICONS.match}
          </div>
          <span className="font-bold text-slate-700">查看推荐</span>
          <span className="text-[10px] text-slate-400 text-center">AI 已为您选出 3 位良配</span>
        </button>
        
        <button 
          onClick={() => navigate('/user/meetings')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3 transition-transform active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl">
            {ICONS.meeting}
          </div>
          <span className="font-bold text-slate-700">见面日程</span>
          <span className="text-[10px] text-slate-400 text-center">管理您的线下约会</span>
        </button>
      </div>

      {/* Announcement */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-amber-500"><i className="fas fa-bullhorn"></i></span>
          服务公告
        </h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">防骗提醒</p>
              <p className="text-[10px] text-slate-400 mt-0.5">本平台为官方公益服务，不会以任何名义收取费用。请谨防网络诈骗。</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">线下专属空间</p>
              <p className="text-[10px] text-slate-400 mt-0.5">新增3处合作公益咖啡馆，见面可享受专属静谧卡座。</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="text-center py-4">
        <p className="text-[10px] text-slate-300 font-medium tracking-widest uppercase">
          Louxing Matchmaking Platform • V2.0
        </p>
      </div>
    </div>
  );
};

export default UserHome;
