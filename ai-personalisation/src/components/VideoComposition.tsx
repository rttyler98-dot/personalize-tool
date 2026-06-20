import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Audio } from 'remotion';
import { MockDashboard, MockCodeEditor, MockChatUI, MockInputCTA } from './MockUI';

export interface VideoCompositionProps {
  name: string;
  hook: string;
  valueProp: string;
  cta: string;
  uiType?: 'dashboard' | 'code' | 'chat';
  themeColor?: string;
  fontStyle?: 'sans' | 'serif' | 'mono';
  animationStyle?: 'zoom' | 'slide' | 'fade';
  uiText?: string[];
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  name,
  hook,
  valueProp,
  cta,
  uiType = 'dashboard',
  themeColor = '#4f46e5',
  fontStyle = 'sans',
  animationStyle = 'zoom',
  uiText = ["System Status: Online", "Resolving issues...", "Success!"]
}) => {
  const { fps } = useVideoConfig();

  const hookAudioSrc = `/api/tts?text=${encodeURIComponent(hook)}`;
  const valuePropAudioSrc = `/api/tts?text=${encodeURIComponent(valueProp)}`;
  const ctaAudioSrc = `/api/tts?text=${encodeURIComponent(cta)}`;

  const fontClass = fontStyle === 'serif' ? 'font-serif' : fontStyle === 'mono' ? 'font-mono' : 'font-sans';

  return (
    <AbsoluteFill className={`bg-black ${fontClass} overflow-hidden`}>
      <DynamicBackground themeColor={themeColor} />

      <Sequence from={0} durationInFrames={180}>
        <Audio src={hookAudioSrc} />
        <SceneText text={hook} fps={fps} animationStyle={animationStyle} />
      </Sequence>

      <Sequence from={180} durationInFrames={180}>
        <Audio src={valuePropAudioSrc} />
        <SceneText text={valueProp} fps={fps} uiType={uiType} animationStyle={animationStyle} uiText={uiText} />
      </Sequence>

      <Sequence from={360} durationInFrames={180}>
        <Audio src={ctaAudioSrc} />
        <SceneText text={cta} fps={fps} isCTA animationStyle={animationStyle} />
      </Sequence>
    </AbsoluteFill>
  );
};

const DynamicBackground: React.FC<{ themeColor: string }> = ({ themeColor }) => {
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

const SceneText: React.FC<{
  text: string,
  fps: number,
  isCTA?: boolean,
  uiType?: 'dashboard' | 'code' | 'chat',
  animationStyle?: 'zoom' | 'slide' | 'fade',
  uiText?: string[]
}> = ({ text, fps, isCTA, uiType, animationStyle = 'zoom', uiText }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');

  const layoutTranslateY = (isCTA || uiType) ? -120 : 0;

  const renderUI = () => {
    switch (uiType) {
      case 'dashboard': return <MockDashboard uiText={uiText} />;
      case 'code': return <MockCodeEditor uiText={uiText} />;
      case 'chat': return <MockChatUI uiText={uiText} />;
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
          const delay = i * (animationStyle === 'fade' ? 15 : 10);
          const relativeFrame = Math.max(0, frame - delay);

          let wordTransform = '';
          let wordOpacity = 1;

          if (animationStyle === 'zoom') {
            const wordScale = spring({
              fps,
              frame: relativeFrame,
              config: { damping: 16, stiffness: 200, mass: 0.5 },
            });
            wordOpacity = interpolate(relativeFrame, [0, 8], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
            });
            wordTransform = `scale(${wordScale})`;
          } else if (animationStyle === 'slide') {
            const wordTranslateY = spring({
              fps,
              frame: relativeFrame,
              config: { damping: 20, stiffness: 150 },
              from: 100,
              to: 0
            });
            wordOpacity = interpolate(relativeFrame, [0, 10], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
            });
            wordTransform = `translateY(${wordTranslateY}px)`;
          } else if (animationStyle === 'fade') {
            wordOpacity = interpolate(relativeFrame, [0, 30], [0, 1], {
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