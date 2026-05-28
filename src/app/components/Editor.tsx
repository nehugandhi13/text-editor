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

import { Bold, Italic } from 'lucide-react'
import { DocumentsPanel } from './editor/DocumentsPanel'
import { EditorHeader } from './editor/EditorHeader'
import { EditorToolbar } from './editor/EditorToolbar'
import type { DocumentRecord } from './editor/types'

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
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
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
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [isDocumentsPanelOpen, setIsDocumentsPanelOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState('Saved')
  const [wordCount, setWordCount] = useState(0)

  const countWords = (text: string) => {
    const trimmedText = text.trim()
    if (!trimmedText) return 0
    return trimmedText.split(/\s+/).length
  }

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      editor?.chain().focus().setImage({ src: base64 }).run()
    }
    reader.readAsDataURL(file)
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing...' }),
      Image,
      TextStyle,
      FontSize,
      Color,
      Highlight,
      Underline,
      FontFamily.configure({ types: ['textStyle'] }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '<p></p>',
    onCreate: ({ editor }) => setWordCount(countWords(editor.getText())),
    onUpdate: ({ editor }) => setWordCount(countWords(editor.getText())),
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

  const loadDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setDocuments((data ?? []) as DocumentRecord[])
  }

  const saveDocument = async () => {
    if (!editor) return
    setSaveStatus('Saving...')

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

    const { data, error } = await supabase
      .from('documents')
      .insert([{ title, content: editor.getJSON() }])
      .select()

    if (error) {
      console.error(error)
      alert('Error saving document')
    } else if (data?.[0]?.id) {
      setDocumentId(data[0].id)
      setSaveStatus('Saved')
      await loadDocuments()
    }
  }

  const openDocument = (doc: DocumentRecord) => {
    if (!editor) return
    setDocumentId(doc.id)
    setTitle(doc.title || 'Untitled')
    editor.commands.clearContent()
    setTimeout(() => {
      editor.commands.setContent(doc.content as any)
    }, 0)
    setIsDocumentsPanelOpen(false)
  }

  const createNewDocument = () => {
    setDocumentId(null)
    setTitle('Untitled Document')
    editor?.commands.clearContent()
    setSaveStatus('Saved')
    setIsDocumentsPanelOpen(false)
  }

  const deleteDocument = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this document?')
    if (!confirmed) return

    const { error } = await supabase.from('documents').delete().eq('id', id)
    if (error) {
      console.error(error)
      return
    }

    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    if (documentId === id) createNewDocument()
  }

  const triggerImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleImageUpload(file)
    }
    input.click()
  }

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

  return (
    <>
      <div className="flex">
        <div
          className={`w-full rounded-3xl border shadow-2xl ${
            darkMode
              ? 'border-zinc-800 bg-zinc-900 text-white'
              : 'border-zinc-300 bg-white text-black'
          }`}
        >
          <EditorHeader
            title={title}
            onTitleChange={setTitle}
            wordCount={wordCount}
            saveStatus={saveStatus}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode((prev) => !prev)}
            onOpenDocuments={() => setIsDocumentsPanelOpen(true)}
          />

          <EditorToolbar
            editor={editor}
            darkMode={darkMode}
            onSave={saveDocument}
            onImageUpload={triggerImageUpload}
          />

          <div className="p-8">
            <BubbleMenu editor={editor} className="flex gap-2 rounded-xl border p-2">
              <button onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold size={16} />
              </button>
              <button onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic size={16} />
              </button>
            </BubbleMenu>

            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      <DocumentsPanel
        isOpen={isDocumentsPanelOpen}
        darkMode={darkMode}
        documents={documents}
        onClose={() => setIsDocumentsPanelOpen(false)}
        onCreate={createNewDocument}
        onOpenDocument={openDocument}
        onDeleteDocument={deleteDocument}
      />
    </>
  )
}