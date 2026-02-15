
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import MeetingFeedbackModal from './MeetingFeedbackModal';
import { MeetingFeedback, User, UserProfile, Gender, UserStatus } from '../../types';
import { MOCK_USERS, MOCK_PROFILES } from '../../services/mockData';

// Helper to calculate distance in meters between two coordinates
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

const MeetingList: React.FC = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedMeetingForFeedback, setSelectedMeetingForFeedback] = useState<any | null>(null);
  const [viewingPartner, setViewingPartner] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'upcoming' | 'history'>('upcoming');
  const [isLocating, setIsLocating] = useState(false);
  
  // States for Preference Selection
  const [activePreferencePush, setActivePreferencePush] = useState<any | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);

  // New: Pending AI Recommendations pushed by Admin
  const [pushedRecommendations, setPushedRecommendations] = useState([
    {
      id: 'push-1',
      userId: '2', // Mapping to MOCK_USERS[1] (王小美)
      partnerName: '王小美',
      age: 26,
      job: '教育行业',
      edu: '本科',
      reason: 'AI 根据您的早起作息和对“独立居住”的共识，为您精准挑选了这位同样热爱生活的艺术工作者。',
      status: 'pending'
    }
  ]);

  const [meetings, setMeetings] = useState([
    {
      id: 'm1',
      partnerName: '王小美',
      date: '2026-03-25',
      time: '14:30',
      venue: '公益红娘驿站 (图书馆店)',
      address: '娄底市娄星区乐坪街道新星南路',
      // Mocked coordinates for the venue (Loudi Library area)
      latitude: 27.7285,
      longitude: 112.0082,
      status: 'confirmed',
      type: 'official',
      feedback_submitted: false,
      signed_in: false
    }
  ]);

  const handleViewDetail = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) setViewingPartner(user);
  };

  const openPreferenceModal = (pushItem: any) => {
    setActivePreferencePush(pushItem);
    setSelectedTimes(['随时均可']);
    setSelectedVenues([]);
  };

  const handleConfirmPushWithPrefs = () => {
    if (!activePreferencePush) return;
    
    // Simulate moving to schedule
    setPushedRecommendations(prev => prev.filter(p => p.id !== activePreferencePush.id));
    
    setMeetings(prev => [...prev, {
      id: `m-${Date.now()}`,
      partnerName: activePreferencePush.partnerName,
      date: '待排期',
      time: '待定',
      venue: selectedVenues.length > 0 ? selectedVenues[0] : '待管理员安排',
      address: '确认成功后由系统分配',
      latitude: 27.7, // generic mock
      longitude: 112.0, // generic mock
      status: 'pending',
      type: 'official',
      feedback_submitted: false,
      signed_in: false
    }]);

    setActivePreferencePush(null);
    alert('意向提交成功！红娘将参考您的偏好进行排期，请留意系统通知。');
  };

  const handleSignIn = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting || !meeting.latitude || !meeting.longitude) return;

    if (!navigator.geolocation) {
      alert('您的浏览器不支持地理定位');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = getDistance(latitude, longitude, meeting.latitude, meeting.longitude);

        setIsLocating(false);
        if (distance <= 100) {
          setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, signed_in: true } : m));
          alert('签到成功！欢迎来到官方见面场所，请保持礼貌，祝您好运。');
        } else {
          alert(`签到失败：您当前距离目的地约为 ${Math.round(distance)} 米。请到达目标场所 100 米范围内再试。`);
        }
      },
      (error) => {
        setIsLocating(false);
        console.error('Geolocation error:', error);
        alert('无法获取您的位置，请检查定位权限是否开启。');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleFeedbackSubmit = (feedback: MeetingFeedback) => {
    setMeetings(prev => prev.map(m => 
      m.id === selectedMeetingForFeedback.id 
        ? { ...m, feedback_submitted: true, status: 'history' } 
        : m
    ));
    setShowFeedbackModal(false);
  };

  const toggleSelection = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const filteredMeetings = meetings.filter(m => {
    if (viewMode === 'upcoming') return m.status !== 'history';
    return m.status === 'history';
  });

  const VENUE_OPTIONS = [
    '公益红娘驿站 (图书馆店)',
    '万豪咖啡厅',
    '珠山公园相亲角',
    '大科街道红娘驿站'
  ];

  const TIME_OPTIONS = [
    '工作日晚上',
    '周六全天',
    '周日全天',
    '随时均可'
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Pending Push Notifications Section - Only shown in upcoming view */}
      {viewMode === 'upcoming' && pushedRecommendations.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              AI 精选推送
              <span className="ml-2 text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">官方推荐</span>
            </h2>
          </div>
          
          {pushedRecommendations.map(item => (
            <div key={item.id} className="bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-100/20 overflow-hidden relative">
               {/* View Detail Button - Top Right */}
               <button 
                  onClick={() => handleViewDetail(item.userId)}
                  className="absolute top-12 right-4 z-10 px-3 py-1.5 bg-white/80 backdrop-blur-md border border-rose-100 text-rose-600 text-[10px] font-black rounded-xl shadow-sm hover:bg-rose-50 transition-all flex items-center gap-1.5"
               >
                  <i className="fas fa-id-card"></i>
                  查看画像
               </button>

               <div className="bg-rose-500 px-4 py-2 flex justify-between items-center">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">红娘系统已为你匹配良缘</span>
                  <i className="fas fa-magic text-white/50 text-xs"></i>
               </div>
               <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 font-black text-xl border border-rose-100 overflow-hidden">
                       <img src={MOCK_PROFILES[item.userId]?.photos[0]} className="w-full h-full object-cover grayscale-[0.3]" alt="" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-base">{item.partnerName}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.age}岁 • {item.edu} • {item.job}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-indigo-600 uppercase mb-1 tracking-tighter">AI 推荐摘要</p>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{item.reason}"</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPushedRecommendations(prev => prev.filter(p => p.id !== item.id))}
                      className="flex-1 py-3.5 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black hover:bg-slate-200 transition-all uppercase"
                    >
                      暂不感兴趣
                    </button>
                    <button 
                      onClick={() => openPreferenceModal(item)}
                      className="flex-[2] py-3.5 bg-rose-600 text-white rounded-2xl text-[10px] font-black shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95 uppercase flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-check-circle"></i>
                      确认参与线下见面
                    </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Scheduled Meetings Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
          {viewMode === 'upcoming' ? '线下见面日程' : '见面历史记录'}
        </h2>
        <button 
          onClick={() => setViewMode(prev => prev === 'upcoming' ? 'history' : 'upcoming')}
          className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5"
        >
          <i className={`fas ${viewMode === 'upcoming' ? 'fa-history' : 'fa-calendar-alt'}`}></i>
          {viewMode === 'upcoming' ? '历史记录' : '查看当前日程'}
        </button>
      </div>

      <div className="space-y-4 min-h-[300px]">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group animate-in fade-in duration-300">
              <div className={`h-1.5 w-full ${
                meeting.status === 'confirmed' ? 'bg-green-500' : 
                meeting.status === 'history' ? 'bg-slate-300' : 'bg-amber-400'
              }`}></div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-slate-800">与 {meeting.partnerName} 的见面</span>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                        meeting.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                        meeting.status === 'history' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {meeting.status === 'confirmed' ? '已排期' : 
                         meeting.status === 'history' ? '已完成' : '等待安排时间'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      {ICONS.location}
                      <span className="truncate max-w-[200px]">{meeting.venue}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-800 leading-tight">{meeting.time}</div>
                    <div className="text-[10px] font-bold text-slate-400">{meeting.date}</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                    <i className="fas fa-map-marked-alt"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">见面地点</p>
                    <p className="text-xs text-slate-600 truncate">{meeting.address}</p>
                  </div>
                </div>

                {meeting.status === 'confirmed' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedMeetingForFeedback(meeting);
                        setShowFeedbackModal(true);
                      }}
                      className="flex-1 py-3 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-bold hover:bg-rose-100 transition-all border border-rose-100"
                    >
                      提交评价/反馈
                    </button>
                    {meeting.signed_in ? (
                      <button className="flex-[2] py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black border border-emerald-100 flex items-center justify-center gap-2" disabled>
                        <i className="fas fa-check-double"></i>
                        已签到
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSignIn(meeting.id)}
                        disabled={isLocating}
                        className={`flex-[2] py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2 ${isLocating ? 'opacity-50' : ''}`}
                      >
                        {isLocating ? (
                           <><i className="fas fa-spinner fa-spin"></i> 正在定位...</>
                        ) : (
                           <><i className="fas fa-location-arrow"></i> 立即签到</>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {meeting.status === 'history' && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase">
                      <i className="fas fa-check-circle"></i>
                      已提交评价，感谢您的反馈
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 animate-in fade-in duration-300">
             <i className={`fas ${viewMode === 'upcoming' ? 'fa-calendar-alt' : 'fa-history'} text-4xl text-slate-100 mb-4`}></i>
             <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">
                {viewMode === 'upcoming' ? '暂无已安排的见面' : '暂无历史见面记录'}
             </p>
          </div>
        )}
      </div>

      {/* Preference Selection Bottom Sheet */}
      {activePreferencePush && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-300">
           <div className="bg-white rounded-t-[2.5rem] flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-500">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2"></div>
              
              <div className="px-8 py-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-800 text-lg">设置您的见面偏好</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">提交后由红娘为您精准排期</p>
                </div>
                <button onClick={() => setActivePreferencePush(null)} className="text-slate-300 hover:text-slate-500"><i className="fas fa-times-circle text-xl"></i></button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 no-scrollbar">
                
                {/* Time Suggestions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-clock text-indigo-500"></i>
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">期望见面时间 (可多选)</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TIME_OPTIONS.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => toggleSelection(selectedTimes, opt, setSelectedTimes)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                          selectedTimes.includes(opt) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Venue Suggestions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-rose-500"></i>
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">期望见面地点 (可多选)</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {VENUE_OPTIONS.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => toggleSelection(selectedVenues, opt, setSelectedVenues)}
                        className={`w-full p-4 rounded-[1.5rem] text-left border transition-all flex items-center justify-between ${
                          selectedVenues.includes(opt) ? 'bg-rose-50 border-rose-500' : 'bg-slate-50 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedVenues.includes(opt) ? 'bg-rose-500 text-white' : 'bg-white text-slate-300'}`}>
                              <i className="fas fa-coffee text-[10px]"></i>
                           </div>
                           <span className={`text-xs font-bold ${selectedVenues.includes(opt) ? 'text-rose-700' : 'text-slate-600'}`}>{opt}</span>
                        </div>
                        {selectedVenues.includes(opt) && <i className="fas fa-check-circle text-rose-500"></i>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                   <i className="fas fa-info-circle text-amber-500 mt-0.5"></i>
                   <p className="text-[10px] text-amber-700 font-bold leading-relaxed">红娘将综合考量双方的偏好与场馆容量，为您匹配最舒适的见面体验。</p>
                </div>
              </div>

              <div className="p-8 bg-white border-t">
                 <button 
                   onClick={handleConfirmPushWithPrefs}
                   className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                    <i className="fas fa-paper-plane"></i>
                    确认意向并提交建议
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Profile Detail Modal (H5 Version) */}
      {viewingPartner && (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Top Bar */}
          <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <button onClick={() => setViewingPartner(null)} className="text-slate-400 text-xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50">
              <i className="fas fa-chevron-left"></i>
            </button>
            <h3 className="font-black text-slate-800">嘉宾画像详情</h3>
            <div className="w-10"></div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* Hero Section */}
            <div className="h-80 bg-slate-200 relative overflow-hidden">
               <img src={MOCK_PROFILES[viewingPartner.id]?.photos[0]} className="w-full h-full object-cover" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-black">{viewingPartner.name}</span>
                    <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold">{MOCK_PROFILES[viewingPartner.id]?.education}</span>
                  </div>
                  <div className="flex gap-2 opacity-80 text-[10px] font-bold uppercase tracking-widest">
                    <span>{viewingPartner.birth_date.split('-')[0]}年</span>
                    <span>•</span>
                    <span>{viewingPartner.village_name}</span>
                  </div>
               </div>
            </div>

            <div className="p-6 space-y-8 pb-32">
               {/* Dimensional Cards */}
               <SectionH5 title="第一层：基础信息" icon="fa-id-card">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <InfoItem label="身高" value={`${MOCK_PROFILES[viewingPartner.id]?.height}cm`} />
                    <InfoItem label="婚姻状态" value={MOCK_PROFILES[viewingPartner.id]?.marriage_status} />
                    <InfoItem label="职业分类" value={MOCK_PROFILES[viewingPartner.id]?.career_category} />
                    <InfoItem label="户籍地" value={MOCK_PROFILES[viewingPartner.id]?.hometown.split('-')[2] || viewingPartner.village_name} />
                  </div>
               </SectionH5>

               <SectionH5 title="第二层：经济与生活" icon="fa-home">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <InfoItem label="月收入" value={MOCK_PROFILES[viewingPartner.id]?.income_range} />
                    <InfoItem label="住房情况" value={MOCK_PROFILES[viewingPartner.id]?.has_house} />
                    <InfoItem label="购车情况" value={MOCK_PROFILES[viewingPartner.id]?.has_car} />
                    <InfoItem label="生育意向" value={MOCK_PROFILES[viewingPartner.id]?.childbearing_intention} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">父母情况</p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{MOCK_PROFILES[viewingPartner.id]?.parent_details}</p>
                  </div>
               </SectionH5>

               <SectionH5 title="第三层：生活方式" icon="fa-coffee">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {MOCK_PROFILES[viewingPartner.id]?.personality_tags.map(t => (
                      <span key={t} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg">{t}</span>
                    ))}
                    {MOCK_PROFILES[viewingPartner.id]?.hobbies.map(t => (
                      <span key={t} className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg">{t}</span>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <InfoItem label="作息习惯" value={MOCK_PROFILES[viewingPartner.id]?.lifestyle.schedule} />
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[9px] font-black text-rose-500 uppercase mb-1">内心宣言</p>
                      <p className="text-xs text-slate-600 leading-relaxed italic">"{MOCK_PROFILES[viewingPartner.id]?.partner_declaration}"</p>
                    </div>
                  </div>
               </SectionH5>

               <SectionH5 title="+1：择偶标准" icon="fa-heart">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-xs text-slate-400 font-bold">年龄要求</span>
                      <span className="text-xs text-slate-700 font-black">{viewingPartner.mate_preferences?.age_range[0]}-{viewingPartner.mate_preferences?.age_range[1]}岁</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-xs text-slate-400 font-bold">学历要求</span>
                      <span className="text-xs text-slate-700 font-black">{viewingPartner.mate_preferences?.education}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-slate-400 font-bold">地域要求</span>
                      <span className="text-xs text-slate-700 font-black">{viewingPartner.mate_preferences?.location.join('/')}</span>
                    </div>
                  </div>
               </SectionH5>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="p-6 bg-white border-t sticky bottom-0 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
             <button 
                onClick={() => {
                  const pushId = pushedRecommendations.find(p => p.userId === viewingPartner.id)?.id;
                  if (pushId) openPreferenceModal(pushedRecommendations.find(p => p.userId === viewingPartner.id));
                  setViewingPartner(null);
                }}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 active:scale-95 transition-all"
             >
                我已了解，申请线下见面
             </button>
          </div>
        </div>
      )}

      {showFeedbackModal && selectedMeetingForFeedback && (
        <MeetingFeedbackModal 
          partnerName={selectedMeetingForFeedback.partnerName}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
      
      <div className="py-4 text-center">
        <p className="text-[10px] text-slate-300 uppercase tracking-widest font-black">
          官方保障 • 线下脱单
        </p>
      </div>
    </div>
  );
};

const SectionH5: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 text-xs shadow-inner">
        <i className={`fas ${icon}`}></i>
      </div>
      <h4 className="text-sm font-black text-slate-800">{title}</h4>
    </div>
    <div className="bg-white rounded-[2rem] border border-slate-100 p-5 shadow-sm">
      {children}
    </div>
  </div>
);

const InfoItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">{label}</p>
    <p className="text-xs font-bold text-slate-700">{value || '未填'}</p>
  </div>
);

export default MeetingList;
