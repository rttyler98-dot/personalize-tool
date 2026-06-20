import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface MockUIProps {
  uiText?: string[];
}

const defaultText = ["Item 1", "Item 2", "Item 3"];

// ==========================================
// 1. Dashboard UI (Analytics / SaaS)
// ==========================================
export const MockDashboard: React.FC<MockUIProps> = ({ uiText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const texts = uiText || defaultText;

  const scale = spring({
    fps,
    frame: frame - 30, // Faster entrance
    config: { damping: 14, mass: 1, stiffness: 200 },
  });

  const opacity = interpolate(frame - 30, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const bars = [40, 70, 45, 90, 60, 100, 80];

  return (
    <div
      className="w-[600px] h-[360px] bg-neutral-900/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_30px_100px_-20px_rgba(79,70,229,0.4)] overflow-hidden flex flex-col"
      style={{ transform: `scale(${scale})`, opacity }}
    >
      <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        <div className="ml-4 w-24 h-2 bg-white/10 rounded-full"></div>
      </div>
      <div className="flex-1 flex p-6 gap-6">
        <div className="w-1/3 flex flex-col gap-4 border-r border-white/5 pr-4 justify-center">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500" /><div className="text-white/80 text-sm truncate">{texts[0]}</div></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><div className="text-white/80 text-sm truncate">{texts[1]}</div></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-500" /><div className="text-white/80 text-sm truncate">{texts[2]}</div></div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-neutral-400 text-xs mb-1 uppercase tracking-wider">{texts[0]}</div>
              <div className="text-3xl font-light text-white tracking-tight">84.2k</div>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
              +14%
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 mt-4">
            {bars.map((height, i) => {
              const barHeight = spring({
                fps,
                frame: frame - 50 - (i * 3),
                config: { damping: 12, stiffness: 200 },
              });
              return (
                <div key={i} className="flex-1 bg-indigo-500/30 rounded-t-sm relative overflow-hidden" style={{ height: '100%' }}>
                  <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm" style={{ height: `${height * barHeight}%` }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. Code Editor UI (DevTools / DevOps)
// ==========================================
export const MockCodeEditor: React.FC<MockUIProps> = ({ uiText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const texts = uiText || defaultText;

  const scale = spring({
    fps,
    frame: frame - 30,
    config: { damping: 14, mass: 1, stiffness: 200 },
  });

  const opacity = interpolate(frame - 30, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div
      className="w-[600px] h-[360px] bg-[#1E1E1E]/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_30px_100px_-20px_rgba(56,189,248,0.3)] overflow-hidden flex flex-col font-mono"
      style={{ transform: `scale(${scale})`, opacity }}
    >
      <div className="h-10 bg-black/40 flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-4 text-neutral-400 text-xs">app.ts</div>
      </div>
      <div className="p-6 text-sm leading-relaxed overflow-hidden">
        <div className="text-pink-400">import <span className="text-white">{'{'}</span> App <span className="text-white">{'}'}</span> from <span className="text-green-300">&apos;./main&apos;</span>;</div>
        <div className="mt-2 text-blue-400">function <span className="text-yellow-200">execute</span><span className="text-white">() {'{'}</span></div>
        <div className="mt-2 pl-4 text-neutral-500">{`// ${texts[0]}`}</div>
        <div className="pl-4 text-white"><span className="text-blue-300">await</span> <span className="text-yellow-200">App</span>.<span className="text-blue-300">init</span>();</div>
        <div className="mt-2 pl-4 text-neutral-500">{`// ${texts[1]}`}</div>
        <div className="pl-4 text-white"><span className="text-blue-300">const</span> result <span className="text-white">=</span> <span className="text-blue-300">await</span> <span className="text-yellow-200">App</span>.<span className="text-blue-300">run</span>();</div>
        <div className="mt-2 pl-4 text-neutral-500">{`// ${texts[2]}`}</div>
        <div className="pl-4 text-white"><span className="text-yellow-200">console</span>.<span className="text-blue-300">log</span>(result);</div>
        <div className="text-white">{'}'}</div>
      </div>
    </div>
  );
};

// ==========================================
// 3. Chat / Messaging UI (Communication/AI)
// ==========================================
export const MockChatUI: React.FC<MockUIProps> = ({ uiText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const texts = uiText || defaultText;

  const scale = spring({
    fps,
    frame: frame - 30,
    config: { damping: 14, mass: 1, stiffness: 200 },
  });

  const opacity = interpolate(frame - 30, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Staggered chat bubbles
  const bubble1Scale = spring({ fps, frame: frame - 40, config: { damping: 12 } });
  const bubble2Scale = spring({ fps, frame: frame - 60, config: { damping: 12 } });
  const bubble3Scale = spring({ fps, frame: frame - 80, config: { damping: 12 } });

  return (
    <div
      className="w-[400px] h-[400px] bg-neutral-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_30px_100px_-20px_rgba(236,72,153,0.3)] flex flex-col"
      style={{ transform: `scale(${scale})`, opacity }}
    >
      <div className="h-16 border-b border-white/10 flex items-center px-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500"></div>
        <div className="ml-4">
          <div className="text-white font-medium">Assistant</div>
          <div className="text-green-400 text-xs">Online</div>
        </div>
      </div>
      <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
        <div className="self-end max-w-[80%] bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none text-sm" style={{ transform: `scale(${bubble1Scale})`, transformOrigin: 'top right' }}>
          {texts[0]}
        </div>
        <div className="self-start max-w-[80%] bg-neutral-800 text-white p-3 rounded-2xl rounded-tl-none text-sm" style={{ transform: `scale(${bubble2Scale})`, transformOrigin: 'top left' }}>
          {texts[1]}
        </div>
        <div className="self-end max-w-[80%] bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none text-sm" style={{ transform: `scale(${bubble3Scale})`, transformOrigin: 'top right' }}>
          {texts[2]}
        </div>
      </div>
      <div className="h-16 border-t border-white/10 flex items-center px-4 gap-2">
        <div className="flex-1 h-10 bg-neutral-800 rounded-full border border-white/5"></div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">↑</div>
      </div>
    </div>
  );
};


// ==========================================
// 4. Clean CTA Input (Used in Final Scene)
// ==========================================
export const MockInputCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const translateY = spring({
    fps,
    frame: frame - 45,
    config: { damping: 14, mass: 1, stiffness: 200 },
    from: 100,
    to: 0,
  });

  const opacity = interpolate(frame - 45, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div
      className="mt-16 flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-6 shadow-2xl"
      style={{ transform: `translateY(${translateY}px)`, opacity }}
    >
      <div className="text-white/40 text-xl font-light mr-8">name@company.com</div>
      <div className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
        Get Started
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </div>
    </div>
  );
};