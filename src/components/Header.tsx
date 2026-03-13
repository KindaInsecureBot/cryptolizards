import type { Lesson } from '../engine/types';
import { CHAPTERS } from '../lessons';

interface Props {
  lesson: Lesson;
  completionPercent: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ lesson, completionPercent, sidebarOpen, onToggleSidebar }: Props) {
  const chapter = CHAPTERS.find((c) => c.id === lesson.chapter);

  return (
    <header className="header">
      <button
        className="header-sidebar-toggle"
        onClick={onToggleSidebar}
        title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        aria-label="Toggle sidebar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </button>

      <div className="header-logo">
        <span className="emoji">🦎</span>
        <span>CryptoLizards</span>
      </div>

      <div className="header-breadcrumb">
        <span>{chapter?.title ?? `Chapter ${lesson.chapter}`}</span>
        <span className="sep">›</span>
        <span className="current">{lesson.title}</span>
      </div>

      <div className="header-progress">
        <span>{completionPercent}% complete</span>
        <div className="progress-bar-container" title={`${completionPercent}% of lessons complete`}>
          <div
            className="progress-bar-fill"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}
