import { useEffect, useRef, useState } from 'react'
import { collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const HEARTBEAT_INTERVAL = 15000
const STALE_AFTER = 30000

export function usePresence(roomId) {
  const [count, setCount] = useState(1)
  const sessionId = useRef(Math.random().toString(36).slice(2)).current

  useEffect(() => {
    if (!roomId) return
    const presenceRef = doc(db, 'rooms', roomId, 'presence', sessionId)

    const beat = () => setDoc(presenceRef, { lastSeen: serverTimestamp() }).catch(() => {})
    beat()
    const interval = setInterval(beat, HEARTBEAT_INTERVAL)

    const unsub = onSnapshot(collection(db, 'rooms', roomId, 'presence'), (snap) => {
      const now = Date.now()
      let active = 0
      snap.forEach((d) => {
        const ts = d.data().lastSeen
        const ms = ts?.toMillis ? ts.toMillis() : now
        if (now - ms < STALE_AFTER) active++
      })
      setCount(Math.max(active, 1))
    })

    const handleUnload = () => deleteDoc(presenceRef).catch(() => {})
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      clearInterval(interval)
      unsub()
      window.removeEventListener('beforeunload', handleUnload)
      deleteDoc(presenceRef).catch(() => {})
    }
  }, [roomId, sessionId])

  return count
}