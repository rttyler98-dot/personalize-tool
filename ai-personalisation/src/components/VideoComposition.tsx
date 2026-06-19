import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Audio } from 'remotion';
import { MockDashboard, MockInputCTA } from './MockUI';

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
  return (
    <AbsoluteFill className="bg-black font-sans overflow-hidden">

      {/*
        Sleek, minimalist "Apple-style" dynamic background.
      */}
      <DynamicBackground />

      {/* Scene 1: The Hook (Text only, dramatic setup) */}
      <Sequence from={0} durationInFrames={300}>
        <Audio src={hookAudioSrc} />
        <SceneText text={hook} fps={fps} />
      </Sequence>

      {/* Scene 2: The Value Proposition (Text + Dashboard UI) */}
      <Sequence from={300} durationInFrames={300}>
        <Audio src={valuePropAudioSrc} />
        <SceneText text={valueProp} fps={fps} showDashboard />
      </Sequence>

      {/* Scene 3: Call to Action (Text + CTA Input UI) */}
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

const SceneText: React.FC<{ text: string, fps: number, isCTA?: boolean, showDashboard?: boolean }> = ({ text, fps, isCTA, showDashboard }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');

  // Calculate Layout Adjustments
  // If we have UI elements, we want to push the text up slightly
  const layoutTranslateY = (isCTA || showDashboard) ? -120 : 0;

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center p-16">

      {/* Kinetic Text Layer */}
      <div
        className="relative z-20 flex flex-wrap justify-center gap-x-8 gap-y-4 text-center max-w-6xl transition-transform duration-1000"
        style={{ transform: `translateY(${layoutTranslateY}px)` }}
      >
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

      {/* UI Layers */}

      {/* Dashboard appears below text in Scene 2 */}
      {showDashboard && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-16 z-10">
          <MockDashboard />
        </div>
      )}

      {/* CTA Input appears below text in Scene 3 */}
      {isCTA && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-16 z-30">
          <MockInputCTA />
        </div>
      )}

    </AbsoluteFill>
  );
};