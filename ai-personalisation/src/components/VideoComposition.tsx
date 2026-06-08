import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface VideoCompositionProps {
  name: string;
  message: string;
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ name, message }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
        className="bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 text-center max-w-3xl w-full"
      >
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
