'use client'

import { Trash2, X } from 'lucide-react'
import type { DocumentRecord } from './types'

type DocumentsPanelProps = {
  isOpen: boolean
  darkMode: boolean
  documents: DocumentRecord[]
  onClose: () => void
  onCreate: () => void
  onOpenDocument: (doc: DocumentRecord) => void
  onDeleteDocument: (id: string) => void
}

export function DocumentsPanel({
  isOpen,
  darkMode,
  documents,
  onClose,
  onCreate,
  onOpenDocument,
  onDeleteDocument,
}: DocumentsPanelProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close documents panel"
      />

      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md border-l p-4 shadow-2xl ${
          darkMode
            ? 'border-zinc-800 bg-zinc-900 text-white'
            : 'border-zinc-300 bg-white text-black'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Documents</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 opacity-70 transition hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>

        <button
          onClick={onCreate}
          className={`mb-4 w-full rounded-xl px-3 py-2 text-sm ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-500'
              : 'bg-blue-500 text-white hover:bg-blue-400'
          }`}
        >
          + New document
        </button>

        <div className="space-y-2 overflow-y-auto pr-1">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-center justify-between rounded-xl p-3 transition ${
                darkMode
                  ? 'bg-zinc-800 hover:bg-zinc-700'
                  : 'bg-zinc-100 hover:bg-zinc-200'
              }`}
            >
              <button onClick={() => onOpenDocument(doc)} className="flex-1 text-left">
                <div className="font-medium">{doc.title || 'Untitled'}</div>
                <div className="text-xs opacity-60">
                  {new Date(doc.updated_at).toLocaleString()}
                </div>
              </button>

              <button
                onClick={() => onDeleteDocument(doc.id)}
                className="ml-2 opacity-60 transition hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
