import React from 'react';

export const CodeEditorBlock: React.FC<{ content: string, blockScale: number, blockOpacity: number }> = ({ content, blockScale, blockOpacity }) => (
  <div
    className="w-[480px] bg-[#1e1e1e] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
    style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
  >
    <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-white/5">
       <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
       <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
       <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
       <div className="ml-4 text-xs text-neutral-400 font-mono">main.ts</div>
    </div>
    <div className="p-4 font-mono text-sm leading-relaxed overflow-hidden">
       <div className="text-[#c678dd]">function <span className="text-[#61afef]">init</span>() {'{'}</div>
       <div className="pl-4 text-[#98c379]">{'// ' + content}</div>
       <div className="pl-4 text-[#e5c07b]">await <span className="text-[#61afef]">deploy</span>();</div>
       <div className="text-[#c678dd]">{'}'}</div>
    </div>
  </div>
);
