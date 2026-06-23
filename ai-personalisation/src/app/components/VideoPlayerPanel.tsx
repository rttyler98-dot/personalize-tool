import React from 'react';
import { Player } from '@remotion/player';
import { Play } from 'lucide-react';
import { VideoCompositionProps, VideoComposition } from '../../components/VideoComposition';

interface VideoPlayerPanelProps {
  videoData: VideoCompositionProps | null;
}

export default function VideoPlayerPanel({ videoData }: VideoPlayerPanelProps) {
  return (
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
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none"></div>
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
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/50">
                Download MP4
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl border border-white/10 transition-colors">
                Copy Link
            </button>
        </div>
      )}
    </div>
  );
}
