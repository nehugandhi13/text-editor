export type DocumentRecord = {
  id: string
  title: string | null
  updated_at: string
  content: unknown
}

export type DocumentVersion = {
  id: string
  document_id: string
  title: string | null
  content: unknown
  created_at: string
}
