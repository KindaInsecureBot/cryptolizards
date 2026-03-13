import type { ValidationResult as VR } from '../engine/types';

interface Props {
  result: VR | null;
}

export default function ValidationResult({ result }: Props) {
  if (!result) {
    return (
      <div className="validation-panel">
        <div className="validation-idle">
          <span>⬡</span>
          <span>Click <strong>Check Answer</strong> to validate your code</span>
        </div>
      </div>
    );
  }

  if (result.passed) {
    return (
      <div className="validation-panel">
        <div className="validation-success">
          <div className="validation-success-title">
            <span>✓</span>
            <span>All checks passed!</span>
          </div>
          <div className="validation-success-text">
            Great work — your LEZ program looks correct.
          </div>
        </div>
      </div>
    );
  }

  const failed = result.checks.filter((c) => c.required && !c.passed);

  return (
    <div className="validation-panel">
      <div className="validation-error">
        <div className="validation-error-title">
          <span>✗</span>
          <span>{failed.length} check{failed.length !== 1 ? 's' : ''} failing</span>
        </div>
        <div className="validation-checks">
          {result.checks.map((check, i) => (
            <div key={i} className={`validation-check ${check.passed ? 'pass' : 'fail'}`}>
              <span className="check-icon">{check.passed ? '✓' : '○'}</span>
              <span>{check.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
