'use client'

import { useEffect, useRef, useState } from 'react'

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalSpaceAround,
  Bold,
  Heading1,
  Heading2,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Table,
  UnderlineIcon,
  Undo2,
} from 'lucide-react'
import type { Editor } from '@tiptap/react'

const fonts = [
  { name: 'Inter', className: 'font-sans' },
  { name: 'Poppins', className: 'font-sans' },
  { name: 'Merriweather', className: 'font-serif' },
  { name: 'Playfair Display', className: 'font-serif' },
  { name: 'JetBrains Mono', className: 'font-mono' },
]

const lineHeights = [
  { label: 'Default', value: '' },
  { label: 'Single', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.5', value: '1.5' },
  { label: 'Double', value: '2' },
]

const letterSpacings = [
  { label: 'Default', value: '' },
  { label: 'Tight', value: '-0.05em' },
  { label: 'Normal', value: '0' },
  { label: 'Wide', value: '0.05em' },
  { label: 'Wider', value: '0.1em' },
]

type EditorToolbarProps = {
  editor: Editor
  darkMode: boolean
  onSave: () => void
  onSaveVersion: () => void
  onImageUpload: () => void
}

export function EditorToolbar({
  editor,
  darkMode,
  onSave,
  onSaveVersion,
  onImageUpload,
}: EditorToolbarProps) {
  const [isSpacingOpen, setIsSpacingOpen] = useState(false)
  const [isTableActionsOpen, setIsTableActionsOpen] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const spacingRef = useRef<HTMLDivElement>(null)
  const tableActionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isSpacingOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        spacingRef.current &&
        !spacingRef.current.contains(event.target as Node)
      ) {
        setIsSpacingOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSpacingOpen])

  useEffect(() => {
    if (!isTableActionsOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableActionsRef.current &&
        !tableActionsRef.current.contains(event.target as Node)
      ) {
        setIsTableActionsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isTableActionsOpen])

  const buttonClass = (active: boolean) =>
    `flex items-center justify-center rounded-xl p-2 transition ${
      active
        ? darkMode
          ? 'bg-white text-black'
          : 'bg-black text-white'
        : darkMode
          ? 'bg-zinc-800 text-white hover:bg-zinc-700'
          : 'bg-zinc-200 text-black hover:bg-zinc-300'
    }`

  return (
    <div className="flex flex-wrap items-center gap-2 border-b p-4">
      <div className="group relative">
        <div
          className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium ${
            darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-black'
          }`}
        >
          Fonts
        </div>

        <div
          className={`absolute left-0 top-12 z-50 hidden max-h-64 w-64 overflow-y-auto rounded-xl border shadow-xl group-hover:block ${
            darkMode
              ? 'border-zinc-700 bg-zinc-900 text-white'
              : 'border-zinc-200 bg-white text-black'
          }`}
        >
          {fonts.map((font) => (
            <button
              key={font.name}
              onClick={() => editor.chain().focus().setFontFamily(font.name).run()}
              className={`w-full px-4 py-3 text-left text-lg transition hover:bg-zinc-800/50 ${font.className}`}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      <select
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        className={`rounded-xl px-3 py-2 text-sm ${
          darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-black'
        }`}
      >
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="24px">24</option>
        <option value="32px">32</option>
      </select>

      <div ref={spacingRef} className="relative">
        <button
          type="button"
          onClick={() => setIsSpacingOpen((open) => !open)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
            darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-black'
          } ${isSpacingOpen ? (darkMode ? 'ring-2 ring-zinc-500' : 'ring-2 ring-zinc-400') : ''}`}
        >
          <AlignVerticalSpaceAround size={16} />
          Spacing
        </button>

        {isSpacingOpen && (
          <div
            className={`absolute left-0 top-12 z-50 w-56 rounded-xl border shadow-xl ${
              darkMode
                ? 'border-zinc-700 bg-zinc-900 text-white'
                : 'border-zinc-200 bg-white text-black'
            }`}
          >
            <div
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
                darkMode ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              Line height
            </div>
            {lineHeights.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  editor.chain().focus().setLineHeight(option.value).run()
                  setIsSpacingOpen(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm transition ${
                  darkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                }`}
              >
                {option.label}
              </button>
            ))}

            <div
              className={`my-1 border-t ${darkMode ? 'border-zinc-700' : 'border-zinc-200'}`}
            />

            <div
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
                darkMode ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              Letter spacing
            </div>
            {letterSpacings.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  if (!option.value) {
                    editor
                      .chain()
                      .focus()
                      .setMark('textStyle', { letterSpacing: null })
                      .removeEmptyTextStyle()
                      .run()
                  } else {
                    editor
                      .chain()
                      .focus()
                      .setMark('textStyle', { letterSpacing: option.value })
                      .run()
                  }
                  setIsSpacingOpen(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm transition ${
                  darkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                }`}
                style={option.value ? { letterSpacing: option.value } : undefined}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={tableActionsRef} className="relative">
        <button
          type="button"
          onClick={() => setIsTableActionsOpen((open) => !open)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
            darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-black'
          } ${isTableActionsOpen ? (darkMode ? 'ring-2 ring-zinc-500' : 'ring-2 ring-zinc-400') : ''}`}
        >
          <Table size={16} />
          Table
        </button>

        {isTableActionsOpen && (
          <div
            className={`absolute left-0 top-12 z-50 w-72 rounded-xl border shadow-xl ${
              darkMode
                ? 'border-zinc-700 bg-zinc-900 text-white'
                : 'border-zinc-200 bg-white text-black'
            }`}
          >
            <div className="px-4 py-3">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-zinc-400">
                Table size
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1 text-xs">
                  Rows
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={tableRows}
                    onChange={(e) => setTableRows(Math.max(1, Math.min(20, Number(e.target.value))))}
                    className={`w-full rounded-xl border px-3 py-2 text-sm ${darkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}
                  />
                </label>
                <label className="space-y-1 text-xs">
                  Columns
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={tableCols}
                    onChange={(e) => setTableCols(Math.max(1, Math.min(20, Number(e.target.value))))}
                    className={`w-full rounded-xl border px-3 py-2 text-sm ${darkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true }).run()
                  setIsTableActionsOpen(false)
                }}
                className={`mt-3 w-full rounded-xl px-4 py-3 text-sm font-medium ${
                  darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
              >
                Insert {tableRows}x{tableCols} table
              </button>
            </div>
            <div className={`my-1 border-t ${darkMode ? 'border-zinc-700' : 'border-zinc-200'}`} />
            <button
              type="button"
              disabled={!editor.can().chain().focus().addRowAfter().run()}
              onClick={() => {
                editor.chain().focus().addRowAfter().run()
                setIsTableActionsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left text-sm transition ${
                darkMode ? 'hover:bg-zinc-800 disabled:text-zinc-500' : 'hover:bg-zinc-100 disabled:text-zinc-400'
              } ${!editor.can().chain().focus().addRowAfter().run() ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Add row after
            </button>
            <button
              type="button"
              disabled={!editor.can().chain().focus().addColumnAfter().run()}
              onClick={() => {
                editor.chain().focus().addColumnAfter().run()
                setIsTableActionsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left text-sm transition ${
                darkMode ? 'hover:bg-zinc-800 disabled:text-zinc-500' : 'hover:bg-zinc-100 disabled:text-zinc-400'
              } ${!editor.can().chain().focus().addColumnAfter().run() ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Add column after
            </button>
            <button
              type="button"
              disabled={!editor.can().chain().focus().deleteRow().run()}
              onClick={() => {
                editor.chain().focus().deleteRow().run()
                setIsTableActionsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left text-sm transition ${
                darkMode ? 'hover:bg-zinc-800 disabled:text-zinc-500' : 'hover:bg-zinc-100 disabled:text-zinc-400'
              } ${!editor.can().chain().focus().deleteRow().run() ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Delete row
            </button>
            <button
              type="button"
              disabled={!editor.can().chain().focus().deleteColumn().run()}
              onClick={() => {
                editor.chain().focus().deleteColumn().run()
                setIsTableActionsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left text-sm transition ${
                darkMode ? 'hover:bg-zinc-800 disabled:text-zinc-500' : 'hover:bg-zinc-100 disabled:text-zinc-400'
              } ${!editor.can().chain().focus().deleteColumn().run() ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Delete column
            </button>
            <button
              type="button"
              disabled={!editor.can().chain().focus().deleteTable().run()}
              onClick={() => {
                editor.chain().focus().deleteTable().run()
                setIsTableActionsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left text-sm transition ${
                darkMode ? 'hover:bg-zinc-800 disabled:text-zinc-500' : 'hover:bg-zinc-100 disabled:text-zinc-400'
              } ${!editor.can().chain().focus().deleteTable().run() ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Delete table
            </button>
          </div>
        )}
      </div>

      <input
        type="color"
        onInput={(e) => editor.chain().focus().setColor(e.currentTarget.value).run()}
        className="h-10 w-10 cursor-pointer"
      />

      {['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'].map((color) => (
        <button
          key={color}
          onClick={() => editor.chain().focus().setColor(color).run()}
          className="h-5 w-5 rounded-full border"
          style={{ backgroundColor: color }}
        />
      ))}

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
      >
        <Bold size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
      >
        <Italic size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive('underline'))}
      >
        <UnderlineIcon size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive('strike'))}
      >
        <Strikethrough size={16} />
      </button>

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 size={16} />
      </button>

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={16} />
      </button>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={16} />
      </button>

      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </button>

      <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft size={16} />
      </button>

      <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter size={16} />
      </button>

      <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight size={16} />
      </button>

      <button onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 size={16} />
      </button>

      <button onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 size={16} />
      </button>

      <button
        onClick={onSave}
        className={`rounded-xl px-4 py-2 text-sm font-medium ${
          darkMode
            ? 'bg-blue-600 text-white hover:bg-blue-500'
            : 'bg-blue-500 text-white hover:bg-blue-400'
        }`}
      >
        Save
      </button>

      <button
        onClick={onSaveVersion}
        className={`rounded-xl px-4 py-2 text-sm font-medium ${
          darkMode
            ? 'bg-zinc-700 text-white hover:bg-zinc-600'
            : 'bg-zinc-300 text-black hover:bg-zinc-400'
        }`}
      >
        Save Version
      </button>

      <div className="ml-auto flex items-center">
        <button onClick={onImageUpload}>
          <ImageIcon size={18} />
        </button>
      </div>
    </div>
  )
}
