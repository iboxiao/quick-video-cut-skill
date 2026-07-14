# Chinese social publishing package

Generate this package only after verifying the year, teams, competition or round, score, goals, major incidents, and principal players from the footage or an authoritative match report.

## Main title

Use the user's requested format when provided. The series default is:

```text
<年份> <对阵方A>x<对阵方B>-<比赛名称或轮次>-回顾
```

Example:

```text
2024 西班牙x法国-欧洲杯半决赛-回顾
```

Keep the title factual and compact. Do not add unverified superlatives, invented controversies, or players who do not appear in the match.

## Summary subtitle

Write one concise Chinese paragraph, normally two to four sentences. Include:

1. how the score developed;
2. the decisive goals, saves, conflict, shootout, or turning point;
3. why the result mattered in the competition or series.

Prefer specific football events over generic praise. Use the same Chinese player-name spellings as the burned-in subtitles.

## Five player topics

Output exactly five players, each beginning with `#`, on one line unless the user requests another layout.

Choose players with the strongest connection to the finished story:

- goalscorers or decisive penalty takers;
- assist providers or chance creators;
- goalkeepers with major saves;
- central figures in a card, foul, or confrontation;
- captains or star players whose performance materially shaped the match.

Do not choose five famous names merely for reach. Every topic must be supported by the actual match.

## Delivery format

Return the copy in this order so it can be pasted directly:

```text
主标题

总结性副标题段落

#球员一 #球员二 #球员三 #球员四 #球员五
```
