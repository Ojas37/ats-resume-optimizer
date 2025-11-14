# ATS Resume Optimizer - Technical Documentation

## Project Overview

**Project Name:** ATS Resume Optimizer with AI Enhancement  
**Type:** Full-Stack Web Application  
**Purpose:** Parse, analyze, and enhance resumes using AI to improve ATS (Applicant Tracking System) compatibility  
**Status:** 95% Complete (Core functionality operational, deployment pending)  
**Development Date:** November 2025

### Key Features
- ✅ File upload support (PDF/DOCX parsing)
- ✅ Manual resume entry with multi-section form
- ✅ ATS compatibility scoring (0-100 scale)
- ✅ AI-powered resume enhancement via OpenRouter
- ✅ Document generation (DOCX + PDF with LaTeX)
- ✅ Real-time suggestions and improvements
- ✅ Dark mode support
- ✅ Responsive design

---

## Technology Stack

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest LTS | Runtime environment |
| Express.js | 4.18.2 | RESTful API server |
| TypeScript | 5.3.3 | Type-safe development |
| ts-node | 10.9.2 | TypeScript execution |
| nodemon | 3.0.2 | Development hot reload |

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.1.3 | React framework |
| React | 19.2.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.1.9 | Styling framework |
| shadcn/ui | Latest | Component library |

### AI & Processing
| Library | Version | Purpose |
|---------|---------|---------|
| OpenAI SDK | 4.20.1 | OpenRouter API client |
| pdf-parse | 1.1.1 | PDF text extraction |
| mammoth | 1.6.0 | DOCX text extraction |
| docx | 8.5.0 | Word document generation |
| node-latex | 3.1.0 | LaTeX → PDF conversion |

### Additional Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| multer | 1.4.5 | File upload handling |
| helmet | 7.1.0 | Security headers |
| cors | 2.8.5 | Cross-origin requests |
| express-rate-limit | 7.1.5 | Rate limiting |
| morgan | 1.10.0 | HTTP logging |
| react-hook-form | 7.60.0 | Form management |
| zod | 3.25.76 | Schema validation |
| recharts | 2.15.4 | Data visualization |
| lucide-react | 0.454.0 | Icon system |

### Development Tools
- **Package Manager:** pnpm 10.17.0
- **Version Control:** Git
- **Code Editor:** VS Code
- **Shell:** PowerShell 5.1

---

## Architecture

### System Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│                     http://localhost:3000                    │
├─────────────────────────────────────────────────────────────┤
│  • File Upload Component (PDF/DOCX)                          │
│  • Manual Entry Form (5 Sections)                            │
│  • ATS Score Display (Visual Metrics)                        │
│  • Enhancement Suggestions (AI-Powered)                      │
│  • Resume Preview (Formatted)                                │
│  • Theme Provider (Dark Mode)                                │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP REST API
                      │ CORS Enabled
┌─────────────────────▼───────────────────────────────────────┐
│                    Backend (Express.js)                      │
│                   http://localhost:5000                      │
├─────────────────────────────────────────────────────────────┤
│  Routes Layer (13 Endpoints)                                 │
│  ├─ Upload Routes    (/api/upload)                           │
│  ├─ Parse Routes     (/api/parse)                            │
│  ├─ ATS Routes       (/api/ats)                              │
│  ├─ Enhance Routes   (/api/enhance)                          │
│  ├─ Generate Routes  (/api/generate)                         │
│  └─ Download Routes  (/api/download)                         │
├─────────────────────────────────────────────────────────────┤
│  Service Layer                                               │
│  ├─ AI Service       (OpenRouter Integration)                │
│  ├─ ATS Service      (Scoring Algorithm)                     │
│  ├─ Parser Service   (PDF/DOCX Extraction)                   │
│  ├─ DOCX Service     (Word Generation)                       │
│  └─ LaTeX Service    (PDF Generation)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴──────────────┬──────────────────┐
        │                            │                   │
┌───────▼────────┐         ┌─────────▼──────┐  ┌────────▼──────┐
│  OpenRouter AI │         │  File System   │  │  LaTeX Engine │
│  (GPT-4 Turbo) │         │  (Uploads)     │  │  (texlive)    │
└────────────────┘         └────────────────┘  └───────────────┘
```

### Data Flow
```
1. File Upload Flow:
   User → Upload Component → Multer Middleware → Parser Service → ParsedResume

2. Manual Entry Flow:
   User → Multi-Tab Form → Validation (Zod) → API → ParsedResume

3. ATS Scoring Flow:
   ParsedResume → ATS Service → Score Calculation → ATSScore (0-100)

4. AI Enhancement Flow:
   ParsedResume → OpenRouter API → GPT-4 → EnhancedResume + Suggestions

5. Document Generation Flow:
   EnhancedResume → DOCX/LaTeX Service → Binary File → Download
```

---

## Backend Implementation

### Project Structure
```
backend/
├── src/
│   ├── server.ts                 # Express app entry point
│   ├── routes/
│   │   ├── upload.routes.ts      # File upload endpoints
│   │   ├── parse.routes.ts       # Resume parsing endpoints
│   │   ├── ats.routes.ts         # ATS scoring endpoints
│   │   ├── enhance.routes.ts     # AI enhancement endpoints
│   │   ├── generate.routes.ts    # Document generation endpoints
│   │   └── download.routes.ts    # File download endpoints
│   ├── services/
│   │   ├── ai.service.ts         # OpenRouter AI integration
│   │   ├── ats.service.ts        # ATS scoring algorithm
│   │   ├── parser.service.ts     # PDF/DOCX parsing
│   │   ├── docx.service.ts       # Word document generation
│   │   └── latex.service.ts      # LaTeX PDF generation
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── global.d.ts               # Module declarations
│   └── uploads/                  # Temporary file storage
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

### API Endpoints (13 Total)

#### 1. Upload Routes
```typescript
POST /api/upload
- Accepts: multipart/form-data
- File types: PDF, DOCX
- Max size: 10MB
- Returns: { fileId, fileName, filePath }
```

#### 2. Parse Routes
```typescript
POST /api/parse/file
- Body: { fileId: string }
- Returns: ParsedResume

POST /api/parse/text
- Body: { text: string }
- Returns: ParsedResume
```

#### 3. ATS Routes
```typescript
POST /api/ats/score
- Body: ParsedResume
- Returns: ATSScore {
    overall: number,      // 0-100
    breakdown: {
      keywords: number,
      formatting: number,
      content: number,
      readability: number
    },
    strengths: string[],
    weaknesses: string[]
  }
```

#### 4. Enhancement Routes
```typescript
POST /api/enhance/resume
- Body: ParsedResume
- Returns: EnhancedResume

POST /api/enhance/section
- Body: { section: string, content: string }
- Returns: { enhancedContent: string }

POST /api/enhance/summary
- Body: ParsedResume
- Returns: { summary: string }

POST /api/enhance/suggestions
- Body: ParsedResume
- Returns: { suggestions: string[] }
```

#### 5. Generate Routes
```typescript
POST /api/generate/docx
- Body: EnhancedResume
- Returns: Buffer (Word document)

POST /api/generate/pdf
- Body: EnhancedResume & { template: 'modern' | 'classic' | 'minimal' }
- Returns: Buffer (PDF document)
```

#### 6. Download Routes
```typescript
GET /api/download/:fileId
- Params: fileId (string)
- Returns: File stream
```

### Service Layer Details

#### AI Service (`ai.service.ts`)
```typescript
class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1'
    });
  }

  // Main enhancement method
  async enhanceResume(resume: ParsedResume): Promise<EnhancedResume> {
    const completion = await this.openai.chat.completions.create({
      model: 'openai/gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer and career coach...'
        },
        {
          role: 'user',
          content: JSON.stringify(resume)
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    // Returns enhanced version with improved wording
  }

  // Section-specific enhancement
  async enhanceSection(section: string, content: string): Promise<string> {
    // Enhances individual sections (experience, education, etc.)
  }

  // Generate professional summary
  async generateSummary(resume: ParsedResume): Promise<string> {
    // Creates compelling 2-3 sentence summary
  }

  // Get actionable suggestions
  async getSuggestions(resume: ParsedResume): Promise<string[]> {
    // Returns 5-10 specific improvement recommendations
  }
}
```

**OpenRouter Configuration:**
- API Key: `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`
- Base URL: `https://openrouter.ai/api/v1`
- Model: `openai/gpt-4-turbo`
- Temperature: 0.7 (balanced creativity)
- Max Tokens: 2000 per request

#### ATS Service (`ats.service.ts`)
```typescript
class ATSService {
  async calculateScore(resume: ParsedResume): Promise<ATSScore> {
    const scores = {
      keywords: this.analyzeKeywords(resume),      // 35% weight
      formatting: this.analyzeFormatting(resume),  // 25% weight
      content: this.analyzeContent(resume),        // 25% weight
      readability: this.analyzeReadability(resume) // 15% weight
    };

    const overall = (
      scores.keywords * 0.35 +
      scores.formatting * 0.25 +
      scores.content * 0.25 +
      scores.readability * 0.15
    );

    return {
      overall: Math.round(overall),
      breakdown: scores,
      strengths: this.identifyStrengths(scores),
      weaknesses: this.identifyWeaknesses(scores)
    };
  }

  private analyzeKeywords(resume: ParsedResume): number {
    // Checks for industry-relevant keywords
    // Verifies technical skills presence
    // Evaluates action verbs usage
  }

  private analyzeFormatting(resume: ParsedResume): number {
    // Validates consistent date formats
    // Checks section organization
    // Evaluates bullet point structure
  }

  private analyzeContent(resume: ParsedResume): number {
    // Measures quantifiable achievements
    // Checks experience relevance
    // Evaluates education completeness
  }

  private analyzeReadability(resume: ParsedResume): number {
    // Analyzes sentence length
    // Checks jargon usage
    // Evaluates clarity and conciseness
  }
}
```

**Scoring Criteria:**
1. **Keywords (35%)**: Industry terms, technical skills, action verbs
2. **Formatting (25%)**: Consistency, structure, bullet points
3. **Content (25%)**: Quantifiable achievements, relevance
4. **Readability (15%)**: Clarity, conciseness, professional tone

#### Parser Service (`parser.service.ts`)
```typescript
class ParserService {
  async parsePDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  async parseDOCX(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  async parseResumeText(text: string): Promise<ParsedResume> {
    // Regex-based extraction
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const phoneRegex = /[\d\s()+-]{10,}/;
    const urlRegex = /https?:\/\/[^\s]+/g;

    // Extract sections using keywords
    const sections = this.identifySections(text);

    return {
      personalInfo: this.extractPersonalInfo(text),
      summary: this.extractSummary(sections),
      experience: this.extractExperience(sections),
      education: this.extractEducation(sections),
      skills: this.extractSkills(sections),
      projects: this.extractProjects(sections),
      certifications: this.extractCertifications(sections)
    };
  }
}
```

**Parsing Strategy:**
- Regex patterns for contact information
- Keyword-based section identification
- Bullet point detection
- Date range extraction
- Multi-format support (PDF, DOCX)

#### DOCX Service (`docx.service.ts`)
```typescript
class DOCXService {
  async generateDOCX(resume: EnhancedResume): Promise<Buffer> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header with name and contact
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: resume.personalInfo.fullName,
                bold: true,
                size: 32,
                font: 'Calibri'
              })
            ]
          }),

          // Contact information
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${resume.personalInfo.email} | ${resume.personalInfo.phone}`,
                size: 20
              })
            ]
          }),

          // Professional Summary
          this.createSection('PROFESSIONAL SUMMARY', resume.summary),

          // Experience Section
          this.createSection('EXPERIENCE', resume.experience),

          // Education Section
          this.createSection('EDUCATION', resume.education),

          // Skills Section
          this.createSection('SKILLS', resume.skills)
        ]
      }]
    });

    return await Packer.toBuffer(doc);
  }

  private createSection(title: string, content: any): Paragraph[] {
    // Creates formatted section with title and content
    // Uses consistent styling throughout document
  }
}
```

**DOCX Features:**
- Professional formatting
- Consistent fonts (Calibri)
- Proper spacing and alignment
- Bullet point lists
- Section headers
- ATS-friendly structure

#### LaTeX Service (`latex.service.ts`)
```typescript
class LatexService {
  async generatePDF(
    resume: EnhancedResume,
    template: 'modern' | 'classic' | 'minimal'
  ): Promise<Buffer> {
    const latexContent = this.generateLatexContent(resume, template);

    const pdf = await latex(latexContent, {
      inputs: path.join(__dirname, '../templates'),
      cmd: 'pdflatex'
    });

    return pdf;
  }

  private generateLatexContent(
    resume: EnhancedResume,
    template: string
  ): string {
    switch (template) {
      case 'modern':
        return this.modernTemplate(resume);
      case 'classic':
        return this.classicTemplate(resume);
      case 'minimal':
        return this.minimalTemplate(resume);
      default:
        return this.modernTemplate(resume);
    }
  }

  private modernTemplate(resume: EnhancedResume): string {
    return `
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=1in}

\\begin{document}

\\begin{center}
  {\\LARGE\\bfseries ${resume.personalInfo.fullName}}\\\\
  \\vspace{2mm}
  ${resume.personalInfo.email} | ${resume.personalInfo.phone}
\\end{center}

\\section*{Professional Summary}
${resume.summary}

\\section*{Experience}
${this.formatExperience(resume.experience)}

\\section*{Education}
${this.formatEducation(resume.education)}

\\section*{Skills}
${this.formatSkills(resume.skills)}

\\end{document}
    `;
  }
}
```

**LaTeX Templates:**
1. **Modern**: Clean design, sans-serif fonts, color accents
2. **Classic**: Traditional format, serif fonts, conservative style
3. **Minimal**: Simple layout, maximum whitespace, elegant typography

### TypeScript Types (`types/index.ts`)
```typescript
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location?: string;
  responsibilities: string[];
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
}

export interface ParsedResume {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects?: Project[];
  certifications?: string[];
}

export interface ATSScore {
  overall: number;
  breakdown: {
    keywords: number;
    formatting: number;
    content: number;
    readability: number;
  };
  strengths: string[];
  weaknesses: string[];
}

export interface EnhancedResume extends ParsedResume {
  enhancedSummary: string;
  enhancedExperience: Experience[];
  suggestions: string[];
}
```

### Middleware Configuration (`server.ts`)
```typescript
// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});
app.use('/api/', limiter);

// File upload
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

### Environment Variables (`.env`)
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# OpenRouter API
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=openai/gpt-4-turbo

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=pdf,docx

# LaTeX
LATEX_CMD=pdflatex
```

---

## Frontend Implementation

### Project Structure
```
frontend/
├── app/
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── uploader-section.tsx     # File upload UI
│   ├── manual-entry-form.tsx    # Manual input form
│   ├── resume-dashboard.tsx     # Results display
│   ├── ats-score-display.tsx    # Score visualization
│   ├── enhancement-suggestions.tsx  # AI suggestions
│   ├── resume-preview.tsx       # Formatted preview
│   ├── theme-provider.tsx       # Dark mode support
│   └── ui/                      # shadcn/ui components (30+)
├── hooks/
│   ├── use-mobile.ts            # Mobile detection
│   └── use-toast.ts             # Toast notifications
├── lib/
│   └── utils.ts                 # Utility functions
├── .env.local                   # Environment variables
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
└── package.json                 # Dependencies
```

### Key Components

#### 1. Uploader Section (`uploader-section.tsx`)
```typescript
export function UploaderSection() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    await uploadFile(selectedFile);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      toast.success('File uploaded successfully');
      // Trigger parsing
      await parseResume(data.fileId);
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-8">
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        {/* Drag and drop UI */}
      </label>
    </div>
  );
}
```

**Features:**
- Drag-and-drop interface
- File type validation (PDF, DOCX)
- File size validation (10MB)
- Progress indicator
- Error handling with toast notifications
- Automatic parsing trigger

#### 2. Manual Entry Form (`manual-entry-form.tsx`)
```typescript
const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    location: z.string().optional(),
    linkedin: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
  }),
  experience: z.array(z.object({
    company: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string(),
    responsibilities: z.array(z.string()),
    achievements: z.array(z.string())
  })),
  education: z.array(z.object({
    institution: z.string().min(1, 'Institution is required'),
    degree: z.string().min(1, 'Degree is required'),
    field: z.string().min(1, 'Field of study is required'),
    startDate: z.string(),
    endDate: z.string(),
    gpa: z.string().optional()
  })),
  skills: z.array(z.string()),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    link: z.string().url().optional().or(z.literal(''))
  })).optional()
});

export function ManualEntryForm() {
  const form = useForm<z.infer<typeof resumeSchema>>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personalInfo: {},
      experience: [{}],
      education: [{}],
      skills: [],
      projects: []
    }
  });

  const onSubmit = async (data: z.infer<typeof resumeSchema>) => {
    try {
      const response = await fetch(`${API_URL}/parse/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const parsedResume = await response.json();
      // Proceed to ATS scoring and enhancement
    } catch (error) {
      toast.error('Failed to process resume');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            {/* Personal Info Fields */}
          </TabsContent>

          <TabsContent value="experience">
            {/* Dynamic Experience Fields */}
          </TabsContent>

          {/* Other tabs */}
        </Tabs>
      </form>
    </Form>
  );
}
```

**Features:**
- 5 organized tabs (Personal, Experience, Education, Skills, Projects)
- Zod schema validation
- React Hook Form integration
- Dynamic field arrays (add/remove experience, education)
- Real-time validation feedback
- Auto-save to local storage

#### 3. ATS Score Display (`ats-score-display.tsx`)
```typescript
export function ATSScoreDisplay({ score }: { score: ATSScore }) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Compatibility Score</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Circular progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={`${score.overall * 2.827} 282.7`}
                className={getScoreColor(score.overall)}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
                {score.overall}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Keywords</span>
              <span>{score.breakdown.keywords}%</span>
            </div>
            <Progress value={score.breakdown.keywords} />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Formatting</span>
              <span>{score.breakdown.formatting}%</span>
            </div>
            <Progress value={score.breakdown.formatting} />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Content</span>
              <span>{score.breakdown.content}%</span>
            </div>
            <Progress value={score.breakdown.content} />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Readability</span>
              <span>{score.breakdown.readability}%</span>
            </div>
            <Progress value={score.breakdown.readability} />
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2 text-green-600">Strengths</h4>
            <ul className="list-disc pl-5 space-y-1">
              {score.strengths.map((strength, idx) => (
                <li key={idx} className="text-sm">{strength}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-red-600">Weaknesses</h4>
            <ul className="list-disc pl-5 space-y-1">
              {score.weaknesses.map((weakness, idx) => (
                <li key={idx} className="text-sm">{weakness}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Features:**
- Circular progress visualization
- Color-coded scoring (green/yellow/red)
- Category breakdown with progress bars
- Strengths and weaknesses lists
- Responsive design
- Animated transitions

#### 4. Enhancement Suggestions (`enhancement-suggestions.tsx`)
```typescript
export function EnhancementSuggestions({ 
  suggestions 
}: { 
  suggestions: string[] 
}) {
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([]);

  const applySuggestion = (index: number) => {
    setAppliedSuggestions([...appliedSuggestions, index]);
    toast.success('Suggestion applied');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Suggestions</CardTitle>
        <CardDescription>
          {suggestions.length} recommendations to improve your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className={cn(
                "p-4 border rounded-lg",
                appliedSuggestions.includes(index) && "opacity-50 bg-green-50"
              )}
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm">{suggestion}</p>
                </div>
                <Button
                  size="sm"
                  variant={appliedSuggestions.includes(index) ? "outline" : "default"}
                  onClick={() => applySuggestion(index)}
                  disabled={appliedSuggestions.includes(index)}
                >
                  {appliedSuggestions.includes(index) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Features:**
- Categorized suggestions
- One-click apply functionality
- Visual feedback for applied suggestions
- Icon-based categorization
- Persistent state management

#### 5. Resume Preview (`resume-preview.tsx`)
```typescript
export function ResumePreview({ resume }: { resume: EnhancedResume }) {
  const downloadDOCX = async () => {
    try {
      const response = await fetch(`${API_URL}/generate/docx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume)
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.personalInfo.fullName}_Resume.docx`;
      a.click();
      toast.success('Resume downloaded as DOCX');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const downloadPDF = async (template: string) => {
    try {
      const response = await fetch(`${API_URL}/generate/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...resume, template })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.personalInfo.fullName}_Resume.pdf`;
      a.click();
      toast.success('Resume downloaded as PDF');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Preview</CardTitle>
        <div className="flex gap-2">
          <Button onClick={downloadDOCX}>
            <FileText className="w-4 h-4 mr-2" />
            Download DOCX
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileDown className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => downloadPDF('modern')}>
                Modern Template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadPDF('classic')}>
                Classic Template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadPDF('minimal')}>
                Minimal Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {/* Formatted Resume Display */}
        <div className="bg-white text-black p-8 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">
              {resume.personalInfo.fullName}
            </h1>
            <p className="text-gray-600">
              {resume.personalInfo.email} | {resume.personalInfo.phone}
            </p>
          </div>

          {resume.enhancedSummary && (
            <section className="mb-6">
              <h2 className="text-xl font-semibold border-b-2 mb-2">
                PROFESSIONAL SUMMARY
              </h2>
              <p>{resume.enhancedSummary}</p>
            </section>
          )}

          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b-2 mb-2">
              EXPERIENCE
            </h2>
            {resume.enhancedExperience.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{exp.position}</h3>
                  <span className="text-gray-600">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700">{exp.company}</p>
                <ul className="list-disc pl-5 mt-2">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Education, Skills, Projects sections */}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Features:**
- Professional formatting
- DOCX export button
- PDF export with template selection
- Print-friendly layout
- Real-time preview updates
- Responsive design

### Styling & Theming

#### Tailwind Configuration (`tailwind.config.ts`)
```typescript
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--foreground))",
        },
        // ... additional color tokens
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### Global Styles (`globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... CSS variables for theming */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}

@layer utilities {
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  
  .animation-delay-400 {
    animation-delay: 400ms;
  }
}
```

### Environment Configuration (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Next.js Configuration (`next.config.mjs`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
```

---

## Critical Bug Fixes & Lessons Learned

### Bug #1: TypeScript Module Declaration Errors
**Problem:**
```
TS7016: Could not find a declaration file for module 'pdf-parse'
TS7016: Could not find a declaration file for module 'mammoth'
```

**Root Cause:** Libraries lack official TypeScript type definitions

**Solution:**
Created `backend/src/global.d.ts`:
```typescript
declare module 'pdf-parse';
declare module 'mammoth';
```

**Lesson:** Always check for @types/* packages first, fallback to manual declarations

---

### Bug #2: Environment Variables Not Loading
**Problem:**
```
OpenAIError: The OPENAI_API_KEY environment variable is missing or empty
```

**Root Cause:** Import order issue - `dotenv.config()` called AFTER route imports

**Incorrect Code:**
```typescript
import express from 'express';
import uploadRoutes from './routes/upload.routes';
import dotenv from 'dotenv';
dotenv.config(); // TOO LATE!
```

**Solution:**
```typescript
import dotenv from 'dotenv';
dotenv.config(); // MUST BE FIRST!

import express from 'express';
import uploadRoutes from './routes/upload.routes';
```

**Lesson:** Side effects (like dotenv) must execute before any code that depends on them

---

### Bug #3: DOCX Generation Type Errors
**Problem:**
```
TS2353: Object literal may only specify known properties, 
and 'bold' does not exist in type 'IParagraphOptions'
```

**Root Cause:** Styling properties belong on `TextRun`, not `Paragraph`

**Incorrect Code:**
```typescript
new Paragraph({
  text: 'Hello',
  bold: true // ERROR!
})
```

**Correct Code:**
```typescript
new Paragraph({
  children: [
    new TextRun({
      text: 'Hello',
      bold: true // CORRECT!
    })
  ]
})
```

**Lesson:** Read library documentation carefully - property placement matters

---

### Bug #4: Turbopack Unicode Path Crash (CRITICAL)
**Problem:**
```
thread 'main' panicked at crates/turbopack-core/src/resolve/pattern.rs:442:17:
byte index 23 is not a char boundary; it is inside 'ン' (bytes 21..24)
```

**Root Cause:** 
- Next.js 16 uses Turbopack by default
- Turbopack has known bug with Unicode characters in file paths
- Project path contains Japanese characters: `ドキュメント`

**Impact:** Frontend server crashed immediately, unusable

**Solution:**
Downgraded Next.js from 16.0.3 to 15.1.3 (uses Webpack):
```powershell
pnpm remove next
pnpm add next@15.1.3
```

Modified `package.json` dev script:
```json
{
  "scripts": {
    "dev": "cross-env TURBOPACK=false next dev"
  }
}
```

**Result:** Frontend compiled successfully with Webpack

**Lesson:** 
- Avoid non-ASCII characters in project paths
- Research known issues with cutting-edge tools (Turbopack is experimental)
- Have fallback strategies (Webpack in this case)
- Version downgrades are sometimes necessary

---

### Bug #5: TypeScript Compilation Errors (tsconfig)
**Problem:**
```
TS2688: Cannot find type definition file for 'node'
```

**Root Cause:** Missing type roots configuration

**Solution:**
Updated `backend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./src/types"
    ]
  },
  "ts-node": {
    "files": true
  }
}
```

**Lesson:** Explicit type roots needed when using custom type definitions

---

## Development Workflow

### Local Development Setup

**1. Clone & Install Dependencies:**
```powershell
# Backend
cd backend
npm install

# Frontend
cd ..
pnpm install
```

**2. Configure Environment Variables:**
```powershell
# Backend (.env)
echo "PORT=5000
OPENROUTER_API_KEY=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
CORS_ORIGIN=http://localhost:3000" > backend/.env

# Frontend (.env.local)
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

**3. Start Development Servers:**
```powershell
# Terminal 1: Backend
cd backend
npm run dev
# Output: 🚀 Server is running on port 5000

# Terminal 2: Frontend
pnpm dev
# Output: ▲ Next.js 15.1.3 ready on http://localhost:3000
```

**4. Access Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Build for Production

**Backend:**
```powershell
cd backend
npm run build
npm start
```

**Frontend:**
```powershell
pnpm build
pnpm start
```

---

## Testing Strategy

### Manual Testing Checklist
- ✅ File upload (PDF): Upload sample PDF, verify parsing
- ✅ File upload (DOCX): Upload sample DOCX, verify parsing
- ✅ Manual entry: Fill all form fields, submit
- ✅ ATS scoring: Verify score calculation (0-100)
- ✅ AI enhancement: Check OpenRouter API responses
- ✅ DOCX generation: Download and open in Microsoft Word
- ✅ PDF generation: Test all 3 templates (Modern, Classic, Minimal)
- ✅ Dark mode: Toggle theme, verify contrast
- ✅ Mobile responsive: Test on various screen sizes
- ✅ Error handling: Test with invalid files, network errors

### API Testing (Postman/cURL)
```bash
# Test file upload
curl -X POST http://localhost:5000/api/upload \
  -F "file=@resume.pdf"

# Test ATS scoring
curl -X POST http://localhost:5000/api/ats/score \
  -H "Content-Type: application/json" \
  -d @resume.json

# Test AI enhancement
curl -X POST http://localhost:5000/api/enhance/resume \
  -H "Content-Type: application/json" \
  -d @resume.json
```

---

## Performance Considerations

### Backend Optimizations
- **Caching:** Consider Redis for parsed resumes
- **Async Processing:** Use queues for long AI requests
- **File Cleanup:** Scheduled deletion of uploaded files
- **Rate Limiting:** 100 requests per 15 minutes
- **Compression:** Gzip middleware for responses

### Frontend Optimizations
- **Code Splitting:** Next.js automatic code splitting
- **Image Optimization:** Next.js Image component
- **Lazy Loading:** Dynamic imports for heavy components
- **Memoization:** React.memo for expensive renders
- **Bundle Size:** Tree shaking with ES modules

### Database Considerations
Currently using file system storage. For production:
- **MongoDB:** Store parsed resumes, user preferences
- **PostgreSQL:** Relational data (users, subscriptions)
- **S3/Blob Storage:** Uploaded files and generated documents

---

## Security Measures

### Implemented Security
1. **Helmet.js:** Security headers (XSS, clickjacking protection)
2. **CORS:** Restricted to localhost:3000
3. **Rate Limiting:** Prevents abuse (100 req/15min)
4. **File Validation:** Type and size checks
5. **Input Sanitization:** Zod schema validation
6. **Environment Variables:** Sensitive data in .env
7. **HTTPS:** Required for production deployment

### Additional Recommendations
- **JWT Authentication:** User login/registration
- **API Key Rotation:** Regular OpenRouter key updates
- **Input Sanitization:** SQL injection prevention
- **File Scanning:** Virus/malware detection
- **Audit Logging:** Track user actions
- **Data Encryption:** Encrypt sensitive resume data

---

## Deployment Guide

### Backend Deployment (Render.com)

**1. Create New Web Service:**
- Connect GitHub repository
- Select `backend` directory as root
- Choose Node.js environment

**2. Configure Build & Start Commands:**
```bash
# Build Command
npm install && npm run build

# Start Command
npm start
```

**3. Set Environment Variables:**
```
PORT=5000
NODE_ENV=production
OPENROUTER_API_KEY=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
CORS_ORIGIN=https://your-frontend.vercel.app
```

**4. Install LaTeX (if PDF generation needed):**
```bash
# Add to Dockerfile or startup script
apt-get update
apt-get install -y texlive-full
```

**5. Deploy:**
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Note the deployed URL: `https://your-backend.onrender.com`

---

### Frontend Deployment (Vercel)

**1. Install Vercel CLI:**
```powershell
pnpm install -g vercel
```

**2. Login to Vercel:**
```powershell
vercel login
```

**3. Deploy:**
```powershell
vercel deploy --prod
```

**4. Configure Environment Variables (Vercel Dashboard):**
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

**5. Custom Domain (Optional):**
- Go to Vercel Dashboard → Project Settings → Domains
- Add custom domain (e.g., `ats-optimizer.com`)
- Update DNS records as instructed

---

### Post-Deployment Checklist
- ✅ Test all API endpoints with production URLs
- ✅ Verify CORS settings allow frontend domain
- ✅ Test file uploads with large files
- ✅ Verify AI enhancement with real API
- ✅ Test document generation (DOCX/PDF)
- ✅ Check SSL certificate validity
- ✅ Monitor error logs (Render + Vercel dashboards)
- ✅ Set up uptime monitoring (UptimeRobot, Pingdom)
- ✅ Configure CDN for static assets
- ✅ Enable auto-deploy on Git push

---

## Future Enhancements

### Phase 2 Features
1. **User Authentication:**
   - JWT-based login/registration
   - OAuth integration (Google, LinkedIn)
   - User dashboard with saved resumes

2. **Resume Versions:**
   - Track multiple versions
   - Compare changes over time
   - Version rollback functionality

3. **Job Matching:**
   - Upload job descriptions
   - Match resume keywords to job requirements
   - Suggest relevant skills to add

4. **ATS Templates Database:**
   - Industry-specific templates
   - Company-specific optimizations
   - Template preview gallery

5. **Collaborative Features:**
   - Share resumes with mentors
   - Commenting and feedback system
   - Real-time collaboration

6. **Advanced AI Features:**
   - Cover letter generation
   - Interview question preparation
   - Salary negotiation tips
   - Career path recommendations

7. **Analytics Dashboard:**
   - Track application success rate
   - A/B test resume versions
   - Keyword trend analysis

8. **Mobile App:**
   - React Native iOS/Android app
   - Offline resume editing
   - Push notifications for suggestions

---

## Project Metrics

### Lines of Code
- **Backend:** ~2,500 lines (TypeScript)
- **Frontend:** ~3,000 lines (TypeScript/TSX)
- **Total:** ~5,500 lines

### File Count
- **Backend:** 15 files
- **Frontend:** 35+ files (including UI components)
- **Total:** 50+ files

### API Endpoints
- **Total:** 13 endpoints
- **Categories:** 6 (Upload, Parse, ATS, Enhance, Generate, Download)

### Components
- **React Components:** 7 core components
- **UI Components:** 30+ shadcn/ui components

### Dependencies
- **Backend:** 18 packages
- **Frontend:** 25+ packages
- **Total:** 43+ packages

### Time Investment
- **Development:** ~10-12 hours
- **Debugging:** ~3-4 hours
- **Documentation:** ~2-3 hours
- **Total:** ~15-19 hours

---

## Conclusion

This ATS Resume Optimizer project demonstrates a full-stack application with:
- Modern tech stack (Next.js 15, React 19, Express, TypeScript)
- AI integration (OpenRouter/GPT-4)
- Complex file processing (PDF/DOCX parsing)
- Document generation (DOCX/LaTeX)
- Professional UI/UX (shadcn/ui, Tailwind CSS)
- Production-ready architecture

### Key Achievements
✅ Fully functional local development environment  
✅ Comprehensive error handling and validation  
✅ Type-safe codebase with TypeScript  
✅ Responsive design with dark mode  
✅ AI-powered resume enhancement  
✅ Multi-format document export  
✅ Detailed technical documentation  

### Next Steps
1. Deploy to production (Vercel + Render)
2. Implement user authentication
3. Add resume versioning
4. Expand AI capabilities
5. Build mobile app

---

## Contact & Support

**Developer:** Ojas Neve  
**Project Path:** `c:\Users\Ojas Neve\OneDrive\ドキュメント\personal\Projects\Ai resume`  
**Completion Status:** 95% (Core features complete, deployment pending)  
**Last Updated:** November 14, 2025

---

## Appendix

### Useful Commands
```powershell
# Backend
cd backend
npm run dev          # Start development server
npm run build        # Compile TypeScript
npm start            # Run production build
npm run lint         # Run ESLint

# Frontend
pnpm dev             # Start development server
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint

# Kill all Node processes (if ports are busy)
taskkill /F /IM node.exe

# Check package versions
npm list             # Backend dependencies
pnpm list            # Frontend dependencies
```

### Environment Variables Reference
```bash
# Backend (.env)
PORT=5000
NODE_ENV=development|production
OPENROUTER_API_KEY=sk-or-v1-***
OPENROUTER_MODEL=openai/gpt-4-turbo
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=pdf,docx

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Key Files Reference
```
Most Important Files:
├── backend/src/server.ts          # Main backend entry
├── backend/src/services/ai.service.ts      # AI logic
├── backend/src/services/ats.service.ts     # Scoring algorithm
├── components/uploader-section.tsx         # File upload
├── components/manual-entry-form.tsx        # Manual entry
├── components/resume-dashboard.tsx         # Results display
├── app/page.tsx                   # Home page
└── PROJECT_DOCUMENTATION.md       # This file
```

---

**End of Technical Documentation**
