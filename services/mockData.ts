
import { User, UserStatus, Gender, UserProfile, MatePreferences } from '../types';

const DEFAULT_PREFERENCES: MatePreferences = {
  age_range: [22, 35],
  height_range: [155, 190],
  education: '不限',
  location: ['娄底市'],
  income: '不限',
  marriage_status: ['未婚'],
  accept_children: false,
  smoking: '不限',
  childbearing_intention: '不限'
};

const firstNames = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林'];
const lastNames = ['明', '美', '伟', '芳', '秀', '英', '杰', '娟', '涛', '兰', '平', '丽', '强', '静', '军', '燕'];
const villages = ['娄星区大科街道', '娄星区乐坪街道', '黄泥塘街道', '花格街道', '蛇形山镇', '万宝镇'];
const educations = ['专科', '本科', '硕士', '博士'];
const jobs = ['公务员', '教师', 'IT工程师', '医生', '个体经营', '金融白领'];

const generateMockData = () => {
  const users: User[] = [];
  const profiles: Record<string, UserProfile> = {};

  for (let i = 1; i <= 109; i++) {
    const id = i.toString();
    const gender = i % 2 === 0 ? Gender.FEMALE : Gender.MALE;
    const name = firstNames[i % firstNames.length] + lastNames[i % lastNames.length] + (i > 30 ? i : '');
    
    users.push({
      id,
      user_code: `U2026${i.toString().padStart(4, '0')}`,
      name,
      id_card: `431301199${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 12).toString().padStart(2, '0')}1234`,
      phone: `13${Math.floor(Math.random() * 999999999).toString().padStart(9, '0')}`,
      gender,
      birth_date: `199${Math.floor(Math.random() * 9)}-06-15`,
      status: i % 5 === 0 ? UserStatus.PENDING_PROFILE : UserStatus.MATCHING,
      match_enabled: true,
      credit_score: 80 + Math.floor(Math.random() * 20),
      profile_completeness: 60 + Math.floor(Math.random() * 40),
      village_name: villages[i % villages.length],
      mate_preferences: DEFAULT_PREFERENCES
    });

    profiles[id] = {
      id: `p${id}`,
      user_id: id,
      height: gender === Gender.MALE ? 170 + (i % 20) : 155 + (i % 20),
      weight: gender === Gender.MALE ? 60 + (i % 30) : 45 + (i % 20),
      city: '湖南省-娄底市-娄星区',
      hometown: '湖南省-娄底市',
      education: educations[i % educations.length],
      career_category: jobs[i % jobs.length],
      career_description: `${jobs[i % jobs.length]}从业者，工作稳定。`,
      marriage_status: '未婚',
      photos: [`https://picsum.photos/seed/user${i}/400/600`],
      income_range: '5000-15000',
      has_house: i % 3 === 0 ? '有（自有）' : '与父母同住',
      has_car: i % 2 === 0 ? '有' : '无',
      is_only_child: i % 4 === 0,
      siblings_count: i % 4 === 0 ? 0 : 1,
      parent_situation: ['父母健在'],
      parent_details: '父母身体健康，均在本地。',
      bride_price_attitude: '好商量',
      living_intention: ['独立居住'],
      childbearing_intention: '顺其自然',
      ldr_acceptance: '不接受',
      personality_tags: ['真诚', '稳重'],
      hobbies: ['阅读', '运动'],
      ideal_weekend: '享受宁静的周末。',
      partner_declaration: '希望能遇到合适的另一半。',
      lifestyle: {
        schedule: '早起型',
        diet: '清淡',
        smoking: '从不',
        drinking: '从不'
      }
    };
  }
  return { users, profiles };
};

const { users, profiles } = generateMockData();

export const MOCK_USERS: User[] = users;
export const MOCK_PROFILES: Record<string, UserProfile> = profiles;
