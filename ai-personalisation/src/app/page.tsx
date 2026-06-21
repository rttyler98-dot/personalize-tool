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
    <main className="flex flex-col items-center pb-24 font-sans">

      {/* Hero Section */}
      <section className="w-full pt-20 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Now with Gemini 1.5 Flash</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6 leading-tight">
            Stop losing leads.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              Start personalising videos.
            </span>
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Generate 7-second, highly engaging SaaS video ads tailored instantly to your prospect&apos;s specific pain points and goals.
          </p>
        </div>
      </section>

      {/* Main App Section */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Form (5 columns wide) */}
          <div className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200 dark:border-neutral-800">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                Generate Your Ad
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Describe your target user and let AI build a bespoke video template.
              </p>
            </div>

            <div className="mb-6">
              <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                Try a preset
              </div>
              <div className="flex gap-2 flex-wrap">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className="px-3 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full transition-colors border border-neutral-200 dark:border-neutral-700"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Target Company / Prospect Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corp or Alice"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Their Core Problem or Goal
                </label>
                <textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. They struggle with slow deployment times and need a faster CI/CD pipeline."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none shadow-sm"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium flex items-start">
                  <span className="mr-2">⚠️</span> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
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
              </button>
            </form>
          </div>

          {/* Right Column: Video Preview (7 columns wide) */}
          <div id="video-preview" className="lg:col-span-7 flex flex-col items-center xl:sticky xl:top-24">

            {/* Browser mock wrapper */}
            <div className="w-full bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="bg-neutral-100 dark:bg-neutral-950 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-4 flex-1 bg-white dark:bg-neutral-900 rounded-md py-1 px-3 text-xs text-neutral-400 text-center font-mono truncate">
                  vivid-ads.app/preview/{videoData?.name ? encodeURIComponent(videoData.name.toLowerCase().replace(/\s+/g, '-')) : 'draft'}
                </div>
              </div>

              <div className="w-full aspect-video bg-neutral-900 relative flex items-center justify-center group overflow-hidden">
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 bg-neutral-100 dark:bg-neutral-900">
                    <div className="w-20 h-20 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow-lg mb-6 border border-neutral-200 dark:border-neutral-700">
                      <Play className="w-8 h-8 text-neutral-300 dark:text-neutral-600 ml-1" />
                    </div>
                    <p className="text-lg font-medium text-neutral-600 dark:text-neutral-400">Ready to generate</p>
                    <p className="text-sm mt-1 text-neutral-400">Your resulting video will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {videoData && (
              <div className="w-full mt-6 grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm text-center">
                  <div className="text-xs text-neutral-500 mb-1 font-semibold uppercase">Duration</div>
                  <div className="font-mono font-medium text-neutral-900 dark:text-white">00:07.00</div>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm text-center">
                  <div className="text-xs text-neutral-500 mb-1 font-semibold uppercase">Format</div>
                  <div className="font-mono font-medium text-neutral-900 dark:text-white">1080p60</div>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm text-center">
                  <div className="text-xs text-neutral-500 mb-1 font-semibold uppercase">Blocks</div>
                  <div className="font-mono font-medium text-neutral-900 dark:text-white">{videoData.uiBlocks?.length || 0}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section className="w-full max-w-5xl mx-auto mt-32 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why use Vivid Ads?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">Our unique architecture generates not just text, but fully composed UI mockups on the fly.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Powered by Gemini 1.5 Flash, the entire script and UI composition takes milliseconds to generate.</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
              <Layout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Generative UI</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Instead of rigid templates, the AI builds custom React layouts (dashboards, chats, heroes) matching the user&apos;s intent.</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Remotion Render</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Preview in real-time in the browser, then deploy to a serverless lambda architecture for mass MP4 rendering.</p>
          </div>
        </div>
      </section>

    </main>
  );
}
