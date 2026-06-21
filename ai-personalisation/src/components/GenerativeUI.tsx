import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface UIBlock {
  type: 'header' | 'stat' | 'chart' | 'code_line' | 'chat_message' | 'task_item' | 'code_editor' | 'iphone_frame' | 'social_post';
  content: string;
  label?: string;
}

export const GenerativeUI: React.FC<{ blocks: UIBlock[], themeColor: string }> = ({ blocks, themeColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame: frame - 30,
    config: { damping: 14, mass: 1, stiffness: 200 },
  });

  const opacity = interpolate(frame - 30, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div
      className="w-[600px] bg-neutral-900/80 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden flex flex-col p-6 gap-4"
      style={{
        transform: `scale(${scale})`,
        opacity,
        boxShadow: `0 30px 100px -20px ${themeColor}60` // 60 is hex alpha
      }}
    >
      {blocks.map((block, index) => (
        <GenerativeBlock key={index} block={block} index={index} themeColor={themeColor} />
      ))}
    </div>
  );
};

const GenerativeBlock: React.FC<{ block: UIBlock, index: number, themeColor: string }> = ({ block, index, themeColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stagger entry
  const blockDelay = 40 + (index * 15);
  const translateY = spring({ fps, frame: frame - blockDelay, config: { damping: 12 }, from: 20, to: 0 });
  const opacity = interpolate(frame - blockDelay, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const style = { transform: `translateY(${translateY}px)`, opacity };

  switch (block.type) {
    case 'header':
      return (
        <div style={style} className="border-b border-white/10 pb-2 mb-2">
           <div className="text-white/60 text-xs tracking-widest uppercase mb-1">Overview</div>
           <div className="text-2xl font-semibold text-white">{block.content}</div>
        </div>
      );
    case 'stat':
      return (
        <div style={style} className="flex justify-between items-end bg-black/20 p-4 rounded-xl border border-white/5">
            <div>
                <div className="text-neutral-400 text-sm mb-1">{block.label || 'Metric'}</div>
                <div className="text-4xl font-light text-white tracking-tight">{block.content}</div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500/20 text-emerald-400">↑</div>
        </div>
      );
    case 'chart':
      return (
        <div style={style} className="h-24 flex items-end gap-2 mt-2">
            {[40, 70, 45, 90, 60, 100, 80].map((h, i) => {
                const hAnim = spring({ fps, frame: frame - blockDelay - (i*3), config: { damping: 12 }, from: 0, to: h});
                return (
                    <div key={i} className="flex-1 rounded-t-sm opacity-80" style={{ height: `${hAnim}%`, backgroundColor: themeColor }} />
                )
            })}
        </div>
      );
    case 'code_line':
      return (
        <div style={style} className="font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/5">
             <span className="text-pink-400">{'❯ '}</span>
             <span className="text-blue-300">{block.content}</span>
        </div>
      );
    case 'chat_message': {
      const isUser = index % 2 === 0;
      return (
        <div style={style} className={`max-w-[85%] p-3 text-sm text-white ${isUser ? 'bg-blue-600 rounded-2xl rounded-tr-none self-end' : 'bg-neutral-800 rounded-2xl rounded-tl-none self-start border border-white/5'}`}>
            {block.content}
        </div>
      );
    }
    case 'task_item':
      return (
        <div style={style} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
            <div className="w-4 h-4 rounded border border-white/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: themeColor }} />
            </div>
            <div className="text-white text-sm">{block.content}</div>
        </div>
      );
    case 'code_editor':
      return (
        <div style={style} className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10 shadow-2xl mt-2 w-full">
          <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            <div className="ml-2 text-xs text-gray-400 font-mono">script.js</div>
          </div>
          <div className="p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-[#d4d4d4]">
            <span className="text-[#569cd6]">const</span> <span className="text-[#4fc1ff]">solution</span> <span className="text-[#d4d4d4]">=</span> <span className="text-[#c586c0]">async</span> () <span className="text-[#569cd6]">{"=>"}</span> {"{\n"}
            {"  "}<span className="text-[#569cd6]">return</span> <span className="text-[#ce9178]">&quot;{block.content}&quot;</span>{";\n"}
            {"}"}
          </div>
        </div>
      );
    case 'iphone_frame':
      return (
        <div style={style} className="flex justify-center mt-2">
            <div className="w-[280px] h-[500px] border-[8px] border-neutral-800 rounded-[40px] bg-black relative overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                <div className="absolute top-0 w-[120px] h-[25px] bg-neutral-800 rounded-b-2xl"></div>
                <div className="w-16 h-16 rounded-2xl mb-4 shadow-lg flex items-center justify-center text-3xl" style={{ backgroundColor: themeColor }}>
                    ✨
                </div>
                <div className="text-white font-semibold text-lg">{block.content}</div>
                <div className="text-neutral-500 text-sm mt-1">Ready to install</div>
            </div>
        </div>
      );
    case 'social_post':
      return (
        <div style={style} className="bg-neutral-900 rounded-2xl p-5 border border-white/10 flex gap-4 mt-2">
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xl text-white font-bold" style={{ backgroundColor: themeColor }}>
                {block.label ? block.label.charAt(0).toUpperCase() : '@'}
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">{block.label || 'User'}</span>
                    <span className="text-neutral-500 text-sm">@{block.label ? block.label.toLowerCase().replace(/\s/g, '') : 'user'}</span>
                </div>
                <div className="text-white/90 text-sm leading-relaxed">
                    {block.content}
                </div>
                <div className="flex gap-6 mt-4 text-neutral-500 text-sm">
                    <span className="flex items-center gap-1">💬 12</span>
                    <span className="flex items-center gap-1">🔁 4</span>
                    <span className="flex items-center gap-1 text-pink-500">❤️ 128</span>
                </div>
            </div>
        </div>
      );
    default:
      return null;
  }
}