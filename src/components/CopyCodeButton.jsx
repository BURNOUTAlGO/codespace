import { useClipboard } from '../hooks/useClipboard'

const CopyCodeButton = ({ code }) => {
  const { copied, copy } = useClipboard()

  return (
    <button
      onClick={() => copy(code || '')}
      disabled={!code}
      className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-3 py-1"
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        </>
      )}
    </button>
  )
}

export default CopyCodeButton