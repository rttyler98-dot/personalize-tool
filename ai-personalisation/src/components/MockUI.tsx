import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// A sleek, abstract dashboard component
export const MockDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation for the dashboard window
  const scale = spring({
    fps,
    frame: frame - 30, // Faster entrance
    config: { damping: 14, mass: 1, stiffness: 200 },
  });

  const opacity = interpolate(frame - 30, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Animated chart bars
  const bars = [40, 70, 45, 90, 60, 100, 80];

  return (
    <div
      className="w-[600px] h-[360px] bg-neutral-900/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_30px_100px_-20px_rgba(79,70,229,0.4)] overflow-hidden flex flex-col"
      style={{ transform: `scale(${scale})`, opacity }}
    >
      {/* Fake Header */}
      <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        <div className="ml-4 w-24 h-2 bg-white/10 rounded-full"></div>
      </div>

      {/* Body */}
      <div className="flex-1 flex p-6 gap-6">
        {/* Sidebar */}
        <div className="w-1/4 flex flex-col gap-4 border-r border-white/5 pr-4">
          <div className="w-full h-3 bg-white/20 rounded-full"></div>
          <div className="w-3/4 h-3 bg-white/10 rounded-full"></div>
          <div className="w-5/6 h-3 bg-white/10 rounded-full"></div>
          <div className="w-1/2 h-3 bg-white/10 rounded-full mt-auto"></div>
        </div>

        {/* Main Content (Chart) */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <div className="w-16 h-2 bg-white/20 rounded-full mb-2"></div>
              <div className="text-3xl font-light text-white tracking-tight">84.2k</div>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
              +14%
            </div>
          </div>

          <div className="flex-1 flex items-end justify-between gap-2 mt-4">
            {bars.map((height, i) => {
              // Staggered growth animation for the bars
              const barHeight = spring({
                fps,
                frame: frame - 50 - (i * 3), // Much faster staggered entrance
                config: { damping: 12, stiffness: 200 },
              });

              return (
                <div key={i} className="flex-1 bg-indigo-500/30 rounded-t-sm relative overflow-hidden" style={{ height: '100%' }}>
                  <div
                    className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm"
                    style={{ height: `${height * barHeight}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// A clean email input component for the CTA scene
export const MockInputCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const translateY = spring({
    fps,
    frame: frame - 45, // Faster entrance for the 3s scene
    config: { damping: 14, mass: 1, stiffness: 200 },
    from: 100,
    to: 0,
  });

  const opacity = interpolate(frame - 45, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className="mt-16 flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-6 shadow-2xl"
      style={{ transform: `translateY(${translateY}px)`, opacity }}
    >
      <div className="text-white/40 text-xl font-light mr-8">name@company.com</div>
      <div className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium shadow-lg flex items-center gap-2">
        Get Started
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </div>
    </div>
  );
};