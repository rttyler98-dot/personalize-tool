import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Audio } from 'remotion';
import { MockDashboard, MockCodeEditor, MockChatUI, MockInputCTA } from './MockUI';

export interface VideoCompositionProps {
  name: string;
  hook: string;
  valueProp: string;
  cta: string;
  uiType?: 'dashboard' | 'code' | 'chat';
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ name, hook, valueProp, cta, uiType = 'dashboard' }) => {
  const { fps } = useVideoConfig();

  const hookAudioSrc = `/api/tts?text=${encodeURIComponent(hook)}`;
  const valuePropAudioSrc = `/api/tts?text=${encodeURIComponent(valueProp)}`;
  const ctaAudioSrc = `/api/tts?text=${encodeURIComponent(cta)}`;

  return (
    <AbsoluteFill className="bg-black font-sans overflow-hidden">
      <DynamicBackground />

      <Sequence from={0} durationInFrames={180}>
        <Audio src={hookAudioSrc} />
        <SceneText text={hook} fps={fps} />
      </Sequence>

      <Sequence from={180} durationInFrames={180}>
        <Audio src={valuePropAudioSrc} />
        <SceneText text={valueProp} fps={fps} uiType={uiType} />
      </Sequence>

      <Sequence from={360} durationInFrames={180}>
        <Audio src={ctaAudioSrc} />
        <SceneText text={cta} fps={fps} isCTA />
      </Sequence>
    </AbsoluteFill>
  );
};

const DynamicBackground: React.FC = () => {
  const frame = useCurrentFrame();
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

const SceneText: React.FC<{ text: string, fps: number, isCTA?: boolean, uiType?: 'dashboard' | 'code' | 'chat' }> = ({ text, fps, isCTA, uiType }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');

  const layoutTranslateY = (isCTA || uiType) ? -120 : 0;

  const renderUI = () => {
    switch (uiType) {
      case 'dashboard': return <MockDashboard />;
      case 'code': return <MockCodeEditor />;
      case 'chat': return <MockChatUI />;
      default: return null;
    }
  }

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center p-16">

      <div
        className="relative z-20 flex flex-wrap justify-center gap-x-8 gap-y-4 text-center max-w-6xl transition-transform duration-1000"
        style={{ transform: `translateY(${layoutTranslateY}px)` }}
      >
        {words.map((word, i) => {
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

      {uiType && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-16 z-10">
          {renderUI()}
        </div>
      )}

      {isCTA && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-16 z-30">
          <MockInputCTA />
        </div>
      )}

    </AbsoluteFill>
  );
};