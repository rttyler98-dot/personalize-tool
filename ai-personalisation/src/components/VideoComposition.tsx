import React, { useEffect, useState } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, cancelRender, continueRender, delayRender } from 'remotion';
import { Lottie } from '@remotion/lottie';

export interface VideoCompositionProps {
  name: string;
  message: string;
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ name, message }) => {
  const frame = useCurrentFrame();
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

  // Entrance animation for the container
  const scale = spring({
    fps,
    frame,
    config: {
      damping: 12,
    },
  });

  // Fade in for the text
  const opacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Slide up for the message
  const translateY = interpolate(frame, [20, 40], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-12">
      <div
        style={{ transform: `scale(${scale})` }}
        className="bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 text-center max-w-3xl w-full flex flex-col items-center"
      >
        {/* Lottie Animation at the top */}
        {animationData && (
          <div className="w-48 h-48 mb-6">
            <Lottie animationData={animationData} />
          </div>
        )}

        <h1
          style={{ opacity }}
          className="text-6xl font-bold text-white mb-6 drop-shadow-lg"
        >
          Hello, {name}!
        </h1>

        <p
          style={{ opacity, transform: `translateY(${translateY}px)` }}
          className="text-3xl text-white/90 leading-relaxed font-medium"
        >
          {message}
        </p>
      </div>
    </AbsoluteFill>
  );
};