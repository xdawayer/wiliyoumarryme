
import React, { useState } from 'react';
import { User, AdminRole, UserStatus, Gender } from '../types';
import { MOCK_USERS } from '../services/mockData';
import { UI_STRINGS, ICONS } from '../constants';

interface LandingPageProps {
  onUserLogin: (user: User) => void;
  onAdminLogin: (admin: { id: string; name: string; role: AdminRole }) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onUserLogin, onAdminLogin }) => {
  const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');
  const [formData, setFormData] = useState({
    name: '',
    idCard: '',
    phone: '',
    adminAccount: '',
    adminPassword: ''
  });
  const [error, setError] = useState('');

  const handleUserLogin = () => {
    if (!formData.name || !formData.phone || !formData.idCard) {
      setError('请完整填写姓名、手机号和身份证号');
      return;
    }

    // 尝试匹配数据库内已有用户：三项必须全部一致
    const user = MOCK_USERS.find(u => 
      u.name === formData.name && 
      u.phone === formData.phone && 
      u.id_card === formData.idCard
    );
    
    if (user) {
      setError('');
      onUserLogin(user);
    } else {
      setError('未查找到匹配的嘉宾信息，请确保姓名、手机号、身份证号与登记时完全一致');
    }
  };

  const handleAdminLogin = () => {
    if (formData.adminAccount === 'admin' && formData.adminPassword === '123456') {
      onAdminLogin({ id: 'a1', name: '系统管理员', role: AdminRole.SUPER_ADMIN });
    } else if (formData.adminAccount === 'cadre' && formData.adminPassword === '123456') {
      onAdminLogin({ id: 'a2', name: '村支书张三', role: AdminRole.VILLAGE_CADRE });
    } else {
      setError('账号或密码错误（提示：admin / 123456）');
    }
  };

  const quickLoginUser = () => {
    const testUser = MOCK_USERS[0];
    onUserLogin(testUser);
  };

  const quickLoginAdmin = () => {
    onAdminLogin({ id: 'a1', name: '系统管理员', role: AdminRole.SUPER_ADMIN });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-50 to-indigo-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-rose-600 mb-2 tracking-tight">{UI_STRINGS.APP_NAME}</h1>
        <p className="text-slate-600 font-medium">{UI_STRINGS.APP_SLOGAN}</p>
        <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-bold">{UI_STRINGS.GOV_BACKING}</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 relative">
        <div className="flex border-b">
          <button 
            onClick={() => { setLoginMode('user'); setError(''); }}
            className={`flex-1 py-5 text-sm font-bold transition-all ${loginMode === 'user' ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/30' : 'text-slate-400 hover:text-slate-600'}`}
          >
            嘉宾登录
          </button>
          <button 
            onClick={() => { setLoginMode('admin'); setError(''); }}
            className={`flex-1 py-5 text-sm font-bold transition-all ${loginMode === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:text-slate-600'}`}
          >
            管理入口
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-[11px] leading-relaxed rounded-2xl flex items-start gap-3 animate-pulse">
              <i className="fas fa-exclamation-circle text-base mt-0.5"></i>
              <span>{error}</span>
            </div>
          )}

          {loginMode === 'user' ? (
            <div className="space-y-5">
              <button 
                onClick={quickLoginUser}
                className="w-full py-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-[10px] font-black text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-bolt"></i>
                测试账号一键登录
              </button>
              
              <div className="h-px bg-slate-100 my-2"></div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">真实姓名 <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all text-sm font-bold"
                    placeholder="请输入姓名"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">手机号 <span className="text-rose-500">*</span></label>
                  <input 
                    type="tel" 
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all text-sm font-bold"
                    placeholder="请输入登录手机号"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">身份证号 <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all text-sm font-bold"
                    placeholder="请输入18位身份证号"
                    value={formData.idCard}
                    onChange={e => setFormData({...formData, idCard: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={handleUserLogin}
                className="w-full py-5 bg-rose-600 text-white rounded-3xl font-black shadow-xl shadow-rose-200 hover:bg-rose-700 hover:-translate-y-1 transition-all active:translate-y-0 active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                <i className="fas fa-sign-in-alt"></i>
                身份匹配并登录
              </button>
              
              <div className="text-center mt-6">
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  本平台仅限已完成线下实名采集的嘉宾登录<br/>
                  请确保输入信息与登记时完全一致
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <button 
                onClick={quickLoginAdmin}
                className="w-full py-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-[10px] font-black text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-shield-alt"></i>
                超级管理员一键进入
              </button>
              <div className="h-px bg-slate-100 my-2"></div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">管理员账号</label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all text-sm font-medium"
                  placeholder="账号 (admin)"
                  value={formData.adminAccount}
                  onChange={e => setFormData({...formData, adminAccount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">登录密码</label>
                <input 
                  type="password" 
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all text-sm font-medium"
                  placeholder="密码 (123456)"
                  value={formData.adminPassword}
                  onChange={e => setFormData({...formData, adminPassword: e.target.value})}
                />
              </div>
              <button 
                onClick={handleAdminLogin}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0 active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-lock"></i>
                进入管理系统
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
