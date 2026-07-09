import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const JoinCodeForm = () => {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const handleJoin = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return

    let roomId = trimmed
    if (trimmed.includes('/s/')) {
      roomId = trimmed.split('/s/')[1]?.split(/[/?#]/)[0] || trimmed
    }

    navigate(`/s/${roomId}`)
  }

  return (
    <form onSubmit={handleJoin} className="flex flex-col gap-4">
      <div className="relative border border-border px-3 py-3">
        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-accent" />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-accent" />
        <label className="block text-[10px] tracking-widest text-text-muted uppercase mb-1.5">Room code or link</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="abc1234"
          autoFocus
          className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={!value.trim()}
        className="bg-accent text-white text-sm tracking-wide py-3 hover:bg-accent-hover transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated"
      >
        [ JOIN ]
      </button>
    </form>
  )
}

export default JoinCodeForm