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

<div class="week-strip-wrap">
  <div class="week-strip">
    {#each weeks as [w], idx}
      {@const wn = Number(w)}
      {@const isCurrent = wn === currentWeek}
      {@const isSelected = wn === selectedWeek}
      {@const wGames = weeks.find(([ww]) => Number(ww) === wn)?.[1] || []}
      {@const hasResults = wGames.some(g => g.score1 !== null)}
      {@const round = wGames[0]?.round}
      {@const prevRound = idx > 0 ? (weeks[idx - 1][1][0]?.round) : round}

      {#if round !== prevRound}
        <div class="round-divider">
          <span class="round-divider-label">R{round}</span>
        </div>
      {/if}

      <button
        class="week-chip"
        class:selected={isSelected}
        class:current={isCurrent && !isSelected}
        class:round2={round === 2}
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

{#if selectedGames.length > 0}
  {@const satDate = selectedGames.find(g => g.day === 'saturday')?.date}
  {@const sunDate = selectedGames.find(g => g.day === 'sunday')?.date}

  <div class="week-info">
    <div class="week-info-left">
      <span class="week-title">Week {selectedWeek}</span>
      <span class="week-dates">{shortDate(satDate)} – {shortDate(sunDate)}</span>
    </div>
    <span class="week-round" class:r2={selectedGames[0].round === 2}>Round {selectedGames[0].round}</span>
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
        <div class="game-top">
          <span class="game-day" class:is-sat={game.day === 'saturday'}>
            {fmtDate(game.date)}{#if game.time} · {game.time}{/if}
          </span>
          {#if hasPhoto}
            <span class="photo-badge">&#128247;</span>
          {/if}
          {#if !has}
            <span class="upcoming-tag">Upcoming</span>
          {/if}
        </div>

        <div class="team-row" class:is-winner={w1} class:is-loser={has && !w1}>
          <div class="team-id">
            <span class="team-bar" style="background:{t1.color}"></span>
            <span class="team-name">{t1.name}</span>
          </div>
          <span class="team-score" class:score-active={has}>
            {#if has}{game.score1}{:else}–{/if}
          </span>
        </div>

        <div class="team-divider"></div>

        <div class="team-row" class:is-winner={w2} class:is-loser={has && !w2}>
          <div class="team-id">
            <span class="team-bar" style="background:{t2.color}"></span>
            <span class="team-name">{t2.name}</span>
          </div>
          <span class="team-score" class:score-active={has}>
            {#if has}{game.score2}{:else}–{/if}
          </span>
        </div>
      </button>
    {/each}
  </div>
{/if}

<style>
  .week-strip-wrap {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--surface);
    box-shadow: var(--shadow-sm);
  }

  .week-strip {
    display: flex;
    gap: 0.375rem;
    padding: 0.75rem 1.25rem;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .week-strip::-webkit-scrollbar { display: none; }

  .week-chip {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.05rem;
    width: 2.75rem;
    padding: 0.45rem 0.25rem 0.35rem;
    background: var(--surface2);
    border: 2px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    font-family: inherit;
    color: inherit;
  }

  .week-chip:active { transform: scale(0.93); }

  .week-chip.round2 {
    background: var(--info-bg);
    border-color: color-mix(in srgb, var(--info) 18%, transparent);
  }

  .week-chip.round2 .chip-num { color: var(--info-light); }

  .week-chip.round2.selected {
    background: var(--info);
    border-color: var(--info);
    box-shadow: 0 2px 8px var(--info-shadow);
  }

  .week-chip.round2.selected .chip-num { color: white; }
  .week-chip.round2.selected .chip-label { color: rgba(255,255,255,0.7); }
  .week-chip.round2.selected .chip-dot { background: white; }

  .week-chip.round2.current {
    border-color: var(--info);
  }

  .week-chip.round2.current .chip-num { color: var(--info); }
  .week-chip.round2.current .chip-label { color: var(--info); }

  .round-divider {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    padding: 0 0.25rem;
  }

  .round-divider-label {
    font-size: 0.55rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--info);
    writing-mode: vertical-lr;
    text-orientation: mixed;
    transform: rotate(180deg);
  }

  .chip-num {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1rem;
    line-height: 1;
    color: var(--text-muted);
  }

  .chip-label {
    font-size: 0.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-dim);
  }

  .chip-dot {
    position: absolute;
    top: 0.25rem;
    right: 0.35rem;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
  }

  .week-chip.selected {
    background: var(--accent);
    border-color: var(--accent);
    box-shadow: 0 2px 8px var(--accent-shadow);
  }

  .week-chip.selected .chip-num { color: white; }
  .week-chip.selected .chip-label { color: rgba(255,255,255,0.7); }
  .week-chip.selected .chip-dot { background: white; }

  .week-chip.current {
    border-color: var(--accent);
  }

  .week-chip.current .chip-num { color: var(--accent); }
  .week-chip.current .chip-label { color: var(--accent); }

  .week-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem 0.5rem;
  }

  .week-info-left {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .week-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.15rem;
    color: var(--text);
  }

  .week-dates {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  .week-round {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 0.2rem 0.6rem;
    border-radius: 2rem;
    background: var(--accent-bg);
    color: var(--accent);
  }

  .week-round.r2 {
    background: var(--info-bg);
    color: var(--info);
  }

  .games {
    padding: 0.5rem 1.25rem 6rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .game-card {
    display: block;
    width: 100%;
    background: var(--surface);
    border: none;
    border-radius: var(--radius);
    padding: 0;
    overflow: hidden;
    cursor: default;
    transition: all 0.2s;
    text-align: left;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    box-shadow: var(--shadow-sm);
    animation: card-in 0.3s ease both;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .game-card.has-photo { cursor: pointer; }
  .game-card.has-photo:active { transform: scale(0.98); }
  .game-card:hover { box-shadow: var(--shadow-md); }
  .game-card.has-photo:hover { box-shadow: var(--shadow-md), 0 0 0 2px var(--accent-light); }

  .game-top {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--surface2);
  }

  .game-day {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .game-day.is-sat { color: var(--accent); }

  .photo-badge {
    font-size: 0.7rem;
    opacity: 0.5;
  }

  .upcoming-tag {
    margin-left: auto;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-dim);
  }

  .team-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
  }

  .team-divider {
    height: 1px;
    margin: 0 1rem;
    background: var(--border);
  }

  .team-id {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .team-bar {
    width: 4px;
    height: 1.75rem;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .team-name {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text);
  }

  .team-score {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.5rem;
    color: var(--text-dim);
    min-width: 2.5rem;
    text-align: right;
    line-height: 1;
  }

  .team-score.score-active { color: var(--text-secondary); }

  .team-row.is-winner .team-name { color: var(--text); font-weight: 700; }
  .team-row.is-winner .team-score { color: var(--accent); }
  .team-row.is-loser .team-name { color: var(--text-muted); }
  .team-row.is-loser .team-score { color: var(--text-dim); }

  @media (min-width: 640px) {
    .games {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
  }

  @media (min-width: 768px) {
    .week-strip-wrap {
      border-bottom: 1px solid var(--border);
      box-shadow: none;
    }

    .week-strip {
      max-width: 72rem;
      margin: 0 auto;
      padding: 0.75rem 2.5rem;
    }

    .week-info {
      max-width: 72rem;
      margin: 0 auto;
      padding: 1rem 2.5rem 0.5rem;
    }

    .games {
      max-width: 72rem;
      margin: 0 auto;
      padding: 0.5rem 2.5rem 2rem;
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
