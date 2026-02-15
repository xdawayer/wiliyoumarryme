
import React, { useState } from 'react';
import { ICONS } from '../../constants';

interface Venue {
  id: number;
  name: string;
  address: string;
  type: string;
  capacity: number;
  status: 'active' | 'inactive';
}

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'venues' | 'system'>('venues');

  // 系统参数开关状态
  const [engineActive, setEngineActive] = useState(true);
  const [smsActive, setSmsActive] = useState(true);
  const [holidayActive, setHolidayActive] = useState(false);

  // 场所管理状态
  const [venues, setVenues] = useState<Venue[]>([
    { id: 1, name: '公益红娘驿站 (图书馆店)', address: '娄底市娄星区乐坪街道新星南路', type: '驿站', capacity: 4, status: 'active' },
    { id: 2, name: '万豪咖啡厅', address: '娄底市娄星区大科街道早元街', type: '合作商家', capacity: 10, status: 'active' },
    { id: 3, name: '珠山公园相亲角', address: '娄底市娄星区珠山公园东门', type: '公共空间', capacity: 50, status: 'active' },
    { id: 4, name: '蓝岛咖啡 (市政府店)', address: '娄底市娄星区湘中大道', type: '合作商家', capacity: 8, status: 'inactive' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  const handleOpenEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingVenue(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: number) => {
    setVenues(prev => prev.map(v => 
      v.id === id ? { ...v, status: v.status === 'active' ? 'inactive' : 'active' } : v
    ));
  };

  const handleSaveVenue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const venueData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      type: formData.get('type') as string,
      capacity: parseInt(formData.get('capacity') as string) || 0,
      status: (formData.get('status') as 'active' | 'inactive') || 'active',
    };

    if (editingVenue) {
      setVenues(prev => prev.map(v => v.id === editingVenue.id ? { ...v, ...venueData } : v));
    } else {
      const newVenue: Venue = {
        id: Math.max(0, ...venues.map(v => v.id)) + 1,
        ...venueData,
      };
      setVenues(prev => [...prev, newVenue]);
    }

    setIsModalOpen(false);
    setEditingVenue(null);
  };

  const handleApplyConfig = () => {
    alert('系统参数配置已成功保存并立即生效');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">系统设置</h2>
          <p className="text-sm text-slate-500">管理见面场所及平台全局运行参数</p>
        </div>
      </div>

      {/* 选项卡 */}
      <div className="flex gap-4 border-b border-slate-200">
         <button
            onClick={() => setActiveTab('venues')}
            className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'venues' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            见面场所管理
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'system' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            平台运行参数
          </button>
      </div>

      {activeTab === 'venues' && (
        <div className="space-y-4 animate-in fade-in duration-300">
           <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <i className="fas fa-info-circle"></i>
                 </div>
                 <div>
                    <p className="text-sm font-bold text-indigo-900">场所管理说明</p>
                    <p className="text-xs text-indigo-700">配置的场所将用于“见面安排”时的地点选择。请确保详细地址准确，以便地图精准定位。</p>
                 </div>
              </div>
              <button 
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
              >
                <i className="fas fa-plus"></i> 新增场所
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venues.map(venue => (
                <div key={venue.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shadow-sm ${
                          venue.type === '驿站' ? 'bg-rose-500' : 
                          venue.type === '合作商家' ? 'bg-amber-500' : 'bg-green-500'
                      }`}>
                        <i className={venue.type === '驿站' ? 'fas fa-home' : venue.type === '合作商家' ? 'fas fa-coffee' : 'fas fa-tree'}></i>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          venue.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {venue.status === 'active' ? '启用中' : '已停用'}
                      </span>
                   </div>
                   <h3 className="font-bold text-slate-800 truncate">{venue.name}</h3>
                   <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <i className="fas fa-map-marker-alt text-slate-300"></i> 
                      <span className="truncate">{venue.address}</span>
                   </p>
                   <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-md">
                        <i className="fas fa-chair mr-1"></i>
                        接待量: {venue.capacity}人
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenEdit(venue)}
                          className="text-indigo-600 text-xs font-bold hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors"
                        >
                          编辑
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(venue.id)}
                          className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${
                            venue.status === 'active' ? 'text-rose-600 hover:bg-rose-50' : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                            {venue.status === 'active' ? '停用' : '启用'}
                        </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 animate-in fade-in duration-300">
           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl">
                    <i className="fas fa-robot"></i>
                </div>
                <div>
                    <h4 className="font-bold text-slate-800">AI 智能匹配引擎</h4>
                    <p className="text-xs text-slate-500 mt-1">开启后，系统将每日自动为符合条件的用户生成匹配推送建议。</p>
                </div>
              </div>
              <button 
                onClick={() => setEngineActive(!engineActive)}
                className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full ${engineActive ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                  <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${engineActive ? 'left-7' : 'left-1'}`}></span>
              </button>
           </div>

           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl">
                    <i className="fas fa-sms"></i>
                </div>
                <div>
                    <h4 className="font-bold text-slate-800">短信/微信消息通知</h4>
                    <p className="text-xs text-slate-500 mt-1">匹配成功或管理员发布见面排期时，自动向双方发送通知消息。</p>
                </div>
              </div>
              <button 
                onClick={() => setSmsActive(!smsActive)}
                className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full ${smsActive ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                  <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${smsActive ? 'left-7' : 'left-1'}`}></span>
              </button>
           </div>
           
           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 text-xl">
                    <i className="fas fa-bed"></i>
                </div>
                <div>
                    <h4 className="font-bold text-slate-800">法定节假日免打扰模式</h4>
                    <p className="text-xs text-slate-500 mt-1">在法定节假日期间，暂停系统自动匹配建议的推送。</p>
                </div>
              </div>
              <button 
                onClick={() => setHolidayActive(!holidayActive)}
                className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full ${holidayActive ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                  <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${holidayActive ? 'left-7' : 'left-1'}`}></span>
              </button>
           </div>

           <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <div className="space-x-3">
                <button 
                  onClick={() => alert('此功能需要验证原密码后在独立窗口操作')}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                  修改登录密码
                </button>
                <button 
                  onClick={() => alert('正在加载近30天的系统操作日志...')}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                  查看操作日志
                </button>
              </div>
              <button 
                onClick={handleApplyConfig}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                应用并保存配置
              </button>
           </div>
        </div>
      )}

      {/* 场所编辑弹窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800">
                {editingVenue ? '编辑场所' : '新增见面场所'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white text-slate-400"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSaveVenue} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 font-bold">场所名称</label>
                  <input required name="name" type="text" defaultValue={editingVenue?.name || ''} className="w-full p-4 rounded-2xl bg-slate-50 border-none text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 font-bold">详细地址 (用于签到校验)</label>
                  <input required name="address" type="text" defaultValue={editingVenue?.address || ''} className="w-full p-4 rounded-2xl bg-slate-50 border-none text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 font-bold">类型</label>
                    <select name="type" defaultValue={editingVenue?.type || '驿站'} className="w-full p-4 rounded-2xl bg-slate-50 border-none text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all">
                      <option value="驿站">驿站</option>
                      <option value="合作商家">合作商家</option>
                      <option value="公共空间">公共空间</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 font-bold">接待容量</label>
                    <input required name="capacity" type="number" defaultValue={editingVenue?.capacity || 4} className="w-full p-4 rounded-2xl bg-slate-50 border-none text-sm font-bold" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs">取消</button>
                <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95">确认保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;
