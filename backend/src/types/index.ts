export interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
  location?: string;
  achievements?: string[];
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  duration: string;
  startDate?: string;
  endDate?: string;
  description: string;
  bullets?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies?: string[];
  link?: string;
  highlights?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
  id?: string;
}

export interface ParsedResume {
  personal_info: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects?: Project[];
  certifications?: Certification[];
  rawText: string;
}

export interface ATSScore {
  overall_score: number;
  keyword_match: number;
  format_compliance: number;
  content_quality: number;
  readability: number;
  missing_keywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface EnhancedResume extends ParsedResume {
  enhanced: boolean;
  original_score?: ATSScore;
  enhanced_score?: ATSScore;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}

export interface GeneratedResume {
  id: string;
  pdf_path: string;
  docx_path: string;
  created_at: string;
}
