import {Video} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {ChineseSubtitles} from './ChineseSubtitles';

type Props = {
  videoFile: string;
  captionsFile: string;
  avoidRangesMs?: Array<[number, number]>;
};

export const CaptionedMaster: React.FC<Props> = ({videoFile, captionsFile, avoidRangesMs = []}) => {
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Video src={staticFile(videoFile)} objectFit="cover" style={{width: '100%', height: '100%'}} />
      <ChineseSubtitles captionsFile={captionsFile} avoidRangesMs={avoidRangesMs} />
    </AbsoluteFill>
  );
};
