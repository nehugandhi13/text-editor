'use client'

import { FileText, History, Moon, Sun } from 'lucide-react'

type EditorHeaderProps = {
  title: string
  onTitleChange: (value: string) => void
  wordCount: number
  saveStatus: string
  darkMode: boolean
  hasDocument: boolean
  onToggleDarkMode: () => void
  onOpenDocuments: () => void
  onOpenVersionHistory: () => void
}

export function EditorHeader({
  title,
  onTitleChange,
  wordCount,
  saveStatus,
  darkMode,
  hasDocument,
  onToggleDarkMode,
  onOpenDocuments,
  onOpenVersionHistory,
}: EditorHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b p-6">
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full bg-transparent text-3xl font-bold outline-none"
      />

      <div className="text-sm opacity-70">{wordCount} words</div>
      <div className="text-sm opacity-70">{saveStatus}</div>

      <button
        onClick={onOpenDocuments}
        className={`rounded-xl p-2 ${
          darkMode
            ? 'bg-zinc-800 hover:bg-zinc-700'
            : 'bg-zinc-200 hover:bg-zinc-300'
        }`}
        title="Open documents"
      >
        <FileText size={18} />
      </button>

      {hasDocument && (
        <button
          onClick={onOpenVersionHistory}
          className={`rounded-xl p-2 ${
            darkMode
              ? 'bg-zinc-800 hover:bg-zinc-700'
              : 'bg-zinc-200 hover:bg-zinc-300'
          }`}
          title="Version history"
        >
          <History size={18} />
        </button>
      )}

      <button
        onClick={onToggleDarkMode}
        className={`rounded-xl p-2 ${
          darkMode
            ? 'bg-zinc-800 hover:bg-zinc-700'
            : 'bg-zinc-200 hover:bg-zinc-300'
        }`}
        title="Toggle theme"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  )
}
