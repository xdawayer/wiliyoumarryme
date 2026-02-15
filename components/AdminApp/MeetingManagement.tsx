
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { MeetingFeedback } from '../../types';

interface AdminMeeting {
  id: number;
  userA: { name: string; score: number; avatar: string; prefTimes: string[]; prefVenues: string[] };
  userB: { name: string; score: number; avatar: string; prefTimes: string[]; prefVenues: string[] };
  status: 'pending' | 'scheduled' | 'history' | string;
  matchScore: number;
  requestTime?: string;
  scheduledTime?: string;
  venue?: string;
  venueAddress?: string;
  feedback?: string; // 管理员备注
  feedbackA?: Partial<MeetingFeedback>; // 男方反馈
  feedbackB?: Partial<MeetingFeedback>; // 女方反馈
}

const MeetingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'scheduled' | 'history'>('pending');
  
  const [meetings, setMeetings] = useState<AdminMeeting[]>([
    // --- 待安排 (5条) ---
    { id: 1, userA: { name: '赵铁柱', score: 92, avatar: '赵', prefTimes: ['周六全天', '随时均可'], prefVenues: ['公益红娘驿站 (图书馆店)', '万豪咖啡厅'] }, userB: { name: '钱小花', score: 92, avatar: '钱', prefTimes: ['周末下午', '周六全天'], prefVenues: ['公益红娘驿站 (图书馆店)', '大科街道红娘驿站'] }, status: 'pending', requestTime: '2026-03-20', matchScore: 92 },
    { id: 101, userA: { name: '李大壮', score: 85, avatar: '李', prefTimes: ['随时均可'], prefVenues: ['万豪咖啡厅'] }, userB: { name: '王美丽', score: 85, avatar: '王', prefTimes: ['周末下午'], prefVenues: ['珠山公园相亲角'] }, status: 'pending', requestTime: '2026-03-21', matchScore: 85 },
    { id: 102, userA: { name: '陈文静', score: 88, avatar: '陈', prefTimes: ['工作日晚上'], prefVenues: ['万豪咖啡厅'] }, userB: { name: '张英杰', score: 88, avatar: '张', prefTimes: ['工作日晚上'], prefVenues: ['万豪咖啡厅'] }, status: 'pending', requestTime: '2026-03-22', matchScore: 88 },
    { id: 103, userA: { name: '刘青云', score: 79, avatar: '刘', prefTimes: ['周日全天'], prefVenues: ['珠山公园相亲角'] }, userB: { name: '杨紫嫣', score: 79, avatar: '杨', prefTimes: ['周日全天'], prefVenues: ['珠山公园相亲角'] }, status: 'pending', requestTime: '2026-03-23', matchScore: 79 },
    { id: 104, userA: { name: '徐少强', score: 94, avatar: '徐', prefTimes: ['随时均可'], prefVenues: ['大科街道红娘驿站'] }, userB: { name: '孙俪华', score: 94, avatar: '孙', prefTimes: ['工作日晚上', '周六全天'], prefVenues: ['公益红娘驿站 (图书馆店)'] }, status: 'pending', requestTime: '2026-03-24', matchScore: 94 },

    // --- 已排期 (5条) ---
    { id: 2, userA: { name: '孙悟空', score: 88, avatar: '孙', prefTimes: ['工作日晚上'], prefVenues: ['万豪咖啡厅'] }, userB: { name: '白骨精', score: 88, avatar: '白', prefTimes: ['随时均可', '周末下午'], prefVenues: ['万豪咖啡厅', '蓝岛咖啡'] }, status: 'scheduled', scheduledTime: '2026-03-25 14:30', venue: '公益红娘驿站 (图书馆店)', matchScore: 88 },
    { id: 201, userA: { name: '欧阳锋', score: 82, avatar: '欧', prefTimes: ['周六'], prefVenues: ['万豪咖啡厅'] }, userB: { name: '小龙女', score: 82, avatar: '龙', prefTimes: ['周六'], prefVenues: ['万豪咖啡厅'] }, status: 'scheduled', scheduledTime: '2026-03-26 10:00', venue: '万豪咖啡厅', matchScore: 82 },
    { id: 202, userA: { name: '郭靖', score: 96, avatar: '郭', prefTimes: ['周末'], prefVenues: ['珠山公园相亲角'] }, userB: { name: '黄蓉', score: 96, avatar: '黄', prefTimes: ['周末'], prefVenues: ['珠山公园相亲角'] }, status: 'scheduled', scheduledTime: '2026-03-27 15:00', venue: '珠山公园相亲角', matchScore: 96 },
    { id: 203, userA: { name: '令狐冲', score: 87, avatar: '令', prefTimes: ['随时'], prefVenues: ['蓝岛咖啡'] }, userB: { name: '任盈盈', score: 87, avatar: '任', prefTimes: ['随时'], prefVenues: ['蓝岛咖啡'] }, status: 'scheduled', scheduledTime: '2026-03-28 19:00', venue: '大科街道红娘驿站', matchScore: 87 },
    { id: 204, userA: { name: '杨过', score: 91, avatar: '杨', prefTimes: ['工作日'], prefVenues: ['图书馆店'] }, userB: { name: '程英', score: 91, avatar: '程', prefTimes: ['工作日'], prefVenues: ['图书馆店'] }, status: 'scheduled', scheduledTime: '2026-03-29 14:00', venue: '公益红娘驿站 (图书馆店)', matchScore: 91 },

    // --- 历史记录 (5条) ---
    { id: 3, userA: { name: '周瑜', score: 85, avatar: '周', prefTimes: ['周日'], prefVenues: ['万豪咖啡厅'] }, userB: { name: '小乔', score: 85, avatar: '乔', prefTimes: ['周日'], prefVenues: ['珠山公园相亲角'] }, status: 'history', scheduledTime: '2026-03-15 10:00', venue: '万豪咖啡厅', feedback: '双方沟通顺畅，已交换私人联系方式。', matchScore: 85, feedbackA: { appearance_match: '非常符合', communication_feel: '非常愉快', willing_to_continue: '非常愿意', overall_rating: 5, match_expectation: '完全符合', match_success_factors: ['性格', '生活习惯'], venue_satisfaction: '非常满意', process_satisfaction: '非常顺畅' }, feedbackB: { appearance_match: '基本符合', communication_feel: '非常愉快', willing_to_continue: '可以考虑', overall_rating: 4, match_expectation: '大部分符合', match_success_factors: ['外貌', '收入'], venue_satisfaction: '满意', process_satisfaction: '顺畅' } },
    { id: 301, userA: { name: '梁山伯', score: 99, avatar: '梁', prefTimes: ['随时'], prefVenues: ['珠山公园'] }, userB: { name: '祝英台', score: 99, avatar: '祝', prefTimes: ['随时'], prefVenues: ['珠山公园'] }, status: 'history', scheduledTime: '2026-03-10 14:00', venue: '珠山公园相亲角', feedback: '化蝶双飞，绝配！', matchScore: 99, feedbackA: { overall_rating: 5, willing_to_continue: '非常愿意', appearance_match: '非常符合', communication_feel: '非常愉快' }, feedbackB: { overall_rating: 5, willing_to_continue: '非常愿意', appearance_match: '非常符合', communication_feel: '非常愉快' } },
    { id: 302, userA: { name: '司马相如', score: 89, avatar: '司', prefTimes: ['晚上'], prefVenues: ['咖啡厅'] }, userB: { name: '卓文君', score: 89, avatar: '卓', prefTimes: ['晚上'], prefVenues: ['咖啡厅'] }, status: 'history', scheduledTime: '2026-03-08 19:30', venue: '大科街道红娘驿站', feedback: '才子佳人，已进入深入了解阶段。', matchScore: 89, feedbackA: { overall_rating: 4, willing_to_continue: '可以考虑', appearance_match: '基本符合', communication_feel: '比较愉快' }, feedbackB: { overall_rating: 5, willing_to_continue: '非常愿意', appearance_match: '非常符合', communication_feel: '非常愉快' } },
    { id: 303, userA: { name: '贾宝玉', score: 75, avatar: '贾', prefTimes: ['下午'], prefVenues: ['公园'] }, userB: { name: '林黛玉', score: 75, avatar: '林', prefTimes: ['下午'], prefVenues: ['公园'] }, status: 'history', scheduledTime: '2026-03-05 15:00', venue: '珠山公园相亲角', feedback: '双方性格差异较大，女方对未来生活规划存疑。', matchScore: 75, feedbackA: { overall_rating: 3, willing_to_continue: '暂不考虑', appearance_match: '有一定差距', communication_feel: '一般' }, feedbackB: { overall_rating: 2, willing_to_continue: '不愿意', appearance_match: '差距较大', communication_feel: '不太愉快' } },
    { id: 304, userA: { name: '唐伯虎', score: 92, avatar: '唐', prefTimes: ['全天'], prefVenues: ['图书馆'] }, userB: { name: '秋香', score: 92, avatar: '秋', prefTimes: ['全天'], prefVenues: ['图书馆'] }, status: 'history', scheduledTime: '2026-03-01 10:00', venue: '公益红娘驿站 (图书馆店)', feedback: '三笑留情，男方表现非常积极。', matchScore: 92, feedbackA: { overall_rating: 5, willing_to_continue: '非常愿意', appearance_match: '非常符合', communication_feel: '非常愉快' }, feedbackB: { overall_rating: 4, willing_to_continue: '可以考虑', appearance_match: '基本符合', communication_feel: '比较愉快' } },
  ]);

  const [schedulingMeeting, setSchedulingMeeting] = useState<AdminMeeting | null>(null);
  const [completingMeeting, setCompletingMeeting] = useState<AdminMeeting | null>(null);
  const [viewingFullFeedback, setViewingFullFeedback] = useState<AdminMeeting | null>(null);

  const handleSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date');
    const time = formData.get('time');
    const venue = formData.get('venue');

    setMeetings(prev => prev.map(m => m.id === schedulingMeeting?.id ? {
      ...m,
      status: 'scheduled',
      scheduledTime: `${date} ${time}`,
      venue: venue as string,
    } : m));
    setSchedulingMeeting(null);
    setActiveTab('scheduled');
  };

  const handleComplete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setMeetings(prev => prev.map(m => m.id === completingMeeting?.id ? {
      ...m,
      status: 'history',
      feedback: formData.get('feedback') as string,
    } : m));
    setCompletingMeeting(null);
    setActiveTab('history');
  };

  const handleCancel = (id: number) => {
    if (window.confirm('确定要取消本次见面排期并退回到“待安排”队列吗？')) {
      setMeetings(prev => prev.map(m => m.id === id ? {
        ...m,
        status: 'pending',
        scheduledTime: undefined,
        venue: undefined
      } : m));
      setActiveTab('pending');
    }
  };

  const filteredMeetings = meetings.filter(m => {
    if (activeTab === 'pending') return m.status === 'pending';
    if (activeTab === 'scheduled') return m.status === 'scheduled';
    return m.status === 'history';
  });

  const getOverlap = (arr1: string[], arr2: string[]) => {
    return arr1.filter(item => arr2.includes(item));
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <i key={s} className={`fas fa-star text-[8px] ${s <= rating ? 'text-amber-400' : 'text-slate-100'}`}></i>
        ))}
      </div>
    );
  };

  const getOutcomeBadge = (m: AdminMeeting) => {
    if (!m.feedbackA || !m.feedbackB) return null;
    const willA = m.feedbackA.willing_to_continue === '非常愿意' || m.feedbackA.willing_to_continue === '可以考虑';
    const willB = m.feedbackB.willing_to_continue === '非常愿意' || m.feedbackB.willing_to_continue === '可以考虑';
    
    if (willA && willB) return <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black animate-bounce"><i className="fas fa-heart mr-1"></i>双方有意</span>;
    if (willA || willB) return <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black"><i className="fas fa-arrow-right mr-1"></i>单向意向</span>;
    return <span className="bg-slate-400 text-white px-2 py-0.5 rounded-full text-[9px] font-black">暂无缘分</span>;
  };

  const FeedbackBlock: React.FC<{ label: string; value: any; icon: string }> = ({ label, value, icon }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-tighter">
        <i className={`fas ${icon} w-3`}></i>
        {label}
      </div>
      <div className="text-[11px] font-bold text-slate-800 leading-tight">
        {Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {value.map(v => <span key={v} className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px]">{v}</span>)}
          </div>
        ) : (
          value || '未填写'
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">线下见面调度</h2>
          <p className="text-sm text-slate-500">管理匹配成功的线下活动流程 (5.3 见面安排)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <button 
              onClick={() => setActiveTab('pending')} 
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${activeTab === 'pending' ? 'bg-rose-50 text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              待安排
            </button>
            <button 
              onClick={() => setActiveTab('scheduled')} 
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${activeTab === 'scheduled' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              已排期
            </button>
            <button 
              onClick={() => setActiveTab('history')} 
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${activeTab === 'history' ? 'bg-slate-100 text-slate-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              历史记录
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-calendar-alt text-3xl text-slate-200"></i>
            </div>
            <p className="font-bold text-slate-400">当前没有{activeTab === 'pending' ? '待安排' : activeTab === 'scheduled' ? '已排期' : '历史'}记录</p>
          </div>
        ) : (
          filteredMeetings.map(meeting => (
            <div key={meeting.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col xl:flex-row hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-full xl:w-64 bg-slate-50/50 p-8 flex flex-col justify-center border-r border-slate-100">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 border-4 border-white flex items-center justify-center text-blue-600 font-bold text-sm mb-1.5 mx-auto shadow-sm">{meeting.userA.avatar}</div>
                    <span className="text-xs font-bold text-slate-700">{meeting.userA.name}</span>
                  </div>
                  <i className="fas fa-heart text-rose-300 text-xs animate-pulse"></i>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 border-4 border-white flex items-center justify-center text-rose-600 font-bold text-sm mb-1.5 mx-auto shadow-sm">{meeting.userB.avatar}</div>
                    <span className="text-xs font-bold text-slate-700">{meeting.userB.name}</span>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <span className="block px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 shadow-sm uppercase tracking-widest">匹配度 {meeting.matchScore}%</span>
                  {activeTab === 'history' && getOutcomeBadge(meeting)}
                </div>
              </div>

              <div className="flex-1 p-8 flex flex-col justify-center">
                {activeTab === 'pending' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                          时间意向对比
                        </p>
                        {getOverlap(meeting.userA.prefTimes, meeting.userB.prefTimes).length > 0 && (
                          <span className="bg-green-50 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1 animate-pulse">
                            <i className="fas fa-check-circle"></i> 存在共识
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                           <p className="text-[8px] font-black text-blue-400 uppercase ml-1">A: {meeting.userA.name}</p>
                           <div className="flex flex-wrap gap-1.5">
                              {meeting.userA.prefTimes.map(t => (
                                <span key={t} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${meeting.userB.prefTimes.includes(t) ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{t}</span>
                              ))}
                           </div>
                        </div>
                        <div className="flex-1 space-y-2 border-l pl-4 border-slate-50">
                           <p className="text-[8px] font-black text-rose-400 uppercase ml-1">B: {meeting.userB.name}</p>
                           <div className="flex flex-wrap gap-1.5">
                              {meeting.userB.prefTimes.map(t => (
                                <span key={t} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${meeting.userA.prefTimes.includes(t) ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{t}</span>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-3 bg-rose-500 rounded-full"></span>
                          地点意向对比
                        </p>
                        {getOverlap(meeting.userA.prefVenues, meeting.userB.prefVenues).length > 0 && (
                          <span className="bg-amber-50 text-amber-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                            <i className="fas fa-magic"></i> 最佳契合
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                           <p className="text-[8px] font-black text-blue-400 uppercase ml-1">男方建议</p>
                           <div className="flex flex-col gap-1.5">
                              {meeting.userA.prefVenues.map(v => (
                                <span key={v} className={`px-2 py-1 rounded-lg text-[10px] font-bold truncate ${meeting.userB.prefVenues.includes(v) ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{v}</span>
                              ))}
                           </div>
                        </div>
                        <div className="flex-1 space-y-2 border-l pl-4 border-slate-50">
                           <p className="text-[8px] font-black text-rose-400 uppercase ml-1">女方建议</p>
                           <div className="flex flex-col gap-1.5">
                              {meeting.userB.prefVenues.map(v => (
                                <span key={v} className={`px-2 py-1 rounded-lg text-[10px] font-bold truncate ${meeting.userA.prefVenues.includes(v) ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{v}</span>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'scheduled' ? (
                  <div className="flex items-center gap-8">
                    <div className="flex-1 space-y-1">
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest font-bold">确定的约会时间</p>
                      <div className="flex items-center gap-2">
                        <i className="far fa-clock text-indigo-600"></i>
                        <p className="text-base font-black text-slate-800">{meeting.scheduledTime}</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1 border-l pl-8 border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-bold">见面场馆安排</p>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-map-marker-alt text-rose-500"></i>
                        <p className="text-base font-bold text-slate-800">{meeting.venue}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/50">
                          <div className="flex justify-between items-center mb-1">
                             <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">男方评价: {meeting.userA.name}</p>
                             {renderStars(meeting.feedbackA?.overall_rating)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                             <div className="flex flex-col"><span className="text-slate-400">符合度</span><span className="font-bold text-slate-700">{meeting.feedbackA?.appearance_match}</span></div>
                             <div className="flex flex-col"><span className="text-slate-400">沟通感</span><span className="font-bold text-slate-700">{meeting.feedbackA?.communication_feel}</span></div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-indigo-100/50 flex justify-between items-center">
                             <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                               meeting.feedbackA?.willing_to_continue?.includes('愿意') ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                             }`}>{meeting.feedbackA?.willing_to_continue}</span>
                             <button onClick={() => setViewingFullFeedback(meeting)} className="text-[9px] text-indigo-600 font-black hover:underline active:scale-95 transition-all">查看完整评价</button>
                          </div>
                       </div>
                       
                       <div className="space-y-2 bg-rose-50/30 p-4 rounded-2xl border border-rose-100/50">
                          <div className="flex justify-between items-center mb-1">
                             <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">女方评价: {meeting.userB.name}</p>
                             {renderStars(meeting.feedbackB?.overall_rating)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                             <div className="flex flex-col"><span className="text-slate-400">符合度</span><span className="font-bold text-slate-700">{meeting.feedbackB?.appearance_match}</span></div>
                             <div className="flex flex-col"><span className="text-slate-400">沟通感</span><span className="font-bold text-slate-700">{meeting.feedbackB?.communication_feel}</span></div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-rose-100/50 flex justify-between items-center">
                             <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                               meeting.feedbackB?.willing_to_continue?.includes('愿意') ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                             }`}>{meeting.feedbackB?.willing_to_continue}</span>
                             <button onClick={() => setViewingFullFeedback(meeting)} className="text-[9px] text-rose-600 font-black hover:underline active:scale-95 transition-all">查看完整评价</button>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-l border-slate-50 bg-slate-50/20 w-full xl:w-56 flex flex-col justify-center gap-3">
                {activeTab === 'pending' && (
                  <>
                    <button onClick={() => setSchedulingMeeting(meeting)} className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95">安排见面排期</button>
                    <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-bold hover:bg-slate-50 active:scale-95 transition-all">暂缓处理</button>
                  </>
                )}
                {activeTab === 'scheduled' && (
                  <>
                    <button onClick={() => setCompletingMeeting(meeting)} className="w-full py-3.5 bg-emerald-500 text-white rounded-2xl text-xs font-black shadow-xl shadow-emerald-100 transition-all hover:bg-emerald-600 active:scale-95">确认见面完成</button>
                    <button onClick={() => handleCancel(meeting.id)} className="w-full py-2.5 bg-white text-rose-500 border border-rose-100 rounded-xl text-[10px] font-bold hover:bg-rose-50 transition-all active:scale-95">取消并改期</button>
                  </>
                )}
                {activeTab === 'history' && (
                  <button onClick={() => setViewingFullFeedback(meeting)} className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors active:scale-95 shadow-sm">
                    <i className="fas fa-file-invoice"></i>
                    详细回访报告
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 详细反馈对比模态框 */}
      {viewingFullFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-800">深度见面反馈对比</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  业务编号: MT-{viewingFullFeedback.id} • 见面日期: {viewingFullFeedback.scheduledTime}
                </p>
              </div>
              <button onClick={() => setViewingFullFeedback(null)} className="w-12 h-12 rounded-full hover:bg-white text-slate-400 transition-all flex items-center justify-center active:scale-90">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/20 no-scrollbar">
              <div className="grid grid-cols-2 gap-12 relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 -translate-x-1/2 hidden md:block"></div>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg">{viewingFullFeedback.userA.avatar}</div>
                    <div>
                      <h4 className="font-black text-slate-800">{viewingFullFeedback.userA.name} (男方)</h4>
                      {renderStars(viewingFullFeedback.feedbackA?.overall_rating)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <FeedbackBlock label="外貌符合度" value={viewingFullFeedback.feedbackA?.appearance_match} icon="fa-user-check" />
                    <FeedbackBlock label="沟通交流感受" value={viewingFullFeedback.feedbackA?.communication_feel} icon="fa-comments" />
                    <FeedbackBlock label="匹配预期" value={viewingFullFeedback.feedbackA?.match_expectation} icon="fa-bullseye" />
                    <FeedbackBlock label="符合预期的维度" value={viewingFullFeedback.feedbackA?.match_success_factors} icon="fa-plus-circle" />
                    <FeedbackBlock label="场馆满意度" value={viewingFullFeedback.feedbackA?.venue_satisfaction} icon="fa-map-marker-alt" />
                    <FeedbackBlock label="流程顺畅度" value={viewingFullFeedback.feedbackA?.process_satisfaction} icon="fa-project-diagram" />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shadow-lg">{viewingFullFeedback.userB.avatar}</div>
                    <div>
                      <h4 className="font-black text-slate-800">{viewingFullFeedback.userB.name} (女方)</h4>
                      {renderStars(viewingFullFeedback.feedbackB?.overall_rating)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <FeedbackBlock label="外貌符合度" value={viewingFullFeedback.feedbackB?.appearance_match} icon="fa-user-check" />
                    <FeedbackBlock label="沟通交流感受" value={viewingFullFeedback.feedbackB?.communication_feel} icon="fa-comments" />
                    <FeedbackBlock label="匹配预期" value={viewingFullFeedback.feedbackB?.match_expectation} icon="fa-bullseye" />
                    <FeedbackBlock label="符合预期的维度" value={viewingFullFeedback.feedbackB?.match_success_factors} icon="fa-plus-circle" />
                    <FeedbackBlock label="场馆满意度" value={viewingFullFeedback.feedbackB?.venue_satisfaction} icon="fa-map-marker-alt" />
                    <FeedbackBlock label="流程顺畅度" value={viewingFullFeedback.feedbackB?.process_satisfaction} icon="fa-project-diagram" />
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-slate-800 text-white rounded-[2rem] shadow-xl">
                 <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-clipboard-list text-indigo-400"></i>
                    <h5 className="text-xs font-black uppercase tracking-widest font-bold">人工回访备注</h5>
                 </div>
                 <p className="text-sm font-medium italic">"{viewingFullFeedback.feedback}"</p>
              </div>
            </div>

            <div className="p-8 border-t flex justify-end gap-4 bg-white">
              <button onClick={() => setViewingFullFeedback(null)} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black hover:bg-slate-200 transition-all active:scale-95">关闭</button>
              <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
                <i className="fas fa-file-export"></i>
                导出完整回访记录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 安排排期弹窗 */}
      {schedulingMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800">安排线下见面排期</h3>
              <button onClick={() => setSchedulingMeeting(null)} className="w-10 h-10 rounded-full hover:bg-white text-slate-400 transition-all active:scale-90"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSchedule} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 font-bold">拟定日期</label>
                  <input required name="date" type="date" className="w-full p-4 rounded-2xl bg-slate-50 border-none text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 font-bold">具体时间</label>
                  <input required name="time" type="time" className="w-full p-4 rounded-2xl bg-slate-50 border-none text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 font-bold">约定场馆</label>
                <select required name="venue" className="w-full p-4 rounded-2xl bg-slate-50 border-none text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer">
                  <option>公益红娘驿站 (图书馆店)</option>
                  <option>万豪咖啡厅</option>
                  <option>珠山公园相亲角</option>
                  <option>大科街道红娘驿站</option>
                </select>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95">
                确认排期并下发通知
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 完成录入弹窗 */}
      {completingMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800">见面回访摘要录入</h3>
              <button onClick={() => setCompletingMeeting(null)} className="w-10 h-10 rounded-full hover:bg-white text-slate-400 transition-all active:scale-90"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleComplete} className="p-8 space-y-6">
              <textarea 
                required 
                name="feedback" 
                rows={4} 
                className="w-full p-5 rounded-[1.5rem] bg-slate-50 border-none text-sm font-medium resize-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="请输入本次线下面谈的人工回访记录..."
              ></textarea>
              <button type="submit" className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-2xl shadow-emerald-100 transition-all hover:bg-emerald-600 active:scale-95">
                确认完成并归档历史
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingManagement;
