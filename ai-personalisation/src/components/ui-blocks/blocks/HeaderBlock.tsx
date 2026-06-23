import React from 'react';

export const HeaderBlock: React.FC<{ content: string, themeColor: string, blockScale: number, blockOpacity: number }> = ({ content, themeColor, blockScale, blockOpacity }) => (
  <div
    className="w-[400px] bg-neutral-900/90 backdrop-blur-md rounded-t-xl border-b border-white/10 px-6 py-4 flex items-center gap-4 shadow-xl"
    style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
  >
     <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: themeColor }}>
        <div className="w-4 h-4 bg-white/90 rounded-sm"></div>
     </div>
     <div className="text-xl font-bold text-white tracking-tight">{content}</div>
  </div>
);
