import React, { useRef } from 'react';
import { Loader2, Upload, List } from 'lucide-react';

interface BatchUploaderProps {
  isGenerating: boolean;
  isBatchProcessing: boolean;
  batchJobsCount: number;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BatchUploader({
  isGenerating, isBatchProcessing, batchJobsCount, onUpload
}: BatchUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-8 pt-8 border-t border-white/10">
      <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
        <List className="w-4 h-4 text-cyan-400" />
        Batch Generation
      </h3>
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={onUpload}
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
      {batchJobsCount > 0 && (
          <p className="text-xs text-neutral-500 text-center mt-3">
              {batchJobsCount} videos generated in batch.
          </p>
      )}
    </div>
  );
}
