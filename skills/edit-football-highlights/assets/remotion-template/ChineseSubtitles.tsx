import type {Caption} from '@remotion/captions';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from 'remotion';

type SubtitleProps = {
  captionsFile: string;
  avoidRangesMs?: Array<[number, number]>;
  normalBottom?: number;
  liftedBottom?: number;
};

const SubtitleCard: React.FC<{
  caption: Caption;
  avoidRangesMs: Array<[number, number]>;
  normalBottom: number;
  liftedBottom: number;
}> = ({caption, avoidRangesMs, normalBottom, liftedBottom}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = Math.max(1, Math.round(((caption.endMs - caption.startMs) / 1000) * fps));
  const timeMs = caption.startMs + (frame / fps) * 1000;
  const lifted = avoidRangesMs.some(([start, end]) => timeMs >= start && timeMs < end);
  const opacity = interpolate(frame, [0, 4, Math.max(5, duration - 5), duration - 1], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: lifted ? liftedBottom : normalBottom}}>
      <div style={{
        maxWidth: 1040,
        padding: '9px 22px 11px',
        borderRadius: 7,
        background: 'rgba(0,0,0,0.76)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 5px 20px rgba(0,0,0,0.56)',
        opacity,
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        fontSize: 40,
        lineHeight: 1.34,
        fontWeight: 800,
        letterSpacing: 1,
        color: '#fff',
        textAlign: 'center',
        whiteSpace: 'pre-line',
        textShadow: '0 2px 4px rgba(0,0,0,0.95)',
      }}>
        {caption.text}
      </div>
    </AbsoluteFill>
  );
};

export const ChineseSubtitles: React.FC<SubtitleProps> = ({
  captionsFile,
  avoidRangesMs = [],
  normalBottom = 52,
  liftedBottom = 198,
}) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const [handle] = useState(() => delayRender('Loading Chinese subtitles'));
  const {fps} = useVideoConfig();

  const load = useCallback(async () => {
    try {
      const response = await fetch(staticFile(captionsFile));
      if (!response.ok) throw new Error(`Could not load captions: ${response.status}`);
      setCaptions((await response.json()) as Caption[]);
      continueRender(handle);
    } catch (error) {
      cancelRender(error instanceof Error ? error : new Error(String(error)));
    }
  }, [cancelRender, captionsFile, continueRender, handle]);

  useEffect(() => { load(); }, [load]);

  const sequences = useMemo(() => captions?.map((caption, index) => (
    <Sequence
      key={`${caption.startMs}-${index}`}
      from={Math.round((caption.startMs / 1000) * fps)}
      durationInFrames={Math.max(1, Math.round(((caption.endMs - caption.startMs) / 1000) * fps))}
    >
      <SubtitleCard
        caption={caption}
        avoidRangesMs={avoidRangesMs}
        normalBottom={normalBottom}
        liftedBottom={liftedBottom}
      />
    </Sequence>
  )) ?? null, [avoidRangesMs, captions, fps, liftedBottom, normalBottom]);

  return <AbsoluteFill>{sequences}</AbsoluteFill>;
};
