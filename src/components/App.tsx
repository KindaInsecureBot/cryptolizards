import { useState, useCallback } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import LessonContent from './LessonContent';
import CodeEditor from './CodeEditor';
import ValidationResult from './ValidationResult';
import CompletionOverlay from './CompletionOverlay';
import { useProgress } from '../hooks/useProgress';
import { getLessonById, getNextLesson, ALL_LESSONS } from '../lessons';
import { validateCode } from '../engine/validator';
import type { ValidationResult as VR } from '../engine/types';

export default function App() {
  const {
    currentLessonId,
    completionPercent,
    markComplete,
    navigateTo,
    isCompleted,
  } = useProgress();

  const lesson = getLessonById(currentLessonId) ?? ALL_LESSONS[0];

  const [code, setCode] = useState(lesson.initialCode);
  const [validationResult, setValidationResult] = useState<VR | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const resetForLesson = useCallback((id: string) => {
    const next = getLessonById(id);
    if (!next) return;
    setCode(next.initialCode);
    setValidationResult(null);
    setFailedAttempts(0);
    setHintIndex(0);
    setShowSolution(false);
    setShowCompletion(false);
    navigateTo(id);
  }, [navigateTo]);

  const handleCheckAnswer = useCallback(() => {
    const result = validateCode(code, lesson);
    setValidationResult(result);
    if (result.passed) {
      markComplete(lesson.id);
      setShowCompletion(true);
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
    }
  }, [code, lesson, failedAttempts, markComplete]);

  const handleResetCode = useCallback(() => {
    setCode(lesson.initialCode);
    setValidationResult(null);
  }, [lesson]);

  const handleShowHint = useCallback(() => {
    setHintIndex((i) => Math.min(i + 1, lesson.hints.length));
  }, [lesson.hints.length]);

  const handleShowSolution = useCallback(() => {
    setShowSolution(true);
  }, []);

  const handleNextLesson = useCallback(() => {
    const next = getNextLesson(lesson.id);
    if (next) resetForLesson(next.id);
    setShowCompletion(false);
  }, [lesson.id, resetForLesson]);

  const handleNavigate = useCallback((id: string) => {
    resetForLesson(id);
  }, [resetForLesson]);

  return (
    <div className="app">
      <Header
        lesson={lesson}
        completionPercent={completionPercent}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      <div className="app-body">
        <Sidebar
          currentLessonId={lesson.id}
          isCompleted={isCompleted}
          onNavigate={handleNavigate}
          open={sidebarOpen}
        />

        <div className="main-content">
          <LessonContent
            lesson={lesson}
            hintIndex={hintIndex}
            showSolution={showSolution}
            onShowHint={handleShowHint}
            onShowSolution={handleShowSolution}
            onNavigate={handleNavigate}
            isCompleted={isCompleted(lesson.id)}
          />

          <div className="editor-panel">
            <div className="editor-toolbar">
              <div className="editor-toolbar-left">
                <span className="editor-filename">main.rs</span>
              </div>
              <div className="editor-toolbar-right">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={handleResetCode}
                  title="Reset to initial code"
                >
                  ↺ Reset
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleCheckAnswer}
                >
                  ▶ Check Answer
                </button>
              </div>
            </div>

            <CodeEditor
              code={code}
              onChange={setCode}
            />

            <ValidationResult result={validationResult} />
          </div>
        </div>
      </div>

      {showCompletion && (
        <CompletionOverlay
          lesson={lesson}
          onNext={handleNextLesson}
          onContinue={() => setShowCompletion(false)}
        />
      )}
    </div>
  );
}
