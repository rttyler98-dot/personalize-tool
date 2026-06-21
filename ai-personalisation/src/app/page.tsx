"use client";

import { useState, useRef } from "react";
import { Player } from "@remotion/player";
import { VideoComposition, VideoCompositionProps } from "@/components/VideoComposition";
import { Loader2, Wand2, Sparkles, Play, Zap, Layout, Upload, List } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoData, setVideoData] = useState<VideoCompositionProps | null>(null);
  const [error, setError] = useState("");

  // Batch generation state
  const [batchJobs, setBatchJobs] = useState<VideoCompositionProps[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // --- Batch Processing Logic ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsBatchProcessing(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        // Basic CSV parse: Name, Topic
        const rows = csvText.split('\n').filter(row => row.trim().length > 0);

        // Skip header if it exists
        const dataRows = rows[0].toLowerCase().includes('name') ? rows.slice(1) : rows;

        const newJobs: VideoCompositionProps[] = [];

        for (const row of dataRows) {
            // Simple comma split (doesn't handle quoted commas, but good for prototype)
            const cols = row.split(',');
            if (cols.length >= 2) {
                const rowName = cols[0].trim();
                const rowTopic = cols.slice(1).join(',').trim(); // Join rest in case of commas in topic

                if (rowName && rowTopic) {
                     // Call the API for each
                     const response = await fetch("/api/generate-message", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: rowName, topic: rowTopic }),
                      });
                      const data = await response.json();
                      if (response.ok) {
                          newJobs.push({
                              name: rowName,
                              hook: data.hook,
                              valueProp: data.valueProp,
                              cta: data.cta,
                              themeColor: data.themeColor,
                              fontStyle: data.fontStyle,
                              animationStyle: data.animationStyle,
                              uiBlocks: data.uiBlocks,
                          });
                          // Update state iteratively so user sees progress
                          setBatchJobs(current => [...current, newJobs[newJobs.length-1]]);
                      }
                }
            }
        }

        // Select the first one for preview if none selected
        if (newJobs.length > 0 && !videoData) {
            setVideoData(newJobs[0]);
        }

      } catch (err: any) {
         setError("Failed to process CSV. Ensure it is Name,Topic format.");
      } finally {
         setIsBatchProcessing(false);
         if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
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
      <section className="w-full max-w-[90rem] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Form (4 columns wide) */}
          <div className="lg:col-span-4 bg-neutral-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                Generate Ad
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Describe your target user and let AI build a bespoke video template in milliseconds.
              </p>
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
                  rows={3}
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
                disabled={isGenerating || isBatchProcessing}
                className="w-full relative group overflow-hidden rounded-xl mt-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2 bg-black/20 text-white font-semibold py-4 px-8 transition-all disabled:opacity-70 disabled:cursor-not-allowed backdrop-blur-sm">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
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

            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <List className="w-4 h-4 text-purple-400" />
                Batch Generation
              </h3>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBatchProcessing || isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all border border-white/10 disabled:opacity-50"
              >
                 {isBatchProcessing ? (
                     <><Loader2 className="w-4 h-4 animate-spin" /> Processing CSV...</>
                 ) : (
                     <><Upload className="w-4 h-4" /> Upload CSV (Name, Topic)</>
                 )}
              </button>
              {batchJobs.length > 0 && (
                  <p className="text-xs text-neutral-500 text-center mt-3">
                      {batchJobs.length} videos generated in batch.
                  </p>
              )}
            </div>
          </div>

          {/* Middle Column: Video Preview (5 columns wide) */}
          <div id="video-preview" className="lg:col-span-5 flex flex-col items-center xl:sticky xl:top-28">
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
                    durationInFrames={420}
                    fps={60}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    style={{ width: "100%", height: "100%" }}
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
                    <p className="text-lg font-medium text-neutral-400 relative z-10">Ready to render</p>
                  </div>
                )}
              </div>
            </div>
            {videoData && (
              <div className="w-full mt-6 grid grid-cols-2 gap-4">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-indigo-900/50">
                      Download MP4
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl border border-white/10 transition-colors">
                      Copy Link
                  </button>
              </div>
            )}
          </div>

          {/* Right Column: Batch List (3 columns wide) */}
          <div className="lg:col-span-3 bg-neutral-900/30 backdrop-blur-sm rounded-3xl p-6 border border-white/5 xl:sticky xl:top-28 xl:h-[calc(100vh-140px)] overflow-y-auto">
             <h3 className="text-lg font-semibold text-white mb-4 tracking-tight">Queue</h3>
             {batchJobs.length === 0 ? (
                 <div className="text-center py-12 text-neutral-500 text-sm">
                     No videos generated yet. <br/><br/>Upload a CSV or generate a single video to see it here.
                 </div>
             ) : (
                 <div className="space-y-3">
                     {batchJobs.map((job, idx) => (
                         <div
                            key={idx}
                            onClick={() => setVideoData(job)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${videoData?.name === job.name ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                         >
                             <div className="font-medium text-white mb-1 flex items-center justify-between">
                                 {job.name}
                                 <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                             </div>
                             <div className="text-xs text-neutral-400 truncate">{job.valueProp}</div>
                         </div>
                     ))}
                 </div>
             )}
          </div>
        </div>
      </section>
    </main>
  );
}
