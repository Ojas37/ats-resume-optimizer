'use client';

import { Card } from '@/components/ui/card';

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

interface PreviewProps {
  resume: ParsedResume;
}

export default function ResumePreview({ resume }: PreviewProps) {
  return (
    <Card className="bg-white text-slate-900 p-12 shadow-xl">
      {/* Header */}
      <div className="text-center border-b pb-6 mb-6">
        <h1 className="text-3xl font-bold">{resume.personal_info.name}</h1>
        <div className="flex justify-center gap-4 text-sm text-slate-600 mt-2">
          <span>{resume.personal_info.email}</span>
          {resume.personal_info.phone && <span>{resume.personal_info.phone}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.personal_info.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-slate-800">Professional Summary</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{resume.personal_info.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-slate-800">Experience</h2>
          <div className="space-y-4">
            {resume.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-900">{exp.title}</p>
                    <p className="text-sm text-slate-600">{exp.company}</p>
                  </div>
                  <p className="text-sm text-slate-600">{exp.duration}</p>
                </div>
                <p className="text-sm text-slate-700 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-slate-800">Education</h2>
          <div className="space-y-3">
            {resume.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-slate-900">{edu.degree} in {edu.field}</p>
                  <p className="text-sm text-slate-600">{edu.school}</p>
                </div>
                <p className="text-sm text-slate-600">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3 text-slate-800">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-900 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
