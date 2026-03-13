import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Lesson } from '../engine/types';
import { getPrevLesson, getNextLesson } from '../lessons';

interface Props {
  lesson: Lesson;
  hintIndex: number;
  showSolution: boolean;
  onShowHint: () => void;
  onShowSolution: () => void;
  onNavigate: (id: string) => void;
  isCompleted: boolean;
}

export default function LessonContent({
  lesson,
  hintIndex,
  showSolution,
  onShowHint,
  onShowSolution,
  onNavigate,
  isCompleted,
}: Props) {
  const prev = getPrevLesson(lesson.id);
  const next = getNextLesson(lesson.id);
  const visibleHints = lesson.hints.slice(0, hintIndex);

  return (
    <div className="lesson-panel">
      <div className="lesson-panel-header">
        <div className="lesson-chapter-badge">
          🦎 Chapter {lesson.chapter} · Lesson {lesson.step}
        </div>
        <h1 className="lesson-title">{lesson.title}</h1>
      </div>

      <div className="lesson-scroll">
        <div className="lesson-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {lesson.content}
          </ReactMarkdown>
        </div>

        {/* Hints */}
        {visibleHints.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            {visibleHints.map((hint, i) => (
              <div key={i} className="hint-box">
                <div className="hint-box-title">💡 Hint {i + 1}</div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{hint}</ReactMarkdown>
              </div>
            ))}
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="solution-box" style={{ marginTop: '16px' }}>
            <div className="solution-box-title">🔑 Solution</div>
            <pre>{lesson.solution}</pre>
          </div>
        )}

        {/* Hint / Solution buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          {hintIndex < lesson.hints.length && (
            <button className="btn btn-sm btn-secondary" onClick={onShowHint}>
              💡 {hintIndex === 0 ? 'Show Hint' : `Hint ${hintIndex + 1}`}
            </button>
          )}
          {!showSolution && (
            <button className="btn btn-sm btn-danger" onClick={onShowSolution}>
              🔑 Show Solution
            </button>
          )}
        </div>
      </div>

      <div className="lesson-nav">
        <button
          className="btn btn-ghost"
          disabled={!prev}
          onClick={() => prev && onNavigate(prev.id)}
        >
          ← Prev
        </button>

        {isCompleted && next ? (
          <button
            className="btn btn-primary"
            onClick={() => onNavigate(next.id)}
          >
            Next Lesson →
          </button>
        ) : (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {isCompleted ? '🎉 All done!' : 'Check your code →'}
          </span>
        )}

        <button
          className="btn btn-ghost"
          disabled={!next}
          onClick={() => next && onNavigate(next.id)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
