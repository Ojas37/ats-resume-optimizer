const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Upload resume file
  async uploadResume(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      body: formData,
    });

    return response.json();
  }

  // Parse resume
  async parseResume(filename?: string, text?: string): Promise<ApiResponse> {
    return this.request('/parse', {
      method: 'POST',
      body: JSON.stringify({ filename, text }),
    });
  }

  // Parse manual entry data
  async parseManualData(resumeData: any): Promise<ApiResponse> {
    return this.request('/parse/manual', {
      method: 'POST',
      body: JSON.stringify(resumeData),
    });
  }

  // Calculate ATS score
  async calculateATSScore(resumeText: string, resumeData?: any): Promise<ApiResponse> {
    return this.request('/ats-score', {
      method: 'POST',
      body: JSON.stringify({ resumeText, resumeData }),
    });
  }

  // Compare ATS scores
  async compareATSScores(originalText: string, enhancedText: string): Promise<ApiResponse> {
    return this.request('/ats-score/compare', {
      method: 'POST',
      body: JSON.stringify({ originalText, enhancedText }),
    });
  }

  // Enhance resume with AI
  async enhanceResume(resumeData: any): Promise<ApiResponse> {
    return this.request('/enhance', {
      method: 'POST',
      body: JSON.stringify({ resumeData }),
    });
  }

  // Enhance specific section
  async enhanceSection(section: string, content: any): Promise<ApiResponse> {
    return this.request('/enhance/section', {
      method: 'POST',
      body: JSON.stringify({ section, content }),
    });
  }

  // Get AI suggestions
  async getSuggestions(resumeData: any): Promise<ApiResponse> {
    return this.request('/enhance/suggestions', {
      method: 'POST',
      body: JSON.stringify({ resumeData }),
    });
  }

  // Generate summary
  async generateSummary(resumeData: any): Promise<ApiResponse> {
    return this.request('/enhance/summary', {
      method: 'POST',
      body: JSON.stringify({ resumeData }),
    });
  }

  // Generate resume files
  async generateResume(resumeData: any, template: string = 'modern'): Promise<ApiResponse> {
    return this.request('/generate-resume', {
      method: 'POST',
      body: JSON.stringify({ resumeData, template }),
    });
  }

  // Get available templates
  async getTemplates(): Promise<ApiResponse> {
    return this.request('/generate-resume/templates', {
      method: 'GET',
    });
  }

  // Get download URL
  getDownloadUrl(id: string, format: 'pdf' | 'docx'): string {
    return `${this.baseURL}/download/${format}/${id}`;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
