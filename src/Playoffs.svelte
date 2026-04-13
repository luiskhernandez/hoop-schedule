<script>
  let { games, teams, photoMap, openPhoto } = $props();

  function team(id) {
    return teams.find(t => t.id === id);
  }

  function fmtDate(dateStr) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  let activeBracket = $state('winners');

  const brackets = {
    winners: [
      { label: 'Quarterfinals', key: 'winners_qf' },
      { label: 'Semifinals', key: 'winners_sf' },
      { label: 'Winners Final', key: 'winners_final' },
    ],
    losers: [
      { label: 'Round 1', key: 'losers_r1' },
      { label: 'Round 2', key: 'losers_r2' },
      { label: 'Round 3', key: 'losers_r3' },
      { label: 'Losers Final', key: 'losers_final' },
    ],
  };

  let grandFinal = $derived(games.filter(g => g.round === 'grand_final'));
</script>

<div class="page">
  <div class="section-head">
    <h2 class="section-title">Playoffs</h2>
    <span class="section-sub">Double Elimination</span>
  </div>

  <p class="format-note">Lose twice = eliminated &middot; Top 2 seeds get byes</p>

  <div class="bracket-toggle">
    <button
      class="toggle-btn"
      class:active={activeBracket === 'winners'}
      onclick={() => activeBracket = 'winners'}
      type="button"
    >
      <span class="dot dot-green"></span>
      Winners
    </button>
    <button
      class="toggle-btn"
      class:active={activeBracket === 'losers'}
      onclick={() => activeBracket = 'losers'}
      type="button"
    >
      <span class="dot dot-red"></span>
      Losers
    </button>
  </div>

  <div class="rounds">
    {#each brackets[activeBracket] as round}
      {@const roundGames = games.filter(g => g.round === round.key)}
      <div class="round">
        <div class="round-label">{round.label}</div>
        {#each roundGames as game}
          {@const t1 = game.team1 ? team(game.team1) : null}
          {@const t2 = game.team2 ? team(game.team2) : null}
          {@const has = game.score1 !== null && game.score2 !== null}
          {@const w1 = has && game.score1 > game.score2}
          {@const w2 = has && game.score2 > game.score1}
          {@const hasPhoto = !!photoMap[game.id]}

          <button
            class="po-card"
            class:has-photo={hasPhoto}
            onclick={() => hasPhoto && openPhoto(game.id)}
            type="button"
          >
            <div class="po-header">
              <span class="po-id">{game.id}</span>
              {#if hasPhoto}<span class="po-photo">&#128247;</span>{/if}
              <span class="po-date">{game.date ? fmtDate(game.date) : 'TBD'}</span>
            </div>

            <div class="po-team" class:is-winner={w1} class:is-loser={has && !w1}>
              {#if t1}
                <span class="po-bar" style="background:{t1.color}"></span>
                <span class="po-name">{t1.name}</span>
              {:else}
                <span class="po-source">{game.source1}</span>
              {/if}
              <span class="po-score">{has ? game.score1 : '–'}</span>
            </div>

            <div class="po-divider"></div>

            <div class="po-team" class:is-winner={w2} class:is-loser={has && !w2}>
              {#if t2}
                <span class="po-bar" style="background:{t2.color}"></span>
                <span class="po-name">{t2.name}</span>
              {:else}
                <span class="po-source">{game.source2}</span>
              {/if}
              <span class="po-score">{has ? game.score2 : '–'}</span>
            </div>
          </button>
        {/each}
      </div>
    {/each}
  </div>

  {#if grandFinal.length}
    <div class="gf-section">
      <div class="gf-label">Grand Final</div>
      {#each grandFinal as game}
        {@const t1 = game.team1 ? team(game.team1) : null}
        {@const t2 = game.team2 ? team(game.team2) : null}
        {@const has = game.score1 !== null && game.score2 !== null}
        {@const w1 = has && game.score1 > game.score2}
        {@const w2 = has && game.score2 > game.score1}
        {@const hasPhoto = !!photoMap[game.id]}

        <button
          class="po-card gf-card"
          class:has-photo={hasPhoto}
          onclick={() => hasPhoto && openPhoto(game.id)}
          type="button"
        >
          <div class="po-header">
            <span class="po-id">{game.id}</span>
            {#if hasPhoto}<span class="po-photo">&#128247;</span>{/if}
            <span class="po-date">{game.date ? fmtDate(game.date) : 'TBD'}</span>
          </div>
          <div class="po-team" class:is-winner={w1} class:is-loser={has && !w1}>
            {#if t1}
              <span class="po-bar" style="background:{t1.color}"></span>
              <span class="po-name">{t1.name}</span>
            {:else}
              <span class="po-source">{game.source1}</span>
            {/if}
            <span class="po-score">{has ? game.score1 : '–'}</span>
          </div>
          <div class="po-divider"></div>
          <div class="po-team" class:is-winner={w2} class:is-loser={has && !w2}>
            {#if t2}
              <span class="po-bar" style="background:{t2.color}"></span>
              <span class="po-name">{t2.name}</span>
            {:else}
              <span class="po-source">{game.source2}</span>
            {/if}
            <span class="po-score">{has ? game.score2 : '–'}</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .page { padding: 0 1.25rem 6rem; }

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

  .format-note {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    margin-bottom: 1rem;
  }

  .bracket-toggle {
    display: flex;
    gap: 0;
    padding: 0.2rem;
    background: var(--surface2);
    border-radius: var(--radius-sm);
    margin-bottom: 1.25rem;
  }

  .toggle-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.6rem;
    border: none;
    border-radius: 0.5rem;
    background: transparent;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
  }

  .toggle-btn:active { transform: scale(0.97); }

  .toggle-btn.active {
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--shadow-sm);
  }

  .dot { width: 8px; height: 8px; border-radius: 50%; }
  .dot-green { background: var(--green); }
  .dot-red { background: var(--red); }

  .rounds {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .round-label {
    font-family: var(--font-display);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .po-card {
    display: block;
    width: 100%;
    background: var(--surface);
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: 0.5rem;
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

  .po-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.875rem;
    background: var(--surface2);
  }

  .po-id {
    font-family: var(--font-display);
    font-size: 0.6rem;
    font-weight: 700;
    color: var(--text-muted);
  }

  .po-date { font-size: 0.65rem; font-weight: 500; color: var(--text-muted); }
  .po-photo { font-size: 0.7rem; opacity: 0.5; }

  .po-team {
    display: flex;
    align-items: center;
    padding: 0.6rem 0.875rem;
    gap: 0.5rem;
  }

  .po-divider {
    height: 1px;
    margin: 0 0.875rem;
    background: var(--border);
  }

  .po-bar {
    width: 3px;
    height: 1.25rem;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .po-name {
    flex: 1;
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text);
  }

  .po-source {
    flex: 1;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-dim);
    font-style: italic;
  }

  .po-score {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text-dim);
    min-width: 2rem;
    text-align: right;
  }

  .po-team.is-winner .po-name { color: var(--text); font-weight: 700; }
  .po-team.is-winner .po-score { color: var(--accent); }
  .po-team.is-loser .po-name { color: var(--text-muted); }
  .po-team.is-loser .po-score { color: var(--text-dim); }

  .gf-section {
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 2px solid var(--border);
  }

  .gf-label {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--accent);
    margin-bottom: 0.75rem;
    text-align: center;
  }

  .gf-card {
    box-shadow: var(--shadow-md), 0 0 0 1.5px rgba(22, 163, 74, 0.12);
  }
</style>
