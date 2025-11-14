'use client';

import { useState, useRef } from 'react';
import { Upload, FileUp, AlertCircle, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ResumeDashboard from './resume-dashboard';
import ManualEntryForm from './manual-entry-form';
import { apiClient } from '@/lib/api-client';

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

export default function UploaderSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    setError('');
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      // Upload file
      const uploadResponse = await apiClient.uploadResume(selectedFile);
      
      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message || 'Upload failed');
      }

      // Parse the uploaded file
      const parseResponse = await apiClient.parseResume(uploadResponse.data.filename);
      
      if (!parseResponse.success) {
        throw new Error(parseResponse.message || 'Parsing failed');
      }

      setParsedResume(parseResponse.data);
    } catch (err: any) {
      console.error('File processing error:', err);
      setError(err.message || 'Failed to process file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showManualEntry) {
    return (
      <ManualEntryForm
        onComplete={(data) => {
          setParsedResume(data);
          setShowManualEntry(false);
        }}
        onBack={() => setShowManualEntry(false)}
      />
    );
  }

  if (parsedResume) {
    return <ResumeDashboard resume={parsedResume} onReset={() => setParsedResume(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Upload Your Resume</h1>
          <p className="text-slate-400">We'll analyze it and provide ATS optimization tips</p>
        </div>

        {/* Upload Card */}
        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-12 text-center transition-colors ${
              isDragging ? 'border-blue-400 bg-blue-500/5' : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-500/10 rounded-lg">
                  <FileUp className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div>
                <p className="text-lg font-semibold text-white mb-1">Drop your resume here</p>
                <p className="text-sm text-slate-400 mb-4">or click to browse</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                variant="outline"
                className="mx-auto border-slate-600 hover:border-blue-400 hover:bg-blue-500/5"
              >
                <Upload className="w-4 h-4 mr-2" />
                {loading ? 'Processing...' : 'Choose File'}
              </Button>

              <p className="text-xs text-slate-500 mt-4">Supported: PDF, DOCX (Max 10MB)</p>
            </div>
          </div>

          {/* Manual Entry Option */}
          <div className="border-t border-slate-700 p-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-4">Don't have a resume file?</p>
              <Button
                onClick={() => setShowManualEntry(true)}
                variant="outline"
                className="border-slate-600 hover:border-blue-400 hover:bg-blue-500/5 text-white"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Enter Details Manually
              </Button>
            </div>
          </div>

          {/* File Preview */}
          {file && (
            <div className="bg-slate-900/50 border-t border-slate-700 p-4">
              <div className="flex items-center gap-3 text-sm">
                <FileUp className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">{file.name}</span>
                <span className="text-slate-500 ml-auto">{(file.size / 1024).toFixed(2)} KB</span>
              </div>
            </div>
          )}
        </Card>

        {/* Error Message */}
        {error && (
          <Alert className="mt-6 bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">What We Analyze</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">•</span>
              <span>ATS compatibility and keyword optimization</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">•</span>
              <span>Formatting issues that confuse applicant tracking systems</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">•</span>
              <span>Missing or weak action verbs and metrics</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">•</span>
              <span>Suggestions for improvement based on job descriptions</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
