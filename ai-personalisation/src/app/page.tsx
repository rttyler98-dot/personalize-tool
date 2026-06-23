"use client";

import { useState } from 'react';
import { Sparkles, Play } from 'lucide-react';
import { VideoCompositionProps } from '../components/VideoComposition';
import GeneratorForm from './components/GeneratorForm';
import BatchUploader from './components/BatchUploader';
import VideoPlayerPanel from './components/VideoPlayerPanel';
import QueueSidebar from './components/QueueSidebar';

export default function Home() {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [videoData, setVideoData] = useState<VideoCompositionProps | null>(null);
  const [batchJobs, setBatchJobs] = useState<VideoCompositionProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name || !topic) {
      setError('Please provide both a name and a topic.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, topic }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate message');
      }

      const data = await res.json();

      const newVideoData = {
        name,
        hook: data.hook,
        valueProp: data.valueProp,
        cta: data.cta,
        themeColor: data.themeColor,
        fontStyle: data.fontStyle,
        animationStyle: data.animationStyle,
        uiBlocks: data.uiBlocks,
      };

      setVideoData(newVideoData);

      // If generated individually, also add it to the queue to view later
      setBatchJobs(prev => [newVideoData, ...prev]);

      setTimeout(() => {
        document.getElementById('video-preview')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsBatchProcessing(true);
    setError(null);

    try {
        const text = await file.text();
        const rows = text.split('\n').filter(row => row.trim() !== '');

        const newBatchJobs: VideoCompositionProps[] = [];

        for (let i = 1; i < rows.length; i++) {
            const [csvName, csvTopic] = rows[i].split(',').map(item => item?.trim());
            if (csvName && csvTopic) {
                const res = await fetch('/api/generate-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: csvName, topic: csvTopic }),
                });

                if (res.ok) {
                    const data = await res.json();
                    newBatchJobs.push({
                        name: csvName,
                        hook: data.hook,
                        valueProp: data.valueProp,
                        cta: data.cta,
                        themeColor: data.themeColor,
                        fontStyle: data.fontStyle,
                        animationStyle: data.animationStyle,
                        uiBlocks: data.uiBlocks,
                    });
                }
            }
        }

        setBatchJobs(prev => [...newBatchJobs, ...prev]);

        if (newBatchJobs.length > 0) {
            setVideoData(newBatchJobs[0]);
        }

    } catch (err) {
        console.error("Batch processing error", err);
        setError("Failed to process the CSV file.");
    } finally {
        setIsBatchProcessing(false);
        if (e.target) e.target.value = '';
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center pb-24">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-20 text-center relative z-10 mt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-300 mb-8 shadow-inner">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Now with Gemini 1.5 Flash</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
          Stop losing leads. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
            Start personalising.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Generate 7-second, highly engaging SaaS video ads tailored instantly to your prospect&apos;s specific pain points and goals.
        </p>
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

            <GeneratorForm
              name={name} setName={setName}
              topic={topic} setTopic={setTopic}
              isGenerating={isGenerating}
              isBatchProcessing={isBatchProcessing}
              error={error}
              handleGenerate={handleGenerate}
            />

            <BatchUploader
               isGenerating={isGenerating}
               isBatchProcessing={isBatchProcessing}
               batchJobsCount={batchJobs.length}
               onUpload={handleFileUpload}
            />
          </div>

          <VideoPlayerPanel videoData={videoData} />

          <QueueSidebar batchJobs={batchJobs} videoData={videoData} setVideoData={setVideoData} />

        </div>
      </section>
    </main>
  );
}
