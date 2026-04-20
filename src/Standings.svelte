<script>
  let { games, teams } = $props();

  const isForfeit = (g) =>
    (g.score1 === 20 && g.score2 === 0) || (g.score1 === 0 && g.score2 === 20);

  let standings = $derived.by(() => {
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
  });

  let anyPlayed = $derived(standings.some(r => r.gp > 0));
</script>

<div class="page">
  <div class="section-head">
    <h2 class="section-title">Standings</h2>
    <span class="section-sub">Regular Season</span>
  </div>

  <div class="cards">
    {#each standings as row, i}
      {@const diff = row.pf - row.pa}
      {@const top2 = i < 2}

      <div class="rank-card" class:top2 style="animation-delay: {i * 50}ms">
        <div class="rank-left">
          <span class="rank-num" class:gold={top2}>{i + 1}</span>
          <span class="team-bar" style="background:{row.team.color}"></span>
          <div class="team-info">
            <span class="team-name">{row.team.name}</span>
            <div class="record">
              <span class="record-w">{row.w}W</span>
              <span class="record-l">{row.l}L</span>
            </div>
          </div>
        </div>

        <div class="rank-right">
          {#if top2}
            <span class="playoff-badge">&#9733;</span>
          {/if}
          <div class="stat-group">
            <div class="stat-item pts-item">
              <span class="stat-num">{row.pts}</span>
              <span class="stat-lbl">PTS</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{row.gp}</span>
              <span class="stat-lbl">GP</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{row.w}</span>
              <span class="stat-lbl">W</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{row.wo}</span>
              <span class="stat-lbl">WO</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{row.pf}</span>
              <span class="stat-lbl">PF</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{row.pa}</span>
              <span class="stat-lbl">PA</span>
            </div>
            <div class="stat-item diff" class:pos={diff > 0} class:neg={diff < 0}>
              <span class="stat-num">{anyPlayed ? (diff > 0 ? '+' : '') + diff : '–'}</span>
              <span class="stat-lbl">+/–</span>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <p class="footnote">&#9733; Top 2 advance to semifinals with a bye</p>
</div>

<style>
  .page { padding: 0 1.25rem 6rem; }

  @media (min-width: 768px) {
    .page { padding: 1rem 2.5rem 2rem; max-width: 44rem; margin: 0 auto; }
  }

  .section-head {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    padding: 1rem 0 0.75rem;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--text);
  }

  .section-sub {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .rank-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
    border-radius: var(--radius);
    padding: 0.875rem 1rem;
    box-shadow: var(--shadow-sm);
    animation: card-in 0.3s ease both;
    gap: 0.5rem;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .rank-card.top2 {
    box-shadow: var(--shadow-md), 0 0 0 1.5px rgba(22, 163, 74, 0.15);
    background: linear-gradient(135deg, rgba(22,163,74,0.03), var(--surface));
  }

  .rank-left {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    min-width: 0;
  }

  .rank-num {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 1.2rem;
    color: var(--text-dim);
    min-width: 1.25rem;
    text-align: center;
  }

  .rank-num.gold { color: var(--accent); }

  .team-bar {
    width: 4px;
    height: 2rem;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .team-info {
    min-width: 0;
  }

  .team-name {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text);
    display: block;
  }

  .record {
    display: flex;
    gap: 0.375rem;
    margin-top: 0.15rem;
  }

  .record-w {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--green);
  }

  .record-l {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--red);
  }

  .rank-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .playoff-badge {
    color: var(--accent);
    font-size: 0.9rem;
  }

  .stat-group {
    display: flex;
    gap: 0.625rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.05rem;
    min-width: 1.75rem;
  }

  .stat-num {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1;
  }

  .stat-lbl {
    font-size: 0.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-dim);
  }

  .diff.pos .stat-num { color: var(--green); }
  .diff.neg .stat-num { color: var(--red); }

  .pts-item .stat-num {
    color: var(--text);
    font-size: 1.05rem;
  }
  .pts-item .stat-lbl { color: var(--text-secondary); }

  .footnote {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    margin-top: 1rem;
    text-align: center;
  }
</style>
