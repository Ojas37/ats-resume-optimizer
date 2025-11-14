import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { ParserService } from '../services/parser.service';

const router = Router();
const parserService = new ParserService();

/**
 * POST /api/parse
 * Parse uploaded resume file or text
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { filename, text } = req.body;

    let resumeText = '';
    
    // If filename provided, parse the file
    if (filename) {
      const filePath = path.join(__dirname, '../../uploads', filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      const ext = path.extname(filename).toLowerCase();
      
      if (ext === '.pdf') {
        resumeText = await parserService.parsePDF(filePath);
      } else if (ext === '.docx' || ext === '.doc') {
        resumeText = await parserService.parseDOCX(filePath);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Unsupported file format'
        });
      }
    } 
    // If text provided directly, use that
    else if (text) {
      resumeText = text;
    } 
    else {
      return res.status(400).json({
        success: false,
        message: 'Either filename or text must be provided'
      });
    }

    // Parse the text into structured format
    const parsedResume = parserService.parseResumeText(resumeText);

    res.json({
      success: true,
      message: 'Resume parsed successfully',
      data: parsedResume
    });

  } catch (error: any) {
    console.error('Parse error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume'
    });
  }
});

/**
 * POST /api/parse/manual
 * Process manually entered resume data
 */
router.post('/manual', async (req: Request, res: Response) => {
  try {
    const resumeData = req.body;

    // Validate required fields
    if (!resumeData.personal_info || !resumeData.personal_info.name) {
      return res.status(400).json({
        success: false,
        message: 'Personal information with name is required'
      });
    }

    // Convert to resume text for ATS scoring
    const resumeText = JSON.stringify(resumeData, null, 2);
    
    const parsedResume = {
      ...resumeData,
      rawText: resumeText
    };

    res.json({
      success: true,
      message: 'Manual resume data processed successfully',
      data: parsedResume
    });

  } catch (error: any) {
    console.error('Manual parse error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process manual data'
    });
  }
});

export default router;
