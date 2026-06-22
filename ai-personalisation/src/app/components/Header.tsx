import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Vivid Ads</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400 relative z-10">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Use Cases</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
        </nav>
        <div className="flex items-center gap-5 relative z-10">
          <a href="#" className="text-sm font-medium hidden sm:block text-neutral-400 hover:text-white transition-colors">Sign in</a>
          <a href="#" className="bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
