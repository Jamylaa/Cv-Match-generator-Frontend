// Type definitions for the CV Matching application

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  text: string;
  skills: string[];
  experience_years?: number;
  location?: string;
  salary_expectation?: number;
  availability?: string;
  cv_file_path?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  ai_confidence_score?: number;
  skill_extraction_method?: string;
  last_ai_analysis?: string;
}

export interface Offer {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  required_experience?: number;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  employment_type?: string;
  remote_allowed: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  is_active: boolean;
  ai_confidence_score?: number;
  skill_extraction_method?: string;
  last_ai_analysis?: string;
}

export interface MatchResult {
  offer: Offer;
  similarity_score: number;
  similarity_percentage: number;
  match_level: string;
  common_skills: string[];
  missing_skills: string[];
  extra_skills: string[];
  recommendations: string[];
  breakdown: {
    skill_overlap: number;
    semantic_similarity: number;
    rare_skills_bonus: number;
  };
}

export interface MatchResponse {
  candidate: Candidate;
  matches: Record<string, any>[];
  total_matches: number;
  algorithm_used: string;
  processing_time_ms: number;
  filters_applied: Record<string, any>;
}

export interface CandidateFormData {
  name: string;
  email?: string;
  phone?: string;
  text: string;
  skills?: string[];
  experience_years?: number;
  location?: string;
  salary_expectation?: number;
  availability?: string;
}

export interface OfferFormData {
  title: string;
  company: string;
  description: string;
  skills?: string[];
  required_experience?: number;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  employment_type?: string;
  remote_allowed: boolean;
  expires_at?: string;
}

export enum MatchLevel {
  EXCELLENT = "excellent",
  GOOD = "good",
  AVERAGE = "average",
  POOR = "poor",
}

