'use client';

import { useState } from 'react';
import { Upload, ArrowRight, CheckCircle2, Zap, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UploaderSection from '@/components/uploader-section';

export default function Home() {
  const [showUploader, setShowUploader] = useState(false);

  if (showUploader) {
    return <UploaderSection />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-slate-950" />
            </div>
            <span className="text-lg font-bold text-white">ResumeOptimize</span>
          </div>
          <div className="text-sm text-slate-400">ATS Resume Optimizer</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
                Optimize Your Resume for ATS
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                Transform your resume into an ATS-friendly powerhouse. Get actionable insights, AI-powered enhancements, and real-time scoring to land more interviews.
              </p>
            </div>

            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white gap-2 w-fit"
              onClick={() => setShowUploader(true)}
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-700/50">
              <div>
                <div className="text-2xl font-bold text-blue-400">15K+</div>
                <div className="text-sm text-slate-400">Resumes Optimized</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">92%</div>
                <div className="text-sm text-slate-400">Pass ATS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">3x</div>
                <div className="text-sm text-slate-400">More Interviews</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <Card className="bg-slate-800 border-slate-700 p-8 overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <span className="text-white font-semibold">ATS Score: 94/100</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-11/12 bg-gradient-to-r from-blue-400 to-cyan-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">98%</div>
                    <div className="text-xs text-slate-400">Keywords</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">85%</div>
                    <div className="text-xs text-slate-400">Format</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900/50 border-y border-slate-700/50 py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">Everything You Need</h2>
            <p className="text-slate-400 text-lg">Complete ATS optimization in one platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: "Smart Upload", desc: "Support for PDF and DOCX formats" },
              { icon: BarChart3, title: "Real-time Scoring", desc: "Instant ATS compatibility feedback" },
              { icon: Zap, title: "AI Enhancement", desc: "Powered by advanced language models" },
            ].map((feature, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500/50 transition-colors">
                <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to Optimize?</h2>
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white gap-2 mx-auto"
            onClick={() => setShowUploader(true)}
          >
            Start Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </main>
  );
}
