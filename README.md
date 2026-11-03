# 🪲 Bug2Brain — Learn Programming Through Your Own Errors 🧠

> **An interactive AI-powered web platform that transforms confusing programming errors into intuitive "Aha!" learning moments for beginner and intermediate programmers.**

Stop blindly copy-pasting fixes from StackOverflow or chat forums without understanding *why* your code broke. **Bug2Brain** deconstructs your bugs using memorable physical analogies, detective-level root cause breakdowns, side-by-side code diffs, line-by-line explanations, and custom micro-challenges.

---

## 🌟 Key Features

### 1. 🔍 Interactive Bug Inspector
- **Code & Error Input**: Paste any broken code snippet along with its terminal error message or stack trace (supports Java, Python, JavaScript, TypeScript, C++, Go, Rust, and C#).
- **One-Click Presets**: Immediate dissecting of classic beginner pitfalls:
  - ☕ **Java `NullPointerException`** (*The blank address label envelope*)
  - 🐍 **Python `IndexError: list index out of range`** (*The 4-story hotel with 0-based room numbers*)
  - ⚡ **JavaScript `TypeError: Cannot read properties of undefined`** (*Reaching into a toolbag that hasn't arrived*)
  - 🗂️ **Python `IndentationError: unexpected indent`** (*The staircase with a misaligned step*)
  - 🚧 **C++ `Segmentation Fault: Out of bounds vector access`** (*Trespassing past the property fence*)
- **Mental Model Analogies (ELI5)**: Real-world metaphors that build physical intuition for abstract computer memory concepts.
- **Under the Hood ("Detective Breakdown")**: Clear contrast between **What the Machine Expected** vs **What It Actually Found**.

### 2. ⚡ Code Comparison & Line-by-Line Changes
- **Side-by-Side & Tabbed Diff**: View your original buggy code contrasted with the clean, idiomatic solution.
- **Line-by-Line Breakdown**: Step-by-step cards explaining *why* each line was added, modified, or guarded.
- **Defensive Idioms**: Learn modern practices (e.g. `Optional`, optional chaining `?.`, nullish coalescing `??`, `enumerate()`, safe `.at()` access).

### 3. 🎯 "Test Your Understanding" Micro-Challenges
- Every analyzed error generates a tailored multiple-choice challenge testing the exact concept.
- Immediate feedback, hint toggle, and celebratory confetti upon passing!
- Automatically tracks your concept mastery.

### 4. 🧬 Innovation Opportunity: Mistake DNA & Adaptive Tracker
- **Recurring Mistake Heatmap**: Aggregates errors by category (`Null / Undefined`, `Bounds & Indexing`, `Type Mismatch`, `Memory & Pointers`, `Syntax`).
- **Habit Alerts**: Detects recurring traps (e.g., *"Critical Trap: 40% of your errors this week are Null dereferences"*).
- **Mistake Journal**: Persistent local storage of every mistake you've encountered with 1-click re-inspection and "Mark Mastered" checkboxes.

### 5. 🏋️ Personalized Practice Drills
- Interactive coding sandbox targeting your weakest mistake categories.
- Test your fixes directly in the browser with hints and model solutions.

### 6. 🔊 Audio Voice Narration
- Built-in text-to-speech tutor via Web Speech API so you can listen to the explanation like a 1-on-1 mentor.

### 7. 🤖 Dual-Engine Architecture (Live Gemini AI + Curated Engine)
- **Official Google GenAI SDK (`@google/genai`)**: Connect your free Google Gemini API key (`gemini-3.8-flash` or `gemini-3.5-flash-lite`) to analyze *any* arbitrary code snippet in real-time with structured JSON output.
- **Curated Offline Engine**: Instant out-of-the-box responsiveness with deep presets even without entering an API key.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Development Server
```bash
# Navigate to project directory
cd C:\Users\SAKIB\.gemini\antigravity\scratch\bug2brain

# Install dependencies (already installed)
npm install

# Start local server
npm run dev -- --host 0.0.0.0 --port 3000
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom glowing dark developer theme
- **AI Integration**: `@google/genai` (Gemini 3.8 Flash)
- **Icons**: Lucide React
- **Confetti**: Canvas-Confetti
- **Storage**: LocalStorage with schema versioning
