export interface Validation {
  pattern: RegExp;
  message: string;
  required: boolean;
}

export interface Lesson {
  id: string;
  chapter: number;
  step: number;
  title: string;
  content: string;       // Markdown
  initialCode: string;
  solution: string;
  validations: Validation[];
  hints: string[];
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface ValidationResult {
  passed: boolean;
  checks: CheckResult[];
}

export interface CheckResult {
  message: string;
  passed: boolean;
  required: boolean;
}

export type LessonId = string;
