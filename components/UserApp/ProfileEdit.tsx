
import React, { useState, useEffect, useRef } from 'react';
import { User, UserProfile, Gender } from '../../types';
import { ICONS } from '../../constants';

interface ProfileEditProps {
  user: User;
  profile: UserProfile | null;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, profile }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'soft' | 'prefs'>('basic');
  const [isOnlyChild, setIsOnlyChild] = useState(profile?.is_only_child ?? true);
  
  // Photo states
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>(profile?.photos || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selection states for limits validation
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(profile?.hobbies || []);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>(profile?.personality_tags || []);
  
  // Preference states
  const [prefIncome, setPrefIncome] = useState(user.mate_preferences?.income || '不限');
  const [prefEdu, setPrefEdu] = useState(user.mate_preferences?.education || '不限');
  const [prefMarriage, setPrefMarriage] = useState<string[]>(user.mate_preferences?.marriage_status || ['不限']);

  // Priority Ranking State
  const PRIORITY_OPTIONS = ['年龄', '身高', '学历', '月收入', '居住地', '婚姻状况', '生育意向', '家庭背景', '生活方式', '性格契合'];
  const [priorities, setPriorities] = useState<(string | null)[]>(Array(10).fill(null));

  const handlePriorityChange = (index: number, value: string) => {
    const newPriorities = [...priorities];
    newPriorities[index] = value === "" ? null : value;
    setPriorities(newPriorities);
  };

  const getAvailableOptions = (currentIndex: number) => {
    const selectedValues = priorities.filter((val, idx) => val !== null && idx !== currentIndex);
    return PRIORITY_OPTIONS.filter(opt => !selectedValues.includes(opt));
  };

  // Strictness logic
  const isTooStrict = (prefIncome === '15000 以上' || prefIncome === '8000 以上') && 
                      (prefEdu === '硕士及以上' || prefEdu === '本科及以上') &&
                      (prefMarriage.includes('仅限未婚'));

  const tabs = [
    { id: 'basic', label: '基础必填' },
    { id: 'advanced', label: '进阶重要' },
    { id: 'soft', label: '软性偏好' },
    { id: 'prefs', label: '择偶条件' },
  ];

  const handleToggleLimit = (list: string[], item: string, limit: number, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else if (list.length < limit) {
      setter([...list, item]);
    }
  };

  const handleMultiSelect = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (item === '不限') {
      setter(['不限']);
      return;
    }
    const newList = list.filter(i => i !== '不限');
    if (newList.includes(item)) {
      const updated = newList.filter(i => i !== item);
      setter(updated.length === 0 ? ['不限'] : updated);
    } else {
      setter([...newList, item]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPhotos = [...selectedPhotos];
      for (let i = 0; i < files.length; i++) {
        if (newPhotos.length < 3) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedPhotos(prev => [...prev, reader.result as string].slice(0, 3));
          };
          reader.readAsDataURL(files[i]);
        }
      }
    }
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const renderSectionTitle = (title: string, subtitle?: string) => (
    <div className="mb-4">
      <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
        <span className="w-1 h-4 bg-rose-500 rounded-full"></span>
        {title}
      </h3>
      {subtitle && <p className="text-[10px] text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );

  const renderField = (label: string, children: React.ReactNode, required = false) => (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">完善我的资料</h2>
          <p className="text-[10px] text-slate-400">分阶段完善，AI 匹配更精准</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-bold text-green-600">已加密保护</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">当前资料完善度</span>
          <span className="text-sm font-black text-rose-600">{user.profile_completeness}%</span>
        </div>
        <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-rose-500 rounded-full transition-all duration-1000" 
            style={{ width: `${user.profile_completeness}%` }}
          ></div>
        </div>
      </div>

      <div className="sticky top-[-1.1rem] z-[40] -mx-4 px-4 py-2 bg-slate-50/95 backdrop-blur-md border-b border-slate-100/50">
        <div className="flex p-1 bg-white rounded-2xl shadow-sm border border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-8 min-h-[400px]">
        
        {/* TAB 1: BASIC REQUIRED */}
        {activeTab === 'basic' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {renderSectionTitle("形象照片", "建议上传真实生活照，最多3张")}
            <div className="grid grid-cols-3 gap-3">
              {selectedPhotos.map((url, idx) => (
                <div key={idx} className="aspect-[3/4] rounded-2xl bg-slate-100 overflow-hidden relative shadow-sm border border-slate-100 group">
                  <img src={url} className="w-full h-full object-cover" alt={`User ${idx + 1}`} />
                  <button onClick={() => removePhoto(idx)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              {selectedPhotos.length < 3 && (
                <button onClick={() => fileInputRef.current?.click()} className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95">
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                    <i className="fas fa-camera"></i>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">添加照片</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
            </div>
            <div className="h-px bg-slate-50 my-2"></div>
            {renderSectionTitle("核心基础", "身份证自动解析信息不可修改")}
            <div className="grid grid-cols-2 gap-4">
              {renderField("姓名", <div className="p-3 rounded-xl bg-slate-50 text-slate-400 text-sm font-bold border border-slate-100">{user.name}</div>)}
              {renderField("性别", <div className="p-3 rounded-xl bg-slate-50 text-slate-400 text-sm font-bold border border-slate-100">{user.gender === Gender.MALE ? '男' : '女'}</div>)}
            </div>
            {renderField("出生日期", <div className="p-3 rounded-xl bg-slate-50 text-slate-400 text-sm font-bold border border-slate-100">{user.birth_date}</div>)}
            <div className="grid grid-cols-2 gap-4">
              {renderField("身高 (cm)", <input type="number" min="100" max="250" placeholder="cm" defaultValue={profile?.height} className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm font-bold" />, true)}
              {renderField("体重 (kg)", <input type="number" min="30" max="200" placeholder="kg" defaultValue={profile?.weight} className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm font-bold" />, true)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderField("所在城市", <select className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm"><option>娄底市</option><option>长沙市</option></select>, true)}
              {renderField("户籍所在地", <select className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm"><option>娄星区</option><option>双峰县</option></select>, true)}
            </div>
            {renderField("最高学历", <select defaultValue={profile?.education} className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm font-bold"><option>高中及以下</option><option>大专</option><option>本科</option><option>硕士</option><option>博士</option></select>, true)}
            {renderField("职业方向", <div className="space-y-2"><select defaultValue={profile?.career_category} className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm"><option>公务员/教师</option><option>IT/互联网</option><option>医疗/金融</option><option>制造/贸易</option></select><input type="text" placeholder="职位详细描述" defaultValue={profile?.career_description} className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm" /></div>, true)}
            {renderField("婚姻状态", <select defaultValue={profile?.marriage_status} className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm font-bold"><option>未婚</option><option>离异未育</option><option>离异有孩</option></select>, true)}
          </div>
        )}

        {/* TAB 2: ADVANCED IMPORTANT */}
        {activeTab === 'advanced' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {renderSectionTitle("经济与规划", "核心匹配权重的经济指标")}
            <div className="grid grid-cols-2 gap-4">
              {renderField("月收入区间", <select defaultValue={profile?.income_range} className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm font-bold"><option>3000 以下</option><option>3000-5000</option><option>5000-8000</option><option>8000-15000</option><option>15000 以上</option></select>)}
              {renderField("是否有房", <select defaultValue={profile?.has_house} className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm"><option>无</option><option>有（自有）</option><option>有（按揭中）</option><option>与父母同住</option></select>)}
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">是否独生子女</span>
                <div className="flex bg-white rounded-lg p-0.5 border border-slate-100">
                  <button onClick={() => setIsOnlyChild(true)} className={`px-3 py-1 rounded-md text-[10px] font-bold ${isOnlyChild ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400'}`}>是</button>
                  <button onClick={() => setIsOnlyChild(false)} className={`px-3 py-1 rounded-md text-[10px] font-bold ${!isOnlyChild ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400'}`}>否</button>
                </div>
              </div>
              {!isOnlyChild && (
                <div className="animate-in fade-in slide-in-from-top-1">
                  {renderField("兄弟姐妹数量", <input type="number" min="1" defaultValue={profile?.siblings_count || 1} className="w-full p-3 rounded-xl bg-white border border-slate-100 text-sm font-bold" />)}
                </div>
              )}
            </div>
            {renderField("父母情况 (多选)", 
              <div className="flex flex-wrap gap-2">
                {['父母健在', '健康状况良好', '已退休', '有退休金'].map(tag => (
                  <button key={tag} className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${profile?.parent_situation.includes(tag) ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-100 text-slate-400'}`}>{tag}</button>
                ))}
              </div>
            )}
            {renderField("对彩礼/嫁妆的态度", <select defaultValue={profile?.bride_price_attitude} className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm font-bold"><option>遵从传统习俗</option><option>象征性即可</option><option>不需要</option><option>可协商</option></select>)}
            {renderField("婚后居住意向 (多选)", 
              <div className="flex flex-wrap gap-2">
                {['独立居住', '可与男方父母同住', '可与女方父母同住', '均可接受'].map(tag => (
                  <button key={tag} className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${profile?.living_intention.includes(tag) ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-100 text-slate-400'}`}>{tag}</button>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {renderField("生育意向", <select defaultValue={profile?.childbearing_intention} className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm"><option>希望生育 1 个</option><option>希望 2 个及以上</option><option>暂不考虑</option><option>不打算生育</option></select>)}
              {renderField("接受异地", <select defaultValue={profile?.ldr_acceptance} className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 text-sm"><option>不接受</option><option>可短期异地</option><option>可长期异地</option></select>)}
            </div>
          </div>
        )}

        {/* TAB 3: SOFT PREFERENCES */}
        {activeTab === 'soft' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {renderSectionTitle("软性偏好", "让 AI 更懂你的生活细节")}
            {renderField(`兴趣爱好 (${selectedHobbies.length}/8)`, 
              <div className="flex flex-wrap gap-2">
                {['运动健身', '阅读', '旅行', '音乐', '美食', '摄影', '游戏', '宠物', '手工', '园艺', '影视', '垂钓'].map(tag => (
                  <button key={tag} onClick={() => handleToggleLimit(selectedHobbies, tag, 8, setSelectedHobbies)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${selectedHobbies.includes(tag) ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-100 text-slate-400'}`}>{tag}</button>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {renderField("作息习惯", <select defaultValue={profile?.lifestyle.schedule} className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm"><option>早起型</option><option>夜猫型</option><option>不固定</option></select>)}
              {renderField("饮食习惯", <select defaultValue={profile?.lifestyle.diet} className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm"><option>无特殊要求</option><option>素食</option><option>清淡</option><option>其他</option></select>)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderField("是否吸烟", <select defaultValue={profile?.lifestyle.smoking} className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm"><option>从不</option><option>偶尔社交场合</option><option>经常</option></select>)}
              {renderField("是否饮酒", <select defaultValue={profile?.lifestyle.drinking} className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm"><option>从不</option><option>偶尔社交场合</option><option>经常</option></select>)}
            </div>
            {renderField(`性格自评 (${selectedPersonality.length}/5)`, 
              <div className="flex flex-wrap gap-2">
                {['内向', '外向', '理性', '感性', '幽默', '沉稳', '乐观', '细腻', '直爽', '严谨'].map(tag => (
                  <button key={tag} onClick={() => handleToggleLimit(selectedPersonality, tag, 5, setSelectedPersonality)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${selectedPersonality.includes(tag) ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-100 text-slate-400'}`}>{tag}</button>
                ))}
              </div>
            )}
            {renderField("理想周末 (限200字)", <textarea rows={3} maxLength={200} defaultValue={profile?.ideal_weekend} placeholder="一段话描述理想的周末生活..." className="w-full p-4 rounded-xl bg-slate-50 border-none text-sm resize-none"></textarea>)}
            {renderField("择偶宣言 (限200字)", <textarea rows={3} maxLength={200} defaultValue={profile?.partner_declaration} placeholder="介绍自己或表达对另一半的期望..." className="w-full p-4 rounded-xl bg-slate-50 border-none text-sm resize-none"></textarea>)}
          </div>
        )}

        {/* TAB 4: MATE PREFERENCES */}
        {activeTab === 'prefs' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            
            {/* 择偶硬性条件模块 - 移动至上方 */}
            <div className="space-y-6">
              {renderSectionTitle("择偶硬性条件", "不满足条件的候选人将被直接排除")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("年龄范围 (18-60岁)", 
                  <div className="flex items-center gap-2">
                    <input type="number" min="18" max="60" defaultValue={user.mate_preferences?.age_range[0]} className="flex-1 p-3 rounded-xl bg-slate-50 text-center text-sm font-bold border-none" />
                    <span className="text-slate-300 font-bold">至</span>
                    <input type="number" min="18" max="60" defaultValue={user.mate_preferences?.age_range[1]} className="flex-1 p-3 rounded-xl bg-slate-50 text-center text-sm font-bold border-none" />
                  </div>
                )}
                {renderField("身高范围 (140-210cm)", 
                  <div className="flex items-center gap-2">
                    <input type="number" min="140" max="210" defaultValue={user.mate_preferences?.height_range[0]} className="flex-1 p-3 rounded-xl bg-slate-50 text-center text-sm font-bold border-none" />
                    <span className="text-slate-300 font-bold">至</span>
                    <input type="number" min="140" max="210" defaultValue={user.mate_preferences?.height_range[1]} className="flex-1 p-3 rounded-xl bg-slate-50 text-center text-sm font-bold border-none" />
                  </div>
                )}
              </div>
              {renderField("学历要求", <select value={prefEdu} onChange={(e) => setPrefEdu(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm font-bold"><option>不限</option><option>大专及以上</option><option>本科及以上</option><option>硕士及以上</option></select>)}
              {renderField("地域要求 (可多选)", 
                <div className="flex flex-wrap gap-2">
                  {['不限', '本市', '本省', '自定义'].map(tag => (
                    <button key={tag} className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${user.mate_preferences?.location.includes(tag) ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-100 text-slate-400'}`}>{tag}</button>
                  ))}
                </div>
              )}
              {renderField("收入要求", <select value={prefIncome} onChange={(e) => setPrefIncome(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm font-bold"><option>不限</option><option>3000 以上</option><option>5000 以上</option><option>8000 以上</option><option>15000 以上</option></select>)}
              {renderField("婚姻状态 (多选)", 
                 <div className="flex flex-wrap gap-2">
                  {['不限', '仅限未婚', '可接受离异未育'].map(tag => (
                    <button key={tag} onClick={() => handleMultiSelect(prefMarriage, tag, setPrefMarriage)} className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${prefMarriage.includes(tag) ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-100 text-slate-400'}`}>{tag}</button>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {renderField("是否接受有孩", <select defaultValue={user.mate_preferences?.accept_children ? "可接受" : "不接受"} className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm"><option>不限</option><option>可接受</option><option>不接受</option></select>)}
                {renderField("吸烟要求", <select defaultValue={user.mate_preferences?.smoking} className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm"><option>不限</option><option>不吸烟</option></select>)}
              </div>
              {renderField("生育意向", <select defaultValue={user.mate_preferences?.childbearing_intention} className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm"><option>不限</option><option>必须愿意生育</option></select>)}
            </div>

            <div className="h-px bg-slate-100"></div>

            {/* 择偶优先级排序大模块 - 移动至下方 */}
            <section className="p-6 bg-rose-50/50 rounded-[2rem] border border-rose-100/50">
              {renderSectionTitle("择偶优先级排序 (Top 10)", "系统将根据您的排序分配权重，第一位为最核心需求")}
              <div className="space-y-3 mt-4">
                {priorities.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-rose-100 shadow-sm transition-all hover:border-rose-300">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${val ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <select 
                        value={val || ""} 
                        onChange={(e) => handlePriorityChange(idx, e.target.value)}
                        className={`w-full bg-transparent border-none text-xs font-black focus:ring-0 ${val ? 'text-slate-800' : 'text-slate-300'}`}
                      >
                        <option value="">{idx === 0 ? "点击选择最看重的条件..." : `优先级 ${idx + 1} (可选)...`}</option>
                        {getAvailableOptions(idx).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    {val && (
                      <button onClick={() => handlePriorityChange(idx, "")} className="text-slate-300 hover:text-rose-500 transition-colors px-2">
                        <i className="fas fa-times-circle"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Strictness Warning */}
            {isTooStrict && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mt-6 flex gap-3 animate-in zoom-in-95">
                <div className="text-amber-500 mt-0.5"><i className="fas fa-exclamation-triangle"></i></div>
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                  当前条件较为严格，匹配池内满足条件的候选人较少。建议适度放宽非原则性条件，可能获得更优匹配。
                </p>
              </div>
            )}
          </div>
        )}

        <div className="pt-6 border-t border-slate-50">
          <button className="w-full py-5 bg-rose-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-rose-100 hover:bg-rose-700 active:scale-95 transition-all flex items-center justify-center gap-3">
            {ICONS.check}
            保存择偶条件并生效
          </button>
          <p className="text-[9px] text-slate-400 text-center mt-4">
            保存后照片与关键资料将进入人工审核队列，审核通过后即刻开启精准匹配
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
