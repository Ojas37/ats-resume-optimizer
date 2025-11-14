'use client';

import { TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ATSScoreDisplay() {
  const score = 89;
  const maxScore = 100;
  const percentage = (score / maxScore) * 100;

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 p-8">
        <div className="text-center space-y-4">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">ATS Score</p>
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 56 * (percentage / 100)} ${2 * Math.PI * 56}`}
                strokeLinecap="round"
                className="transition-all"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{score}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
          <p className="text-sm text-slate-300 font-medium">Good Match</p>
        </div>
      </Card>

      {/* Status Alert */}
      <Alert className="bg-green-500/10 border-green-500/50">
        <TrendingUp className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-green-300">Your resume will likely pass ATS screening</AlertDescription>
      </Alert>

      {/* Quick Stats */}
      <Card className="bg-slate-800 border-slate-700 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white">Quick Stats</h3>
        <div className="space-y-3">
          {[
            { label: 'Keywords Found', value: '24/30', status: 'good' },
            { label: 'Hard Skills', value: '8', status: 'good' },
            { label: 'Action Verbs', value: '12', status: 'good' },
            { label: 'Formatting Issues', value: '2', status: 'warning' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-t border-slate-700/50 first:border-0 first:py-0">
              <span className="text-xs text-slate-400">{stat.label}</span>
              <span className={`text-sm font-semibold ${
                stat.status === 'good' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Top Improvement</h3>
        <Alert className="bg-slate-900 border-slate-600">
          <AlertCircle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-slate-300 text-sm">
            Add more quantifiable metrics to your achievements
          </AlertDescription>
        </Alert>
      </Card>
    </div>
  );
}
