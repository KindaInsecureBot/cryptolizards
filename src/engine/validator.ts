import type { Lesson, ValidationResult, CheckResult } from './types';

export function validateCode(code: string, lesson: Lesson): ValidationResult {
  const trimmedCode = code.trim();
  const trimmedInitial = lesson.initialCode.trim();

  if (trimmedCode === trimmedInitial) {
    return {
      passed: false,
      checks: [
        {
          message: "You haven't made any changes yet! Fill in the YOUR CODE HERE sections.",
          passed: false,
          required: true,
        },
      ],
    };
  }

  if (code.includes('// YOUR CODE HERE')) {
    return {
      passed: false,
      checks: [
        {
          message: 'Replace all `// YOUR CODE HERE` comments with your code',
          passed: false,
          required: true,
        },
      ],
    };
  }

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
