import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import fs from 'fs';
import path from 'path';
import { ParsedResume } from '../types';

export class DocxService {
  /**
   * Generate DOCX file from resume data
   */
  async generateDOCX(resume: ParsedResume, outputPath: string): Promise<string> {
    try {
      const doc = this.createDocument(resume);
      
      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(outputPath, buffer);
      
      return outputPath;
    } catch (error) {
      console.error('DOCX generation error:', error);
      throw new Error('Failed to generate DOCX file');
    }
  }

  /**
   * Create Word document from resume data
   */
  private createDocument(resume: ParsedResume): Document {
    const sections: any[] = [];

    // Header with personal info
    sections.push(
      ...this.createPersonalInfoSection(resume.personal_info)
    );

    // Summary
    if (resume.personal_info.summary) {
      sections.push(
        new Paragraph({
          text: 'PROFESSIONAL SUMMARY',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 }
        }),
        new Paragraph({
          text: resume.personal_info.summary,
          spacing: { after: 240 }
        })
      );
    }

    // Experience
    if (resume.experience && resume.experience.length > 0) {
      sections.push(
        new Paragraph({
          text: 'WORK EXPERIENCE',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 }
        }),
        ...this.createExperienceSection(resume.experience)
      );
    }

    // Education
    if (resume.education && resume.education.length > 0) {
      sections.push(
        new Paragraph({
          text: 'EDUCATION',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 }
        }),
        ...this.createEducationSection(resume.education)
      );
    }

    // Skills
    if (resume.skills && resume.skills.length > 0) {
      sections.push(
        new Paragraph({
          text: 'SKILLS',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 }
        }),
        new Paragraph({
          text: resume.skills.join(' • '),
          spacing: { after: 240 }
        })
      );
    }

    // Projects
    if (resume.projects && resume.projects.length > 0) {
      sections.push(
        new Paragraph({
          text: 'PROJECTS',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 }
        }),
        ...this.createProjectsSection(resume.projects)
      );
    }

    return new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });
  }

  /**
   * Create personal information section
   */
  private createPersonalInfoSection(info: any): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    // Name
    paragraphs.push(
      new Paragraph({
        text: info.name,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 }
      })
    );

    // Contact info
    const contactParts: string[] = [];
    if (info.email) contactParts.push(info.email);
    if (info.phone) contactParts.push(info.phone);
    if (info.location) contactParts.push(info.location);

    if (contactParts.length > 0) {
      paragraphs.push(
        new Paragraph({
          text: contactParts.join(' | '),
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 }
        })
      );
    }

    // Links
    const linkParts: string[] = [];
    if (info.linkedin) linkParts.push(info.linkedin);
    if (info.github) linkParts.push(info.github);
    if (info.website) linkParts.push(info.website);

    if (linkParts.length > 0) {
      paragraphs.push(
        new Paragraph({
          text: linkParts.join(' | '),
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 }
        })
      );
    }

    return paragraphs;
  }

  /**
   * Create experience section
   */
  private createExperienceSection(experiences: any[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    experiences.forEach((exp, index) => {
      // Job title and company
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.title, bold: true }),
            new TextRun({ text: ` | ${exp.company}` })
          ],
          spacing: { before: index > 0 ? 200 : 0, after: 60 }
        })
      );

      // Duration and location
      const details: string[] = [];
      if (exp.duration) details.push(exp.duration);
      if (exp.location) details.push(exp.location);

      if (details.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: details.join(' | '),
                italics: true
              })
            ],
            spacing: { after: 120 }
          })
        );
      }

      // Bullet points
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((bullet: string) => {
          paragraphs.push(
            new Paragraph({
              text: bullet,
              bullet: { level: 0 },
              spacing: { after: 60 }
            })
          );
        });
      } else if (exp.description) {
        paragraphs.push(
          new Paragraph({
            text: exp.description,
            spacing: { after: 120 }
          })
        );
      }
    });

    return paragraphs;
  }

  /**
   * Create education section
   */
  private createEducationSection(education: any[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    education.forEach((edu, index) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true }),
            new TextRun({ text: edu.field ? ` in ${edu.field}` : '' })
          ],
          spacing: { before: index > 0 ? 200 : 0, after: 60 }
        })
      );

      paragraphs.push(
        new Paragraph({
          text: `${edu.school} | ${edu.year}`,
          spacing: { after: 120 }
        })
      );

      if (edu.gpa) {
        paragraphs.push(
          new Paragraph({
            text: `GPA: ${edu.gpa}`,
            spacing: { after: 120 }
          })
        );
      }
    });

    return paragraphs;
  }

  /**
   * Create projects section
   */
  private createProjectsSection(projects: any[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    projects.forEach((project, index) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: project.name,
              bold: true
            })
          ],
          spacing: { before: index > 0 ? 200 : 0, after: 60 }
        })
      );

      if (project.description) {
        paragraphs.push(
          new Paragraph({
            text: project.description,
            spacing: { after: 60 }
          })
        );
      }

      if (project.highlights && project.highlights.length > 0) {
        project.highlights.forEach((highlight: string) => {
          paragraphs.push(
            new Paragraph({
              text: highlight,
              bullet: { level: 0 },
              spacing: { after: 60 }
            })
          );
        });
      }
    });

    return paragraphs;
  }
}
