import React from 'react';

export const IPhoneFrameBlock: React.FC<{ content: string, themeColor: string, blockScale: number, blockOpacity: number }> = ({ content, themeColor, blockScale, blockOpacity }) => (
  <div
    className="w-[280px] h-[580px] bg-black rounded-[40px] border-[12px] border-neutral-800 shadow-2xl relative flex flex-col"
    style={{ transform: `scale(${blockScale})`, opacity: blockOpacity }}
  >
     <div className="absolute top-0 inset-x-0 h-6 bg-neutral-800 rounded-b-3xl mx-16 z-20"></div>
     <div className="flex-1 bg-white rounded-[28px] overflow-hidden flex flex-col">
        <div className="bg-neutral-100 pt-10 pb-4 px-4 border-b border-neutral-200">
            <div className="text-lg font-bold text-black text-center">{content}</div>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-3 relative overflow-hidden">
            <div className="w-full h-24 bg-neutral-200 rounded-xl animate-pulse"></div>
            <div className="w-3/4 h-8 bg-neutral-200 rounded-xl animate-pulse"></div>
            <div className="w-full h-32 bg-neutral-200 rounded-xl animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: themeColor }}>
               <div className="w-4 h-4 border-t-2 border-r-2 border-white transform rotate-45 mb-1 mr-1"></div>
            </div>
        </div>
     </div>
  </div>
);
