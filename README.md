# Charlie Ålander's Portfolio

A modern portfolio website showcasing my software development skills, featuring an AI-powered real-time translator application.

## Live Translator

### Breaking Language Barriers in Real-Time

The Live Translator is a powerful AI application designed to facilitate seamless communication between people who don't share a common language. Whether you're traveling abroad, collaborating with international colleagues, or connecting with people from different cultures, this tool removes language barriers instantly.

### What It Does

The Live Translator:

- Records your voice in any language
- Automatically transcribes what you said
- Translates your speech into your chosen language
- Speaks the translation aloud
- Keeps a history of your conversation

With this tool, you can have natural conversations with anyone, regardless of linguistic differences. Simply speak in your native language, and the other person will hear your words in their preferred language.

### Real-World Applications

- **International Travel**: Navigate foreign countries with confidence
- **Business Meetings**: Communicate effectively with international partners
- **Education**: Learn pronunciation and practice language skills
- **Customer Service**: Assist customers who speak different languages
- **Cultural Exchange**: Connect with people across language barriers

### How It Works

1. **Speech Recognition**: When you speak into your device's microphone, the app captures your voice and sends it to OpenAI's Whisper model for accurate speech-to-text conversion.

2. **Language Detection**: The app automatically detects which language you're speaking.

3. **Translation**: Your words are translated to your chosen language using Google Cloud Translation API, providing high-quality translations across a wide range of languages.

4. **Text-to-Speech**: The translated text is converted back to speech using OpenAI's text-to-speech models, so you can hear how it sounds.

### Technologies Used

This full-stack application is built with a modern tech stack:

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **APIs**: OpenAI (for speech recognition and text-to-speech), Google Cloud Translation (for translating between languages)
- **Infrastructure**: AWS Amplify for cloud hosting
- **State Management**: React Hooks and Context
- **Persistence**: Local storage for saving conversations

## About Me

I'm a software developer specializing in AI solutions, with expertise in frontend and backend development, cloud infrastructure, and artificial intelligence integration. My goal is to create applications that solve real-world problems and improve human interaction through technology.

---

_This portfolio is continuously evolving as I add new projects and improve existing ones._
