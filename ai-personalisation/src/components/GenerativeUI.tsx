import React from 'react';
import { UIBlock, GenerativeBlock } from './ui-blocks/GenerativeBlock';

export type { UIBlock };

export const GenerativeUI: React.FC<{ blocks: UIBlock[], themeColor: string }> = ({ blocks, themeColor }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      {blocks.map((block, index) => (
         <GenerativeBlock key={index} block={block} index={index} themeColor={themeColor} />
      ))}
    </div>
  );
};
