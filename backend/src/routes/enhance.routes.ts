import { Router, Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { ATSService } from '../services/ats.service';

const router = Router();
const aiService = new AIService();
const atsService = new ATSService();

/**
 * POST /api/enhance
 * Enhance resume using AI (OpenAI + Gemini)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    // Get original ATS score
    const originalText = JSON.stringify(resumeData, null, 2);
    const originalScore = await atsService.calculateScore(originalText);

    // Enhance resume with AI
    const enhancedResume = await aiService.enhanceResume(resumeData);

    // Get enhanced ATS score
    const enhancedText = JSON.stringify(enhancedResume, null, 2);
    const enhancedScore = await atsService.calculateScore(enhancedText);

    // Calculate improvement
    const improvement = {
      overall_score: enhancedScore.overall_score - originalScore.overall_score,
      keyword_match: enhancedScore.keyword_match - originalScore.keyword_match,
      format_compliance: enhancedScore.format_compliance - originalScore.format_compliance,
      content_quality: enhancedScore.content_quality - originalScore.content_quality,
      readability: enhancedScore.readability - originalScore.readability
    };

    res.json({
      success: true,
      message: 'Resume enhanced successfully',
      data: {
        original: resumeData,
        enhanced: enhancedResume,
        originalScore,
        enhancedScore,
        improvement
      }
    });

  } catch (error: any) {
    console.error('Enhancement error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to enhance resume'
    });
  }
});

/**
 * POST /api/enhance/section
 * Enhance specific section of resume
 */
router.post('/section', async (req: Request, res: Response) => {
  try {
    const { section, content } = req.body;

    if (!section || !content) {
      return res.status(400).json({
        success: false,
        message: 'Section name and content are required'
      });
    }

    const enhancedContent = await aiService.enhanceSection(section, content);

    res.json({
      success: true,
      message: `${section} section enhanced successfully`,
      data: {
        original: content,
        enhanced: enhancedContent
      }
    });

  } catch (error: any) {
    console.error('Section enhancement error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to enhance section'
    });
  }
});

/**
 * POST /api/enhance/suggestions
 * Get AI-powered improvement suggestions
 */
router.post('/suggestions', async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    const suggestions = await aiService.getSuggestions(resumeData);

    res.json({
      success: true,
      message: 'Suggestions generated successfully',
      data: { suggestions }
    });

  } catch (error: any) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate suggestions'
    });
  }
});

/**
 * POST /api/enhance/summary
 * Generate professional summary using AI
 */
router.post('/summary', async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    const summary = await aiService.generateSummary(resumeData);

    res.json({
      success: true,
      message: 'Summary generated successfully',
      data: { summary }
    });

  } catch (error: any) {
    console.error('Summary generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate summary'
    });
  }
});

export default router;
