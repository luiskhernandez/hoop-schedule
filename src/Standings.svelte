<script>
  let { games, teams } = $props();

  let standings = $derived.by(() => {
    const s = {};
    for (const t of teams) {
      s[t.id] = { team: t, w: 0, l: 0, pf: 0, pa: 0, gp: 0 };
    }
    for (const g of games) {
      if (g.score1 === null || g.score2 === null) continue;
      const a = s[g.team1], b = s[g.team2];
      a.pf += g.score1; a.pa += g.score2; a.gp++;
      b.pf += g.score2; b.pa += g.score1; b.gp++;
      if (g.score1 > g.score2) { a.w++; b.l++; }
      else { b.w++; a.l++; }
    }
    return Object.values(s).sort((a, b) => {
      if (b.w !== a.w) return b.w - a.w;
      return (b.pf - b.pa) - (a.pf - a.pa);
    });
  });

  let anyPlayed = $derived(standings.some(r => r.gp > 0));
</script>

<div class="standings-page">
  <div class="section-head">
    <h2 class="section-title">Standings</h2>
    <span class="section-sub">Regular Season</span>
  </div>

  <div class="cards">
    {#each standings as row, i}
      {@const diff = row.pf - row.pa}
      {@const top2 = i < 2}

      <div class="rank-card" class:top2 style="animation-delay: {i * 50}ms">
        <div class="rank-pos" class:gold={top2}>
          {i + 1}
        </div>

        <div class="rank-main">
          <div class="rank-team">
            <span class="rank-color" style="background:{row.team.color}"></span>
            <span class="rank-name">{row.team.name}</span>
            {#if top2}
              <span class="playoff-tag">Playoffs</span>
            {/if}
          </div>

          <div class="rank-stats">
            <div class="stat">
              <span class="stat-val wins">{row.w}</span>
              <span class="stat-label">W</span>
            </div>
            <div class="stat">
              <span class="stat-val losses">{row.l}</span>
              <span class="stat-label">L</span>
            </div>
            <div class="stat-sep"></div>
            <div class="stat">
              <span class="stat-val">{row.pf}</span>
              <span class="stat-label">PF</span>
            </div>
            <div class="stat">
              <span class="stat-val">{row.pa}</span>
              <span class="stat-label">PA</span>
            </div>
            <div class="stat-sep"></div>
            <div class="stat">
              <span class="stat-val diff" class:pos={diff > 0} class:neg={diff < 0}>
                {#if anyPlayed}
                  {diff > 0 ? '+' : ''}{diff}
                {:else}
                  &ndash;
                {/if}
              </span>
              <span class="stat-label">+/&ndash;</span>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <p class="footnote">Top 2 advance to semifinals with a bye</p>
</div>

<style>
  .standings-page {
    padding: 0 1rem 6rem;
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
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text);
  }

  .section-sub {
    font-size: 0.75rem;
    color: var(--text-dim);
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .rank-card {
    display: flex;
    align-items: stretch;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.875rem;
    overflow: hidden;
    animation: card-in 0.3s ease both;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .rank-card.top2 {
    border-color: rgba(245, 158, 11, 0.2);
    background: linear-gradient(135deg, rgba(245,158,11,0.04), transparent);
  }

  .rank-pos {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    flex-shrink: 0;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.3rem;
    color: var(--text-dim);
    border-right: 1px solid var(--border);
  }

  .rank-pos.gold { color: var(--amber); }

  .rank-main {
    flex: 1;
    padding: 0.75rem 0.875rem;
    min-width: 0;
  }

  .rank-team {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .rank-color {
    width: 4px;
    height: 1.25rem;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .rank-name {
    font-weight: 500;
    font-size: 0.95rem;
    color: var(--text);
  }

  .playoff-tag {
    font-family: var(--font-display);
    font-size: 0.55rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.15rem 0.4rem;
    border-radius: 3px;
    background: var(--amber-dim);
    color: var(--amber);
    margin-left: auto;
  }

  .rank-stats {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    min-width: 1.5rem;
  }

  .stat-val {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1rem;
    line-height: 1;
    color: var(--text-muted);
  }

  .stat-val.wins { color: var(--green); }
  .stat-val.losses { color: var(--red); }
  .stat-val.diff { color: var(--text-dim); }
  .stat-val.diff.pos { color: var(--green); }
  .stat-val.diff.neg { color: var(--red); }

  .stat-label {
    font-family: var(--font-display);
    font-size: 0.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-dim);
  }

  .stat-sep {
    width: 1px;
    height: 1.5rem;
    background: var(--border);
  }

  .footnote {
    font-size: 0.7rem;
    color: var(--text-dim);
    margin-top: 1rem;
    text-align: center;
  }
</style>
