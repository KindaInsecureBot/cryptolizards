import { useState, useCallback } from 'react';
import { ALL_LESSONS } from '../lessons';

const STORAGE_KEY = 'cryptolizards_progress';

interface ProgressState {
  completedLessons: Set<string>;
  currentLessonId: string;
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completedLessons: new Set(parsed.completedLessons ?? []),
        currentLessonId: parsed.currentLessonId ?? ALL_LESSONS[0]?.id ?? '',
      };
    }
  } catch {
    // ignore
  }
  return {
    completedLessons: new Set(),
    currentLessonId: ALL_LESSONS[0]?.id ?? '',
  };
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedLessons: Array.from(state.completedLessons),
        currentLessonId: state.currentLessonId,
      })
    );
  } catch {
    // ignore
  }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(loadProgress);

  const markComplete = useCallback((lessonId: string) => {
    setState((prev) => {
      const next: ProgressState = {
        completedLessons: new Set([...prev.completedLessons, lessonId]),
        currentLessonId: prev.currentLessonId,
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const navigateTo = useCallback((lessonId: string) => {
    setState((prev) => {
      const next: ProgressState = { ...prev, currentLessonId: lessonId };
      saveProgress(next);
      return next;
    });
  }, []);

  const isCompleted = useCallback(
    (lessonId: string) => state.completedLessons.has(lessonId),
    [state.completedLessons]
  );

  const completionPercent = Math.round(
    (state.completedLessons.size / Math.max(ALL_LESSONS.length, 1)) * 100
  );

  return {
    currentLessonId: state.currentLessonId,
    completedLessons: state.completedLessons,
    completionPercent,
    markComplete,
    navigateTo,
    isCompleted,
  };
}
