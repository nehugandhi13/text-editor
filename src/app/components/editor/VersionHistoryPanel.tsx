'use client'

import { History, X } from 'lucide-react'
import type { DocumentVersion } from './types'

type VersionHistoryPanelProps = {
  isOpen: boolean
  darkMode: boolean
  versions: DocumentVersion[]
  versionStatus: string
  onClose: () => void
  onRestoreVersion: (version: DocumentVersion) => void
}

export function VersionHistoryPanel({
  isOpen,
  darkMode,
  versions,
  versionStatus,
  onClose,
  onRestoreVersion,
}: VersionHistoryPanelProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close version history panel"
      />

      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l shadow-2xl ${
          darkMode
            ? 'border-zinc-800 bg-zinc-900 text-white'
            : 'border-zinc-300 bg-white text-black'
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <History size={20} />
            <h2 className="text-xl font-bold">Version history</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 opacity-70 transition hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>

        <p className="px-4 py-2 text-sm opacity-70">{versionStatus}</p>

        <div className="flex-1 space-y-2 overflow-y-auto p-4 pt-0">
          {versions.length === 0 ? (
            <p className="text-sm opacity-60">
              No saved versions yet. Use &quot;Save Version&quot; to create a snapshot.
            </p>
          ) : (
            versions.map((version) => (
              <div
                key={version.id}
                className={`flex items-center justify-between rounded-xl p-3 ${
                  darkMode ? 'bg-zinc-800' : 'bg-zinc-100'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">
                    {version.title || 'Untitled'}
                  </div>
                  <div className="text-xs opacity-60">
                    {new Date(version.created_at).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => onRestoreVersion(version)}
                  className={`ml-2 shrink-0 rounded-lg px-3 py-1.5 text-sm ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-500'
                      : 'bg-blue-500 text-white hover:bg-blue-400'
                  }`}
                >
                  Restore
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
