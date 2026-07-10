import { useEffect } from 'react'

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white  px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-bg-elevated border border-purple-900/40 animate-scale-in font-mono"
        style={{
          clipPath:
            'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
        }}
      >
        {/* corner tick marks */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-purple-900/40" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-purple-900/40" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-900/40"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-6 bg-[#0d0620]">{children}</div>
      </div>
    </div>
  )
}

export default Modal