import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const stickers = [
  { text: 'no signup required', color: 'bg-sticker-teal text-teal-950', mobileRotate: '-rotate-2', deskPos: 'sm:-top-10 sm:-left-16 sm:rotate-[-8deg]', shape: 'rounded-md' },
  { text: 'live collaboration', color: 'bg-sticker-yellow text-yellow-950', mobileRotate: 'rotate-2', deskPos: 'sm:-top-10 sm:-right-20 sm:rotate-[6deg]', shape: 'rounded-md' },
  { text: 'free, forever', color: 'bg-sticker-pink text-white', mobileRotate: '-rotate-1', deskPos: 'sm:-bottom-10 sm:-right-14 sm:rotate-[-5deg]', shape: 'rounded-full' },
  { text: 'expires with your link', color: 'bg-sticker-orange text-white', mobileRotate: 'rotate-1', deskPos: 'sm:-bottom-10 sm:-left-20 sm:rotate-[7deg]', shape: 'rounded-full' },
]

const Sticker = ({ text, color, mobileRotate, shape }) => (
  <span className={`inline-block ${color} ${shape} text-[10px] sm:text-[11px] font-medium px-2.5 py-1 sm:px-3 sm:py-1.5 border border-black/10 whitespace-nowrap ${mobileRotate} sm:rotate-0`}>
    {text}
  </span>
)

const Home = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeString = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })

  return (
    <div className="min-h-screen bg-black text-text overflow-hidden relative flex flex-col">
      <Navbar />

      {/* Ruler / grid bar */}
      <div className="relative h-6 border-b border-border overflow-hidden hidden md:block flex-shrink-0">
        <div className="absolute inset-0 flex text-[10px] text-text-muted font-mono">
          {Array.from({ length: 13 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[100px] border-l border-border/50 pl-1 pt-1">
              {i * 100}
            </div>
          ))}
        </div>
      </div>

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />

      {/* Hero */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">

          {/* Clock */}
          <div className="font-mono text-xs sm:text-sm text-text-muted mb-6 sm:mb-8">
            {timeString}
          </div>

          {/* Handwritten-style label */}
          <div className="relative mb-8 sm:mb-10">
            <p className="font-mono text-text-muted text-xs sm:text-sm italic">no login is needed</p>
            <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
              <path d="M2 4 Q 50 0, 100 3 T 198 2" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-text-muted" />
            </svg>
          </div>

          {/* Mobile sticker row — above wordmark */}
          <div className="flex sm:hidden items-center gap-2 mb-4">
            <Sticker {...stickers[0]} />
            <Sticker {...stickers[1]} />
          </div>

          {/* Wordmark with selection handles */}
          <div className="relative inline-block">
            {/* Selection corner handles */}
            <span className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent rounded-sm" />
            <span className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent rounded-sm" />
            <span className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent rounded-sm" />
            <span className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent rounded-sm" />
            <span className="absolute inset-0 border border-accent/60 -m-2 sm:-m-3 pointer-events-none" />

            <h1 className="font-mono font-black uppercase text-4xl sm:text-6xl md:text-8xl tracking-tight leading-none px-2">
              CODESHARE
            </h1>

            {/* Desktop-only scattered stickers */}
            {stickers.map((s) => (
              <div key={s.text} className={`hidden sm:block absolute ${s.deskPos}`}>
                <Sticker {...s} />
              </div>
            ))}
          </div>

          {/* Mobile sticker row — below wordmark */}
          <div className="flex sm:hidden items-center gap-2 mt-4 mb-2">
            <Sticker {...stickers[3]} />
            <Sticker {...stickers[2]} />
          </div>

          {/* Availability pill */}
          <div className="flex items-center gap-2 mt-6 mb-6 text-xs sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-text-muted">ready to share, no waiting</span>
          </div>

          {/* Headline */}
          <p className="text-xl sm:text-3xl md:text-4xl font-medium max-w-xl leading-snug">
            Paste code, get a link.
            <br />
            Anyone can edit it live.
          </p>

          {/* CTA */}
          <Link
            to="/start"
            className="mt-8 sm:mt-10 inline-flex items-center gap-2         bg-gradient-to-r
    from-[#9858ff]
    via-[#b27cff]
    to-[#9d62ff]
    text-[#1a1a1a]
    uppercase
    tracking-[0.25em]
    px-8
    py-3
    rounded-md
    transition-all
    duration-300

    hover:from-[#a66cff]
    hover:via-[#c18cff]
    hover:to-[#b07cff]"
          >
            <span className="text-black font-sans">{'>'}</span>
            share code
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home