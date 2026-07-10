import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Flag,
  Sparkles,
  Plus,
  MoreHorizontal,
  ChevronDown,
  X,
  FileCode,
  Circle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { generateRoomId } from "../utils/generateRoomId";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";


/* ---------- Syntax color map ---------- */
const COLOR = {
  tag: "text-[#a855f7]",
  name: "text-[#f472b6]",
  attr: "text-[#c4b5fd]",
  eq: "text-white/60",
  str: "text-[#fca5a5]",
  txt: "text-white/80",
  kw: "text-[#f472b6]",
  fn: "text-[#93c5fd]",
  var: "text-[#fde68a]",
  num: "text-[#fdba74]",
  cmt: "text-white/30 italic",
  punct: "text-white/60",
};

/* ---------- Code snippets (as tokens) ---------- */
const FILES = [
  {
    name: "index.html",
    lang: "HTML",
    icon: <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#a855f7] text-[8px] font-bold text-white">5</span>,
    lines: [
      [{ t: "<", c: "tag" }, { t: "!DOCTYPE html", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "<", c: "tag" }, { t: "html", c: "name" }, { t: " lang", c: "attr" }, { t: "=", c: "eq" }, { t: "\"en\"", c: "str" }, { t: ">", c: "tag" }],
      [],
      [{ t: "<", c: "tag" }, { t: "head", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "  <", c: "tag" }, { t: "meta", c: "name" }, { t: " charset", c: "attr" }, { t: "=", c: "eq" }, { t: "\"UTF-8\"", c: "str" }, { t: ">", c: "tag" }],
      [{ t: "  <", c: "tag" }, { t: "title", c: "name" }, { t: ">", c: "tag" }, { t: "CodeShare · Live Share", c: "txt" }, { t: "</", c: "tag" }, { t: "title", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "</", c: "tag" }, { t: "head", c: "name" }, { t: ">", c: "tag" }],
      [],
      [{ t: "<", c: "tag" }, { t: "body", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "  <", c: "tag" }, { t: "h1", c: "name" }, { t: " class", c: "attr" }, { t: "=", c: "eq" }, { t: "\"hero\"", c: "str" }, { t: ">", c: "tag" }, { t: "Hello, world!", c: "txt" }, { t: "</", c: "tag" }, { t: "h1", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "  <", c: "tag" }, { t: "p", c: "name" }, { t: ">", c: "tag" }, { t: "Build together in real-time.", c: "txt" }, { t: "</", c: "tag" }, { t: "p", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "</", c: "tag" }, { t: "body", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "</", c: "tag" }, { t: "html", c: "name" }, { t: ">", c: "tag" }],
    ],
  },
  {
    name: "scrypt.py",
    lang: "Python",
    icon: <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#3776ab] text-[8px] font-bold text-white">Py</span>,
    lines: [
      [{ t: "# Realtime collab demo", c: "cmt" }],
      [{ t: "def", c: "kw" }, { t: " greet", c: "fn" }, { t: "(", c: "punct" }, { t: "name", c: "var" }, { t: ")", c: "punct" }, { t: ":", c: "punct" }],
      [{ t: "    return", c: "kw" }, { t: " f", c: "kw" }, { t: "\"Hello, {name}!\"", c: "str" }],
      [],
      [{ t: "users", c: "var" }, { t: " = ", c: "eq" }, { t: "[", c: "punct" }, { t: "\"Aisha\"", c: "str" }, { t: ", ", c: "punct" }, { t: "\"Kai\"", c: "str" }, { t: ", ", c: "punct" }, { t: "\"Zoe\"", c: "str" }, { t: "]", c: "punct" }],
      [{ t: "for", c: "kw" }, { t: " u ", c: "var" }, { t: "in", c: "kw" }, { t: " users", c: "var" }, { t: ":", c: "punct" }],
      [{ t: "    print", c: "fn" }, { t: "(", c: "punct" }, { t: "greet", c: "fn" }, { t: "(", c: "punct" }, { t: "u", c: "var" }, { t: "))", c: "punct" }],
    ],
  },
  {
    name: "scrypt.js",
    lang: "JavaScript",
    icon: <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#f7df1e] text-[8px] font-bold text-black">JS</span>,
    lines: [
      [{ t: "// Broadcast changes to peers", c: "cmt" }],
      [{ t: "const", c: "kw" }, { t: " socket ", c: "var" }, { t: "= ", c: "eq" }, { t: "new", c: "kw" }, { t: " ", c: "punct" }, { t: "WebSocket", c: "fn" }, { t: "(", c: "punct" }, { t: "\"wss://codeshare.io\"", c: "str" }, { t: ")", c: "punct" }, { t: ";", c: "punct" }],
      [],
      [{ t: "function", c: "kw" }, { t: " send", c: "fn" }, { t: "(", c: "punct" }, { t: "patch", c: "var" }, { t: ")", c: "punct" }, { t: " {", c: "punct" }],
      [{ t: "  socket", c: "var" }, { t: ".", c: "punct" }, { t: "send", c: "fn" }, { t: "(", c: "punct" }, { t: "JSON", c: "fn" }, { t: ".", c: "punct" }, { t: "stringify", c: "fn" }, { t: "(", c: "punct" }, { t: "patch", c: "var" }, { t: "));", c: "punct" }],
      [{ t: "}", c: "punct" }],
      [],
      [{ t: "send", c: "fn" }, { t: "(", c: "punct" }, { t: "{ line: ", c: "punct" }, { t: "12", c: "num" }, { t: ", op: ", c: "punct" }, { t: "\"insert\"", c: "str" }, { t: " });", c: "punct" }],
    ],
  },
  {
    name: "cart.html",
    lang: "HTML",
    icon: <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#a855f7] text-[8px] font-bold text-white">5</span>,
    lines: [
      [{ t: "<", c: "tag" }, { t: "section", c: "name" }, { t: " class", c: "attr" }, { t: "=", c: "eq" }, { t: "\"cart\"", c: "str" }, { t: ">", c: "tag" }],
      [{ t: "  <", c: "tag" }, { t: "h2", c: "name" }, { t: ">", c: "tag" }, { t: "Your Cart", c: "txt" }, { t: "</", c: "tag" }, { t: "h2", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "  <", c: "tag" }, { t: "ul", c: "name" }, { t: " class", c: "attr" }, { t: "=", c: "eq" }, { t: "\"items\"", c: "str" }, { t: ">", c: "tag" }],
      [{ t: "    <", c: "tag" }, { t: "li", c: "name" }, { t: ">", c: "tag" }, { t: "Neon Sticker Pack", c: "txt" }, { t: "</", c: "tag" }, { t: "li", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "    <", c: "tag" }, { t: "li", c: "name" }, { t: ">", c: "tag" }, { t: "Code Keyboard", c: "txt" }, { t: "</", c: "tag" }, { t: "li", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "  </", c: "tag" }, { t: "ul", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "  <", c: "tag" }, { t: "button", c: "name" }, { t: ">", c: "tag" }, { t: "Checkout", c: "txt" }, { t: "</", c: "tag" }, { t: "button", c: "name" }, { t: ">", c: "tag" }],
      [{ t: "</", c: "tag" }, { t: "section", c: "name" }, { t: ">", c: "tag" }],
    ],
  },
];

const WINDOW_TABS = ["Peta store", "Wariter", "Blog type", "Alibra-content", "Tira-vines"];
const COLLABORATORS = [
  { name: "Aisha", color: "#f472b6" },
  { name: "Kai", color: "#38bdf8" },
  { name: "Zoe", color: "#22d3ee" },
];

/* Compute total characters of a file for typing progress */
const fileCharCount = (file) =>
  file.lines.reduce((sum, ln) => sum + ln.reduce((s, tok) => s + tok.t.length, 0) + 1, 0);

const Home = () => {
  const starsRef = useRef(null);
  const navigate = useNavigate();
  const [activeFile, setActiveFile] = useState(0);
  const [typed, setTyped] = useState(0);
  const [activeWindow, setActiveWindow] = useState(0);
  const [caretBlink, setCaretBlink] = useState(true);

  const total = useMemo(() => fileCharCount(FILES[activeFile]), [activeFile]);

const handleShareCode = async () => {
  const roomId = generateRoomId();

  // Create room document
  await setDoc(doc(db, "rooms", roomId), {
    createdAt: serverTimestamp(),
  });

  // Create default file
  await addDoc(collection(db, "rooms", roomId, "files"), {
    name: "untitled",
    code: "",
    description: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  navigate(`/s/${roomId}`);
};

  /* Star field */
  useEffect(() => {
    const el = starsRef.current;
    if (!el || el.dataset.generated === "1") return;
    const count = 80;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      const size = Math.random() * 2 + 0.5;
      s.style.position = "absolute";
      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.borderRadius = "9999px";
      s.style.background = "rgba(216,180,254,0.75)";
      s.style.opacity = `${Math.random() * 0.7 + 0.2}`;
      s.style.boxShadow = "0 0 6px rgba(216,180,254,0.5)";
      s.style.animation = `twinkle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`;
      frag.appendChild(s);
    }
    el.appendChild(frag);
    el.dataset.generated = "1";
  }, []);

  /* Typing animation */
  useEffect(() => {
    setTyped(0);
    let stopped = false;
    let t;
    const step = () => {
      if (stopped) return;
      setTyped((prev) => {
        if (prev >= total) {
          t = setTimeout(() => {
            setActiveFile((f) => (f + 1) % FILES.length);
          }, 1600);
          return prev;
        }
        const jump = 1 + Math.floor(Math.random() * 3);
        t = setTimeout(step, 30 + Math.random() * 55);
        return prev + jump;
      });
    };
    t = setTimeout(step, 400);
    return () => {
      stopped = true;
      clearTimeout(t);
    };
  }, [activeFile, total]);

  /* Rotate window tabs occasionally */
  useEffect(() => {
    const i = setInterval(() => {
      setActiveWindow((w) => (w + 1) % WINDOW_TABS.length);
    }, 5200);
    return () => clearInterval(i);
  }, []);

  /* Cursor blink */
  useEffect(() => {
    const i = setInterval(() => setCaretBlink((b) => !b), 500);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050208] text-white">
      {/* Star field */}
      <div ref={starsRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Ambient purple glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#4c1d95]/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-[380px] w-[380px] rounded-full bg-[#6d28d9]/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/4 -right-40 h-[380px] w-[380px] rounded-full bg-[#5b21b6]/10 blur-[140px]" />

      <Navbar />

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 pt-10 md:pt-20 pb-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-white/80">
            <span className="inline-flex items-center rounded-md bg-[#c4ff3a] px-2 py-0.5 text-[12px] font-semibold text-[#08040f]">
              200k+
            </span>
            <span>Developers coding together.</span>
          </div>

          <h1 className="mt-6 mx-auto max-w-4xl font-semibold tracking-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
            Share &amp; Collaborate
            <br className="hidden sm:block" />{" "}on Code Instantly
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-white/60 leading-relaxed">
            CodeSpace is the fastest way to share and collaborate on code in real-time.
            No sign-up needed &mdash; just paste, share the link, and start coding together.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleShareCode}
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#a855f7] to-[#7c3aed] pl-5 pr-2 py-2 text-sm font-medium text-white shadow-[0_10px_30px_rgba(168,85,247,0.4)] hover:from-[#9333ea] hover:to-[#6d28d9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Share Code</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#08040f] transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <Link
              to="/start"
              className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 pl-5 pr-2 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Join Room</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* Floating labels */}
          <div className="pointer-events-none absolute left-2 md:left-16 top-36 md:top-56 hidden sm:block">
            <div className="floaty">
              <div className="flex items-center gap-1.5 rounded-md bg-[#ff5b2b] px-2.5 py-1 text-xs font-medium text-white shadow-lg">
                <Flag className="h-3 w-3" />
                <span>Share</span>
              </div>
              <div className="mx-auto h-6 w-px bg-[#ff5b2b]/70" />
              <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-[#ff5b2b]" />
            </div>
          </div>
          <div className="pointer-events-none absolute right-2 md:right-20 top-28 md:top-44 hidden sm:block">
            <div className="floaty-alt">
              <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-[#a855f7]" />
              <div className="mx-auto h-6 w-px bg-[#a855f7]/70" />
              <div className="flex items-center gap-1.5 rounded-md bg-[#a855f7] px-2.5 py-1 text-xs font-medium text-white shadow-lg">
                <Sparkles className="h-3 w-3" />
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Code Editor */}
        <div className="relative z-10 mx-auto mt-6 max-w-6xl px-3 sm:px-6">
          <div className="rounded-2xl border border-purple-500/20 bg-[#100820] shadow-[0_30px_120px_rgba(124,58,237,0.35)] overflow-hidden">
            {/* Window tabs */}
            <div className="flex items-center gap-1 bg-[#0b0416] px-2 sm:px-3 pt-3 overflow-x-auto no-scrollbar">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#a855f7] to-[#6d28d9]">
                <Circle className="h-4 w-4 text-white" fill="currentColor" />
              </div>
              {WINDOW_TABS.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setActiveWindow(i)}
                  className={`flex shrink-0 items-center gap-2 rounded-t-md px-3 py-2 text-xs transition-colors ${
                    i === activeWindow
                      ? "bg-[#1a0f2e] text-white border-t border-x border-purple-500/20"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>{t}</span>
                  <X className="h-3 w-3 opacity-60" />
                </button>
              ))}
            </div>

            {/* Menu bar */}
            <div className="flex items-center gap-3 sm:gap-5 border-b border-purple-500/10 bg-[#100820] px-3 sm:px-4 py-2 text-[11px] sm:text-xs text-white/70 overflow-x-auto no-scrollbar">
              {["File", "Edit", "View", "Find", "Editor", "Debug", "Window", "Help", "Settings"].map((m) => (
                <span key={m} className="shrink-0 hover:text-white cursor-default">{m}</span>
              ))}
            </div>

            {/* Body */}
            <div className="grid grid-cols-12 min-h-[340px] sm:min-h-[380px]">
              {/* Explorer */}
              <aside className="hidden md:block col-span-4 lg:col-span-3 border-r border-purple-500/10 bg-[#0d0620] p-3">
                <div className="flex items-center justify-between px-1 pb-2 text-xs uppercase tracking-wide text-white/50">
                  <span>Explorer</span>
                  <div className="flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5" />
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <TreeRow open label="App-API" depth={0} />
                  <TreeRow open label="App" depth={1} />
                  <TreeRow label="Gulp" depth={2} />
                  <TreeRow label="Images" depth={2} />
                  <TreeRow label="Fonts" depth={2} />
                  <TreeRow label="Icons" depth={2} />
                  <TreeRow open label="Pages" depth={2} />
                  {FILES.map((f, i) => (
                    <FileRow
                      key={f.name}
                      name={f.name}
                      icon={f.icon}
                      active={i === activeFile}
                      depth={3}
                      onClick={() => setActiveFile(i)}
                    />
                  ))}
                </div>
              </aside>

              {/* Editor */}
              <div className="col-span-12 md:col-span-8 lg:col-span-9 bg-[#100820] flex flex-col min-w-0">
                {/* File tabs */}
                <div className="flex items-center gap-1 border-b border-purple-500/10 bg-[#0d0620] px-2 pt-2 overflow-x-auto no-scrollbar">
                  {FILES.map((f, i) => (
                    <button
                      key={f.name}
                      onClick={() => setActiveFile(i)}
                      className={`flex shrink-0 items-center gap-2 rounded-t-md px-3 py-1.5 text-xs transition-colors ${
                        i === activeFile
                          ? "bg-[#100820] text-white border-t border-x border-purple-500/20"
                          : "text-white/50 hover:text-white/80"
                      }`}
                    >
                      {f.icon}
                      <span>{f.name}</span>
                      <X className="h-3 w-3 opacity-60" />
                    </button>
                  ))}
                </div>

                {/* Code */}
                <div className="relative flex-1 overflow-auto">
                  <TypingCode file={FILES[activeFile]} typed={typed} caretBlink={caretBlink} />
                  <CollaboratorPill user={COLLABORATORS[activeFile % COLLABORATORS.length]} />
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between border-t border-purple-500/10 bg-[#0b0416] px-3 py-1.5 text-[10px] sm:text-[11px] text-white/50">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                    </span>
                    <span className="hidden sm:inline">main</span>
                    <span className="hidden sm:inline">UTF-8</span>
                    <span className="flex items-center gap-1">
                      {COLLABORATORS.map((u) => (
                        <span
                          key={u.name}
                          className="h-4 w-4 rounded-full ring-1 ring-black/40 text-[8px] flex items-center justify-center font-bold"
                          style={{ background: u.color, color: "#0b0416" }}
                          title={u.name}
                        >
                          {u.name[0]}
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span>{FILES[activeFile].lang}</span>
                    <span className="hidden sm:inline">Ln {Math.min(FILES[activeFile].lines.length, Math.max(1, Math.floor((typed / total) * FILES[activeFile].lines.length) + 1))}</span>
                    <span className="hidden md:inline">Spaces: 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none mx-auto mt-2 h-16 max-w-5xl rounded-full bg-purple-900/40 blur-2xl" />
        </div>

        <div className="h-16 sm:h-24" />
      </section>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }
        @keyframes floaty {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .floaty { display: flex; flex-direction: column; align-items: flex-start; animation: floaty 5s ease-in-out infinite; }
        .floaty-alt { display: flex; flex-direction: column; align-items: flex-end; animation: floaty 5s ease-in-out 1.2s infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

/* ---------- Typing code renderer ---------- */
const TypingCode = ({ file, typed, caretBlink }) => {
  let count = 0;
  const rendered = [];
  let caretPlaced = false;

  for (let li = 0; li < file.lines.length; li++) {
    const line = file.lines[li];
    const lineChildren = [];
    let lineHasContent = false;
    for (let ti = 0; ti < line.length; ti++) {
      const tok = line[ti];
      const remaining = typed - count;
      if (remaining <= 0) break;
      const showText = tok.t.slice(0, Math.min(tok.t.length, remaining));
      lineChildren.push(
        <span key={ti} className={COLOR[tok.c] || "text-white/80"}>{showText}</span>
      );
      count += tok.t.length;
      lineHasContent = true;
      if (remaining < tok.t.length) break;
    }
    const currentLine = typed <= count && !caretPlaced;
    if (currentLine && !caretPlaced) {
      lineChildren.push(
        <span
          key="caret"
          className={`inline-block w-[7px] h-[14px] align-middle ml-[1px] ${caretBlink ? "bg-[#c4b5fd]" : "bg-transparent"}`}
        />
      );
      caretPlaced = true;
    }

    rendered.push(
      <div key={li} className="flex items-start">
        <span className="select-none w-8 sm:w-10 shrink-0 text-right pr-2 sm:pr-3 text-white/25">{li + 1}</span>
        <span className="whitespace-pre">{lineChildren}{!lineHasContent && !currentLine ? " " : ""}</span>
      </div>
    );
    count += 1;
  }

  return (
    <pre className="font-mono text-[11px] sm:text-[12px] md:text-[13px] leading-[1.6] p-3 sm:p-4 min-w-max">
      {rendered}
    </pre>
  );
};

/* ---------- Collaborator floating pill ---------- */
const CollaboratorPill = ({ user }) => (
  <div
    className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 backdrop-blur px-2.5 py-1 text-[10px] sm:text-[11px]"
    style={{ boxShadow: `0 0 20px ${user.color}22` }}
  >
    <span
      className="h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold"
      style={{ background: user.color, color: "#0b0416" }}
    >
      {user.name[0]}
    </span>
    <span className="text-white/80">{user.name} is typing…</span>
    <span className="flex items-center gap-0.5">
      <span className="h-1 w-1 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="h-1 w-1 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "120ms" }} />
      <span className="h-1 w-1 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "240ms" }} />
    </span>
  </div>
);

/* ---------- Sidebar helpers ---------- */
const TreeRow = ({ label, depth = 0, open = false }) => (
  <div
    className="flex items-center gap-1.5 rounded px-1.5 py-1 text-white/75 hover:bg-white/5 cursor-default"
    style={{ paddingLeft: `${8 + depth * 12}px` }}
  >
    <ChevronDown className={`h-3.5 w-3.5 text-white/40 transition-transform ${open ? "" : "-rotate-90"}`} />
    <FolderIcon />
    <span className="text-[13px]">{label}</span>
  </div>
);

const FileRow = ({ name, icon, active = false, depth = 0, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-2 rounded px-1.5 py-1 text-left transition-colors ${
      active ? "bg-purple-500/15 text-white" : "text-white/70 hover:bg-white/5"
    }`}
    style={{ paddingLeft: `${8 + depth * 12 + 14}px` }}
  >
    <span className="shrink-0">{icon}</span>
    <span className="text-[13px] truncate">{name}</span>
  </button>
);

const FolderIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#c4b5fd]" fill="currentColor">
    <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h4L9 5.5h7.5A1.5 1.5 0 0 1 18 7v7.5A1.5 1.5 0 0 1 16.5 16h-13A1.5 1.5 0 0 1 2 14.5v-9Z" />
  </svg>
);

export default Home;