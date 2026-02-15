
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { MeetingFeedback } from '../../types';

interface MeetingFeedbackModalProps {
  partnerName: string;
  onClose: () => void;
  onSubmit: (feedback: MeetingFeedback) => void;
}

const MeetingFeedbackModal: React.FC<MeetingFeedbackModalProps> = ({ partnerName, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<MeetingFeedback>>({
    match_success_factors: [],
    match_gap_factors: [],
    rejection_reasons: [],
    overall_rating: 5
  });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const toggleMulti = (field: keyof MeetingFeedback, value: string) => {
    const current = (formData[field] as string[]) || [];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(v => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const isWilling = formData.willing_to_continue === '非常愿意' || formData.willing_to_continue === '可以考虑';

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-black text-slate-800">见面反馈</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">与 {partnerName} 的见面回顾</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-8 mb-4">
          <div className="flex gap-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`flex-1 transition-all duration-500 ${step >= s ? 'bg-rose-500' : 'bg-transparent'}`}></div>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-8 space-y-6">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <SectionTitle title="第一部分：印象评价" icon="fa-user-check" />
              
              <Question label="对方外貌与照片符合度">
                <OptionGroup 
                  options={['非常符合', '基本符合', '有一定差距', '差距较大']} 
                  selected={formData.appearance_match} 
                  onSelect={(v) => setFormData({...formData, appearance_match: v})} 
                />
              </Question>

              <Question label="沟通交流的感受">
                <OptionGroup 
                  options={['非常愉快', '比较愉快', '一般', '不太愉快']} 
                  selected={formData.communication_feel} 
                  onSelect={(v) => setFormData({...formData, communication_feel: v})} 
                />
              </Question>

              <Question label="是否愿意继续了解">
                <OptionGroup 
                  options={['非常愿意', '可以考虑', '暂不考虑', '不愿意']} 
                  selected={formData.willing_to_continue} 
                  onSelect={(v) => setFormData({...formData, willing_to_continue: v})} 
                  color="rose"
                />
              </Question>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <SectionTitle title="第二部分：匹配质量" icon="fa-venus-mars" />
              
              <Question label="推荐的对象符合您的期望吗">
                <OptionGroup 
                  options={['完全符合', '大部分符合', '部分符合', '不太符合']} 
                  selected={formData.match_expectation} 
                  onSelect={(v) => setFormData({...formData, match_expectation: v})} 
                />
              </Question>

              <Question label="哪些方面最符合期望 (多选)">
                <MultiGroup 
                  options={['外貌', '学历', '性格', '收入', '家庭背景', '生活习惯']} 
                  selected={formData.match_success_factors || []} 
                  onToggle={(v) => toggleMulti('match_success_factors', v)} 
                />
              </Question>

              <Question label="哪些方面与期望差距最大 (多选)">
                <MultiGroup 
                  options={['外貌', '学历', '性格', '收入', '家庭背景', '生活习惯']} 
                  selected={formData.match_gap_factors || []} 
                  onToggle={(v) => toggleMulti('match_gap_factors', v)} 
                />
              </Question>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <SectionTitle title="第三部分：服务反馈" icon="fa-smile" />
              
              <Question label="见面地点是否满意">
                <OptionGroup 
                  options={['非常满意', '满意', '一般', '不满意']} 
                  selected={formData.venue_satisfaction} 
                  onSelect={(v) => setFormData({...formData, venue_satisfaction: v})} 
                />
              </Question>

              <Question label="见面安排流程是否顺畅">
                <OptionGroup 
                  options={['非常顺畅', '顺畅', '一般', '不顺畅']} 
                  selected={formData.process_satisfaction} 
                  onSelect={(v) => setFormData({...formData, process_satisfaction: v})} 
                />
              </Question>

              <Question label="综合评价评分">
                <div className="flex gap-3 justify-center py-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => setFormData({...formData, overall_rating: star})}
                      className={`text-2xl transition-all ${formData.overall_rating! >= star ? 'text-amber-400 scale-110' : 'text-slate-200'}`}
                    >
                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                </div>
              </Question>

              <Question label="其他建议 (选填)">
                <textarea 
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none text-xs focus:ring-2 focus:ring-rose-500 transition-all resize-none"
                  placeholder="请输入您的意见或建议..."
                  value={formData.other_suggestions}
                  onChange={e => setFormData({...formData, other_suggestions: e.target.value})}
                />
              </Question>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {isWilling ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                    <i className="fas fa-check"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">填写完成</h4>
                  <p className="text-xs text-slate-500 leading-relaxed px-8">
                    感谢您的真实反馈，我们将继续协助您跟进这段缘分。系统已为您记录了本次见面表现。
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <SectionTitle title="第四部分：不愿继续的原因" icon="fa-heart-broken" />
                  <p className="text-[10px] text-rose-400 bg-rose-50 p-3 rounded-xl font-bold leading-relaxed">
                    <i className="fas fa-info-circle mr-1"></i> 拒绝原因仅用于优化 AI 匹配算法，不会告知对方，请放心填写。
                  </p>
                  
                  <Question label="主要原因 (可多选)">
                    <MultiGroup 
                      options={['外貌不合眼缘', '性格不合', '三观有差异', '经济条件不匹配', '家庭情况有顾虑', '生活习惯差异大', '态度不够认真', '地域距离']} 
                      selected={formData.rejection_reasons || []} 
                      onToggle={(v) => toggleMulti('rejection_reasons', v)} 
                      color="rose"
                    />
                  </Question>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t bg-white flex gap-3">
          {step > 1 && (
            <button 
              onClick={handlePrev}
              className="px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black transition-all hover:bg-slate-100"
            >
              上一步
            </button>
          )}
          
          {step < 4 ? (
            <button 
              onClick={handleNext}
              disabled={step === 1 && (!formData.appearance_match || !formData.communication_feel || !formData.willing_to_continue)}
              className={`flex-1 py-4 bg-rose-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-rose-100 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale`}
            >
              下一步
            </button>
          ) : (
            <button 
              onClick={() => onSubmit(formData as MeetingFeedback)}
              className="flex-1 py-4 bg-rose-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-rose-100 transition-all active:scale-95"
            >
              提交反馈
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ title: string; icon: string }> = ({ title, icon }) => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-xs">
      <i className={`fas ${icon}`}></i>
    </div>
    <h4 className="text-sm font-black text-slate-700">{title}</h4>
  </div>
);

const Question: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-3">
    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const OptionGroup: React.FC<{ options: string[]; selected?: string; onSelect: (v: string) => void; color?: 'rose' | 'indigo' }> = ({ options, selected, onSelect, color = 'indigo' }) => (
  <div className="grid grid-cols-2 gap-2">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onSelect(opt)}
        className={`px-4 py-3 rounded-xl text-[10px] font-bold border transition-all text-center ${
          selected === opt 
            ? color === 'rose' ? 'bg-rose-50 border-rose-500 text-rose-600' : 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm'
            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const MultiGroup: React.FC<{ options: string[]; selected: string[]; onToggle: (v: string) => void; color?: 'rose' | 'indigo' }> = ({ options, selected, onToggle, color = 'indigo' }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onToggle(opt)}
        className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${
          selected.includes(opt)
            ? color === 'rose' ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' : 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

export default MeetingFeedbackModal;
