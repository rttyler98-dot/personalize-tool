import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface UIBlock {
  type: 'header' | 'stat' | 'chart' | 'code_line' | 'chat_message' | 'task_item' | 'code_editor' | 'iphone_frame' | 'social_post';
  content: string;
  label?: string;
}

export const GenerativeBlock: React.FC<{ block: UIBlock, index: number, themeColor: string }> = ({ block, index, themeColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blockScale = spring({
    fps,
    frame: Math.max(0, frame - 15 - (index * 5)),
    config: { damping: 14, stiffness: 200 },
  });

  const blockOpacity = interpolate(frame, [10 + (index * 5), 20 + (index * 5)], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
  });

  switch (block.type) {
    case 'header':
      return (
        <div
          className="w-[400px] bg-neutral-900/90 backdrop-blur-md rounded-t-xl border-b border-white/10 px-6 py-4 flex items-center gap-4 shadow-xl"
          style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
        >
           <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: themeColor }}>
              <div className="w-4 h-4 bg-white/90 rounded-sm"></div>
           </div>
           <div className="text-xl font-bold text-white tracking-tight">{block.content}</div>
        </div>
      );
    case 'stat':
      return (
        <div
          className="w-[400px] bg-neutral-900/80 backdrop-blur-md px-6 py-5 flex flex-col items-start border-l-4 border-b border-b-white/5 shadow-xl"
          style={{ transform: `scale(${blockScale})`, opacity: blockOpacity, borderColor: themeColor }}
        >
            <div className="text-4xl font-extrabold text-white tracking-tighter mb-1">{block.content}</div>
            <div className="text-sm font-medium text-neutral-400 uppercase tracking-widest">{block.label}</div>
        </div>
      );
    case 'chart':
      return (
        <div
          className="w-[400px] bg-neutral-900/80 backdrop-blur-md rounded-b-xl px-6 py-8 flex items-end gap-2 shadow-xl"
          style={{ transform: `scale(${blockScale})`, opacity: blockOpacity, height: '140px' }}
        >
            {[40, 70, 45, 90, 60, 100, 85].map((height, i) => {
              const barHeight = spring({
                 fps,
                 frame: Math.max(0, frame - 25 - (i * 2)),
                 config: { damping: 12 },
              });
              return (
                 <div
                   key={i}
                   className="flex-1 rounded-t-sm opacity-80"
                   style={{ height: `${height * barHeight}%`, backgroundColor: themeColor }}
                 />
              )
            })}
        </div>
      );
    case 'code_line':
      return (
        <div
          className="w-[400px] bg-black/90 backdrop-blur-md border border-white/10 px-6 py-3 font-mono text-sm shadow-xl flex items-center gap-3"
          style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
        >
          <span className="text-neutral-600 select-none">{index + 1}</span>
          <span className="text-emerald-400">{block.content}</span>
        </div>
      );
    case 'chat_message':
      return (
        <div
          className="w-[400px] flex items-end gap-3 mb-2"
          style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
        >
           <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex-shrink-0"></div>
           <div className="bg-neutral-800 border border-white/10 text-white px-5 py-3 rounded-2xl rounded-bl-sm text-sm shadow-lg max-w-[85%]">
              {block.content}
           </div>
        </div>
      );
    case 'task_item':
      return (
        <div
          className="w-[400px] bg-neutral-900/90 backdrop-blur-md border border-white/10 px-5 py-4 rounded-lg mb-2 shadow-xl flex items-center gap-4"
          style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
        >
           <div className="w-5 h-5 rounded-full border-2 border-neutral-600 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-0"></div>
           </div>
           <span className="text-white font-medium">{block.content}</span>
        </div>
      );
    case 'code_editor':
      return (
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
             <div className="pl-4 text-[#98c379]">{'// ' + block.content}</div>
             <div className="pl-4 text-[#e5c07b]">await <span className="text-[#61afef]">deploy</span>();</div>
             <div className="text-[#c678dd]">{'}'}</div>
          </div>
        </div>
      );
    case 'iphone_frame':
      return (
        <div
          className="w-[280px] h-[580px] bg-black rounded-[40px] border-[12px] border-neutral-800 shadow-2xl relative flex flex-col"
          style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
        >
           <div className="absolute top-0 inset-x-0 h-6 bg-neutral-800 rounded-b-3xl mx-16 z-20"></div>
           <div className="flex-1 bg-white rounded-[28px] overflow-hidden flex flex-col">
              <div className="bg-neutral-100 pt-10 pb-4 px-4 border-b border-neutral-200">
                  <div className="text-lg font-bold text-black text-center">{block.content}</div>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-3 relative overflow-hidden">
                  <div className="w-full h-24 bg-neutral-200 rounded-xl animate-pulse"></div>
                  <div className="w-3/4 h-8 bg-neutral-200 rounded-xl animate-pulse"></div>
                  <div className="w-full h-32 bg-neutral-200 rounded-xl animate-pulse"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: themeColor }}>
                     <div className="w-4 h-4 border-t-2 border-r-2 border-white transform rotate-45 mb-1 mr-1"></div>
                  </div>
              </div>
           </div>
        </div>
      );
    case 'social_post':
      return (
        <div
          className="w-[440px] bg-white rounded-2xl border border-neutral-200 shadow-xl p-5 flex flex-col gap-3"
          style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
        >
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500"></div>
              <div className="flex flex-col">
                 <div className="text-black font-bold text-sm leading-tight">{block.label || 'User'}</div>
                 <div className="text-neutral-500 text-xs">@{(block.label || 'user').toLowerCase().replace(' ', '')}</div>
              </div>
           </div>
           <div className="text-black text-base leading-snug">
              {block.content}
           </div>
           <div className="flex gap-6 mt-2 text-neutral-400">
               <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full border-2 border-neutral-300"></div></div>
               <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-sm border-2 border-neutral-300"></div></div>
           </div>
        </div>
      );
    default:
      return null;
  }
}
