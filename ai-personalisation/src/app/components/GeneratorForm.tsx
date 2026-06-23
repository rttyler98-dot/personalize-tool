import React from 'react';
import { Loader2, Wand2 } from 'lucide-react';

interface GeneratorFormProps {
  name: string;
  setName: (name: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  isGenerating: boolean;
  isBatchProcessing: boolean;
  error: string | null;
  handleGenerate: (e: React.FormEvent) => void;
}

export default function GeneratorForm({
  name, setName, topic, setTopic, isGenerating, isBatchProcessing, error, handleGenerate
}: GeneratorFormProps) {
  return (
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
          className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/50 text-white placeholder-neutral-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner outline-none"
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
          className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/50 text-white placeholder-neutral-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none shadow-inner outline-none"
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
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
  );
}
