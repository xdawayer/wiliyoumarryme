
import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from '../../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

type Period = 'week' | 'month' | 'quarter';

const AdminDashboard: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState<Period>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toLocaleTimeString());

  const DATA_MAP = useMemo(() => ({
    week: {
      userMetrics: [
        { label: '总导入量', value: '42', trend: '+5', unit: '人', sub: '本周新增记录' },
        { label: '登录率', value: '91.2', trend: '+3.1', unit: '%', sub: '已登录/总导入' },
        { label: '资料完善率', value: '82.5', trend: '+1.2', unit: '%', sub: '基础资料完整度' },
        { label: '匹配池活跃', value: '124', trend: '+8', unit: '人', sub: '当前活跃匹配中' },
      ],
      matchMetrics: [
        { label: '推荐总次数', value: '842', unit: '次' },
        { label: '单方感兴趣率', value: '45.1', unit: '%' },
        { label: '双向确认率', value: '21.4', unit: '%' },
        { label: '见面率', value: '72.1', unit: '%' },
        { label: '配对成功率', value: '15.2', unit: '%' },
        { label: '平均匹配轮次', value: '4.2', unit: '轮' },
      ],
      aiMetrics: [
        { 
          label: 'AI 评分准确率', 
          value: '88.5', 
          unit: '%', 
          icon: 'fa-bullseye',
          desc: '衡量 AI 预测匹配分与线下真实反馈的一致程度。分值越高，匹配建议越靠谱。'
        },
        { 
          label: '推荐理由认可度', 
          value: '92.1', 
          unit: '%', 
          icon: 'fa-thumbs-up',
          desc: '用户对系统生成的“为什么推荐你们”逻辑的满意比例。反映了算法的人格化理解。'
        },
        { 
          label: '降级发生次数', 
          value: '0', 
          unit: '次', 
          icon: 'fa-shield-virus',
          desc: '因信用异常或严重条件冲突触发“人工介入”的次数。这是系统的安全刹车记录。'
        },
      ],
      ageData: [
        { range: '22-25岁', count: 12 }, { range: '26-30岁', count: 45 }, { range: '31-35岁', count: 32 }, { range: '36-40岁', count: 28 }, { range: '40岁+', count: 12 }
      ],
      eduData: [
        { name: '高中及下', value: 8 }, { name: '大专', value: 15 }, { name: '本科', value: 65 }, { name: '硕士', value: 35 }, { name: '博士', value: 9 }
      ]
    },
    month: {
      userMetrics: [
        { label: '总导入量', value: '1,284', trend: '+12%', unit: '人', sub: '累计入库总数' },
        { label: '登录率', value: '86.4', trend: '+2.1%', unit: '%', sub: '系统注册登录率' },
        { label: '资料完善率', value: '72.8', trend: '+4.5%', unit: '%', sub: '平均资料完整水平' },
        { label: '匹配池活跃', value: '542', trend: '-12', unit: '人', sub: '实时匹配中规模' },
      ],
      matchMetrics: [
        { label: '推荐总次数', value: '4,102', unit: '次' },
        { label: '单方感兴趣率', value: '42.0', unit: '%' },
        { label: '双向确认率', value: '18.5', unit: '%' },
        { label: '见面率', value: '64.2', unit: '%' },
        { label: '配对成功率', value: '12.4', unit: '%' },
        { label: '平均匹配轮次', value: '5.8', unit: '轮' },
      ],
      aiMetrics: [
        { 
          label: 'AI 评分准确率', 
          value: '84.2', 
          unit: '%', 
          icon: 'fa-bullseye',
          desc: '衡量 AI 预测匹配分与线下真实反馈的一致程度。分值越高，匹配建议越靠谱。'
        },
        { 
          label: '推荐理由认可度', 
          value: '87.5', 
          unit: '%', 
          icon: 'fa-thumbs-up',
          desc: '用户对系统生成的“为什么推荐你们”逻辑的满意比例。反映了算法的人格化理解。'
        },
        { 
          label: '降级发生次数', 
          value: '2', 
          unit: '次', 
          icon: 'fa-shield-virus',
          desc: '因信用异常或严重条件冲突触发“人工介入”的次数。这是系统的安全刹车记录。'
        },
      ],
      ageData: [
        { range: '22-25岁', count: 85 }, { range: '26-30岁', count: 210 }, { range: '31-35岁', count: 165 }, { range: '36-40岁', count: 110 }, { range: '40岁+', count: 45 }
      ],
      eduData: [
        { name: '高中及下', value: 62 }, { name: '大专', value: 120 }, { name: '本科', value: 280 }, { name: '硕士', value: 110 }, { name: '博士', value: 32 }
      ]
    },
    quarter: {
      userMetrics: [
        { label: '总导入量', value: '4,102', trend: '+28%', unit: '人', sub: '季度累计覆盖量' },
        { label: '登录率', value: '82.1', trend: '+5.5%', unit: '%', sub: '季度均活跃登记' },
        { label: '资料完善率', value: '68.4', trend: '+8.2%', unit: '%', sub: '质量稳步提升' },
        { label: '匹配池活跃', value: '1,120', trend: '+142', unit: '人', sub: '总池内活跃量' },
      ],
      matchMetrics: [
        { label: '推荐总次数', value: '12,540', unit: '次' },
        { label: '单方感兴趣率', value: '38.5', unit: '%' },
        { label: '双向确认率', value: '14.2', unit: '%' },
        { label: '见面率', value: '58.9', unit: '%' },
        { label: '配对成功率', value: '10.1', unit: '%' },
        { label: '平均匹配轮次', value: '7.5', unit: '轮' },
      ],
      aiMetrics: [
        { 
          label: 'AI 评分准确率', 
          value: '81.5', 
          unit: '%', 
          icon: 'fa-bullseye',
          desc: '衡量 AI 预测匹配分与线下真实反馈的一致程度。分值越高，匹配建议越靠谱。'
        },
        { 
          label: '推荐理由认可度', 
          value: '85.2', 
          unit: '%', 
          icon: 'fa-thumbs-up',
          desc: '用户对系统生成的“为什么推荐你们”逻辑的满意比例。反映了算法的人格化理解。'
        },
        { 
          label: '降级发生次数', 
          value: '5', 
          unit: '次', 
          icon: 'fa-shield-virus',
          desc: '因信用异常或严重条件冲突触发“人工介入”的次数。这是系统的安全刹车记录。'
        },
      ],
      ageData: [
        { range: '22-25岁', count: 320 }, { range: '26-30岁', count: 480 }, { range: '31-35岁', count: 240 }, { range: '36-40岁', count: 180 }, { range: '40岁+', count: 95 }
      ],
      eduData: [
        { name: '高中及下', value: 180 }, { name: '大专', value: 450 }, { name: '本科', value: 512 }, { name: '硕士', value: 128 }, { name: '博士', value: 30 }
      ]
    }
  }), []);

  const currentData = DATA_MAP[reportPeriod];

  useEffect(() => {
    setIsRefreshing(true);
    const timer = setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdateTime(new Date().toLocaleTimeString());
    }, 400);
    return () => clearTimeout(timer);
  }, [reportPeriod]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      alert(`【娄星红娘】报表导出成功`);
      setIsExporting(false);
    }, 1200);
  };

  const genderData = [
    { name: '男嘉宾', value: 45, color: '#4f46e5' },
    { name: '女嘉宾', value: 55, color: '#e11d48' },
  ];

  return (
    <div className={`space-y-8 pb-12 transition-all duration-300 ${isRefreshing ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
      {/* 顶部标题及筛选 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">运营数据中心</h2>
          <p className="text-sm text-slate-500 flex items-center gap-2">
            更新至今日 {lastUpdateTime}
            <button onClick={() => setIsRefreshing(true)} className="text-indigo-600 active:scale-90 transition-transform">
              <i className="fas fa-sync-alt text-[10px]"></i>
            </button>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {(['week', 'month', 'quarter'] as const).map(p => (
              <button
                key={p}
                onClick={() => setReportPeriod(p)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  reportPeriod === p ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {p === 'week' ? '周' : p === 'month' ? '月' : '季'}
              </button>
            ))}
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-xl hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <i className="fas fa-file-excel"></i>
            {isExporting ? '生成中...' : '导出报表'}
          </button>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentData.userMetrics.map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-lg transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{s.label}</h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${s.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {s.trend}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-black text-slate-800">{s.value}</p>
              <span className="text-[10px] font-bold text-slate-400">{s.unit}</span>
            </div>
            <p className="text-[9px] text-slate-400 mt-2 font-medium bg-slate-50 p-2 rounded-xl">
              <i className="fas fa-info-circle mr-1 text-slate-300"></i> {s.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 匹配绩效 */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 uppercase text-xs flex items-center gap-2 mb-8">
            <span className="w-1 h-3 bg-rose-500 rounded-full"></span> 业务闭环绩效
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
             {currentData.matchMetrics.map(m => (
               <div key={m.label} className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase">{m.label}</p>
                 <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-700">{m.value}</span>
                    <span className="text-[9px] font-bold text-slate-400">{m.unit}</span>
                 </div>
                 <div className="w-full h-1 bg-slate-50 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(parseFloat(m.value.replace(',',''))/10, 100)}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* AI 效果看板 - 改为低饱和度的深夜蓝调，降低视觉冲击 */}
        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group border border-slate-700">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 group-hover:scale-[2] transition-transform duration-1000">
            <i className="fas fa-robot text-8xl"></i>
          </div>
          <h3 className="font-black text-xs uppercase mb-8 flex items-center gap-2 relative z-10">
            <span className="w-1 h-3 bg-indigo-500 rounded-full"></span> AI 智能匹配引擎效能
          </h3>
          <div className="space-y-6 relative z-10">
             {currentData.aiMetrics.map((ai, index) => {
               const isLast = index === currentData.aiMetrics.length - 1;
               return (
                 <div key={ai.label} className="group/ai flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-help relative">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60">
                          <i className={`fas ${ai.icon}`}></i>
                       </div>
                       <div>
                          <div className="flex items-center gap-1.5">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{ai.label}</p>
                             <i className="fas fa-question-circle text-[8px] opacity-30"></i>
                          </div>
                          <p className="text-lg font-black tracking-tight">{ai.value}{ai.unit}</p>
                       </div>
                    </div>
                    
                    {/* 自定义悬浮解释气泡 - 自适应位置：顶部向下，底部向上 */}
                    <div className={`absolute left-4 w-56 p-4 bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-2xl text-[10px] text-slate-300 leading-relaxed shadow-2xl opacity-0 pointer-events-none group-hover/ai:opacity-100 group-hover/ai:translate-y-0 transition-all duration-300 z-[100] ${
                      isLast ? 'bottom-full mb-2 translate-y-2' : 'top-full mt-2 -translate-y-2'
                    }`}>
                      <div className="font-black text-white mb-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        指标解读
                      </div>
                      {ai.desc}
                      {/* 箭头指向调整 */}
                      <div className={`absolute left-4 w-2 h-2 bg-slate-900 rotate-45 ${
                        isLast ? 'top-full -translate-y-1' : 'bottom-full translate-y-1'
                      }`}></div>
                    </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>

      {/* 分布图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 性别比例 */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
          <h3 className="font-bold text-slate-800 uppercase text-[11px] mb-8 w-full text-left flex items-center gap-2">
            <span className="w-1 h-3 bg-blue-500 rounded-full"></span> 性别比例
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                  {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 w-full">
            {genderData.map(item => (
              <div key={item.name} className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase">{item.name}</p>
                <p className="text-xl font-black" style={{ color: item.color }}>{item.value}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* 年龄跨度分布 */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 uppercase text-[11px] mb-8 flex items-center gap-2">
            <span className="w-1 h-3 bg-amber-500 rounded-full"></span> 库内年龄波段分布
          </h3>
          <div className="flex-1 min-h-[220px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={currentData.ageData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                 <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                 <Area type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorAge)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* 学历层次分布 */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 uppercase text-[11px] mb-8 flex items-center gap-2">
            <span className="w-1 h-3 bg-emerald-500 rounded-full"></span> 学历层次占比
          </h3>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.eduData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 800, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="py-4 text-center">
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">
          娄星区公益婚恋平台 • 管理决策支持
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
