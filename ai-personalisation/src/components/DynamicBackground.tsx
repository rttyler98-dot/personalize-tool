import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const DynamicBackground: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 900], [0, 90]);
  const scale = interpolate(Math.sin(frame / 300), [-1, 1], [1, 1.2]);

  return (
    <AbsoluteFill className="bg-neutral-950 flex items-center justify-center">
      <div
        className="absolute w-[150vw] h-[150vw] rounded-full blur-[120px] opacity-20"
        style={{
          background: `conic-gradient(from 180deg at 50% 50%, #171717 0deg, ${themeColor} 180deg, #171717 360deg)`,
          transform: `rotate(${rotation}deg) scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
}
