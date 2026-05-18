# 🎯 AI Interview Prep Pro

A comprehensive full-stack AI-powered interview preparation platform designed to help job seekers excel in technical and HR interviews with intelligent mock sessions, resume analysis, and real-time feedback.

[![Node.js](https://img.shields.io/badge/Node.js-20.11.1+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

## ✨ Features

### 🤖 Dual AI Integration
- **Gemini AI** (Default): Google's powerful AI for interview coaching
- **OpenAI GPT-4o-mini** (Alternative): Industry-leading language model
- Seamless switching between providers
- Fallback to mock responses when API unavailable

### 📝 Mock Interview Questions
- **100+ Curated Questions** across 5 specialized tracks:
  - 💻 Technical Interview
  - 👥 HR Interview
  - 🏗️ System Design
  - 🔢 Coding Round
  - 🧠 Aptitude Round
- Market-focused questions from top companies (Google, Amazon, Meta, Microsoft, Apple)
- Dynamic question selection based on your profile

### 🎤 Speech Recognition
- Browser-native Web Speech API integration
- Real-time voice-to-text transcription
- Visual feedback during recording
- Seamless text editing after transcription
- Works in Chrome, Edge, and Safari

### 📄 AI Resume Analyzer
- PDF resume upload and parsing
- Comprehensive AI-powered analysis
- Skills detection and extraction
- Personalized interview question suggestions
- Resume health metrics (Format, Keywords, ATS Friendly)
- Improvement recommendations

### 🔐 Authentication & User Management
- Beautiful animated login interface
- Email-based session management
- LocalStorage persistence
- Protected routes
- User profile display
- Secure logout functionality

### 🎨 Additional Features
- Real-time chat interface with AI interviewer
- Progress tracking and analytics
- Interview history logging
- Multi-track practice sessions
- Resume-based scoring
- Responsive design for all devices

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 20.11.1
npm or yarn
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-interview-prep-pro
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```bash
# Option A: Use Gemini (Free tier available)
GEMINI_API_KEY=your_gemini_api_key
AI_PROVIDER=gemini

# Option B: Use OpenAI (Paid)
OPENAI_API_KEY=your_openai_api_key
AI_PROVIDER=openai
```

4. **Run the application**
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📚 Documentation

- **[Quick Setup Guide](QUICK_SETUP_GUIDE.md)** - Get started in 5 minutes
- **[Features Documentation](FEATURES_DOCUMENTATION.md)** - Comprehensive feature guide
- **[API Documentation](FEATURES_DOCUMENTATION.md#-api-endpoints)** - API endpoints reference

## 🏗️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Motion (Framer Motion)** - Smooth animations
- **React Router v7** - Client-side routing
- **Lucide React** - Beautiful icons
- **Vite** - Lightning-fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Google Gemini API** - AI integration
- **OpenAI API** - Alternative AI provider
- **Multer** - File upload handling
- **PDF-parse** - Resume text extraction

### Development
- **esbuild** - Fast bundling
- **TypeScript** - Type checking
- **ESLint** - Code linting

## 📁 Project Structure

```
ai-interview-prep-pro/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx          # Authentication UI
│   │   ├── Dashboard.tsx          # Main dashboard
│   │   ├── InterviewView.tsx      # Interview practice
│   │   ├── ResumeAnalyzerPage.tsx # Resume analysis
│   │   ├── AnalyticsPage.tsx      # Progress tracking
│   │   ├── ProfilePage.tsx        # User profile
│   │   ├── SettingsPage.tsx       # App settings
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx  # Chat UI
│   │   │   ├── ChatInput.tsx      # Voice + text input
│   │   │   └── ChatMessage.tsx    # Message display
│   │   └── ui/                    # Reusable components
│   ├── backend/
│   │   ├── services/
│   │   │   └── interviewService.ts # AI integration
│   │   └── routes/
│   │       └── api.ts             # API endpoints
│   └── lib/
│       ├── api.ts                 # API configuration
│       └── utils.ts               # Utility functions
├── .env.example                   # Environment template
├── FEATURES_DOCUMENTATION.md      # Full documentation
├── QUICK_SETUP_GUIDE.md          # Setup guide
└── package.json                   # Dependencies
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check & AI status |
| `/api/analyze-resume` | POST | Upload & analyze resume |
| `/api/chat` | POST | Chat with AI interviewer |
| `/api/evaluate-answer` | POST | Evaluate interview answer |

## 🎯 Usage

1. **Login** - Enter your email to access the platform
2. **Upload Resume** - Go to Resume Analyzer and upload your PDF
3. **Choose Track** - Select from 5 interview tracks
4. **Practice** - Use text or voice to answer questions
5. **Get Feedback** - Receive AI-powered evaluation
6. **Track Progress** - View analytics and history

## 🌟 Key Features Showcase

### Voice Recognition
```typescript
// Automatic speech-to-text in ChatInput.tsx
const recognition = new SpeechRecognition();
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setInput(transcript);
};
```

### AI Provider Switching
```typescript
// Seamless provider switching in interviewService.ts
const provider = getAIProvider(); // 'gemini' or 'openai'
if (provider === "openai") {
  // Use OpenAI
} else {
  // Use Gemini
}
```

### Resume Analysis
```typescript
// AI-powered resume analysis
const result = await analyzeResume({
  role: "Software Engineer",
  fileName: "resume.pdf",
  fileSize: 1024000
});
// Returns: { analysis, suggestedQuestions, skills }
```

## 🔒 Security

- API keys stored in environment variables
- Session data in browser LocalStorage
- CORS enabled for API access
- File upload size limited to 2MB
- Input validation on all endpoints

## 🐛 Troubleshooting

### AI Not Working
- Verify API key in `.env` file
- Check `AI_PROVIDER` is set correctly
- Restart the dev server
- Check console for errors

### Voice Input Not Working
- Use Chrome, Edge, or Safari
- Allow microphone permissions
- Ensure HTTPS or localhost
- Check browser compatibility

### Resume Upload Fails
- Use PDF format only
- Keep file size under 2MB
- Verify backend is running
- Check file permissions

## 📊 Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Chat Interface | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ✅ | ✅ | ❌ |
| Resume Upload | ✅ | ✅ | ✅ | ✅ |
| Authentication | ✅ | ✅ | ✅ | ✅ |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the Apache-2.0 License.

## 👨‍💻 Author

**Deepesh**
- Built with ❤️ using Bob AI Assistant

## 🙏 Acknowledgments

- Google Gemini AI for powerful language models
- OpenAI for GPT-4o-mini
- React team for amazing framework
- Tailwind CSS for beautiful styling

## 📞 Support

For questions or issues, please check:
- [Features Documentation](FEATURES_DOCUMENTATION.md)
- [Quick Setup Guide](QUICK_SETUP_GUIDE.md)
- GitHub Issues

---

**Made with 💻 and ☕ | Last Updated: 2026-05-15**
