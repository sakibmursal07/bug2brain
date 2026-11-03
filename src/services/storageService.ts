import { AnalysisResult, DrillItem, ErrorCategory, MistakePattern, MistakeRecord, SupportedLanguage } from '../types';

const STORAGE_KEY_MISTAKES = 'bug2brain_mistakes_v1';
const STORAGE_KEY_API_KEY = 'bug2brain_gemini_api_key';
const STORAGE_KEY_MODEL = 'bug2brain_gemini_model';

export const getStoredApiKey = (): string => {
  return localStorage.getItem(STORAGE_KEY_API_KEY) || import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const setStoredApiKey = (key: string): void => {
  localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
};

export const getStoredModel = (): string => {
  return localStorage.getItem(STORAGE_KEY_MODEL) || 'gemini-3.8-flash';
};

export const setStoredModel = (model: string): void => {
  localStorage.setItem(STORAGE_KEY_MODEL, model);
};

export const getMistakeHistory = (): MistakeRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MISTAKES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse mistake history', e);
    return [];
  }
};

export const saveMistakeRecord = (result: AnalysisResult): MistakeRecord => {
  const history = getMistakeHistory();
  const record: MistakeRecord = {
    id: result.id || `mistake-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    language: result.language,
    errorType: result.errorType,
    errorCategory: result.errorCategory,
    title: result.title,
    summary: result.summary,
    originalCode: result.originalCode,
    correctedCode: result.correctedCode,
    mastered: false,
  };

  // Prepend new record, cap at 50 records
  const updated = [record, ...history.filter(h => h.id !== record.id)].slice(0, 50);
  localStorage.setItem(STORAGE_KEY_MISTAKES, JSON.stringify(updated));
  return record;
};

export const toggleMasteredMistake = (id: string): MistakeRecord[] => {
  const history = getMistakeHistory();
  const updated = history.map(item => 
    item.id === id ? { ...item, mastered: !item.mastered } : item
  );
  localStorage.setItem(STORAGE_KEY_MISTAKES, JSON.stringify(updated));
  return updated;
};

export const clearMistakeHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY_MISTAKES);
};

export const calculateMistakeDNA = (history: MistakeRecord[]): MistakePattern[] => {
  if (history.length === 0) return [];

  const counts: Record<string, number> = {};
  history.forEach(item => {
    counts[item.errorCategory] = (counts[item.errorCategory] || 0) + 1;
  });

  const total = history.length;
  const categories = Object.keys(counts) as ErrorCategory[];

  return categories.map(cat => {
    const count = counts[cat];
    const percentage = Math.round((count / total) * 100);
    let riskLevel: MistakePattern['riskLevel'] = 'Mild';
    let advice = 'Good awareness. Keep writing unit tests.';

    if (count >= 3 || percentage >= 40) {
      riskLevel = 'Critical Trap';
      advice = `Critical Habit Alert: You frequently encounter ${cat}. Build muscle memory by writing defensive checks before invoking methods or indexing.`;
    } else if (count >= 2 || percentage >= 25) {
      riskLevel = 'Frequent';
      advice = `Recurring Pattern: Keep practicing ${cat} flash drills until defensive validation becomes second nature.`;
    }

    return {
      category: cat,
      count,
      percentage,
      riskLevel,
      advice
    };
  }).sort((a, b) => b.count - a.count);
};

// Curated drill library keyed to common mistake categories
export const CURATED_DRILLS: DrillItem[] = [
  {
    id: 'drill-1',
    title: 'Defend the Empty String Length',
    language: 'java',
    category: 'Null / Undefined',
    difficulty: 'Easy',
    description: 'The method crashes when passed a user without an email address. Add null defense!',
    buggyCode: `public int getEmailLength(User user) {
    // 💥 Throws NullPointerException if user or email is null
    return user.getEmail().length();
}`,
    fixedCode: `public int getEmailLength(User user) {
    if (user == null || user.getEmail() == null) {
        return 0;
    }
    return user.getEmail().length();
}`,
    hint: 'Check if user is null first, then check user.getEmail().',
    explanation: 'Short-circuit evaluation `user == null || user.getEmail() == null` safely stops before dereferencing null.'
  },
  {
    id: 'drill-2',
    title: 'The Out-of-Bounds Loop',
    language: 'python',
    category: 'Bounds & Indexing',
    difficulty: 'Easy',
    description: 'Fix the off-by-one bug so it safely prints each item without crashing at the end.',
    buggyCode: `def print_items(items):
    # 💥 Crashes on the final iteration
    for i in range(len(items) + 1):
        print(f"[{i}] {items[i]}")`,
    fixedCode: `def print_items(items):
    for i, item in enumerate(items):
        print(f"[{i}] {item}")`,
    hint: 'Use enumerate(items) instead of manually computing range(len(items) + 1).',
    explanation: 'Python lists are 0-indexed. The last valid index is len(items) - 1. `enumerate()` eliminates manual bounds math.'
  },
  {
    id: 'drill-3',
    title: 'Async API Property Access',
    language: 'javascript',
    category: 'Null / Undefined',
    difficulty: 'Medium',
    description: 'Protect against undefined when fetching author city before payload resolves.',
    buggyCode: `function getAuthorCity(post) {
  // 💥 Crashes if post.author is undefined
  return post.author.location.city.toUpperCase();
}`,
    fixedCode: `function getAuthorCity(post) {
  return post?.author?.location?.city?.toUpperCase() ?? "Unknown";
}`,
    hint: 'Use optional chaining (?.) and nullish coalescing (??).',
    explanation: 'Optional chaining `?.` prevents throwing on undefined parents and returns undefined instead. `?? "Unknown"` gives a fallback.'
  },
  {
    id: 'drill-4',
    title: 'Safe Vector Element Access',
    language: 'cpp',
    category: 'Memory & Pointers',
    difficulty: 'Medium',
    description: 'Prevent potential segfault when querying an item by user-provided index.',
    buggyCode: `#include <vector>

int getItem(const std::vector<int>& list, int index) {
    // 💥 Undefined behavior / segfault if index >= list.size()
    return list[index];
}`,
    fixedCode: `#include <vector>
#include <stdexcept>

int getItem(const std::vector<int>& list, int index) {
    if (index < 0 || static_cast<size_t>(index) >= list.size()) {
        throw std::out_of_range("Index out of bounds");
    }
    return list[index]; // Or simply: return list.at(index);
}`,
    hint: 'Use list.at(index) or validate 0 <= index < list.size().',
    explanation: 'std::vector::at() performs automatic range verification and throws a catchable exception.'
  }
];
