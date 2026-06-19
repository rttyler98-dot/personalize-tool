import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, cancelRender, continueRender, delayRender, Audio } from 'remotion';
import { Lottie } from '@remotion/lottie';

export interface VideoCompositionProps {
  name: string;
  hook: string;
  valueProp: string;
  cta: string;
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ name, hook, valueProp, cta }) => {
  const { fps } = useVideoConfig();
  const [animationData, setAnimationData] = useState<any>(null);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    // Fetch the Lottie animation JSON
    fetch('/lottie/animation.json')
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data);
        continueRender(handle);
      })
      .catch((err) => {
        console.error('Failed to load lottie animation', err);
        cancelRender(handle);
      });
  }, [handle]);

  // Use TTS endpoint for audio.
  // We URI encode the text to pass it safely via GET.
  const hookAudioSrc = `/api/tts?text=${encodeURIComponent(hook)}`;
  const valuePropAudioSrc = `/api/tts?text=${encodeURIComponent(valueProp)}`;
  const ctaAudioSrc = `/api/tts?text=${encodeURIComponent(cta)}`;

  return (
    <AbsoluteFill className="bg-black font-sans overflow-hidden">

      {/* Scene 1: The Hook (0 - 150 frames, approx 5 seconds) */}
      <Sequence from={0} durationInFrames={150}>
        <Audio src={hookAudioSrc} />
        <SceneText text={hook} type="hook" fps={fps} animationData={animationData} />
      </Sequence>

      {/* Scene 2: The Value Proposition (150 - 300 frames, approx 5 seconds) */}
      <Sequence from={150} durationInFrames={150}>
        <Audio src={valuePropAudioSrc} />
        <SceneText text={valueProp} type="valueProp" fps={fps} />
      </Sequence>

      {/* Scene 3: Call to Action (300 - 450 frames, approx 5 seconds) */}
      <Sequence from={300} durationInFrames={150}>
        <Audio src={ctaAudioSrc} />
        <SceneText text={cta} type="cta" fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

const SceneText: React.FC<{ text: string, type: 'hook' | 'valueProp' | 'cta', fps: number, animationData?: any }> = ({ text, type, fps, animationData }) => {
  const frame = useCurrentFrame();

  // Different background and typography animations for each scene to remove the "slide" feel

  if (type === 'hook') {
    // Hook: Split text into words for kinetic typography
    const words = text.split(' ');

    return (
      <AbsoluteFill className="bg-gradient-to-br from-blue-900 to-indigo-900 flex flex-col items-center justify-center p-16">
         {animationData && (
          <div className="w-80 h-80 mb-12 absolute opacity-30 blur-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Lottie animationData={animationData} />
          </div>
        )}
        <div className="relative z-10 flex flex-wrap justify-center gap-4 text-center max-w-5xl">
          {words.map((word, i) => {
            const wordScale = spring({
              fps,
              frame: frame - (i * 3), // staggered animation
              config: { damping: 12, mass: 0.5 },
            });
            const wordOpacity = interpolate(frame - (i * 3), [0, 5], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
            });
            return (
              <span
                key={i}
                style={{ transform: `scale(${wordScale})`, opacity: wordOpacity }}
                className="text-7xl font-black text-white uppercase tracking-tighter"
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    );
  }

  if (type === 'valueProp') {
    // Value Prop: Sliding panels and highlighting
    const slideX = spring({
      fps,
      frame,
      config: { damping: 14, mass: 1 },
    });

    const panelTranslateX = interpolate(slideX, [0, 1], [-1000, 0]);

    return (
      <AbsoluteFill className="bg-emerald-900 flex items-center p-16">
        {/* Dynamic diagonal shape in background */}
        <div
           className="absolute inset-0 bg-emerald-500 origin-bottom-left shadow-2xl"
           style={{ transform: `translateX(${panelTranslateX}px) skewX(-15deg) scaleX(1.5)` }}
        />
        <div className="relative z-10 max-w-4xl text-left pl-12">
           <h1
             style={{
               opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
               transform: `translateY(${interpolate(frame, [15, 30], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}px)`
             }}
             className="text-5xl md:text-6xl text-white font-bold leading-tight drop-shadow-xl"
           >
             {text}
           </h1>
        </div>
      </AbsoluteFill>
    );
  }

  if (type === 'cta') {
    // CTA: Pulsing scale and bright colors
    const scale = spring({
      fps,
      frame,
      config: { damping: 10, mass: 1 },
    });

    // Continuous slow pulse
    const pulse = interpolate(Math.sin(frame / 10), [-1, 1], [1, 1.05]);

    return (
      <AbsoluteFill className="bg-gradient-to-tr from-purple-900 via-pink-800 to-orange-600 flex items-center justify-center p-12">
        <div
          style={{ transform: `scale(${scale * pulse})` }}
          className="bg-white rounded-3xl p-16 shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-center max-w-4xl w-full border-4 border-white/20"
        >
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-600">
            {text}
          </h1>
          <div className="mt-12">
             <div className="inline-block px-10 py-5 bg-black text-white text-3xl font-bold rounded-full animate-bounce">
                Get Started Now
             </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  return null;
};