'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import { EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'

import { Extension } from '@tiptap/core'

import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'

import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'

import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Moon,
  Sun,
  Trash2,
} from 'lucide-react'

/* ---------------- FONT SIZE EXTENSION ---------------- */
const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: (attrs) =>
              attrs.fontSize
                ? { style: `font-size: ${attrs.fontSize}` }
                : {},
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: any) =>
          chain().setMark('textStyle', { fontSize }).run(),
    }
  },
})

export default function Editor() {
  const [title, setTitle] = useState('Untitled Document')
  const [darkMode, setDarkMode] = useState(true)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [documents, setDocuments] = useState<any[]>([])

  const [saveStatus, setSaveStatus] = useState('Saved')

  const saveDocument = async () => {
  if (!editor) return

  setSaveStatus('Saving...')


  // UPDATE EXISTING DOCUMENT
  if (documentId) {
    const { error } = await supabase
      .from('documents')
      .update({
        title,
        content: editor.getJSON(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    if (error) {
      console.error(error)
      alert('Error updating document')
    } else {
      setSaveStatus('Saved')
    }

    await loadDocuments()

    return
  }

  // CREATE NEW DOCUMENT
  const { data, error } = await supabase
    .from('documents')
    .insert([
      {
        title,
        content: editor.getJSON(),
      },
    ])
    .select()

  if (error) {
    console.error(error)
    alert('Error saving document')
  } else {
    setDocumentId(data[0].id)
    setSaveStatus('Saved')
  }
  await loadDocuments()
}

const loadDocuments = async () => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error(error)
  } else {
    setDocuments(data)
  }
}

const openDocument = (doc: any) => {
  if (!editor) return

  setDocumentId(doc.id)
  setTitle(doc.title || 'Untitled')

  editor.commands.clearContent()

  setTimeout(() => {
    editor.commands.setContent(doc.content)
  }, 0)
}

const createNewDocument = () => {
  setDocumentId(null)
  setTitle('Untitled Document')

  editor?.commands.clearContent()

  setSaveStatus('Saved')
}

const deleteDocument = async (id: string) => {
  const confirmed = confirm(
    'Are you sure you want to delete this document?'
  )

  if (!confirmed) return

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    return
  }

  // REMOVE FROM SIDEBAR
  setDocuments((prev) =>
    prev.filter((doc) => doc.id !== id)
  )

  // CLEAR EDITOR IF CURRENT DOC DELETED
  if (documentId === id) {
    createNewDocument()
  }
}


  /* ---------------- IMAGE HANDLER ---------------- */
  const handleImageUpload = (file: File) => {
    const reader = new FileReader()

    reader.onload = () => {
      const base64 = reader.result as string
      editor?.chain().focus().setImage({ src: base64 }).run()
    }

    reader.readAsDataURL(file)
  }

  const fonts = [
    { name: 'Inter', className: 'font-sans' },
    { name: 'Poppins', className: 'font-sans' },
    { name: 'Merriweather', className: 'font-serif' },
    { name: 'Playfair Display', className: 'font-serif' },
    { name: 'JetBrains Mono', className: 'font-mono' },
  ]

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      
      Image,

      TextStyle,
      FontSize,

      Color,
      Highlight,
      Underline,

      FontFamily.configure({
        types: ['textStyle'],
      }),

      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],

    content: '<p></p>',

    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[500px] focus:outline-none',
      },

      handleDrop: (_, event) => {
        const file = event.dataTransfer?.files?.[0]
        if (file?.type.startsWith('image/')) {
          handleImageUpload(file)
          return true
        }
        return false
      },

      handlePaste: (_, event) => {
        const items = event.clipboardData?.items
        if (!items) return false

        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile()
            if (file) {
              handleImageUpload(file)
              return true
            }
          }
        }
        return false
      },
    },
  })

  useEffect(() => {
  loadDocuments()
}, [])

  useEffect(() => {
  if (!editor || !documentId) return

  const interval = setInterval(() => {
    saveDocument()
  }, 5000)

  return () => clearInterval(interval)
}, [editor, documentId, title])

  if (!editor) return null

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
  <div className="flex gap-6">

    {/* MAIN EDITOR */}
    <div
      className={`w-full max-w-6xl rounded-3xl border shadow-2xl ${
        darkMode
          ? 'border-zinc-800 bg-zinc-900 text-white'
          : 'border-zinc-300 bg-white text-black'
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b p-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-3xl font-bold outline-none"
        />

      <div className="mr-4 text-sm opacity-70">
        {saveStatus}
      </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`ml-4 rounded-xl p-2 ${
            darkMode
              ? 'bg-zinc-800 hover:bg-zinc-700'
              : 'bg-zinc-200 hover:bg-zinc-300'
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-2 border-b p-4">

        {/* FONT DROPDOWN */}
        <div className="relative group">
          <div
            className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium ${
              darkMode
                ? 'bg-zinc-800 text-white'
                : 'bg-zinc-200 text-black'
            }`}
          >
            Fonts
          </div>

          <div
            className={`absolute top-12 left-0 hidden z-50 max-h-64 w-64 overflow-y-auto rounded-xl border shadow-xl group-hover:block ${
              darkMode
                ? 'border-zinc-700 bg-zinc-900 text-white'
                : 'border-zinc-200 bg-white text-black'
            }`}
          >
            {fonts.map((font) => (
              <button
                key={font.name}
                onClick={() =>
                  editor.chain().focus().setFontFamily(font.name).run()
                }
                className={`w-full px-4 py-3 text-left text-lg transition hover:bg-zinc-800/50 ${font.className}`}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>

        {/* FONT SIZE */}
        <select
          onChange={(e) =>
            editor.chain().focus().setFontSize(e.target.value).run()
          }
          className={`rounded-xl px-3 py-2 text-sm ${
            darkMode
              ? 'bg-zinc-800 text-white'
              : 'bg-zinc-200 text-black'
          }`}
        >
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
        </select>

        {/* COLOR PICKER */}
        <input
          type="color"
          onInput={(e) =>
            editor.chain().focus().setColor(e.currentTarget.value).run()
          }
          className="h-10 w-10 cursor-pointer"
        />

        {/* PALETTE */}
        {['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'].map(
          (c) => (
            <button
              key={c}
              onClick={() =>
                editor.chain().focus().setColor(c).run()
              }
              className="h-5 w-5 rounded-full border"
              style={{ backgroundColor: c }}
            />
          )
        )}

        {/* FORMATTING */}
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

        {/* HEADINGS */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={16} />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={16} />
        </button>

        {/* LISTS */}
        <button
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List size={16} />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered size={16} />
        </button>

        {/* ALIGN */}
        <button
          onClick={() =>
            editor.chain().focus().setTextAlign('left').run()
          }
        >
          <AlignLeft size={16} />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().setTextAlign('center').run()
          }
        >
          <AlignCenter size={16} />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().setTextAlign('right').run()
          }
        >
          <AlignRight size={16} />
        </button>

        {/* UNDO REDO */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={16} />
        </button>

        {/* SAVE */}
        <button
          onClick={saveDocument}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-blue-500 hover:bg-blue-400 text-white'
          }`}
        >
          Save
        </button>

        {/* IMAGE */}
        <div className="ml-auto flex items-center">
          <button
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'

              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) handleImageUpload(file)
              }

              input.click()
            }}
          >
            <ImageIcon size={18} />
          </button>
        </div>
      </div>

      {/* EDITOR */}
      <div className="p-8">
        <BubbleMenu
          editor={editor}
          className="flex gap-2 rounded-xl border p-2"
        >
          <button
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
          >
            <Bold size={16} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
          >
            <Italic size={16} />
          </button>
        </BubbleMenu>

        <EditorContent editor={editor} />
      </div>
    </div>

    {/* SIDEBAR */}
    <div
      className={`w-72 rounded-3xl border p-4 ${
        darkMode
          ? 'border-zinc-800 bg-zinc-900 text-white'
          : 'border-zinc-300 bg-white text-black'
      }`}
    >
     <div className="mb-4 flex items-center justify-between">
  <h2 className="text-xl font-bold">
    Documents
  </h2>

  <button
    onClick={createNewDocument}
    className={`rounded-xl px-3 py-1 text-sm ${
      darkMode
        ? 'bg-blue-600 hover:bg-blue-500'
        : 'bg-blue-500 hover:bg-blue-400 text-white'
    }`}
  >
    +
  </button>
</div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
  key={doc.id}
  className={`flex items-center justify-between rounded-xl p-3 transition ${
    darkMode
      ? 'bg-zinc-800 hover:bg-zinc-700'
      : 'bg-zinc-100 hover:bg-zinc-200'
  }`}
>
  <button
    onClick={() => openDocument(doc)}
    className="flex-1 text-left"
  >
    <div className="font-medium">
      {doc.title || 'Untitled'}
    </div>

    <div className="text-xs opacity-60">
      {new Date(doc.updated_at).toLocaleString()}
    </div>
  </button>

  <button
    onClick={() => deleteDocument(doc.id)}
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