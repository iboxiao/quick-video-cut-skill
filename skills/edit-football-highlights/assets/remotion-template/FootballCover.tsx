import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';

export type FootballCoverProps = {
  year: string;
  teamA: string;
  teamB: string;
  seriesTitle: string;
  chapter: string;
  tournamentLine: string;
  archiveLabel: string;
  primaryImage: string;
  secondaryImage: string;
  monochrome: boolean;
  primaryPosition: string;
};

const ENGLAND = '#d71920';
const ARGENTINA = '#75aadb';
const PAPER = '#f5f1e8';

export const FootballCover: React.FC<FootballCoverProps> = ({
  year,
  teamA,
  teamB,
  seriesTitle,
  chapter,
  tournamentLine,
  archiveLabel,
  primaryImage,
  secondaryImage,
  monochrome,
  primaryPosition,
}) => {
  const {width, height} = useVideoConfig();
  const vertical = height > width;

  const safe = vertical ? 72 : 82;
  const cardWidth = vertical ? 380 : 420;
  const cardHeight = vertical ? 238 : 262;

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: '#050505',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        color: PAPER,
      }}
    >
      <AbsoluteFill style={{scale: 1.12}}>
        <Img
          src={staticFile(secondaryImage)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: `${monochrome ? 'grayscale(1) ' : ''}blur(28px) brightness(0.46) contrast(1.18)`,
          }}
        />
      </AbsoluteFill>

      <Img
        src={staticFile(primaryImage)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: primaryPosition,
          filter: `${monochrome ? 'grayscale(1) sepia(0.12) ' : 'saturate(1.08) '}contrast(1.15) brightness(${vertical ? 0.78 : 0.74})`,
        }}
      />

      <AbsoluteFill
        style={{
          background: vertical
            ? 'linear-gradient(180deg, rgba(4,4,4,0.34) 0%, rgba(4,4,4,0.02) 35%, rgba(4,4,4,0.26) 54%, rgba(4,4,4,0.96) 83%, #050505 100%)'
            : 'linear-gradient(90deg, rgba(4,4,4,0.97) 0%, rgba(4,4,4,0.86) 35%, rgba(4,4,4,0.38) 58%, rgba(4,4,4,0.12) 77%, rgba(4,4,4,0.46) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.58) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 28,
          border: '2px solid rgba(245,241,232,0.34)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: safe,
          top: vertical ? 72 : 66,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: vertical ? 25 : 24,
          fontWeight: 800,
          letterSpacing: 4,
          color: 'rgba(245,241,232,0.86)',
          textShadow: '0 3px 16px rgba(0,0,0,0.9)',
        }}
      >
        <div style={{display: 'flex', gap: 8}}>
          <span style={{display: 'block', width: 42, height: 6, background: ENGLAND}} />
          <span style={{display: 'block', width: 42, height: 6, background: ARGENTINA}} />
        </div>
        {archiveLabel}
      </div>

      <div
        style={{
          position: 'absolute',
          right: safe,
          top: vertical ? 142 : 76,
          width: cardWidth,
          height: cardHeight,
          padding: 9,
          background: 'rgba(5,5,5,0.84)',
          border: '1px solid rgba(245,241,232,0.7)',
          boxShadow: '0 22px 54px rgba(0,0,0,0.56)',
        }}
      >
        <Img
          src={staticFile(secondaryImage)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: `${monochrome ? 'grayscale(1) sepia(0.1) ' : 'saturate(1.04) '}contrast(1.12)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 18,
            bottom: 15,
            padding: '8px 13px',
            background: 'rgba(0,0,0,0.78)',
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          {year}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: vertical ? 52 : 70,
          bottom: vertical ? 480 : 55,
          fontSize: vertical ? 286 : 246,
          lineHeight: 0.8,
          fontFamily: 'Arial Black, Arial, sans-serif',
          fontWeight: 900,
          letterSpacing: -14,
          color: 'rgba(245,241,232,0.1)',
        }}
      >
        {year}
      </div>

      <div
        style={{
          position: 'absolute',
          left: safe,
          right: vertical ? safe : width * 0.46,
          bottom: vertical ? 92 : 84,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textShadow: '0 7px 28px rgba(0,0,0,0.9)',
        }}
      >
        <div
          style={{
            fontSize: vertical ? 82 : 72,
            lineHeight: 1.06,
            fontWeight: 900,
            letterSpacing: 2,
            whiteSpace: 'nowrap',
          }}
        >
          {teamA} × {teamB}
        </div>

        <div
          style={{
            marginTop: vertical ? 26 : 22,
            fontSize: vertical ? 106 : 94,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: vertical ? 4 : 3,
          }}
        >
          {seriesTitle}
        </div>

        <div
          style={{
            marginTop: vertical ? 30 : 27,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
          }}
        >
          <div
            style={{
              padding: vertical ? '13px 25px 15px' : '11px 23px 13px',
              background: PAPER,
              color: '#080808',
              fontSize: vertical ? 46 : 40,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: 5,
              textShadow: 'none',
            }}
          >
            {chapter}
          </div>
          <div style={{display: 'flex', gap: 10}}>
            <span style={{display: 'block', width: vertical ? 70 : 62, height: 8, background: ENGLAND}} />
            <span style={{display: 'block', width: vertical ? 70 : 62, height: 8, background: ARGENTINA}} />
          </div>
        </div>

        <div
          style={{
            marginTop: vertical ? 29 : 24,
            fontSize: vertical ? 30 : 28,
            lineHeight: 1.2,
            fontWeight: 700,
            letterSpacing: 4,
            color: 'rgba(245,241,232,0.74)',
          }}
        >
          {tournamentLine}
        </div>
      </div>
    </AbsoluteFill>
  );
};
