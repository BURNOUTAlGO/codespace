import { useEffect, useRef, useState, useCallback } from 'react'
import {
  collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot,
  serverTimestamp, orderBy, query,
} from 'firebase/firestore'
import { db } from '../firebase'
import { debounce } from '../utils/debounce'

export function useRoomFiles(roomId) {
  const [files, setFiles] = useState([])
  const [activeFileId, setActiveFileId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState('synced')
  const debouncersRef = useRef({})
  const createdInitialRef = useRef(false)

  useEffect(() => {
    if (!roomId) return
    const filesRef = collection(db, 'rooms', roomId, 'files')
    const q = query(filesRef, orderBy('createdAt', 'asc'))

    const unsub = onSnapshot(q, async (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setFiles(list)
      setLoading(false)

      setActiveFileId((prev) => (prev && list.some((f) => f.id === prev) ? prev : list[0]?.id ?? null))

      if (list.length === 0 && !createdInitialRef.current) {
        createdInitialRef.current = true
        await addDoc(filesRef, {
          name: 'untitled',
          code: '',
          description: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }
    })
    return () => unsub()
  }, [roomId])

  const addFile = useCallback(
    async (name = 'untitled') => {
      const filesRef = collection(db, 'rooms', roomId, 'files')
      const docRef = await addDoc(filesRef, {
        name,
        code: '',
        description: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      setActiveFileId(docRef.id)
      return docRef.id
    },
    [roomId]
  )

  const getDebouncer = (fileId) => {
    if (!debouncersRef.current[fileId]) {
      debouncersRef.current[fileId] = debounce(async (fields) => {
        try {
          await updateDoc(doc(db, 'rooms', roomId, 'files', fileId), {
            ...fields,
            updatedAt: serverTimestamp(),
          })
          setSaveState('synced')
        } catch (err) {
          console.error('Save failed:', err)
          setSaveState('error')
        }
      })
    }
    return debouncersRef.current[fileId]
  }

  const updateFileCode = (fileId, code) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, code } : f)))
    setSaveState('saving')
    getDebouncer(fileId)({ code })
  }

  const updateFileDescription = (fileId, description) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, description } : f)))
    setSaveState('saving')
    getDebouncer(fileId)({ description })
  }

  const renameFile = async (fileId, name) => {
    if (!name.trim()) return
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, name } : f)))
    await updateDoc(doc(db, 'rooms', roomId, 'files', fileId), { name, updatedAt: serverTimestamp() })
  }

  const deleteFile = async (fileId) => {
    await deleteDoc(doc(db, 'rooms', roomId, 'files', fileId))
  }

  return {
    files, activeFileId, setActiveFileId, addFile, updateFileCode, updateFileDescription,
    renameFile, deleteFile, saveState, loading,
  }
}