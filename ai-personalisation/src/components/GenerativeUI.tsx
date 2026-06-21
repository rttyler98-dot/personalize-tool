import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface UIBlock {
  type: 'header' | 'stat' | 'chart' | 'code_line' | 'chat_message' | 'task_item';
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
    default:
      return null;
  }
}