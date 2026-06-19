"use client";

import { useState } from "react";
import { Player } from "@remotion/player";
import { VideoComposition, VideoCompositionProps } from "@/components/VideoComposition";
import { Loader2, Wand2 } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoData, setVideoData] = useState<VideoCompositionProps | null>(null);
  const [error, setError] = useState("");

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
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Form */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-xl border border-neutral-200 dark:border-neutral-800">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-4">
              AI SaaS Ad Generator
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Create a unique, 15-second personalized video ad tailored to your audience using AI.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Recipient&apos;s Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                User&apos;s Pain Point or Goal (Explain in Detail)
              </label>
              <textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Explain the specific struggles, what you've tried before, and what your ultimate goal is. The more detail, the better the AI can personalize the ad!"
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Script & Video...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate SaaS Ad
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Video Preview */}
        <div className="sticky top-12 flex flex-col items-center">
          <div className="w-full aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-2xl border border-neutral-300 dark:border-neutral-700 relative flex items-center justify-center">
            {videoData ? (
              <Player
                component={VideoComposition}
                inputProps={videoData}
                durationInFrames={900} // 15 seconds at 60fps
                fps={60}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                controls
                autoPlay
                loop
              />
            ) : (
              <div className="text-center p-8 flex flex-col items-center text-neutral-500 dark:text-neutral-400">
                <Wand2 className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Your SaaS Ad will appear here</p>
                <p className="text-sm mt-2">Fill out the form and hit generate!</p>
              </div>
            )}
          </div>
          {videoData && (
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800">
              Previewing 15s Ad for {videoData.name}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}