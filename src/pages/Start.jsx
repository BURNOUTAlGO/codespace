import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import JoinCodeForm from '../components/JoinCodeForm'

const Start = () => {
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()

  const handleClose = () => {
    setIsOpen(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg">
      <Modal isOpen={isOpen} onClose={handleClose}>
        <p className="text-[11px] tracking-widest text-text-muted uppercase mb-1">Join room</p>
        <h2 className="text-lg font-medium mb-6 normal-case">Enter code</h2>
        <JoinCodeForm />
      </Modal>
    </div>
  )
}

export default Start