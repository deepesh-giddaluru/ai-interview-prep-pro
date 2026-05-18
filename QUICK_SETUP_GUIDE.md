# 🚀 Quick Setup Guide - AI Interview Prep Pro

## ⚡ Fast Track Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory:

```bash
# Option A: Use Gemini AI (Recommended for beginners)
GEMINI_API_KEY=your_gemini_api_key_here
AI_PROVIDER=gemini

# Option B: Use OpenAI
OPENAI_API_KEY=your_openai_api_key_here
AI_PROVIDER=openai

# Optional
APP_URL=http://localhost:3000
```

### Step 3: Get Your API Key

#### For Gemini (Free tier available):
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in `.env` as `GEMINI_API_KEY`

#### For OpenAI (Paid):
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the key and paste it in `.env` as `OPENAI_API_KEY`

### Step 4: Run the Application
```bash
npm run dev
```

The app will start at `http://localhost:3000`

## 🎯 First Time Usage

1. **Login**: Enter any email address (no password required for demo)
2. **Upload Resume**: Go to "Resume Analyzer" and upload your PDF resume
3. **Start Interview**: Navigate to "Mock Interviews" and choose a track
4. **Practice**: Use text or voice input to answer questions

## ✨ Key Features to Try

### 1. Voice Input 🎤
- Click the microphone icon in the chat
- Speak your answer
- Watch it transcribe automatically

### 2. Resume Analysis 📄
- Upload your resume (PDF only)
- Get AI-powered feedback
- Receive personalized interview questions

### 3. Multiple Interview Tracks 🎯
- Technical Interview
- HR Interview
- System Design
- Coding Round
- Aptitude Round

### 4. Real-time AI Feedback 🤖
- Get instant responses from AI interviewer
- Receive detailed evaluation
- Track your progress

## 🔧 Troubleshooting

### "AI not configured" error
- Check your `.env` file exists
- Verify API key is correct
- Restart the dev server

### Voice input not working
- Use Chrome or Edge browser
- Allow microphone permissions
- Ensure HTTPS (or localhost)

### Resume upload fails
- Check file is PDF format
- Ensure file size < 2MB
- Verify backend is running

## 📱 Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Chat | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ✅ | ✅ | ❌ |
| Resume Upload | ✅ | ✅ | ✅ | ✅ |
| Authentication | ✅ | ✅ | ✅ | ✅ |

## 🎓 Pro Tips

1. **Best AI Provider**: 
   - Gemini: Free tier, good for testing
   - OpenAI: Better quality, requires payment

2. **Voice Recognition**:
   - Speak clearly and at normal pace
   - Use in quiet environment
   - Works best with Chrome/Edge

3. **Interview Practice**:
   - Start with HR track to build confidence
   - Upload resume first for personalized questions
   - Review suggested questions before starting

4. **Resume Tips**:
   - Use PDF format only
   - Keep file size under 2MB
   - Include clear skills section

## 🆘 Need Help?

Check the full documentation: `FEATURES_DOCUMENTATION.md`

## 📊 What's Included

✅ Gemini AI Integration  
✅ OpenAI Integration (Alternative)  
✅ Mock Interview Questions (100+ questions)  
✅ Speech Recognition  
✅ Resume Analyzer  
✅ Authentication/Login  
✅ 5 Interview Tracks  
✅ Real-time Chat Interface  
✅ Progress Analytics  

## 🎉 You're Ready!

Start your interview preparation journey now! 🚀

---

**Questions?** Check `FEATURES_DOCUMENTATION.md` for detailed information.