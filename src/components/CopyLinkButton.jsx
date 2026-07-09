import { useClipboard } from '../hooks/useClipboard'

const CopyLinkButton = () => {
  const { copied, copy } = useClipboard()

  return (
    <button
      onClick={() => copy(window.location.href)}
      className="flex items-center gap-1.5 text-xs border border-border rounded-md px-3 py-1.5 hover:border-text-muted transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy link
        </>
      )}
    </button>
  )
}

export default CopyLinkButton