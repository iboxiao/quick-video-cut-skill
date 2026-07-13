# Football cover workflow

Create covers from authentic frames in the supplied footage. Do not invent players, kits, scorelines, or stadium scenes when source images are available.

## Select the images

1. Review the contact sheet and extract several full-resolution candidates around the strongest moments.
2. Choose a main frame with a recognizable player, confrontation, decisive action, or celebration near the center of the image.
3. Choose a second contextual frame for the documentary inset. Prefer the opposing team, the disputed incident, or the aftermath.
4. Test the main frame with a narrow center crop. Replace it if a 3:4 crop removes faces, the ball, or the main gesture.

## Build the cover

Copy `assets/remotion-template/FootballCover.tsx` into the Remotion project. Define two one-frame compositions using the same props:

- vertical: 1200×1600 pixels for a 3:4 cover;
- horizontal: 1600×1200 pixels for a 4:3 cover.

Set `teamA`, `teamB`, `seriesTitle`, `chapter`, `year`, `tournamentLine`, `archiveLabel`, `primaryImage`, `secondaryImage`, `monochrome`, and `primaryPosition` through `defaultProps`.

Use one clear hierarchy:

1. teams;
2. series title;
3. chapter badge;
4. tournament and round.

Keep the England red and Argentina sky-blue accents only when those teams are involved. For other teams, replace the two accent constants with their restrained identifying colors.

## Render and verify

Render both compositions with `npx remotion still`. Inspect the PNGs at normal size and verify:

- the aspect ratio and dimensions are exact;
- the subject remains recognizable in both crops;
- the main title can be read immediately;
- the inset does not cover a face or title;
- all text stays inside the border and safe area;
- no source watermark, subtitle, or temporary timestamp distracts from the cover.

Deliver the two PNGs with descriptive names that include the year and orientation.
