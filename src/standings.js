export const isForfeit = (g) =>
  (g.score1 === 20 && g.score2 === 0) || (g.score1 === 0 && g.score2 === 20);

export function computeStandings(games, teams) {
  const s = {};
  for (const t of teams) {
    s[t.id] = { team: t, w: 0, l: 0, pf: 0, pa: 0, gp: 0, pts: 0, wo: 0 };
  }
  for (const g of games) {
    if (g.score1 === null || g.score2 === null) continue;
    const a = s[g.team1], b = s[g.team2];
    a.pf += g.score1; a.pa += g.score2; a.gp++;
    b.pf += g.score2; b.pa += g.score1; b.gp++;
    const forfeit = isForfeit(g);
    if (g.score1 > g.score2) {
      a.w++; b.l++;
      a.pts += 2;
      b.pts += forfeit ? 0 : 1;
      if (forfeit) b.wo++;
    } else {
      b.w++; a.l++;
      b.pts += 2;
      a.pts += forfeit ? 0 : 1;
      if (forfeit) a.wo++;
    }
  }

  const rows = Object.values(s);

  const h2h = (t1Id, t2Id) => {
    let w1 = 0, w2 = 0;
    for (const g of games) {
      if (g.score1 === null || g.score2 === null) continue;
      const matches = (g.team1 === t1Id && g.team2 === t2Id) || (g.team1 === t2Id && g.team2 === t1Id);
      if (!matches) continue;
      const winnerId = g.score1 > g.score2 ? g.team1 : g.team2;
      if (winnerId === t1Id) w1++; else w2++;
    }
    return w1 - w2;
  };

  return rows.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const tiedCount = rows.filter(r => r.pts === a.pts).length;
    if (tiedCount === 2) {
      const h = h2h(b.team.id, a.team.id);
      if (h !== 0) return h;
    }
    return (b.pf - b.pa) - (a.pf - a.pa);
  });
}
