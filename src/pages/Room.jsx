import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useRoomFiles } from '../hooks/useRoomFiles'
import { usePresence } from '../hooks/usePresence'
import CodeEditor from '../components/CodeEditor'
import PresenceIndicator from '../components/PresenceIndicator'
import CopyLinkButton from '../components/CopyLinkButton'
import CopyCodeButton from '../components/CopyCodeButton'
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
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

const PanelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="9" y1="4" x2="9" y2="20" />
  </svg>
)

const PencilIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
)

const getFileMeta = (name = '') => {
  const ext = name.split('.').pop()?.toLowerCase()
  const map = {
    html: { label: '5', bg: 'bg-[#a855f7]', fg: 'text-white', lang: 'HTML' },
    htm: { label: '5', bg: 'bg-[#a855f7]', fg: 'text-white', lang: 'HTML' },
    js: { label: 'JS', bg: 'bg-[#f7df1e]', fg: 'text-black', lang: 'JavaScript' },
    jsx: { label: 'JS', bg: 'bg-[#f7df1e]', fg: 'text-black', lang: 'JavaScript' },
    ts: { label: 'TS', bg: 'bg-[#3178c6]', fg: 'text-white', lang: 'TypeScript' },
    tsx: { label: 'TS', bg: 'bg-[#3178c6]', fg: 'text-white', lang: 'TypeScript' },
    java: { label: 'J', bg: 'bg-[#f89820]', fg: 'text-white', lang: 'Java' },
    py: { label: 'Py', bg: 'bg-[#3776ab]', fg: 'text-white', lang: 'Python' },
    css: { label: '#', bg: 'bg-[#2965f1]', fg: 'text-white', lang: 'CSS' },
    json: { label: '{}', bg: 'bg-[#cbcb41]', fg: 'text-black', lang: 'JSON' },
    md: { label: 'M', bg: 'bg-[#519aba]', fg: 'text-white', lang: 'Markdown' },
  }
  return map[ext] || { label: '•', bg: 'bg-purple-600', fg: 'text-white', lang: 'Plain Text' }
}

const FileBadge = ({ name }) => {
  const meta = getFileMeta(name)
  return (
    <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm ${meta.bg} ${meta.fg} text-[8px] font-bold flex-shrink-0`}>
      {meta.label}
    </span>
  )
}

const Room = () => {
  const { id } = useParams()
  const [roomExists, setRoomExists] = useState(null);
  const {
    files, activeFileId, setActiveFileId, addFile, updateFileCode, updateFileDescription,
    renameFile, deleteFile, saveState, loading,
  } = useRoomFiles(id)
  const presenceCount = usePresence(id)

  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [addingFile, setAddingFile] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)

  const openTabsKey = `codeshare:openTabs:${id}`
  const activeTabKey = `codeshare:activeTab:${id}`

  const [openFileIds, setOpenFileIds] = useState(() => {
    try {
      const saved = localStorage.getItem(openTabsKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
  const checkRoom = async () => {
    try {
      const roomRef = doc(db, "rooms", id);
      const roomSnap = await getDoc(roomRef);

      setRoomExists(roomSnap.exists());
    } catch (err) {
      console.error(err);
      setRoomExists(false);
    }
  };

  checkRoom();
}, [id]);

  // Persist open tabs whenever they change
useEffect(() => {
  console.log("Saving tabs:", openFileIds)

  try {
    localStorage.setItem(openTabsKey, JSON.stringify(openFileIds))
  } catch {
    // ignore storage errors
  }
}, [openFileIds, openTabsKey])

  // Seed / restore open tabs once files first load
useEffect(() => {
  if (files.length === 0) return

  console.log("Restoring tabs from state:", openFileIds)

  setOpenFileIds((prev) => {
    const validPrev = prev.filter((fid) => files.some((f) => f.id === fid))
    if (validPrev.length > 0) return validPrev
    return activeFileId ? [activeFileId] : [files[0].id]
  })
}, [files.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Drop tabs whose file no longer exists (e.g. deleted by another collaborator)
  useEffect(() => {
    setOpenFileIds((prev) => prev.filter((fid) => files.some((f) => f.id === fid)))
  }, [files])

  // Restore previously active tab on load, if it's still valid
  useEffect(() => {
    if (files.length === 0) return
    try {
      const savedActive = localStorage.getItem(activeTabKey)
      if (savedActive && files.some((f) => f.id === savedActive)) {
        setActiveFileId(savedActive)
      }
    } catch {
      // ignore
    }
  }, [files.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist active tab whenever it changes
  useEffect(() => {
    if (activeFileId) {
      try {
        localStorage.setItem(activeTabKey, activeFileId)
      } catch {
        // ignore
      }
    }
  }, [activeFileId, activeTabKey])
  useEffect(() => {
  if (!activeFileId) return;

  setOpenFileIds((prev) => {
    if (prev.includes(activeFileId)) return prev;
    return [...prev, activeFileId];
  });
}, [activeFileId]);

  const openFiles = files.filter((f) => openFileIds.includes(f.id))
  const activeFile = files.find((f) => f.id === activeFileId)
  const saveLabel = saveState === 'saving' ? 'saving...' : saveState === 'error' ? 'error saving' : 'synced'
  const activeMeta = activeFile ? getFileMeta(activeFile.name) : null
  const lineCount = activeFile ? Math.max(activeFile.code.split('\n').length, 1) : 1

  const startRename = (file) => {
    setRenamingId(file.id)
    setRenameValue(file.name)
  }

  const commitRename = () => {
    if (renamingId) renameFile(renamingId, renameValue.trim() || 'untitled')
    setRenamingId(null)
  }

  const commitNewFile = async () => {
    const name = newFileName.trim()
    if (name) {
      const newId = await addFile(name)
      setOpenFileIds((prev) => (prev.includes(newId) ? prev : [...prev, newId]))
    }
    setNewFileName('')
    setAddingFile(false)
  }

  const selectFile = (fileId) => {
    setOpenFileIds((prev) => (prev.includes(fileId) ? prev : [...prev, fileId]))
    setActiveFileId(fileId)
    setMobileSidebarOpen(false)
  }

  const activateTab = (fileId) => {
    setActiveFileId(fileId)
  }

  const closeTab = (fileId) => {
    setOpenFileIds((prev) => {
      const next = prev.filter((fid) => fid !== fileId)
      if (fileId === activeFileId) {
        setActiveFileId(next.length > 0 ? next[next.length - 1] : null)
      }
      return next
    })
  }

  const handleDelete = (fileId) => {
    if (files.length <= 1) return
    deleteFile(fileId)
    setOpenFileIds((prev) => prev.filter((fid) => fid !== fileId))
  }
  if (roomExists === null) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-text-muted text-sm font-mono">
      Checking room...
    </div>
  );
}

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-text-muted text-sm font-mono">
        loading room...
      </div>
    )
  }

  // if room does not exist, show a "Room Not Found" message for the url validation
  if (!roomExists) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-text-muted text-sm font-mono pl-3 pr-3">
      <h1 className="text-4xl font-bold text-white mb-3 text-center">
        Room Not Found
      </h1>

      <p className="text-white/60 mb-6 max-w-md text-center">
        The room you're trying to join doesn't exist or has been deleted.
      </p>

      <Link
        to="/"
        className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white"
      >
        Go Home
      </Link>
    </div>
  );
}

  return (
    <div className="h-screen bg-black text-text flex overflow-hidden relative">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col flex-shrink-0
          bg-gradient-to-b from-purple-950 via-[#1b0e33] to-bg-black
          border-r border-purple-900/60
          transform transition-all duration-200 ease-out overflow-hidden
          w-64
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${desktopSidebarOpen ? 'md:w-64 md:border-r' : 'md:w-0 md:border-r-0'}`}
      >
        <div className="px-4 h-14 flex items-center justify-between border-b border-purple-900/60 flex-shrink-0 w-64">
          <Link to="/" className="flex items-center gap-2 font-mono font-bold text-sm text-white">
            <span className="text-white">{'<>'}</span>
            CodeSpace
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
            className="md:hidden text-purple-300 hover:text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
          >
            <XIcon />
          </button>
        </div>

        <div className="px-4 py-4 flex-1 overflow-y-auto w-64 no-scrollbar">
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
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileBadge name={file.name} />
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

                {renamingId !== file.id && (
                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); startRename(file) }}
                      aria-label={`Rename ${file.name}`}
                      className="text-purple-300 hover:text-white p-0.5"
                    >
                      <PencilIcon />
                    </button>
                    {files.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(file.id) }}
                        aria-label={`Delete ${file.name}`}
                        className="text-purple-300 hover:text-red-400 p-0.5"
                      >
                        <XIcon />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {addingFile && (
              <div className="flex items-center gap-2 text-xs px-2 py-1.5">
                <span className="w-3.5 h-3.5 flex-shrink-0" />
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

      {/* Main codebase area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Info bar top */}
        <div className="h-10 bg-[#0d0620] border-b border-purple-900/40 flex items-center justify-between px-4 flex-shrink-0 gap-2">
          <span className="font-mono text-xs text-text-muted truncate">Room Id: {id}</span>
          <CopyLinkButton />
        </div>

        {/* File tabs — only OPEN files show here */}
        <div className="h-11 border-b border-purple-900/40 flex items-center flex-shrink-0 bg-[#0d0620] gap-3">
          <div className="flex items-center flex-shrink-0 pl-2 gap-1">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open file explorer"
              className="md:hidden text-text-muted hover:text-text transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            >
              <MenuIcon />
            </button>
            <button
              onClick={() => setDesktopSidebarOpen((v) => !v)}
              aria-label={desktopSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              title={desktopSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              className="hidden md:flex text-text-muted hover:text-text transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            >
              <PanelIcon />
            </button>
          </div>

          <div className="flex-1 flex items-center overflow-x-auto gap-1 px-2 min-w-0 no-scrollbar">
            {openFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => activateTab(file.id)}
                className={`group/tab flex items-center gap-2 text-xs rounded-t-md pl-3 pr-2 py-2 cursor-pointer flex-shrink-0 transition-colors duration-150 ${
                  file.id === activeFileId
                    ? 'bg-[#160a37] text-text border-t border-x border-purple-900/40'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <FileBadge name={file.name} />
                {file.name}
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(file.id) }}
                  aria-label={`Close ${file.name}`}
                  className="ml-1 text-text-muted hover:text-text opacity-60 hover:opacity-100 transition-opacity duration-150"
                >
                  <XIcon />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description — unique per file, with copy-code button */}
        <div className="h-[35px] bg-[#0d0620] border-b border-purple-900/40 px-4 py-2 flex-shrink-0 flex items-center justify-between gap-3">
          <input
            type="text"
            value={activeFile?.description || ''}
            onChange={(e) => activeFile && updateFileDescription(activeFile.id, e.target.value)}
            placeholder="Add a description for this file..."
            className="flex-1 min-w-0 bg-transparent text-sm text-text-muted placeholder:text-text-muted focus:outline-none focus:text-text"
          />
          <CopyCodeButton code={activeFile?.code} />
        </div>

        {/* Editor + floating presence */}
        <div className="flex-1 min-h-0 relative">
          {activeFile ? (
<CodeEditor
  value={activeFile.code}
  fileName={activeFile.name}
  onChange={(val) => updateFileCode(activeFile.id, val)}
/>
          ) : (
            <div className="h-full flex items-center justify-center text-text-muted text-sm">
              Select a file from the sidebar to open it
            </div>
          )}
          <div className="absolute bottom-3 right-4">
            <div className="bg-[#0d0620] backdrop-blur border border-purple-900/40 rounded-full px-3 py-1.5 shadow-none">
              <PresenceIndicator count={presenceCount} />
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="h-8 flex items-center justify-between px-4 border-t border-border flex-shrink-0 text-[11px] text-text-muted">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${saveState === 'saving' ? 'bg-yellow-400 animate-pulse' : saveState === 'error' ? 'bg-red-400' : 'bg-emerald-400'}`} />
              {saveLabel}
            </span>
            <span className="hidden sm:inline">main</span>
            <span className="hidden sm:inline">UTF-8</span>
          </div>
          <div className="flex items-center gap-3">
            {activeMeta && <span>{activeMeta.lang}</span>}
            <span className="hidden sm:inline">{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
            <span className="hidden md:inline">Spaces: 2</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Room