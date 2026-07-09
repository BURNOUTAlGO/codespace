const CodeEditor = ({ value, onChange, placeholder }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    spellCheck="false"
    className="w-full h-full bg-black text-text font-mono text-sm leading-relaxed p-6 resize-none focus:outline-none placeholder:text-text-muted"
  />
)

export default CodeEditor