
export enum UserStatus {
  PENDING_LOGIN = 'pending_login',
  PENDING_PROFILE = 'pending_profile',
  MATCHING = 'matching',
  MEETING = 'meeting',
  PAUSED = 'paused',
  DEVELOPING = 'developing',
  EXITED = 'exited',
  FEEDBACK_PENDING = 'feedback_pending'
}

export enum Gender {
  MALE = 1,
  FEMALE = 2
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  VILLAGE_CADRE = 'village_cadre'
}

export interface MatePreferences {
  age_range: [number, number];
  height_range: [number, number];
  education: string;
  location: string[];
  income: string;
  marriage_status: string[];
  accept_children: boolean;
  smoking: string;
  childbearing_intention: string;
}

export interface User {
  id: string;
  user_code: string;
  name: string;
  id_card: string;
  phone: string;
  gender: Gender;
  birth_date: string;
  status: UserStatus;
  match_enabled: boolean;
  credit_score: number;
  profile_completeness: number;
  village_name?: string;
  mate_preferences?: MatePreferences;
}

export interface UserProfile {
  id: string;
  user_id: string;
  // Layer 1
  height: number;
  weight: number;
  city: string;
  hometown: string;
  education: string;
  career_category: string;
  career_description: string;
  marriage_status: string;
  photos: string[];
  
  // Layer 2
  income_range: string;
  has_house: string;
  has_car: string;
  is_only_child: boolean;
  siblings_count: number;
  parent_situation: string[];
  parent_details: string;
  bride_price_attitude: string;
  living_intention: string[];
  childbearing_intention: string;
  ldr_acceptance: string;

  // Layer 3
  personality_tags: string[];
  hobbies: string[];
  ideal_weekend: string;
  partner_declaration: string;
  lifestyle: {
    schedule: string;
    diet: string;
    smoking: string;
    drinking: string;
  };
}

export interface MeetingFeedback {
  appearance_match: string;
  communication_feel: string;
  overall_impression: string;
  willing_to_continue: string;
  match_expectation: string;
  match_success_factors: string[];
  match_gap_factors: string[];
  venue_satisfaction: string;
  process_satisfaction: string;
  overall_rating: number;
  other_suggestions?: string;
  rejection_reasons?: string[];
}

export interface MatchRecommendation {
  id: string;
  user_id: string;
  candidate_id: string;
  base_score: number;
  ai_score: number;
  total_score: number;
  ai_analysis: string;
  recommendation_summary: string;
  potential_friction: string;
  status: 'pending' | 'approved' | 'rejected';
  user_response?: 'interested' | 'not_interested' | 'pending';
}

export interface AppState {
  currentUser: User | null;
  userProfile: UserProfile | null;
  adminUser: { id: string; name: string; role: AdminRole } | null;
  view: 'user' | 'admin';
}
