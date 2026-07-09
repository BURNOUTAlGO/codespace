import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useRoomFiles } from '../hooks/useRoomFiles'
import { usePresence } from '../hooks/usePresence'
import CodeEditor from '../components/CodeEditor'
import PresenceIndicator from '../components/PresenceIndicator'
import CopyLinkButton from '../components/CopyLinkButton'

const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
)

const FileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const Room = () => {
  const { id } = useParams()
  const {
    files, activeFileId, setActiveFileId, addFile, updateFileCode, renameFile, deleteFile, saveState, loading,
  } = useRoomFiles(id)
  const presenceCount = usePresence(id)

  const [description, setDescription] = useState('')
  const [showDescription, setShowDescription] = useState(false)
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [addingFile, setAddingFile] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeFile = files.find((f) => f.id === activeFileId)
  const saveLabel = saveState === 'saving' ? 'saving...' : saveState === 'error' ? 'error saving' : 'synced'

  const handleSaveDescription = async () => {
    await setDoc(doc(db, 'rooms', id), { description }, { merge: true })
  }

  const startRename = (file) => {
    setRenamingId(file.id)
    setRenameValue(file.name)
  }

  const commitRename = () => {
    if (renamingId) renameFile(renamingId, renameValue.trim() || 'untitled')
    setRenamingId(null)
  }

  const commitNewFile = () => {
    const name = newFileName.trim()
    if (name) addFile(name)
    setNewFileName('')
    setAddingFile(false)
  }

  const handleDelete = (fileId) => {
    if (files.length <= 1) return
    deleteFile(fileId)
  }

  const selectFile = (fileId) => {
    setActiveFileId(fileId)
    setSidebarOpen(false) // auto-close drawer on mobile after picking a file
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-text-muted text-sm font-mono">
        loading room...
      </div>
    )
  }

  return (
    <div className="h-screen bg-black text-text flex overflow-hidden relative">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex flex-col flex-shrink-0
          bg-gradient-to-b from-purple-950 via-[#1b0e33]
          border-r border-purple-900/60
          transform transition-transform duration-200 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="px-4 h-14 flex items-center justify-between border-b border-purple-900/60 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2 font-mono font-bold text-sm text-white">
            <span className="text-accent">{'<>'}</span>
            codeshare
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="md:hidden text-purple-300 hover:text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
          >
            <XIcon />
          </button>
        </div>

        <div className="px-4 py-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] tracking-widest text-purple-300 uppercase">Explorer</p>
            <button
              onClick={() => setAddingFile(true)}
              aria-label="New file"
              className="text-purple-300 hover:text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            >
              <PlusIcon />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-purple-300 mb-2">
            <FolderIcon />
            room-{id}
          </div>

          <div className="flex flex-col gap-0.5 ml-3">
            {files.map((file) => (
              <div
                key={file.id}
                className={`group flex items-center justify-between gap-2 text-xs rounded-md px-2 py-1.5 cursor-pointer transition-colors duration-150 ${
                  file.id === activeFileId ? 'bg-white/10 text-white' : 'text-purple-200 hover:bg-white/5'
                }`}
                onClick={() => selectFile(file.id)}
                onDoubleClick={() => startRename(file)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileIcon />
                  {renamingId === file.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => e.key === 'Enter' && commitRename()}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent border-b border-accent focus:outline-none w-full text-white"
                    />
                  ) : (
                    <span className="truncate">{file.name}</span>
                  )}
                </div>
                {files.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(file.id) }}
                    aria-label={`Delete ${file.name}`}
                    className="opacity-0 group-hover:opacity-100 text-purple-300 hover:text-red-400 transition-opacity duration-150 flex-shrink-0"
                  >
                    <XIcon />
                  </button>
                )}
              </div>
            ))}

            {addingFile && (
              <div className="flex items-center gap-2 text-xs px-2 py-1.5">
                <FileIcon />
                <input
                  autoFocus
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onBlur={commitNewFile}
                  onKeyDown={(e) => e.key === 'Enter' && commitNewFile()}
                  placeholder="file name"
                  className="bg-transparent border-b border-accent focus:outline-none w-full placeholder:text-purple-300 text-white"
                />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tab bar */}
        <div className="h-10 border-b border-border flex items-center px-2 flex-shrink-0 overflow-x-auto gap-1">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open file explorer"
            className="md:hidden text-text-muted hover:text-text transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md flex-shrink-0 mr-1"
          >
            <MenuIcon />
          </button>
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`flex items-center gap-2 text-xs border rounded-t-md px-3 py-2 -mb-px cursor-pointer flex-shrink-0 mr-1 transition-colors duration-150 ${
                file.id === activeFileId
                  ? 'bg-bg border-border border-b-0 text-text'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0" />
              {file.name}
            </div>
          ))}
        </div>

        {/* Info bar */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4 flex-shrink-0 gap-2">
          <span className="font-mono text-xs text-text-muted truncate">{id}</span>
          <PresenceIndicator count={presenceCount} />
          <CopyLinkButton />
        </div>

        {/* Description */}
        <div className="border-b border-border px-4 py-2 flex-shrink-0">
          {showDescription ? (
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => { handleSaveDescription(); if (!description) setShowDescription(false) }}
              placeholder="Add a description (optional)"
              autoFocus
              className="w-full bg-transparent text-sm text-text-muted placeholder:text-text-muted focus:outline-none focus:text-text"
            />
          ) : (
            <button
              onClick={() => setShowDescription(true)}
              className="text-sm text-text-muted hover:text-text transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            >
              {description || '+ Add a description'}
            </button>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0">
          {activeFile && (
            <CodeEditor
              key={activeFile.id}
              value={activeFile.code}
              onChange={(val) => updateFileCode(activeFile.id, val)}
              placeholder="Start typing or paste your code..."
            />
          )}
        </div>

        {/* Save state */}
        <div className="h-8 flex items-center px-4 border-t border-border flex-shrink-0">
          <span className="text-[11px] text-text-muted font-mono">{saveLabel}</span>
        </div>
      </div>
    </div>
  )
}

export default Room