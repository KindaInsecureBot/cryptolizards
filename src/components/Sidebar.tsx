import { useState } from 'react';
import { CHAPTERS } from '../lessons';
import type { Lesson } from '../engine/types';

interface Props {
  currentLessonId: string;
  isCompleted: (id: string) => boolean;
  onNavigate: (id: string) => void;
  open: boolean;
}

export default function Sidebar({ currentLessonId, isCompleted, onNavigate, open }: Props) {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    () => new Set(CHAPTERS.map((c) => c.id))
  );

  const toggleChapter = (id: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (isCompleted(lesson.id)) return { icon: '✓', cls: 'done' };
    if (lesson.id === currentLessonId) return { icon: '●', cls: 'current' };
    return { icon: '○', cls: 'locked' };
  };

  return (
    <nav className={`sidebar${open ? '' : ' collapsed'}`} aria-hidden={!open}>
      <div className="sidebar-header">Curriculum</div>
      {CHAPTERS.map((chapter) => (
        <div key={chapter.id} className="sidebar-chapter">
          <div
            className="sidebar-chapter-title"
            onClick={() => toggleChapter(chapter.id)}
            role="button"
            aria-expanded={expandedChapters.has(chapter.id)}
          >
            <span>Ch {chapter.id} · {chapter.title}</span>
            <span>{expandedChapters.has(chapter.id) ? '▾' : '▸'}</span>
          </div>

          {expandedChapters.has(chapter.id) && chapter.lessons.map((lesson) => {
            const { icon, cls } = getLessonIcon(lesson);
            return (
              <div
                key={lesson.id}
                className={`sidebar-lesson${lesson.id === currentLessonId ? ' active' : ''}`}
                onClick={() => onNavigate(lesson.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onNavigate(lesson.id)}
              >
                <span className={`sidebar-lesson-icon ${cls}`}>{icon}</span>
                <span>{lesson.step}. {lesson.title}</span>
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
