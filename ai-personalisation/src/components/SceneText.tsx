import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { GenerativeUI, UIBlock } from './GenerativeUI';

export const SceneText: React.FC<{
  text: string,
  fps: number,
  isCTA?: boolean,
  uiBlocks?: UIBlock[],
  themeColor?: string,
  animationStyle?: 'zoom' | 'slide' | 'fade',
}> = ({ text, fps, isCTA, uiBlocks, themeColor = '#4f46e5', animationStyle = 'zoom' }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');

  const layoutTranslateY = (isCTA || (uiBlocks && uiBlocks.length > 0)) ? -120 : 0;

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center p-16">

      <div
        className="relative z-20 flex flex-wrap justify-center gap-x-8 gap-y-4 text-center max-w-6xl transition-transform duration-1000"
        style={{ transform: `translateY(${layoutTranslateY}px)` }}
      >
        {words.map((word, i) => {
          const delay = i * (animationStyle === 'fade' ? 8 : 5);
          const relativeFrame = Math.max(0, frame - delay);

          let wordTransform = '';
          let wordOpacity = 1;

          if (animationStyle === 'zoom') {
            const wordScale = spring({
              fps,
              frame: relativeFrame,
              config: { damping: 14, stiffness: 300, mass: 0.4 },
            });
            wordOpacity = interpolate(relativeFrame, [0, 5], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
            });
            wordTransform = `scale(${wordScale})`;
          } else if (animationStyle === 'slide') {
            const wordTranslateY = spring({
              fps,
              frame: relativeFrame,
              config: { damping: 16, stiffness: 250 },
              from: 100,
              to: 0
            });
            wordOpacity = interpolate(relativeFrame, [0, 6], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
            });
            wordTransform = `translateY(${wordTranslateY}px)`;
          } else if (animationStyle === 'fade') {
            wordOpacity = interpolate(relativeFrame, [0, 15], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
            });
            wordTransform = `scale(1)`;
          }

          return (
            <span
              key={i}
              style={{ transform: wordTransform, opacity: wordOpacity }}
              className="text-8xl md:text-9xl font-semibold tracking-tight text-white drop-shadow-2xl"
            >
              {word}
            </span>
          );
        })}
      </div>

      {uiBlocks && uiBlocks.length > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-16 z-10">
          <GenerativeUI blocks={uiBlocks} themeColor={themeColor} />
        </div>
      )}

      {isCTA && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-16 z-30 flex items-center justify-center">
           <div className="w-[400px] h-16 bg-neutral-900/80 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl flex items-center px-4 justify-between" style={{boxShadow: `0 20px 40px -10px ${themeColor}60`}}>
               <div className="flex items-center gap-3 w-full">
                   <div className="w-5 h-5 rounded-full border border-white/40 opacity-50" />
                   <div className="text-white/40 text-sm font-medium">Enter your email...</div>
               </div>
               <div className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap">
                   Get Started
               </div>
           </div>
        </div>
      )}

    </AbsoluteFill>
  );
};
