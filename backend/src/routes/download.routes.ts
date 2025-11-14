import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

/**
 * GET /api/download/pdf/:id
 * Download generated PDF file
 */
router.get('/pdf/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const filePath = path.join(__dirname, '../../resume-output', `${id}.pdf`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }

    res.download(filePath, `resume-${id}.pdf`, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          success: false,
          message: 'Failed to download PDF file'
        });
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to download PDF'
    });
  }
});

/**
 * GET /api/download/docx/:id
 * Download generated DOCX file
 */
router.get('/docx/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const filePath = path.join(__dirname, '../../resume-output', `${id}.docx`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'DOCX file not found'
      });
    }

    res.download(filePath, `resume-${id}.docx`, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          success: false,
          message: 'Failed to download DOCX file'
        });
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to download DOCX'
    });
  }
});

/**
 * GET /api/download/:id
 * Get download links for both formats
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pdfPath = path.join(__dirname, '../../resume-output', `${id}.pdf`);
    const docxPath = path.join(__dirname, '../../resume-output', `${id}.docx`);

    const hasPDF = fs.existsSync(pdfPath);
    const hasDOCX = fs.existsSync(docxPath);

    if (!hasPDF && !hasDOCX) {
      return res.status(404).json({
        success: false,
        message: 'No resume files found for this ID'
      });
    }

    res.json({
      success: true,
      data: {
        id,
        pdf: hasPDF ? `/api/download/pdf/${id}` : null,
        docx: hasDOCX ? `/api/download/docx/${id}` : null
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve download links'
    });
  }
});

export default router;
