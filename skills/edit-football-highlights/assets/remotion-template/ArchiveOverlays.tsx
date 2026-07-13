import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const ArchiveTexture: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 1.7) % 18;
  const pulse = 0.022 + Math.abs(Math.sin(frame * 0.71)) * 0.018;
  return (
    <>
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 46%, rgba(0,0,0,0.48) 100%)'}} />
      <AbsoluteFill style={{
        pointerEvents: 'none',
        opacity: pulse,
        translate: `${drift}px ${-drift / 2}px`,
        backgroundImage: 'repeating-linear-gradient(7deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 1px, transparent 1px, transparent 4px)',
        mixBlendMode: 'screen',
      }} />
    </>
  );
};

export const CornerMark: React.FC<{label: string; accent?: string}> = ({label, accent = '#d71920'}) => (
  <div style={{
    position: 'absolute',
    top: 42,
    right: 58,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontFamily: '"Microsoft YaHei", Arial, sans-serif',
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.72)',
    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
  }}>
    <span style={{width: 28, height: 3, background: accent}} />
    {label}
  </div>
);

export const ChapterCard: React.FC<{title: string; detail?: string; accent?: string}> = ({
  title,
  detail,
  accent = '#d6b15c',
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 9, 82, 102], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{position: 'absolute', left: 62, bottom: 54, display: 'flex', opacity}}>
      <div style={{width: 8, background: accent}} />
      <div style={{
        minWidth: 390,
        maxWidth: 670,
        padding: '18px 26px 20px',
        background: 'rgba(7,7,7,0.86)',
        border: '1px solid rgba(255,255,255,0.1)',
        fontFamily: '"Microsoft YaHei", Arial, sans-serif',
        color: 'white',
      }}>
        <div style={{fontSize: 38, lineHeight: 1.1, fontWeight: 900, letterSpacing: 2}}>{title}</div>
        {detail ? <div style={{marginTop: 10, fontSize: 25, lineHeight: 1.3, color: 'rgba(255,255,255,0.78)'}}>{detail}</div> : null}
      </div>
    </div>
  );
};
