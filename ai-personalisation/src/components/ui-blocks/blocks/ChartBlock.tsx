import React from 'react';
import { spring } from 'remotion';

export const ChartBlock: React.FC<{ fps: number, frame: number, themeColor: string, blockScale: number, blockOpacity: number }> = ({ fps, frame, themeColor, blockScale, blockOpacity }) => (
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
