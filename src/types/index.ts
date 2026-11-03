export type SupportedLanguage = 
  | 'java' 
  | 'python' 
  | 'javascript' 
  | 'typescript' 
  | 'cpp' 
  | 'go' 
  | 'rust' 
  | 'csharp';

export type ErrorCategory = 
  | 'Null / Undefined' 
  | 'Bounds & Indexing' 
  | 'Type Mismatch' 
  | 'Syntax & Structure' 
  | 'Scope & Lifecycle' 
  | 'Memory & Pointers' 
  | 'Logic & State';

export interface LineChange {
  lineNumber: number;
  originalLine?: string;
  newLine?: string;
  action: 'added' | 'modified' | 'removed' | 'context';
  explanation: string;
}

export interface QuizChallenge {
  question: string;
  codeSnippet: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  hint?: string;
}

export interface AnalysisResult {
  id: string;
  title: string;
  language: SupportedLanguage;
  errorType: string;
  errorCategory: ErrorCategory;
  summary: string;
  analogy: {
    title: string;
    story: string;
    icon?: string;
  };
  rootCause: {
    whyItFailed: string;
    machineExpectation: string;
    actualReality: string;
    culpritLine?: number;
  };
  originalCode: string;
  errorMessage?: string;
  correctedCode: string;
  lineBreakdown: LineChange[];
  preventionTips: string[];
  challenge: QuizChallenge;
  timestamp: number;
}

export interface MistakeRecord {
  id: string;
  timestamp: number;
  language: SupportedLanguage;
  errorType: string;
  errorCategory: ErrorCategory;
  title: string;
  summary: string;
  originalCode: string;
  correctedCode: string;
  mastered: boolean;
}

export interface DrillItem {
  id: string;
  title: string;
  language: SupportedLanguage;
  category: ErrorCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  buggyCode: string;
  fixedCode: string;
  hint: string;
  explanation: string;
}

export interface MistakePattern {
  category: ErrorCategory;
  count: number;
  percentage: number;
  riskLevel: 'Mild' | 'Frequent' | 'Critical Trap';
  advice: string;
}
