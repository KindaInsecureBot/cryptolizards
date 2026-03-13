import type { Lesson, ValidationResult, CheckResult } from './types';

export function validateCode(code: string, lesson: Lesson): ValidationResult {
  const checks: CheckResult[] = lesson.validations.map((v) => ({
    message: v.message,
    passed: v.pattern.test(code),
    required: v.required,
  }));

  const passed = checks
    .filter((c) => c.required)
    .every((c) => c.passed);

  return { passed, checks };
}
