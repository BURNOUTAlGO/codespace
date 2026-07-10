const DOTS = [
  { top: '10%', left: '8%', size: 3 }, { top: '18%', left: '90%', size: 2 },
  { top: '28%', left: '4%', size: 2 }, { top: '32%', left: '96%', size: 3 },
  { top: '48%', left: '2%', size: 2 }, { top: '55%', left: '92%', size: 2 },
  { top: '68%', left: '10%', size: 3 }, { top: '15%', left: '45%', size: 2 },
  { top: '75%', left: '85%', size: 2 }, { top: '40%', left: '55%', size: 2 },
]

const Starfield = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {DOTS.map((d, i) => (
      <span
        key={i}
        className="absolute rounded-full bg-text-muted/40"
        style={{ top: d.top, left: d.left, width: d.size, height: d.size }}
      />
    ))}
  </div>
)

export default Starfield