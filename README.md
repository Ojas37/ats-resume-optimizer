# ATS Resume Optimizer

Full-stack web application that creates ATS-optimized professional resumes using AI, featuring automated resume parsing, ATS scoring, AI-powered content enhancement, and multiple export formats (PDF & DOCX).

## 🌟 Features

- **Resume Upload & Parsing**: Upload PDF/DOCX files or manually enter details
- **ATS Scoring**: Real-time compatibility scoring (0-100) with detailed breakdowns
- **AI Enhancement**: Powered by OpenRouter (access to GPT-4, Claude, Gemini, Llama with one key)
- **LaTeX Templates**: Multiple professional resume templates  
- **Export Options**: Download as PDF and DOCX
- **Before/After Comparison**: See improvement metrics
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Full dark mode support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- OpenRouter API Key (get $1 free credit, no credit card required)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Ai resume"
   ```

2. **Install frontend dependencies**
   ```bash
   pnpm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configure environment variables**
   
   **Frontend (.env.local):**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

   **Backend (backend/.env):**
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `backend/.env` and add your OpenRouter API key:
   ```
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   OPENROUTER_API_KEY=your_openrouter_key_here
   OPENROUTER_MODEL=openai/gpt-4-turbo
   ```
   
   **Get your FREE OpenRouter API key:**
   - Visit [openrouter.ai](https://openrouter.ai)
   - Sign in with Google/GitHub
   - Get **$1 free credit** (no credit card needed)
   - Create API key at [openrouter.ai/keys](https://openrouter.ai/keys)

5. **Run the application**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
Ai resume/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── manual-entry-form.tsx
│   ├── resume-dashboard.tsx
│   ├── uploader-section.tsx
│   └── ...
├── lib/                    # Utility functions
│   ├── api-client.ts      # API client
│   └── utils.ts
├── backend/                # Express.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   └── server.ts      # Main server file
│   ├── uploads/           # Temporary file storage
│   └── resume-output/     # Generated resumes
└── ...
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload resume file |
| POST | `/api/parse` | Parse uploaded resume |
| POST | `/api/parse/manual` | Process manual entry data |
| POST | `/api/ats-score` | Calculate ATS score |
| POST | `/api/ats-score/compare` | Compare before/after scores |
| POST | `/api/enhance` | Enhance resume with AI |
| POST | `/api/enhance/suggestions` | Get improvement suggestions |
| POST | `/api/generate-resume` | Generate PDF & DOCX |
| GET | `/api/download/pdf/:id` | Download PDF |
| GET | `/api/download/docx/:id` | Download DOCX |

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.1.3 (using Webpack for Unicode path compatibility)
- **UI**: React 19.2.0, Tailwind CSS 4.1.9, shadcn/ui
- **State Management**: React Hooks
- **Forms**: react-hook-form 7.60.0, Zod 3.25.76
- **Charts**: recharts 2.15.4
- **Icons**: Lucide React 0.454.0
- **Theming**: next-themes (dark mode)

### Backend
- **Runtime**: Node.js 18+, TypeScript 5.3.3
- **Framework**: Express.js 4.18.2
- **AI**: OpenRouter API (GPT-4, Claude, Gemini, Llama)
- **Document Processing**: pdf-parse 1.1.1, mammoth 1.6.0
- **Document Generation**: docx 8.5.0, node-latex 3.1.0
- **File Upload**: Multer 1.4.5
- **Security**: helmet 7.1.0, cors 2.8.5, express-rate-limit 7.1.5

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```
4. Deploy!

### Backend (Render)

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=5000
     OPENROUTER_API_KEY=your_openrouter_key_here
     OPENROUTER_MODEL=openai/gpt-4-turbo
     CORS_ORIGIN=https://your-vercel-app.vercel.app
     MAX_FILE_SIZE=10485760
     ```
4. Deploy!

**For detailed deployment steps, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

## 📝 Usage Guide

### Upload Resume
1. Click "Get Started" on homepage
2. Drag & drop your resume (PDF/DOCX) or click to browse
3. Wait for parsing and analysis

### Manual Entry
1. Click "Enter Details Manually"
2. Fill in your information across tabs:
   - Personal Info
   - Work Experience
   - Education
   - Skills
   - Projects (optional)
3. Click "Continue to Analysis"

### AI Enhancement
1. View your ATS score and breakdown
2. Click "Enhance with AI" to improve content
3. Compare before/after scores
4. Select a template
5. Download as PDF or DOCX

## 🔑 Getting API Keys

### OpenRouter API Key (Only Key You Need!)

**Why OpenRouter?**
- ✅ Access GPT-4, Claude, Gemini, Llama with **ONE** key
- ✅ **$1 free credit** - no credit card required
- ✅ Better pricing than direct OpenAI
- ✅ Easy to switch between models
- ✅ Pay-as-you-go (no subscriptions)

**Steps:**
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign in with Google/GitHub
3. Get **$1 free credit** automatically (good for ~30-50 resume enhancements)
4. Navigate to [openrouter.ai/keys](https://openrouter.ai/keys)
5. Click "Create Key"
6. Copy your key (starts with `sk-or-v1-...`)
7. Add to `backend/.env`:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   OPENROUTER_MODEL=openai/gpt-4-turbo
   ```

**Available Models via OpenRouter:**
```env
# Premium models
OPENROUTER_MODEL=openai/gpt-4-turbo              # Best overall
OPENROUTER_MODEL=anthropic/claude-3-opus         # Best quality
OPENROUTER_MODEL=anthropic/claude-3-sonnet       # Good balance

# Budget-friendly models
OPENROUTER_MODEL=openai/gpt-3.5-turbo           # Cheap & fast
OPENROUTER_MODEL=google/gemini-pro              # Free tier available
OPENROUTER_MODEL=meta-llama/llama-3-70b-instruct # Open source
```

**Pricing Examples (with OpenRouter):**
- GPT-4 Turbo: ~$0.01 per resume enhancement
- GPT-3.5 Turbo: ~$0.001 per resume enhancement  
- Gemini Pro: Often free or very cheap

**No other API keys needed!** The project uses OpenRouter exclusively.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🐛 Known Issues & Solutions

### Issue: Turbopack Unicode Path Error
**Problem:** Next.js 16's Turbopack crashes with Japanese/Unicode characters in file path  
**Solution:** Project uses Next.js 15.1.3 with Webpack (already configured)

### Issue: Environment Variables Not Loading
**Problem:** `dotenv.config()` must be called before any imports  
**Solution:** Already fixed in `backend/src/server.ts` (dotenv at top of file)

### Issue: LaTeX PDF Generation
**Problem:** Requires LaTeX installation on server  
**Solution:** DOCX export always works; PDF requires texlive installation

### Issue: Cold Starts on Free Tier
**Problem:** Render.com free tier spins down after 15 min  
**Solution:** First request takes 30-60 seconds; consider upgrading to Starter plan ($7/mo)

## 📚 Documentation

- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Complete technical documentation (1,200+ lines)
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Step-by-step deployment to Vercel + Render

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 📊 Project Metrics

- **Total Lines of Code:** ~5,500
- **Backend Files:** 15+
- **Frontend Components:** 35+
- **API Endpoints:** 13
- **Development Time:** ~15-19 hours

---

Built with ❤️ using Next.js, React, TypeScript, Express, and OpenRouter AI
