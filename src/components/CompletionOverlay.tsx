import type { Lesson } from '../engine/types';
import { getNextLesson } from '../lessons';

interface Props {
  lesson: Lesson;
  onNext: () => void;
  onContinue: () => void;
}

export default function CompletionOverlay({ lesson, onNext, onContinue }: Props) {
  const next = getNextLesson(lesson.id);

  return (
    <div className="completion-overlay" onClick={onContinue}>
      <div className="completion-card" onClick={(e) => e.stopPropagation()}>
        <span className="completion-emoji">🦎</span>
        <h2 className="completion-title">Lesson Complete!</h2>
        <p className="completion-subtitle">
          You finished <strong>{lesson.title}</strong>.<br />
          Your lizard grows stronger with each program written.
        </p>
        <div className="completion-actions">
          <button className="btn btn-ghost" onClick={onContinue}>
            Keep Editing
          </button>
          {next && (
            <button className="btn btn-primary" onClick={onNext}>
              Next Lesson →
            </button>
          )}
          {!next && (
            <button className="btn btn-primary" onClick={onContinue}>
              🎉 All Done!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
