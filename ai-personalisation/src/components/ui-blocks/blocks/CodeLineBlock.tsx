import React from 'react';

export const CodeLineBlock: React.FC<{ content: string, index: number, blockScale: number, blockOpacity: number }> = ({ content, index, blockScale, blockOpacity }) => (
  <div
    className="w-[400px] bg-black/90 backdrop-blur-md border border-white/10 px-6 py-3 font-mono text-sm shadow-xl flex items-center gap-3"
    style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
  >
    <span className="text-neutral-600 select-none">{index + 1}</span>
    <span className="text-emerald-400">{content}</span>
  </div>
);
