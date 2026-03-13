import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface Props {
  code: string;
  onChange: (value: string) => void;
  onMount?: (editor: editor.IStandaloneCodeEditor) => void;
}

const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  fontSize: 13,
  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  fontLigatures: true,
  lineHeight: 22,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  padding: { top: 14, bottom: 14 },
  renderLineHighlight: 'gutter',
  cursorBlinking: 'smooth',
  smoothScrolling: true,
  tabSize: 4,
  insertSpaces: true,
  wordWrap: 'off',
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  guides: { indentation: true, bracketPairs: true },
  bracketPairColorization: { enabled: true },
};

export default function CodeEditor({ code, onChange, onMount }: Props) {
  return (
    <div className="monaco-container">
      <Editor
        language="rust"
        value={code}
        theme="vs-dark"
        options={EDITOR_OPTIONS}
        onChange={(val) => onChange(val ?? '')}
        onMount={onMount}
        loading={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-muted)',
            fontSize: '13px',
          }}>
            Loading editor…
          </div>
        }
      />
    </div>
  );
}
