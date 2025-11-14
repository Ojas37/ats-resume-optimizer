import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';
import { ParsedResume, PersonalInfo, Education, Experience } from '../types';

export class ParserService {
  /**
   * Extract text from PDF file
   */
  async parsePDF(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error}`);
    }
  }

  /**
   * Extract text from DOCX file
   */
  async parseDOCX(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      throw new Error(`Failed to parse DOCX: ${error}`);
    }
  }

  /**
   * Parse resume text into structured JSON
   */
  parseResumeText(text: string): ParsedResume {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Extract personal information
    const personal_info = this.extractPersonalInfo(lines, text);
    
    // Extract education
    const education = this.extractEducation(text);
    
    // Extract experience
    const experience = this.extractExperience(text);
    
    // Extract skills
    const skills = this.extractSkills(text);
    
    // Extract projects
    const projects = this.extractProjects(text);

    return {
      personal_info,
      education,
      experience,
      skills,
      projects,
      rawText: text
    };
  }

  /**
   * Extract personal information from resume
   */
  private extractPersonalInfo(lines: string[], fullText: string): PersonalInfo {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const linkedinRegex = /linkedin\.com\/in\/[\w-]+/i;
    const githubRegex = /github\.com\/[\w-]+/i;
    
    const email = fullText.match(emailRegex)?.[0] || '';
    const phone = fullText.match(phoneRegex)?.[0] || '';
    const linkedin = fullText.match(linkedinRegex)?.[0] || '';
    const github = fullText.match(githubRegex)?.[0] || '';
    
    // First non-empty line is usually the name
    const name = lines[0] || 'Unknown';
    
    // Extract summary (usually after "Summary", "Objective", "Profile")
    const summaryMatch = fullText.match(/(?:Summary|Objective|Profile|About)[:\s]+(.*?)(?=\n\n|\nEducation|\nExperience)/is);
    const summary = summaryMatch?.[1]?.trim() || '';

    return {
      name,
      email,
      phone,
      linkedin,
      github,
      summary
    };
  }

  /**
   * Extract education section
   */
  private extractEducation(text: string): Education[] {
    const education: Education[] = [];
    
    const educationMatch = text.match(/Education[:\s]+(.*?)(?=\n\n[A-Z]|\nExperience|\nSkills|$)/is);
    if (!educationMatch) return education;

    const educationText = educationMatch[1];
    const lines = educationText.split('\n').filter(line => line.trim());
    
    // Look for degree patterns
    const degreePatterns = /(?:Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|Associate)/i;
    
    let currentEdu: Partial<Education> | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (degreePatterns.test(line)) {
        if (currentEdu && currentEdu.degree) {
          education.push(currentEdu as Education);
        }
        currentEdu = {
          school: '',
          degree: line,
          field: '',
          year: ''
        };
      } else if (currentEdu && !currentEdu.school && line) {
        currentEdu.school = line;
      } else if (currentEdu && /\d{4}/.test(line)) {
        currentEdu.year = line.match(/\d{4}/)?.[0] || '';
      }
    }
    
    if (currentEdu && currentEdu.degree) {
      education.push(currentEdu as Education);
    }
    
    return education;
  }

  /**
   * Extract work experience
   */
  private extractExperience(text: string): Experience[] {
    const experience: Experience[] = [];
    
    const expMatch = text.match(/(?:Experience|Work Experience|Employment)[:\s]+(.*?)(?=\n\n[A-Z]|Education|Skills|$)/is);
    if (!expMatch) return experience;

    const expText = expMatch[1];
    const sections = expText.split(/\n\n+/);
    
    for (const section of sections) {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length === 0) continue;
      
      const exp: Partial<Experience> = {
        title: '',
        company: '',
        duration: '',
        description: '',
        bullets: []
      };
      
      // First line is usually the job title
      exp.title = lines[0].trim();
      
      // Look for company and duration
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check for date patterns
        if (/\d{4}|present|current/i.test(line) && !exp.duration) {
          exp.duration = line;
        } else if (!exp.company && i === 1) {
          exp.company = line;
        } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          exp.bullets?.push(line.replace(/^[•\-*]\s*/, ''));
        } else if (line) {
          exp.bullets?.push(line);
        }
      }
      
      exp.description = exp.bullets?.join(' ') || '';
      
      if (exp.title && exp.company) {
        experience.push(exp as Experience);
      }
    }
    
    return experience;
  }

  /**
   * Extract skills
   */
  private extractSkills(text: string): string[] {
    const skillsMatch = text.match(/Skills[:\s]+(.*?)(?=\n\n[A-Z]|$)/is);
    if (!skillsMatch) return [];

    const skillsText = skillsMatch[1];
    
    // Split by common delimiters
    const skills = skillsText
      .split(/[,•\n|]/)
      .map(skill => skill.trim())
      .filter(skill => skill && skill.length > 2 && skill.length < 50);
    
    return [...new Set(skills)]; // Remove duplicates
  }

  /**
   * Extract projects
   */
  private extractProjects(text: string): any[] {
    const projects: any[] = [];
    
    const projectsMatch = text.match(/Projects[:\s]+(.*?)(?=\n\n[A-Z]|$)/is);
    if (!projectsMatch) return projects;

    const projectsText = projectsMatch[1];
    const sections = projectsText.split(/\n\n+/);
    
    for (const section of sections) {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length === 0) continue;
      
      const project: any = {
        name: lines[0].trim(),
        description: '',
        highlights: []
      };
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          project.highlights.push(line.replace(/^[•\-*]\s*/, ''));
        } else {
          project.description += line + ' ';
        }
      }
      
      project.description = project.description.trim();
      
      if (project.name) {
        projects.push(project);
      }
    }
    
    return projects;
  }
}
