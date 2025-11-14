import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ParsedResume, EnhancedResume } from '../types';

export class AIService {
  private openai: OpenAI;
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    // Use OpenRouter instead of direct OpenAI
    this.openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': 'ATS Resume Optimizer'
      }
    });
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  /**
   * Enhance resume using both OpenAI and Gemini
   */
  async enhanceResume(resume: ParsedResume): Promise<EnhancedResume> {
    try {
      // Use OpenAI for main enhancement
      const openAIEnhanced = await this.enhanceWithOpenAI(resume);
      
      // Use Gemini for additional polishing (optional)
      const finalEnhanced = await this.polishWithGemini(openAIEnhanced);
      
      return {
        ...finalEnhanced,
        enhanced: true
      };
    } catch (error) {
      console.error('AI Enhancement error:', error);
      throw new Error('Failed to enhance resume with AI');
    }
  }

  /**
   * Enhance resume using OpenRouter (GPT-4, Claude, etc.)
   */
  private async enhanceWithOpenAI(resume: ParsedResume): Promise<ParsedResume> {
    const prompt = this.buildEnhancementPrompt(resume);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume writer and ATS optimization specialist. 
                     Your task is to enhance resume content while maintaining truthfulness.
                     Focus on:
                     1. Using strong action verbs
                     2. Adding relevant keywords
                     3. Quantifying achievements where possible
                     4. Improving professional tone
                     5. Making content ATS-friendly
                     6. Keeping bullet points concise
                     Return ONLY valid JSON with the same structure as input.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      });

      const enhancedData = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        ...resume,
        ...enhancedData,
        rawText: JSON.stringify(enhancedData, null, 2)
      };
    } catch (error) {
      console.error('OpenAI error:', error);
      return resume; // Return original if enhancement fails
    }
  }

  /**
   * Polish resume using Google Gemini
   */
  private async polishWithGemini(resume: ParsedResume): Promise<ParsedResume> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Review and polish this resume content for maximum ATS compatibility.
                     Focus on keyword optimization and professional tone.
                     Return the same JSON structure with improvements.
                     
                     Resume Data:
                     ${JSON.stringify(resume, null, 2)}
                     
                     Return ONLY valid JSON.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const polishedData = JSON.parse(jsonMatch[0]);
        return {
          ...resume,
          ...polishedData
        };
      }
      
      return resume;
    } catch (error) {
      console.error('Gemini error:', error);
      return resume; // Return original if polishing fails
    }
  }

  /**
   * Build enhancement prompt for OpenAI
   */
  private buildEnhancementPrompt(resume: ParsedResume): string {
    return `Enhance this resume for ATS optimization. Improve clarity, add relevant keywords, 
           and ensure professional tone. Maintain all factual information.

Resume Data:
${JSON.stringify(resume, null, 2)}

Instructions:
1. Rewrite experience descriptions with strong action verbs
2. Add quantifiable metrics where contextually appropriate
3. Optimize for ATS keywords in the relevant field
4. Improve grammar and professional tone
5. Keep bullet points concise (1-2 lines each)
6. Ensure skills are industry-relevant

Return the enhanced resume in the same JSON structure.`;
  }

  /**
   * Enhance specific section (for targeted improvements)
   */
  async enhanceSection(section: string, content: any): Promise<any> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume writer. Enhance the ${section} section for ATS optimization.`
          },
          {
            role: 'user',
            content: `Enhance this ${section} section:\n${JSON.stringify(content, null, 2)}\n\nReturn enhanced version in same format.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Section enhancement error:', error);
      return content;
    }
  }

  /**
   * Generate professional summary using AI
   */
  async generateSummary(resume: ParsedResume): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer. Create a compelling professional summary (2-3 sentences) based on the provided resume data.'
          },
          {
            role: 'user',
            content: `Create a professional summary for this candidate:\n${JSON.stringify(resume, null, 2)}`
          }
        ],
        temperature: 0.8,
        max_tokens: 200
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Summary generation error:', error);
      return '';
    }
  }

  /**
   * Get AI suggestions for improvement
   */
  async getSuggestions(resume: ParsedResume): Promise<string[]> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an ATS optimization expert. Provide 5-7 specific, actionable suggestions to improve this resume.'
          },
          {
            role: 'user',
            content: `Analyze this resume and provide improvement suggestions:\n${JSON.stringify(resume, null, 2)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content || '';
      // Split by newlines and filter out empty lines
      return response.split('\n').filter(line => line.trim()).slice(0, 7);
    } catch (error) {
      console.error('Suggestions generation error:', error);
      return [];
    }
  }
}
