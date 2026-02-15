
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppState, AdminRole } from '../../types';
import { ICONS } from '../../constants';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import MatchManagement from './MatchManagement';
import MeetingManagement from './MeetingManagement';
import SystemSettings from './SystemSettings';

interface AdminAppProps {
  state: AppState;
  onLogout: () => void;
}

const AdminApp: React.FC<AdminAppProps> = ({ state, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: '运营总览', icon: ICONS.stats },
    { path: '/admin/users', label: '用户管理', icon: ICONS.user },
    { path: '/admin/matches', label: '匹配审核', icon: ICONS.match },
    { path: '/admin/meetings', label: '见面安排', icon: ICONS.meeting },
    { path: '/admin/settings', label: '系统设置', icon: ICONS.cog },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getRoleLabel = (role: AdminRole) => {
    switch (role) {
      case AdminRole.SUPER_ADMIN: return '超级管理员';
      case AdminRole.ADMIN: return '平台红娘';
      case AdminRole.VILLAGE_CADRE: return '基层村干';
      default: return '管理人员';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <i className="fas fa-heart"></i>
            娄星红娘后台
          </h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black font-bold">公益婚恋管理系统</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-95 ${
                isActive(item.path) 
                  ? 'bg-indigo-50 text-indigo-600 font-bold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:pl-5'
              }`}
            >
              <span className="w-8 flex justify-center text-lg">{item.icon}</span>
              <span className="text-sm font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t bg-slate-50">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-inner">
              {state.adminUser?.name[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{state.adminUser?.name}</p>
              <p className="text-[10px] text-slate-400 truncate font-bold uppercase">{getRoleLabel(state.adminUser?.role as AdminRole)}</p>
            </div>
            <button onClick={onLogout} className="text-slate-300 hover:text-rose-500 transition-colors active:scale-90 p-2">
              <i className="fas fa-power-off"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement role={state.adminUser!.role} />} />
          <Route path="/matches" element={<MatchManagement />} />
          <Route path="/meetings" element={<MeetingManagement />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminApp;
