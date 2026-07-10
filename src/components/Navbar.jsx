import React from "react";
import { Code2 } from "lucide-react";

const Navbar = () => {
  return (
    <header className="relative z-50 w-full">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 py-5">
        <nav className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#a855f7] to-[#6d28d9] shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <Code2 className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-semibold text-white tracking-tight">CodeSpace</span>
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
