import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig, Audio } from 'remotion';
import { UIBlock } from './GenerativeUI';
import { DynamicBackground } from './DynamicBackground';
import { SceneText } from './SceneText';

export interface VideoCompositionProps {
  name: string;
  hook: string;
  valueProp: string;
  cta: string;
  themeColor?: string;
  fontStyle?: 'sans' | 'serif' | 'mono';
  animationStyle?: 'zoom' | 'slide' | 'fade';
  uiBlocks?: UIBlock[];
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  name,
  hook,
  valueProp,
  cta,
  themeColor = '#4f46e5',
  fontStyle = 'sans',
  animationStyle = 'zoom',
  uiBlocks = []
}) => {
  const { fps } = useVideoConfig();

  const hookAudioSrc = `/api/tts?text=${encodeURIComponent(hook)}`;
  const valuePropAudioSrc = `/api/tts?text=${encodeURIComponent(valueProp)}`;
  const ctaAudioSrc = `/api/tts?text=${encodeURIComponent(cta)}`;

  const fontClass = fontStyle === 'serif' ? 'font-serif' : fontStyle === 'mono' ? 'font-mono' : 'font-sans';

  // We bypass audio if we are missing the env var to avoid crashing the Remotion player.
  // Using a Next.js public env var check so it works on the client side during render.
  const hasAudio = false; // Temporarily disabled audio check to prevent client-side secrets leakage

  return (
    <AbsoluteFill className={`bg-black ${fontClass} overflow-hidden`}>
      <DynamicBackground themeColor={themeColor} />

      <Sequence from={0} durationInFrames={120}>
        {hasAudio && <Audio src={hookAudioSrc} />}
        <SceneText text={hook} fps={fps} animationStyle={animationStyle} />
      </Sequence>

      <Sequence from={120} durationInFrames={180}>
        {hasAudio && <Audio src={valuePropAudioSrc} />}
        <SceneText text={valueProp} fps={fps} uiBlocks={uiBlocks} themeColor={themeColor} animationStyle={animationStyle} />
      </Sequence>

      <Sequence from={300} durationInFrames={120}>
        {hasAudio && <Audio src={ctaAudioSrc} />}
        <SceneText text={cta} fps={fps} isCTA animationStyle={animationStyle} />
      </Sequence>
    </AbsoluteFill>
  );
};
