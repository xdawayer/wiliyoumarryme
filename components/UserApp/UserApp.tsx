
import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppState } from '../../types';
import { ICONS } from '../../constants';
import ProfileEdit from './ProfileEdit';
import MeetingList from './MeetingList';

interface UserAppProps {
  state: AppState;
  onLogout: () => void;
}

const UserApp: React.FC<UserAppProps> = ({ state, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/user/meetings', label: '见面', icon: ICONS.meeting, badge: true },
    { path: '/user/profile', label: '我的资料', icon: ICONS.user, badge: false },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden max-w-md mx-auto shadow-2xl relative border-x border-slate-100">
      {/* Top Bar */}
      <div className="bg-white px-4 py-3 border-b flex items-center justify-between z-10 shadow-sm">
        <h1 className="font-black text-slate-800 flex items-center gap-2 tracking-tighter">
          <span className="text-rose-600">{ICONS.heart}</span>
          娄星红娘
        </h1>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xs font-black">
            {state.currentUser?.name[0]}
          </div>
          <button onClick={onLogout} className="text-slate-300 hover:text-rose-600 transition-colors">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/user/meetings" replace />} />
          <Route path="/meetings" element={<MeetingList />} />
          <Route path="/profile" element={<ProfileEdit user={state.currentUser!} profile={state.userProfile} />} />
        </Routes>
      </div>

      {/* Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t px-8 py-3 flex justify-around items-center z-10 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 relative ${
              isActive(item.path) ? 'text-rose-600' : 'text-slate-300'
            }`}
          >
            <span className={`text-2xl transition-transform ${isActive(item.path) ? 'scale-110' : 'scale-100'}`}>{item.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            {item.badge && (
               <div className="absolute top-0 right-1/3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserApp;
