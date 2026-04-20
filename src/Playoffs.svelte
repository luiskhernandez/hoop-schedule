<script>
  import { computeStandings } from './standings.js';

  let { games, regularSeason, teams, photoMap, openPhoto } = $props();

  function team(id) {
    return teams.find(t => t.id === id);
  }

  let rsPlayed = $derived(regularSeason.filter(g => g.score1 !== null && g.score2 !== null).length);
  let rsTotal = $derived(regularSeason.length);
  let isProjection = $derived(rsPlayed > 0 && rsPlayed < rsTotal);

  let resolvedById = $derived.by(() => {
    const standings = computeStandings(regularSeason, teams);
    const seeds = standings.map(r => r.team.id);
    const byId = Object.fromEntries(games.map(g => [g.id, g]));
    const cache = {};

    function resolveRef(src) {
      if (!src) return null;
      const seedM = src.match(/^Seed #(\d+)$/);
      if (seedM) {
        const idx = parseInt(seedM[1], 10) - 1;
        return seeds[idx] ?? null;
      }
      const winM = src.match(/^Winner (\w+)$/);
      const losM = src.match(/^Loser (\w+)$/);
      const ref = winM || losM;
      if (ref) {
        const target = resolve(ref[1]);
        if (!target || target.score1 == null || target.score2 == null) return null;
        const winner = target.score1 > target.score2 ? target.team1 : target.team2;
        const loser = target.score1 > target.score2 ? target.team2 : target.team1;
        return winM ? winner : loser;
      }
      return null;
    }

    function resolve(id) {
      if (id in cache) return cache[id];
      const g = byId[id];
      if (!g) { cache[id] = null; return null; }
      cache[id] = null; // guard against cycles
      const team1 = g.team1 ?? resolveRef(g.source1);
      const team2 = g.team2 ?? resolveRef(g.source2);
      cache[id] = { ...g, team1, team2 };
      return cache[id];
    }

    for (const g of games) resolve(g.id);
    return cache;
  });

  function fmtDate(dateStr) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function fmtDateRange(dates) {
    const unique = [...new Set(dates)].sort();
    if (unique.length === 1) return fmtDate(unique[0]);
    return `${fmtDate(unique[0])} – ${fmtDate(unique[unique.length - 1])}`;
  }

  // Readable labels for bracket rounds
  const roundLabels = {
    'winners_qf': 'Quarterfinals',
    'winners_sf': 'Semifinals',
    'winners_final': 'Winners Final',
    'losers_r1': 'Losers Round 1',
    'losers_r2': 'Losers Round 2',
    'losers_r3': 'Losers Round 3',
    'losers_final': 'Losers Final',
    'grand_final': 'Grand Final',
  };

  // Badge type for each round
  const roundBracket = {
    'winners_qf': 'winners',
    'winners_sf': 'winners',
    'winners_final': 'winners',
    'losers_r1': 'losers',
    'losers_r2': 'losers',
    'losers_r3': 'losers',
    'losers_final': 'losers',
    'grand_final': 'final',
  };

  // Group games into playoff weekends by date proximity
  let weekends = $derived.by(() => {
    const sorted = [...games].sort((a, b) => a.date.localeCompare(b.date));
    const groups = [];
    let current = null;

    for (const g of sorted) {
      const sat = g.date;
      // Group games within the same weekend (within 1 day)
      if (!current || daysBetween(current.anchor, sat) > 1) {
        current = { anchor: sat, games: [] };
        groups.push(current);
      }
      current.games.push(g);
    }
    return groups;
  });

  function daysBetween(a, b) {
    return Math.abs(new Date(a + 'T12:00:00') - new Date(b + 'T12:00:00')) / 86400000;
  }
</script>

<div class="page">
  <div class="section-head">
    <h2 class="section-title">Playoffs</h2>
    <span class="section-sub">Double Elimination</span>
  </div>

  <div class="legend">
    <span class="legend-item"><span class="legend-dot winners"></span>Winners bracket</span>
    <span class="legend-item"><span class="legend-dot losers"></span>Losers bracket</span>
    <span class="legend-item"><span class="legend-dot final"></span>Grand Final</span>
  </div>

  <p class="format-note">Lose twice = eliminated &middot; Seeds #1 & #2 get byes to semis</p>

  {#if isProjection}
    <div class="projection-banner">
      <svg class="proj-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span class="proj-text">
        <strong>Projected bracket</strong> &middot; based on current standings ({rsPlayed}/{rsTotal} games played). Seeds may change.
      </span>
    </div>
  {/if}

  <div class="timeline">
    {#each weekends as weekend, wi}
      {@const dates = weekend.games.map(g => g.date)}
      {@const dateRange = fmtDateRange(dates)}

      <div class="weekend" style="animation-delay: {wi * 60}ms">
        <div class="weekend-header">
          <span class="weekend-num">Playoff Week {wi + 1}</span>
          <span class="weekend-date">{dateRange}</span>
        </div>

        <div class="weekend-games">
          {#each weekend.games as game}
            {@const resolved = resolvedById[game.id] ?? game}
            {@const t1 = resolved.team1 ? team(resolved.team1) : null}
            {@const t2 = resolved.team2 ? team(resolved.team2) : null}
            {@const has = game.score1 !== null && game.score2 !== null}
            {@const w1 = has && game.score1 > game.score2}
            {@const w2 = has && game.score2 > game.score1}
            {@const hasPhoto = !!photoMap[game.id]}
            {@const bracket = roundBracket[game.round]}
            {@const projected1 = game.team1 == null && !!game.source1}
            {@const projected2 = game.team2 == null && !!game.source2}

            <button
              class="po-card"
              class:has-photo={hasPhoto}
              onclick={() => hasPhoto && openPhoto(game.id)}
              type="button"
            >
              <div class="po-top">
                <span class="bracket-tag {bracket}">{roundLabels[game.round]}</span>
              </div>

              <div class="po-team" class:is-winner={w1} class:is-loser={has && !w1}>
                {#if t1}
                  <span class="po-bar" style="background:{t1.color}"></span>
                  <div class="po-team-info">
                    <span class="po-name">{t1.name}</span>
                    {#if projected1}
                      <span class="po-source-sub">{game.source1}</span>
                    {/if}
                  </div>
                {:else}
                  <span class="po-source">{game.source1}</span>
                {/if}
                <span class="po-score">{has ? game.score1 : '–'}</span>
              </div>

              <div class="po-divider"></div>

              <div class="po-team" class:is-winner={w2} class:is-loser={has && !w2}>
                {#if t2}
                  <span class="po-bar" style="background:{t2.color}"></span>
                  <div class="po-team-info">
                    <span class="po-name">{t2.name}</span>
                    {#if projected2}
                      <span class="po-source-sub">{game.source2}</span>
                    {/if}
                  </div>
                {:else}
                  <span class="po-source">{game.source2}</span>
                {/if}
                <span class="po-score">{has ? game.score2 : '–'}</span>
              </div>

              {#if hasPhoto}
                <div class="po-footer">&#128247; View scoresheet</div>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
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
    padding: 1rem 0 0.25rem;
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

  .legend {
    display: flex;
    gap: 1rem;
    padding: 0.5rem 0;
    flex-wrap: wrap;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .legend-dot.winners { background: var(--green); }
  .legend-dot.losers { background: var(--red); }
  .legend-dot.final { background: #f59e0b; }

  .format-note {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-dim);
    margin-bottom: 0.75rem;
  }

  .projection-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.625rem 0.75rem;
    margin-bottom: 1.25rem;
    background: rgba(245, 158, 11, 0.08);
    border-left: 3px solid #f59e0b;
    border-radius: var(--radius-sm);
    color: #b45309;
  }

  .proj-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  .proj-text {
    font-size: 0.72rem;
    line-height: 1.35;
    color: var(--text-secondary);
  }

  .proj-text strong {
    color: #b45309;
    font-weight: 700;
  }

  /* --- Timeline --- */
  .timeline {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .weekend {
    animation: fade-up 0.3s ease both;
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .weekend-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.625rem;
    padding-bottom: 0.375rem;
    border-bottom: 2px solid var(--border);
  }

  .weekend-num {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--text);
  }

  .weekend-date {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  .weekend-games {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  /* --- Card --- */
  .po-card {
    display: block;
    width: 100%;
    background: var(--surface);
    border-radius: var(--radius-sm);
    overflow: hidden;
    cursor: default;
    transition: all 0.2s;
    text-align: left;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    box-shadow: var(--shadow-sm);
    border: none;
  }

  .po-card:hover { box-shadow: var(--shadow-md); }
  .po-card.has-photo { cursor: pointer; }
  .po-card.has-photo:active { transform: scale(0.98); }

  .po-top {
    padding: 0.4rem 0.875rem;
    background: var(--surface2);
    display: flex;
    align-items: center;
  }

  .bracket-tag {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    padding: 0.15rem 0.5rem;
    border-radius: 2rem;
  }

  .bracket-tag.winners {
    background: rgba(22, 163, 74, 0.1);
    color: var(--green);
  }

  .bracket-tag.losers {
    background: rgba(220, 38, 38, 0.08);
    color: var(--red);
  }

  .bracket-tag.final {
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
  }

  .po-team {
    display: flex;
    align-items: center;
    padding: 0.625rem 0.875rem;
    gap: 0.5rem;
  }

  .po-divider {
    height: 1px;
    margin: 0 0.875rem;
    background: var(--border);
  }

  .po-bar {
    width: 4px;
    height: 1.5rem;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .po-team-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }

  .po-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text);
  }

  .po-source-sub {
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--text-dim);
    letter-spacing: 0.01em;
  }

  .po-source {
    flex: 1;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-dim);
  }

  .po-score {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--text-dim);
    min-width: 2rem;
    text-align: right;
  }

  .po-team.is-winner .po-name { color: var(--text); font-weight: 700; }
  .po-team.is-winner .po-score { color: var(--accent); }
  .po-team.is-loser .po-name { color: var(--text-muted); }
  .po-team.is-loser .po-score { color: var(--text-dim); }

  .po-footer {
    padding: 0.35rem 0.875rem;
    background: var(--surface2);
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--text-muted);
    text-align: center;
  }
</style>
