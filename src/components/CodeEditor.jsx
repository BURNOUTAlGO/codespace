import { useRef } from 'react'

const CodeEditor = ({ value, onChange, placeholder }) => {
  const gutterRef = useRef(null)
  const textareaRef = useRef(null)

  const lineCount = Math.max(value.split('\n').length, 1)

  const syncScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  return (
    <div className="flex h-full bg-[#030108] overflow-hidden">
      <div
        ref={gutterRef}
        className="select-none text-right pr-3 pl-4 pt-4 text-xs text-text-muted/50 font-mono overflow-hidden flex-shrink-0"
        style={{ minWidth: '3rem', lineHeight: '1.625rem' }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} style={{ height: '1.625rem' }}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        placeholder={placeholder}
        spellCheck="false"
        wrap="off"
        className="no-scrollbar flex-1 h-full bg-[#030108] text-text font-mono text-sm pt-4 pb-4 pr-6 pl-2 resize-none focus:outline-none placeholder:text-text-muted border-0"
        style={{
          lineHeight: '1.625rem',
          whiteSpace: 'pre',
          overflowX: 'auto',
          overflowY: 'auto',
        }}
      />
    </div>
  )
}

export default CodeEditor