import React from 'react';

interface QueueSidebarProps {
  batchJobs: any[];
  videoData: any;
  setVideoData: (data: any) => void;
}

export default function QueueSidebar({ batchJobs, videoData, setVideoData }: QueueSidebarProps) {
  return (
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
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${videoData?.name === job.name ? 'bg-blue-600/20 border-blue-500/50' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
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
  );
}
