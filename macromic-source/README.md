# MacroMic

AI voice macro tracker. Speak your meals, track macros, weight, workouts, and BMI.

## Stack
- React 18 + Vite
- recharts for graphs
- Anthropic Claude API for voice → macro parsing (key entered by user, stored in localStorage)
- Browser SpeechRecognition for voice

## Deploy
```bash
npm install
npm run build      # outputs to dist/
npm run dev        # local dev at http://localhost:5173
```
