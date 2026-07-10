const PresenceIndicator = ({ count }) => (
  <div className="flex items-center gap-2 text-xs text-text-muted">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-600 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
    </span>
    {count} {count === 1 ? 'person' : 'people'} here
  </div>
)

export default PresenceIndicator