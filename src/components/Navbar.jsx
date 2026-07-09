import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 h-14 border-b border-border relative z-20">
      <div className="flex items-center gap-2 font-mono font-bold text-sm tracking-tight">
        <span className="text-accent">{'<>'}</span>
        <span>codeshare</span>
      </div>
      <div className="hidden sm:flex items-center gap-6 text-xs text-text-muted font-medium">
        <span className="text-text">home</span>
        <span>how it works</span>
        <span>github</span>
      </div>
      <Link
        to="/start"
        className="text-xs font-medium border border-border rounded-md px-3 py-1.5 hover:border-text-muted transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        share code
      </Link>
    </nav>
  )
}

export default Navbar