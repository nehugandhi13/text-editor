'use client'

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
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

type EditorToolbarProps = {
  editor: Editor
  darkMode: boolean
  onSave: () => void
  onImageUpload: () => void
}

export function EditorToolbar({
  editor,
  darkMode,
  onSave,
  onImageUpload,
}: EditorToolbarProps) {
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

      <div className="ml-auto flex items-center">
        <button onClick={onImageUpload}>
          <ImageIcon size={18} />
        </button>
      </div>
    </div>
  )
}
