import { Router, Request, Response } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DocxService } from '../services/docx.service';
import { LatexService } from '../services/latex.service';

const router = Router();
const docxService = new DocxService();
const latexService = new LatexService();

/**
 * POST /api/generate-resume
 * Generate PDF and DOCX files from resume data
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { resumeData, template = 'modern' } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    // Generate unique ID for this resume
    const resumeId = uuidv4();
    const outputDir = path.join(__dirname, '../../resume-output');
    
    // Generate file paths
    const pdfPath = path.join(outputDir, `${resumeId}.pdf`);
    const docxPath = path.join(outputDir, `${resumeId}.docx`);

    // Generate PDF using LaTeX
    try {
      await latexService.generatePDF(resumeData, template, pdfPath);
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Continue even if PDF generation fails
    }

    // Generate DOCX
    try {
      await docxService.generateDOCX(resumeData, docxPath);
    } catch (error) {
      console.error('DOCX generation failed:', error);
      throw error; // DOCX generation is critical
    }

    res.json({
      success: true,
      message: 'Resume files generated successfully',
      data: {
        id: resumeId,
        pdf_path: `/api/download/pdf/${resumeId}`,
        docx_path: `/api/download/docx/${resumeId}`,
        created_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Generate resume error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate resume files'
    });
  }
});

/**
 * GET /api/generate-resume/templates
 * Get available resume templates
 */
router.get('/templates', (req: Request, res: Response) => {
  try {
    const templates = latexService.getTemplates();

    res.json({
      success: true,
      message: 'Templates retrieved successfully',
      data: { templates }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve templates'
    });
  }
});

export default router;
