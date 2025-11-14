'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api-client';

interface ManualEntryFormProps {
  onComplete: (resumeData: any) => void;
  onBack: () => void;
}

export default function ManualEntryForm({ onComplete, onBack }: ManualEntryFormProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      personal_info: {
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
        summary: ''
      },
      education: [],
      experience: [],
      skills: [],
      projects: []
    }
  });

  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  const addEducation = () => {
    setEducation([...education, {
      school: '',
      degree: '',
      field: '',
      year: '',
      gpa: ''
    }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const addExperience = () => {
    setExperience([...experience, {
      title: '',
      company: '',
      location: '',
      duration: '',
      description: '',
      bullets: ['']
    }]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const addBullet = (expIndex: number) => {
    const updated = [...experience];
    if (!updated[expIndex].bullets) updated[expIndex].bullets = [];
    updated[expIndex].bullets.push('');
    setExperience(updated);
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = [...experience];
    updated[expIndex].bullets[bulletIndex] = value;
    setExperience(updated);
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...experience];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_: any, i: number) => i !== bulletIndex);
    setExperience(updated);
  };

  const addProject = () => {
    setProjects([...projects, {
      name: '',
      description: '',
      technologies: [],
      highlights: ['']
    }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: string, value: string) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const resumeData = {
        personal_info: data.personal_info,
        education,
        experience,
        skills: skills.filter(s => s.trim()),
        projects
      };

      const response = await apiClient.parseManualData(resumeData);
      
      if (response.success) {
        onComplete(response.data);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert('Failed to process resume data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="border-b border-slate-700/50 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-400">
            ← Back
          </Button>
          <h1 className="text-xl font-bold text-white">Manual Entry</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800 border-slate-700 mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card className="bg-slate-800 border-slate-700 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Full Name *</Label>
                    <Input
                      {...register('personal_info.name')}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Email *</Label>
                    <Input
                      {...register('personal_info.email')}
                      type="email"
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Phone</Label>
                    <Input
                      {...register('personal_info.phone')}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Location</Label>
                    <Input
                      {...register('personal_info.location')}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">LinkedIn</Label>
                    <Input
                      {...register('personal_info.linkedin')}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">GitHub</Label>
                    <Input
                      {...register('personal_info.github')}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="github.com/johndoe"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Professional Summary</Label>
                  <Textarea
                    {...register('personal_info.summary')}
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                    placeholder="Brief professional summary..."
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Experience */}
            <TabsContent value="experience">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Work Experience</h2>
                  <Button
                    type="button"
                    onClick={addExperience}
                    className="bg-blue-500 hover:bg-blue-600"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>

                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <Card key={index} className="bg-slate-700 border-slate-600 p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-white font-medium">Experience {index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-slate-300">Job Title *</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Company *</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Tech Corp"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Duration</Label>
                          <Input
                            value={exp.duration}
                            onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Jan 2020 - Present"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(index, 'location', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="San Francisco, CA"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">Responsibilities & Achievements</Label>
                        {exp.bullets?.map((bullet: string, bulletIndex: number) => (
                          <div key={bulletIndex} className="flex gap-2">
                            <Input
                              value={bullet}
                              onChange={(e) => updateBullet(index, bulletIndex, e.target.value)}
                              className="bg-slate-600 border-slate-500 text-white"
                              placeholder="• Achieved X by doing Y..."
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBullet(index, bulletIndex)}
                              className="text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addBullet(index)}
                          className="border-slate-600 text-slate-300"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Bullet Point
                        </Button>
                      </div>
                    </Card>
                  ))}

                  {experience.length === 0 && (
                    <p className="text-slate-400 text-center py-8">
                      No experience added yet. Click "Add Experience" to get started.
                    </p>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Education - Similar structure */}
            <TabsContent value="education">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Education</h2>
                  <Button
                    type="button"
                    onClick={addEducation}
                    className="bg-blue-500 hover:bg-blue-600"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>

                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <Card key={index} className="bg-slate-700 border-slate-600 p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-white font-medium">Education {index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-300">School *</Label>
                          <Input
                            value={edu.school}
                            onChange={(e) => updateEducation(index, 'school', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="University Name"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Degree *</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Bachelor of Science"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Field of Study</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(index, 'field', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Computer Science"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Year</Label>
                          <Input
                            value={edu.year}
                            onChange={(e) => updateEducation(index, 'year', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="2020"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">GPA (Optional)</Label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="3.8/4.0"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                  {education.length === 0 && (
                    <p className="text-slate-400 text-center py-8">
                      No education added yet. Click "Add Education" to get started.
                    </p>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Skills */}
            <TabsContent value="skills">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Skills</h2>
                <Textarea
                  value={skills.join(', ')}
                  onChange={(e) => setSkills(e.target.value.split(',').map(s => s.trim()))}
                  className="bg-slate-700 border-slate-600 text-white min-h-[200px]"
                  placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js, Python, SQL)"
                />
                <p className="text-slate-400 text-sm mt-2">
                  Separate skills with commas. Add technical skills, tools, and technologies you're proficient in.
                </p>
              </Card>
            </TabsContent>

            {/* Projects */}
            <TabsContent value="projects">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Projects (Optional)</h2>
                  <Button
                    type="button"
                    onClick={addProject}
                    className="bg-blue-500 hover:bg-blue-600"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>

                <div className="space-y-4">
                  {projects.map((proj, index) => (
                    <Card key={index} className="bg-slate-700 border-slate-600 p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-white font-medium">Project {index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-300">Project Name *</Label>
                          <Input
                            value={proj.name}
                            onChange={(e) => updateProject(index, 'name', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="E-commerce Platform"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Description</Label>
                          <Textarea
                            value={proj.description}
                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Brief description of the project..."
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Continue to Analysis
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
