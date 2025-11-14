import { Router, Request, Response } from 'express';
import { ATSService } from '../services/ats.service';

const router = Router();
const atsService = new ATSService();

/**
 * POST /api/ats-score
 * Calculate ATS score for resume
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { resumeText, resumeData } = req.body;

    if (!resumeText && !resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume text or data is required'
      });
    }

    // Convert resume data to text if needed
    const text = resumeText || JSON.stringify(resumeData, null, 2);

    // Calculate ATS score
    const score = await atsService.calculateScore(text);

    res.json({
      success: true,
      message: 'ATS score calculated successfully',
      data: score
    });

  } catch (error: any) {
    console.error('ATS score error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate ATS score'
    });
  }
});

/**
 * POST /api/ats-score/compare
 * Compare ATS scores before and after enhancement
 */
router.post('/compare', async (req: Request, res: Response) => {
  try {
    const { originalText, enhancedText } = req.body;

    if (!originalText || !enhancedText) {
      return res.status(400).json({
        success: false,
        message: 'Both original and enhanced text are required'
      });
    }

    // Calculate scores for both versions
    const originalScore = await atsService.calculateScore(originalText);
    const enhancedScore = await atsService.calculateScore(enhancedText);

    // Calculate improvements
    const improvement = {
      overall_score: enhancedScore.overall_score - originalScore.overall_score,
      keyword_match: enhancedScore.keyword_match - originalScore.keyword_match,
      format_compliance: enhancedScore.format_compliance - originalScore.format_compliance,
      content_quality: enhancedScore.content_quality - originalScore.content_quality,
      readability: enhancedScore.readability - originalScore.readability
    };

    res.json({
      success: true,
      message: 'ATS scores compared successfully',
      data: {
        original: originalScore,
        enhanced: enhancedScore,
        improvement
      }
    });

  } catch (error: any) {
    console.error('ATS compare error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to compare ATS scores'
    });
  }
});

export default router;
