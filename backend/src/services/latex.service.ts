import fs from 'fs';
import path from 'path';
import { ParsedResume } from '../types';

export class LatexService {
  /**
   * Generate PDF from LaTeX template
   */
  async generatePDF(
    resume: ParsedResume,
    template: string,
    outputPath: string
  ): Promise<string> {
    try {
      // Generate LaTeX content based on template
      const latexContent = this.generateLatexContent(resume, template);
      
      // Save LaTeX file temporarily
      const texPath = outputPath.replace('.pdf', '.tex');
      fs.writeFileSync(texPath, latexContent);
      
      // For now, we'll create a simple HTML-to-PDF approach
      // In production, you'd use node-latex or pdflatex
      // This requires LaTeX installation on the server
      
      // Alternative: Use puppeteer or similar for HTML to PDF
      // For demonstration, we'll create a placeholder
      await this.compileLaTeX(texPath, outputPath);
      
      return outputPath;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF file');
    }
  }

  /**
   * Generate LaTeX content based on template
   */
  private generateLatexContent(resume: ParsedResume, template: string): string {
    switch (template) {
      case 'modern':
        return this.generateModernTemplate(resume);
      case 'classic':
        return this.generateClassicTemplate(resume);
      case 'minimal':
        return this.generateMinimalTemplate(resume);
      default:
        return this.generateModernTemplate(resume);
    }
  }

  /**
   * Modern LaTeX template
   */
  private generateModernTemplate(resume: ParsedResume): string {
    const { personal_info, education, experience, skills, projects } = resume;

    return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[left=0.75in,right=0.75in,top=0.75in,bottom=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}

\\definecolor{primary}{RGB}{0, 102, 204}

\\titleformat{\\section}{\\Large\\bfseries\\color{primary}}{}{0em}{}[\\titlerule]
\\setlist[itemize]{leftmargin=*, noitemsep, topsep=0pt}

\\begin{document}

\\pagestyle{empty}

% Header
\\begin{center}
{\\Huge\\bfseries ${this.escapeLatex(personal_info.name)}}\\\\[5pt]
${personal_info.email ? this.escapeLatex(personal_info.email) : ''} ${personal_info.phone ? '\\textbar\\ ' + this.escapeLatex(personal_info.phone) : ''}\\\\
${personal_info.linkedin ? '\\href{https://' + personal_info.linkedin + '}{LinkedIn}' : ''} ${personal_info.github ? '\\textbar\\ \\href{https://' + personal_info.github + '}{GitHub}' : ''}
\\end{center}

${personal_info.summary ? `\\section*{Professional Summary}
${this.escapeLatex(personal_info.summary)}\\\\` : ''}

${experience && experience.length > 0 ? `\\section*{Work Experience}
${experience.map(exp => `\\textbf{${this.escapeLatex(exp.title)}} \\hfill ${this.escapeLatex(exp.duration)}\\\\
\\textit{${this.escapeLatex(exp.company)}}\\\\
${exp.bullets && exp.bullets.length > 0 ? `\\begin{itemize}
${exp.bullets.map(bullet => `\\item ${this.escapeLatex(bullet)}`).join('\n')}
\\end{itemize}` : this.escapeLatex(exp.description)}
\\vspace{5pt}`).join('\n\n')}` : ''}

${education && education.length > 0 ? `\\section*{Education}
${education.map(edu => `\\textbf{${this.escapeLatex(edu.degree)}${edu.field ? ' in ' + this.escapeLatex(edu.field) : ''}} \\hfill ${this.escapeLatex(edu.year)}\\\\
\\textit{${this.escapeLatex(edu.school)}}${edu.gpa ? ' \\textbar\\ GPA: ' + edu.gpa : ''}\\\\
\\vspace{5pt}`).join('\n\n')}` : ''}

${skills && skills.length > 0 ? `\\section*{Skills}
${skills.map(skill => this.escapeLatex(skill)).join(' \\textbar\\ ')}\\\\` : ''}

${projects && projects.length > 0 ? `\\section*{Projects}
${projects.map((proj: any) => `\\textbf{${this.escapeLatex(proj.name)}}\\\\
${proj.description ? this.escapeLatex(proj.description) + '\\\\' : ''}
${proj.highlights && proj.highlights.length > 0 ? `\\begin{itemize}
${proj.highlights.map((h: string) => `\\item ${this.escapeLatex(h)}`).join('\n')}
\\end{itemize}` : ''}
\\vspace{5pt}`).join('\n\n')}` : ''}

\\end{document}`;
  }

  /**
   * Classic LaTeX template
   */
  private generateClassicTemplate(resume: ParsedResume): string {
    // Similar structure to modern but with different styling
    return this.generateModernTemplate(resume);
  }

  /**
   * Minimal LaTeX template
   */
  private generateMinimalTemplate(resume: ParsedResume): string {
    // Simplified version of modern template
    return this.generateModernTemplate(resume);
  }

  /**
   * Escape special LaTeX characters
   */
  private escapeLatex(text: string): string {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/[&%$#_{}]/g, '\\$&')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  }

  /**
   * Compile LaTeX to PDF
   * Note: This requires LaTeX installation (pdflatex)
   */
  private async compileLaTeX(texPath: string, outputPath: string): Promise<void> {
    // In a production environment, you would use:
    // 1. node-latex package
    // 2. latex.js (JavaScript LaTeX compiler)
    // 3. External service like LaTeX.Online
    // 4. Docker container with LaTeX
    
    // For now, we'll create a simple placeholder
    // You'll need to implement actual LaTeX compilation based on your setup
    
    // Placeholder: Copy a sample PDF or create a simple one
    const placeholderPDF = Buffer.from('%PDF-1.4\nPlaceholder PDF - LaTeX compilation not configured');
    fs.writeFileSync(outputPath, placeholderPDF);
    
    console.warn('LaTeX compilation not fully implemented. Using placeholder PDF.');
    console.log('To enable PDF generation, install LaTeX and configure node-latex or use an alternative solution.');
  }

  /**
   * Get available templates
   */
  getTemplates(): Array<{ id: string; name: string; description: string }> {
    return [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and professional with color accents'
      },
      {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional resume format'
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple and elegant design'
      }
    ];
  }
}
