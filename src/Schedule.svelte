<script>
  let { games, teams, photoMap, openPhoto } = $props();

  function team(id) {
    return teams.find(t => t.id === id);
  }

  function fmtDate(dateStr) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function shortDate(dateStr) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  let weeks = $derived.by(() => {
    const map = {};
    for (const g of games) {
      if (!map[g.week]) map[g.week] = [];
      map[g.week].push(g);
    }
    return Object.entries(map);
  });

  let currentWeek = $derived.by(() => {
    const today = new Date().toISOString().split('T')[0];
    for (const [w, gs] of weeks) {
      const sun = gs.find(g => g.day === 'sunday')?.date;
      if (sun && sun >= today) return Number(w);
    }
    return null;
  });

  let selectedWeek = $state(null);

  // Auto-select current week on first render
  $effect(() => {
    if (selectedWeek === null && currentWeek !== null) {
      selectedWeek = currentWeek;
    } else if (selectedWeek === null && weeks.length > 0) {
      selectedWeek = Number(weeks[0][0]);
    }
  });

  let selectedGames = $derived(
    weeks.find(([w]) => Number(w) === selectedWeek)?.[1] || []
  );
</script>

<!-- Week selector strip -->
<div class="week-strip-wrap">
  <div class="week-strip">
    {#each weeks as [w]}
      {@const wn = Number(w)}
      {@const isCurrent = wn === currentWeek}
      {@const isSelected = wn === selectedWeek}
      {@const wGames = weeks.find(([ww]) => Number(ww) === wn)?.[1] || []}
      {@const hasResults = wGames.some(g => g.score1 !== null)}

      <button
        class="week-chip"
        class:selected={isSelected}
        class:current={isCurrent && !isSelected}
        class:has-results={hasResults}
        onclick={() => selectedWeek = wn}
        type="button"
      >
        <span class="chip-num">{w}</span>
        <span class="chip-label">
          {#if isCurrent}NOW{:else}WK{/if}
        </span>
        {#if hasResults}
          <span class="chip-dot"></span>
        {/if}
      </button>
    {/each}
  </div>
</div>

<!-- Selected week games -->
{#if selectedGames.length > 0}
  {@const satDate = selectedGames.find(g => g.day === 'saturday')?.date}
  {@const sunDate = selectedGames.find(g => g.day === 'sunday')?.date}

  <div class="week-info">
    <span class="week-title">Week {selectedWeek}</span>
    <span class="week-sep">&middot;</span>
    <span class="week-dates">{shortDate(satDate)} – {shortDate(sunDate)}</span>
    <span class="week-round">Round {selectedGames[0].round}</span>
  </div>

  <div class="games">
    {#each selectedGames as game, idx}
      {@const t1 = team(game.team1)}
      {@const t2 = team(game.team2)}
      {@const has = game.score1 !== null && game.score2 !== null}
      {@const w1 = has && game.score1 > game.score2}
      {@const w2 = has && game.score2 > game.score1}
      {@const hasPhoto = !!photoMap[game.id]}

      <button
        class="game-card"
        class:has-photo={hasPhoto}
        class:played={has}
        onclick={() => hasPhoto && openPhoto(game.id)}
        type="button"
        style="animation-delay: {idx * 60}ms"
      >
        <div class="game-date">
          <span class="date-day" class:is-sat={game.day === 'saturday'}>
            {fmtDate(game.date)}
          </span>
          {#if hasPhoto}
            <span class="photo-badge">&#128247; Scoresheet</span>
          {/if}
        </div>

        <div class="matchup">
          <!-- Team 1 -->
          <div class="team-row" class:is-winner={w1} class:is-loser={has && !w1}>
            <div class="team-identity">
              <span class="team-color" style="background:{t1.color}"></span>
              <span class="team-name">{t1.name}</span>
            </div>
            <span class="team-score">
              {#if has}{game.score1}{:else}&ndash;{/if}
            </span>
          </div>

          <!-- Team 2 -->
          <div class="team-row" class:is-winner={w2} class:is-loser={has && !w2}>
            <div class="team-identity">
              <span class="team-color" style="background:{t2.color}"></span>
              <span class="team-name">{t2.name}</span>
            </div>
            <span class="team-score">
              {#if has}{game.score2}{:else}&ndash;{/if}
            </span>
          </div>
        </div>

        {#if !has}
          <div class="game-status">Upcoming</div>
        {/if}
      </button>
    {/each}
  </div>
{/if}

<style>
  /* --- Week strip --- */
  .week-strip-wrap {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }

  .week-strip {
    display: flex;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .week-strip::-webkit-scrollbar { display: none; }

  .week-chip {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    width: 2.75rem;
    padding: 0.5rem 0.25rem 0.4rem;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    font-family: inherit;
    color: inherit;
  }

  .week-chip:active { transform: scale(0.95); }

  .chip-num {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1rem;
    line-height: 1;
    color: var(--text-muted);
  }

  .chip-label {
    font-family: var(--font-display);
    font-size: 0.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-dim);
  }

  .chip-dot {
    position: absolute;
    top: 0.3rem;
    right: 0.4rem;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--green);
  }

  .week-chip.selected {
    background: var(--amber);
    border-color: var(--amber);
  }

  .week-chip.selected .chip-num { color: #0a0a0c; }
  .week-chip.selected .chip-label { color: rgba(0,0,0,0.5); }
  .week-chip.selected .chip-dot { background: #0a0a0c; }

  .week-chip.current {
    border-color: var(--amber);
  }

  .week-chip.current .chip-num { color: var(--amber); }
  .week-chip.current .chip-label { color: var(--amber); }

  /* --- Week info --- */
  .week-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem 0.375rem;
  }

  .week-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.1rem;
    text-transform: uppercase;
    color: var(--text);
  }

  .week-sep { color: var(--text-dim); }

  .week-dates {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .week-round {
    margin-left: auto;
    font-family: var(--font-display);
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    background: var(--amber-dim);
    color: var(--amber);
  }

  /* --- Game cards --- */
  .games {
    padding: 0.5rem 1rem 6rem;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .game-card {
    display: block;
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.875rem;
    padding: 0;
    overflow: hidden;
    cursor: default;
    transition: all 0.2s;
    text-align: left;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    animation: card-in 0.3s ease both;
  }

  @keyframes card-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .game-card.has-photo { cursor: pointer; }
  .game-card.has-photo:active { transform: scale(0.98); }
  .game-card:hover { border-color: var(--border-hover); }
  .game-card.has-photo:hover { border-color: rgba(245,158,11,0.3); }

  .game-date {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.875rem;
    border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,0.015);
  }

  .date-day {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .date-day.is-sat { color: var(--amber); }

  .photo-badge {
    font-size: 0.65rem;
    color: var(--text-dim);
    opacity: 0.7;
  }

  .matchup {
    padding: 0.125rem 0;
  }

  .team-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;
  }

  .team-identity {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .team-color {
    width: 4px;
    height: 1.75rem;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .team-name {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.95rem;
    color: var(--text);
  }

  .team-score {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.5rem;
    color: var(--text-dim);
    min-width: 2.5rem;
    text-align: right;
    line-height: 1;
  }

  .team-row.is-winner .team-name { color: #fff; }
  .team-row.is-winner .team-score { color: #fff; }
  .team-row.is-loser .team-name { color: var(--text-muted); }
  .team-row.is-loser .team-score { color: var(--text-muted); }

  .game-status {
    text-align: center;
    padding: 0.35rem;
    font-family: var(--font-display);
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-dim);
    border-top: 1px solid var(--border);
  }

  @media (min-width: 640px) {
    .games {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
  }
</style>
