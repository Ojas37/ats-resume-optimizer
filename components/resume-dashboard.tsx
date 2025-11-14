'use client';

import { useState } from 'react';
import { ChevronLeft, Download, Share2, BarChart3, Lightbulb, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ATSScoreDisplay from './ats-score-display';
import EnhancementSuggestions from './enhancement-suggestions';
import ResumePreview from './resume-preview';

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

interface DashboardProps {
  resume: ParsedResume;
  onReset: () => void;
}

export default function ResumeDashboard({ resume, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('score');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onReset} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-white">{resume.personal_info.name}'s Resume</h1>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-800">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Score */}
          <div className="lg:col-span-1">
            <ATSScoreDisplay />
          </div>

          {/* Main Content - Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-slate-800 border-slate-700">
                <TabsTrigger value="score" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Score Details
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Suggestions
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="score">
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Score Breakdown</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Keyword Match', score: 92 },
                      { label: 'Format Compliance', score: 85 },
                      { label: 'Content Quality', score: 88 },
                      { label: 'Readability', score: 90 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">{item.label}</span>
                          <span className="text-sm font-semibold text-blue-400">{item.score}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="suggestions">
                <EnhancementSuggestions resume={resume} />
              </TabsContent>

              <TabsContent value="preview">
                <ResumePreview resume={resume} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
