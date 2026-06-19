import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, cancelRender, continueRender, delayRender } from 'remotion';
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

  return (
    <AbsoluteFill className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 flex items-center justify-center font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>

      {/* Scene 1: The Hook (0 - 150 frames, approx 5 seconds) */}
      <Sequence from={0} durationInFrames={150}>
        <SceneText text={hook} type="hook" fps={fps} animationData={animationData} />
      </Sequence>

      {/* Scene 2: The Value Proposition (150 - 300 frames, approx 5 seconds) */}
      <Sequence from={150} durationInFrames={150}>
        <SceneText text={valueProp} type="valueProp" fps={fps} />
      </Sequence>

      {/* Scene 3: Call to Action (300 - 450 frames, approx 5 seconds) */}
      <Sequence from={300} durationInFrames={150}>
        <SceneText text={cta} type="cta" fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

const SceneText: React.FC<{ text: string, type: 'hook' | 'valueProp' | 'cta', fps: number, animationData?: any }> = ({ text, type, fps, animationData }) => {
  const frame = useCurrentFrame();

  // Entrance animation for the container
  const scale = spring({
    fps,
    frame,
    config: { damping: 14, mass: 0.8 },
  });

  // Fade in for the text
  const opacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Slide up for the message
  const translateY = interpolate(frame, [10, 30], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit animation (fade out before the scene ends)
  // Assuming each scene is 150 frames, we start fading out at frame 130
  const exitOpacity = interpolate(frame, [130, 145], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const getStyle = () => {
    switch(type) {
      case 'hook': return "text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6 drop-shadow-lg";
      case 'valueProp': return "text-4xl md:text-5xl text-white leading-relaxed font-medium";
      case 'cta': return "text-5xl md:text-6xl font-bold text-white bg-indigo-600 px-12 py-6 rounded-full shadow-[0_0_40px_rgba(79,70,229,0.5)]";
    }
  }

  return (
    <AbsoluteFill className="flex items-center justify-center p-12">
      <div
        style={{ transform: `scale(${scale})`, opacity: exitOpacity }}
        className={`bg-black/40 backdrop-blur-xl rounded-3xl p-16 shadow-2xl border border-white/10 text-center max-w-4xl w-full flex flex-col items-center justify-center ${type === 'cta' ? 'border-indigo-500/50' : ''}`}
      >
        {/* Lottie Animation only in the hook scene for now */}
        {type === 'hook' && animationData && (
          <div className="w-64 h-64 mb-8">
            <Lottie animationData={animationData} />
          </div>
        )}

        <h1
          style={{ opacity, transform: `translateY(${translateY}px)` }}
          className={getStyle()}
        >
          {text}
        </h1>
      </div>
    </AbsoluteFill>
  );
};