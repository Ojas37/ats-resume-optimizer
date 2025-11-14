'use client';

import { AlertCircle, CheckCircle2, Lightbulb, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ParsedResume {
  personal_info: {
    name: string;
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
    bullets?: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: string[];
  projects?: any[];
  rawText: string;
}

interface SuggestionsProps {
  resume: ParsedResume;
}

export default function EnhancementSuggestions({ resume }: SuggestionsProps) {
  const suggestions = [
    {
      type: 'critical',
      title: 'Add Quantifiable Metrics',
      description: 'Your experience section lacks specific numbers and percentages. Add metrics like "Increased sales by 35%" instead of "Improved sales"',
      section: 'Experience',
      impact: 'High',
    },
    {
      type: 'important',
      title: 'Expand Technical Skills',
      description: 'The job description mentions AWS, GCP, and Kubernetes. Consider adding these if you have experience.',
      section: 'Skills',
      impact: 'High',
    },
    {
      type: 'minor',
      title: 'Use Stronger Action Verbs',
      description: 'Replace "Worked on" with "Orchestrated", "Drove", or "Spearheaded"',
      section: 'Experience',
      impact: 'Medium',
    },
    {
      type: 'minor',
      title: 'Add Date to Current Role',
      description: 'Your current position shows "Present" - consider using current date format',
      section: 'Experience',
      impact: 'Low',
    },
  ];

  const typeConfig = {
    critical: { icon: AlertCircle, color: 'red', bg: 'bg-red-500/10', border: 'border-red-500/50' },
    important: { icon: Zap, color: 'yellow', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50' },
    minor: { icon: Lightbulb, color: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/50' },
  };

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, i) => {
        const config = typeConfig[suggestion.type as keyof typeof typeConfig];
        const Icon = config.icon;

        return (
          <Card key={i} className={`border-l-4 ${config.bg} border-l-${config.color}-500/50 border-r border-t border-b border-slate-700 p-6`}>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-1 text-${config.color}-400 flex-shrink-0`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{suggestion.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{suggestion.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-slate-700/30">
                <div className="text-xs">
                  <span className="text-slate-500">Section:</span>
                  <span className="text-slate-300 ml-2">{suggestion.section}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">Impact:</span>
                  <span className="text-slate-300 ml-2">{suggestion.impact}</span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {/* All Good Card */}
      <Card className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/50 p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white">Strong Sections</h3>
            <p className="text-sm text-slate-300">Your education and summary are well-formatted and ATS-friendly</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
