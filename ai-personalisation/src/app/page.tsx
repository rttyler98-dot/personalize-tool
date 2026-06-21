"use client";

import { useState } from "react";
import { Player } from "@remotion/player";
import { VideoComposition, VideoCompositionProps } from "@/components/VideoComposition";
import { Loader2, Wand2, Sparkles, Play, Zap, Layout } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoData, setVideoData] = useState<VideoCompositionProps | null>(null);
  const [error, setError] = useState("");

  const presets = [
    { name: "SaaS Analytics", topic: "My users need a fast dashboard to see their stats." },
    { name: "DevTool", topic: "Developers spend too much time debugging. They need a faster way to find errors." },
    { name: "Health App", topic: "Users want to track their daily calories and workouts easily." }
  ];

  const handlePresetClick = (preset: {name: string, topic: string}) => {
    setName(preset.name);
    setTopic(preset.topic);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !topic.trim()) {
      setError("Please fill in both fields");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, topic }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate message");
      }

      setVideoData({
        name,
        hook: data.hook,
        valueProp: data.valueProp,
        cta: data.cta,
        themeColor: data.themeColor,
        fontStyle: data.fontStyle,
        animationStyle: data.animationStyle,
        uiBlocks: data.uiBlocks,
      });

      // Auto-scroll to player on mobile
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          document.getElementById('video-preview')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex flex-col items-center pb-32 font-sans w-full">

      {/* Hero Section */}
      <section className="w-full pt-28 pb-20 px-4 text-center relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-sm font-medium mb-8 backdrop-blur-md shadow-2xl">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Now with Gemini 1.5 Flash</span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white mb-6 leading-[1.1]">
            Stop losing leads.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Start personalising.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Generate 7-second, highly engaging SaaS video ads tailored instantly to your prospect&apos;s specific pain points and goals.
          </p>
        </div>
      </section>

      {/* Main App Section */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Form (5 columns wide) */}
          <div className="lg:col-span-5 bg-neutral-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                Generate Your Ad
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Describe your target user and let AI build a bespoke video template in milliseconds.
              </p>
            </div>

            <div className="mb-8">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                Try a preset
              </div>
              <div className="flex gap-2 flex-wrap">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className="px-4 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-neutral-300 rounded-full transition-all border border-white/10 hover:border-white/20"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                  Target Company / Prospect Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corp or Alice"
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/50 text-white placeholder-neutral-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner outline-none"
                />
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-neutral-300 mb-2">
                  Their Core Problem or Goal
                </label>
                <textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. They struggle with slow deployment times and need a faster CI/CD pipeline."
                  rows={4}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/50 text-white placeholder-neutral-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none shadow-inner outline-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-start">
                  <span className="mr-2">⚠️</span> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full relative group overflow-hidden rounded-xl mt-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2 bg-black/20 text-white font-semibold py-4 px-8 transition-all disabled:opacity-70 disabled:cursor-not-allowed backdrop-blur-sm">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing & Rendering...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Video
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>

          {/* Right Column: Video Preview (7 columns wide) */}
          <div id="video-preview" className="lg:col-span-7 flex flex-col items-center xl:sticky xl:top-28">

            {/* Browser mock wrapper */}
            <div className="w-full bg-neutral-900/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

              <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                </div>
                <div className="ml-4 flex-1 bg-black/40 border border-white/5 rounded-md py-1.5 px-4 text-xs text-neutral-500 text-center font-mono truncate shadow-inner">
                  vivid-ads.app/preview/{videoData?.name ? encodeURIComponent(videoData.name.toLowerCase().replace(/\s+/g, '-')) : 'draft'}
                </div>
              </div>

              <div className="w-full aspect-video bg-black relative flex items-center justify-center group overflow-hidden">
                {videoData ? (
                  <Player
                    component={VideoComposition}
                    inputProps={videoData}
                    durationInFrames={420} // 7 seconds at 60fps
                    fps={60}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    controls
                    autoPlay
                    loop={true}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 bg-neutral-950">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none"></div>
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center shadow-lg mb-6 border border-white/10 backdrop-blur-sm relative z-10">
                      <Play className="w-8 h-8 text-neutral-500 ml-1" />
                    </div>
                    <p className="text-lg font-medium text-neutral-400 relative z-10">Ready to generate</p>
                    <p className="text-sm mt-2 text-neutral-600 relative z-10">Your resulting video will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {videoData && (
              <div className="w-full mt-6 grid grid-cols-3 gap-4">
                <div className="bg-neutral-900/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 shadow-lg text-center">
                  <div className="text-xs text-neutral-500 mb-1.5 font-semibold uppercase tracking-wider">Duration</div>
                  <div className="font-mono font-medium text-white">00:07.00</div>
                </div>
                <div className="bg-neutral-900/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 shadow-lg text-center">
                  <div className="text-xs text-neutral-500 mb-1.5 font-semibold uppercase tracking-wider">Format</div>
                  <div className="font-mono font-medium text-white">1080p60</div>
                </div>
                <div className="bg-neutral-900/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 shadow-lg text-center">
                  <div className="text-xs text-neutral-500 mb-1.5 font-semibold uppercase tracking-wider">Blocks</div>
                  <div className="font-mono font-medium text-white">{videoData.uiBlocks?.length || 0}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section className="w-full max-w-6xl mx-auto mt-40 px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight text-white">Why use Vivid Ads?</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">Our unique architecture generates not just text, but fully composed UI mockups on the fly.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-neutral-900/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:bg-neutral-900/60 transition-colors">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Lightning Fast</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">Powered by Gemini 1.5 Flash, the entire script and UI composition takes milliseconds to generate.</p>
          </div>
          <div className="bg-neutral-900/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:bg-neutral-900/60 transition-colors">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
              <Layout className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Generative UI</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">Instead of rigid templates, the AI builds custom React layouts (dashboards, chats, heroes) matching the user&apos;s intent.</p>
          </div>
          <div className="bg-neutral-900/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:bg-neutral-900/60 transition-colors">
            <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-400 mb-6 border border-pink-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Remotion Render</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">Preview in real-time in the browser, then deploy to a serverless lambda architecture for mass MP4 rendering.</p>
          </div>
        </div>
      </section>

    </main>
  );
}
