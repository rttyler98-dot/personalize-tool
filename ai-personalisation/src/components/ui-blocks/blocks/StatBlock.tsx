import React from 'react';

export const StatBlock: React.FC<{ content: string, label?: string, themeColor: string, blockScale: number, blockOpacity: number }> = ({ content, label, themeColor, blockScale, blockOpacity }) => (
  <div
    className="w-[400px] bg-neutral-900/80 backdrop-blur-md px-6 py-5 flex flex-col items-start border-l-4 border-b border-b-white/5 shadow-xl"
    style={{ transform: `scale(${blockScale})`, opacity: blockOpacity, borderColor: themeColor }}
  >
      <div className="text-4xl font-extrabold text-white tracking-tighter mb-1">{content}</div>
      <div className="text-sm font-medium text-neutral-400 uppercase tracking-widest">{label}</div>
  </div>
);
