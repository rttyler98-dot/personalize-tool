import React from 'react';

export const SocialPostBlock: React.FC<{ content: string, label?: string, blockScale: number, blockOpacity: number }> = ({ content, label, blockScale, blockOpacity }) => (
  <div
    className="w-[440px] bg-white rounded-2xl border border-neutral-200 shadow-xl p-5 flex flex-col gap-3"
    style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
  >
     <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500"></div>
        <div className="flex flex-col">
           <div className="text-black font-bold text-sm leading-tight">{label || 'User'}</div>
           <div className="text-neutral-500 text-xs">@{(label || 'user').toLowerCase().replace(' ', '')}</div>
        </div>
     </div>
     <div className="text-black text-base leading-snug">
        {content}
     </div>
     <div className="flex gap-6 mt-2 text-neutral-400">
         <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full border-2 border-neutral-300"></div></div>
         <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-sm border-2 border-neutral-300"></div></div>
     </div>
  </div>
);
