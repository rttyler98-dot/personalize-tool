import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { HeaderBlock } from './blocks/HeaderBlock';
import { StatBlock } from './blocks/StatBlock';
import { ChartBlock } from './blocks/ChartBlock';
import { CodeLineBlock } from './blocks/CodeLineBlock';
import { ChatMessageBlock } from './blocks/ChatMessageBlock';
import { TaskItemBlock } from './blocks/TaskItemBlock';
import { CodeEditorBlock } from './blocks/CodeEditorBlock';
import { IPhoneFrameBlock } from './blocks/IPhoneFrameBlock';
import { SocialPostBlock } from './blocks/SocialPostBlock';

export interface UIBlock {
  type: 'header' | 'stat' | 'chart' | 'code_line' | 'chat_message' | 'task_item' | 'code_editor' | 'iphone_frame' | 'social_post';
  content: string;
  label?: string;
}

export const GenerativeBlock: React.FC<{ block: UIBlock, index: number, themeColor: string }> = ({ block, index, themeColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blockScale = spring({
    fps,
    frame: Math.max(0, frame - 15 - (index * 5)),
    config: { damping: 14, stiffness: 200 },
  });

  const blockOpacity = interpolate(frame, [10 + (index * 5), 20 + (index * 5)], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
  });

  switch (block.type) {
    case 'header':
      return <HeaderBlock content={block.content} themeColor={themeColor} blockScale={blockScale} blockOpacity={blockOpacity} />;
    case 'stat':
      return <StatBlock content={block.content} label={block.label} themeColor={themeColor} blockScale={blockScale} blockOpacity={blockOpacity} />;
    case 'chart':
      return <ChartBlock fps={fps} frame={frame} themeColor={themeColor} blockScale={blockScale} blockOpacity={blockOpacity} />;
    case 'code_line':
      return <CodeLineBlock content={block.content} index={index} blockScale={blockScale} blockOpacity={blockOpacity} />;
    case 'chat_message':
      return <ChatMessageBlock content={block.content} blockScale={blockScale} blockOpacity={blockOpacity} />;
    case 'task_item':
      return <TaskItemBlock content={block.content} blockScale={blockScale} blockOpacity={blockOpacity} />;
    case 'code_editor':
      return <CodeEditorBlock content={block.content} blockScale={blockScale} blockOpacity={blockOpacity} />;
    case 'iphone_frame':
      return <IPhoneFrameBlock content={block.content} themeColor={themeColor} blockScale={blockScale} blockOpacity={blockOpacity} />;
    case 'social_post':
      return <SocialPostBlock content={block.content} label={block.label} blockScale={blockScale} blockOpacity={blockOpacity} />;
    default:
      return null;
  }
}
