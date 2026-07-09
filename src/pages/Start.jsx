import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import JoinCodeForm from '../components/JoinCodeForm'
import { generateRoomId } from '../utils/generateRoomId'

const Start = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [mode, setMode] = useState(null)
  const navigate = useNavigate()

  const handleClose = () => {
    setIsOpen(false)
    navigate('/')
  }

const handleShareCode = () => {
  const roomId = generateRoomId()
  navigate(`/s/${roomId}`)
}

  return (
    <div className="min-h-screen bg-bg">
      <Modal isOpen={isOpen} onClose={handleClose}>
        {mode === null && (
          <>
            <p className="text-[11px] tracking-widest text-text-muted uppercase mb-1">Get started</p>
            <h2 className="text-lg font-medium mb-6 normal-case">Join or share a room</h2>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setMode('join')}
                className="w-full border border-border py-3 text-sm tracking-wide hover:border-text-muted transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                [ ENTER CODE ]
              </button>
              <button
                onClick={handleShareCode}
                className="w-full bg-accent text-white py-3 text-sm tracking-wide hover:bg-accent-hover transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated"
              >
                [ SHARE CODE ]
              </button>
            </div>
          </>
        )}

        {mode === 'join' && (
          <>
            <BackButton onClick={() => setMode(null)} />
            <p className="text-[11px] tracking-widest text-text-muted uppercase mb-1">Join room</p>
            <h2 className="text-lg font-medium mb-6 normal-case">Enter code</h2>
            <JoinCodeForm />
          </>
        )}
      </Modal>
    </div>
  )
}

const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-xs text-text-muted hover:text-text mb-4 flex items-center gap-1 tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
    BACK
  </button>
)

export default Start