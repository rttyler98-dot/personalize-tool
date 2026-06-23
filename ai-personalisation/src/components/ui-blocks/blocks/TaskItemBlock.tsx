import React from 'react';

export const TaskItemBlock: React.FC<{ content: string, blockScale: number, blockOpacity: number }> = ({ content, blockScale, blockOpacity }) => (
  <div
    className="w-[400px] bg-neutral-900/90 backdrop-blur-md border border-white/10 px-5 py-4 rounded-lg mb-2 shadow-xl flex items-center gap-4"
    style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
  >
     <div className="w-5 h-5 rounded-full border-2 border-neutral-600 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-0"></div>
     </div>
     <span className="text-white font-medium">{content}</span>
  </div>
);
