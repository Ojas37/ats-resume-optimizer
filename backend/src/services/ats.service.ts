import axios from 'axios';
import { ATSScore } from '../types';

export class ATSService {
  /**
   * Calculate ATS score for resume text
   * This uses a simulated scoring algorithm
   * Replace with actual ATS API when available
   */
  async calculateScore(resumeText: string): Promise<ATSScore> {
    try {
      // Check if external ATS API is configured
      if (process.env.ATS_API_KEY && process.env.ATS_API_URL) {
        return await this.callExternalATSAPI(resumeText);
      }
      
      // Fallback to internal scoring algorithm
      return this.internalScoring(resumeText);
    } catch (error) {
      console.error('ATS scoring error:', error);
      // Return fallback score
      return this.internalScoring(resumeText);
    }
  }

  /**
   * Call external ATS API (Resume Worded or similar)
   */
  private async callExternalATSAPI(resumeText: string): Promise<ATSScore> {
    const response = await axios.post(
      process.env.ATS_API_URL!,
      { resume_text: resumeText },
      {
        headers: {
          'Authorization': `Bearer ${process.env.ATS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  /**
   * Internal ATS scoring algorithm
   */
  private internalScoring(resumeText: string): ATSScore {
    const text = resumeText.toLowerCase();
    
    // Calculate keyword match score
    const keywordScore = this.calculateKeywordScore(text);
    
    // Calculate format compliance score
    const formatScore = this.calculateFormatScore(resumeText);
    
    // Calculate content quality score
    const contentScore = this.calculateContentScore(text);
    
    // Calculate readability score
    const readabilityScore = this.calculateReadabilityScore(text);
    
    // Overall score (weighted average)
    const overall_score = Math.round(
      (keywordScore * 0.35) +
      (formatScore * 0.25) +
      (contentScore * 0.25) +
      (readabilityScore * 0.15)
    );
    
    // Find missing keywords
    const missing_keywords = this.findMissingKeywords(text);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(
      keywordScore,
      formatScore,
      contentScore,
      readabilityScore,
      text
    );
    
    // Identify strengths
    const strengths = this.identifyStrengths(
      keywordScore,
      formatScore,
      contentScore,
      readabilityScore
    );
    
    // Identify weaknesses
    const weaknesses = this.identifyWeaknesses(
      keywordScore,
      formatScore,
      contentScore,
      readabilityScore
    );

    return {
      overall_score,
      keyword_match: keywordScore,
      format_compliance: formatScore,
      content_quality: contentScore,
      readability: readabilityScore,
      missing_keywords,
      suggestions,
      strengths,
      weaknesses
    };
  }

  /**
   * Calculate keyword match score
   */
  private calculateKeywordScore(text: string): number {
    const importantKeywords = [
      'managed', 'developed', 'created', 'implemented', 'designed',
      'led', 'improved', 'increased', 'reduced', 'achieved',
      'analyzed', 'coordinated', 'executed', 'optimized', 'strategic',
      'leadership', 'collaboration', 'innovation', 'results-driven'
    ];
    
    let score = 0;
    const maxScore = importantKeywords.length;
    
    for (const keyword of importantKeywords) {
      if (text.includes(keyword)) {
        score++;
      }
    }
    
    return Math.round((score / maxScore) * 100);
  }

  /**
   * Calculate format compliance score
   */
  private calculateFormatScore(text: string): number {
    let score = 100;
    
    // Check for essential sections
    const sections = ['experience', 'education', 'skills'];
    for (const section of sections) {
      if (!text.toLowerCase().includes(section)) {
        score -= 15;
      }
    }
    
    // Check for contact information
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
    const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
    
    if (!hasEmail) score -= 10;
    if (!hasPhone) score -= 5;
    
    // Check length (ideal: 400-1000 words)
    const wordCount = text.split(/\s+/).length;
    if (wordCount < 300) {
      score -= 15;
    } else if (wordCount > 1500) {
      score -= 10;
    }
    
    return Math.max(0, score);
  }

  /**
   * Calculate content quality score
   */
  private calculateContentScore(text: string): number {
    let score = 70; // Base score
    
    // Check for quantifiable achievements
    const numberPattern = /\d+%|\d+\+|increased by \d+|reduced by \d+/gi;
    const achievements = text.match(numberPattern);
    if (achievements && achievements.length > 3) {
      score += 20;
    } else if (achievements && achievements.length > 0) {
      score += 10;
    }
    
    // Check for action verbs
    const actionVerbs = ['achieved', 'improved', 'increased', 'developed', 'led'];
    const verbCount = actionVerbs.filter(verb => text.includes(verb)).length;
    score += Math.min(verbCount * 2, 10);
    
    return Math.min(100, score);
  }

  /**
   * Calculate readability score
   */
  private calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const words = text.split(/\s+/);
    
    if (sentences.length === 0) return 50;
    
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Ideal: 15-20 words per sentence
    let score = 100;
    if (avgWordsPerSentence > 25) {
      score -= 20;
    } else if (avgWordsPerSentence < 10) {
      score -= 10;
    }
    
    // Check for bullet points (good for readability)
    const bulletPoints = (text.match(/[•\-*]/g) || []).length;
    if (bulletPoints > 5) {
      score = Math.min(100, score + 10);
    }
    
    return Math.max(0, score);
  }

  /**
   * Find missing important keywords
   */
  private findMissingKeywords(text: string): string[] {
    const importantKeywords = [
      'leadership', 'team collaboration', 'project management',
      'data analysis', 'problem-solving', 'communication',
      'strategic planning', 'results-driven', 'innovation'
    ];
    
    return importantKeywords.filter(keyword => !text.includes(keyword.toLowerCase()));
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(
    keywordScore: number,
    formatScore: number,
    contentScore: number,
    readabilityScore: number,
    text: string
  ): string[] {
    const suggestions: string[] = [];
    
    if (keywordScore < 60) {
      suggestions.push('Add more action verbs like "managed", "developed", "implemented"');
      suggestions.push('Include industry-specific keywords relevant to your field');
    }
    
    if (formatScore < 70) {
      suggestions.push('Ensure all essential sections are present (Experience, Education, Skills)');
      suggestions.push('Add contact information (email and phone number)');
    }
    
    if (contentScore < 70) {
      suggestions.push('Include quantifiable achievements (e.g., "Increased sales by 30%")');
      suggestions.push('Use more specific metrics and numbers to demonstrate impact');
    }
    
    if (readabilityScore < 70) {
      suggestions.push('Use bullet points to improve readability');
      suggestions.push('Keep sentences concise (15-20 words per sentence)');
    }
    
    if (!text.includes('project')) {
      suggestions.push('Consider adding a Projects section to showcase your work');
    }
    
    return suggestions;
  }

  /**
   * Identify strengths
   */
  private identifyStrengths(
    keywordScore: number,
    formatScore: number,
    contentScore: number,
    readabilityScore: number
  ): string[] {
    const strengths: string[] = [];
    
    if (keywordScore >= 80) strengths.push('Strong use of industry keywords');
    if (formatScore >= 85) strengths.push('Well-structured format');
    if (contentScore >= 80) strengths.push('Quantifiable achievements present');
    if (readabilityScore >= 85) strengths.push('Excellent readability');
    
    return strengths;
  }

  /**
   * Identify weaknesses
   */
  private identifyWeaknesses(
    keywordScore: number,
    formatScore: number,
    contentScore: number,
    readabilityScore: number
  ): string[] {
    const weaknesses: string[] = [];
    
    if (keywordScore < 60) weaknesses.push('Lacks important keywords');
    if (formatScore < 70) weaknesses.push('Missing essential sections');
    if (contentScore < 60) weaknesses.push('Few quantifiable achievements');
    if (readabilityScore < 70) weaknesses.push('Could improve readability');
    
    return weaknesses;
  }
}
