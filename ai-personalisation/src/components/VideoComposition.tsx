import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, cancelRender, continueRender, delayRender, Audio } from 'remotion';

export interface VideoCompositionProps {
  name: string;
  hook: string;
  valueProp: string;
  cta: string;
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ name, hook, valueProp, cta }) => {
  const { fps } = useVideoConfig();

  // Use TTS endpoint for audio.
  // We URI encode the text to pass it safely via GET.
  const hookAudioSrc = `/api/tts?text=${encodeURIComponent(hook)}`;
  const valuePropAudioSrc = `/api/tts?text=${encodeURIComponent(valueProp)}`;
  const ctaAudioSrc = `/api/tts?text=${encodeURIComponent(cta)}`;

  // 60fps timings for a 15-second total video (900 frames)
  // Scene 1: 0 - 300
  // Scene 2: 300 - 600
  // Scene 3: 600 - 900

  return (
    <AbsoluteFill className="bg-black font-sans overflow-hidden">

      {/*
        Sleek, minimalist "Apple-style" dynamic background.
        Deep blacks with a very subtle, slow-moving radial glow.
      */}
      <DynamicBackground />

      {/* Scene 1: The Hook */}
      <Sequence from={0} durationInFrames={300}>
        <Audio src={hookAudioSrc} />
        <SceneText text={hook} fps={fps} />
      </Sequence>

      {/* Scene 2: The Value Proposition */}
      <Sequence from={300} durationInFrames={300}>
        <Audio src={valuePropAudioSrc} />
        <SceneText text={valueProp} fps={fps} />
      </Sequence>

      {/* Scene 3: Call to Action */}
      <Sequence from={600} durationInFrames={300}>
        <Audio src={ctaAudioSrc} />
        <SceneText text={cta} fps={fps} isCTA />
      </Sequence>
    </AbsoluteFill>
  );
};

const DynamicBackground: React.FC = () => {
  const frame = useCurrentFrame();
  // Very slow rotation and scale for a premium, subtle feel
  const rotation = interpolate(frame, [0, 900], [0, 90]);
  const scale = interpolate(Math.sin(frame / 300), [-1, 1], [1, 1.2]);

  return (
    <AbsoluteFill className="bg-neutral-950 flex items-center justify-center">
      <div
        className="absolute w-[150vw] h-[150vw] rounded-full blur-[120px] opacity-20"
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, #171717 0deg, #4f46e5 180deg, #171717 360deg)',
          transform: `rotate(${rotation}deg) scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
}


const SceneText: React.FC<{ text: string, fps: number, isCTA?: boolean }> = ({ text, fps, isCTA }) => {
  const frame = useCurrentFrame();

  // Minimalist Kinetic Typography:
  // Words pop in quickly, sharply, and very large.
  const words = text.split(' ');

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center p-16">
      <div className="relative z-10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-center max-w-6xl">
        {words.map((word, i) => {
          // Snappy 60fps spring animation
          // Staggered rapidly (every 10 frames = ~160ms)
          const wordScale = spring({
            fps,
            frame: frame - (i * 10),
            config: { damping: 16, stiffness: 200, mass: 0.5 },
          });

          const wordOpacity = interpolate(frame - (i * 10), [0, 8], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
          });

          return (
            <span
              key={i}
              style={{ transform: `scale(${wordScale})`, opacity: wordOpacity }}
              className="text-8xl md:text-9xl font-semibold tracking-tight text-white drop-shadow-2xl"
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* For the final scene, fade in a sleek CTA button after the text finishes */}
      {isCTA && (
        <div
          className="absolute bottom-32 opacity-0"
          style={{
            opacity: interpolate(frame, [words.length * 10 + 30, words.length * 10 + 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [words.length * 10 + 30, words.length * 10 + 60], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`
          }}
        >
          <div className="px-12 py-6 bg-white text-black text-4xl font-semibold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
            Get Started
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};