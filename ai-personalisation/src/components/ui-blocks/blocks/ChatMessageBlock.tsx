import React from 'react';

export const ChatMessageBlock: React.FC<{ content: string, blockScale: number, blockOpacity: number }> = ({ content, blockScale, blockOpacity }) => (
  <div
    className="w-[400px] flex items-end gap-3 mb-2"
    style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
  >
     <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex-shrink-0"></div>
     <div className="bg-neutral-800 border border-white/10 text-white px-5 py-3 rounded-2xl rounded-bl-sm text-sm shadow-lg max-w-[85%]">
        {content}
     </div>
  </div>
);
