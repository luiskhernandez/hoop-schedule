<script>
  import { computeStandings } from './standings.js';
  import Crest from './Crest.svelte';

  let { games, teams } = $props();

  let standings = $derived(computeStandings(games, teams));
  let anyPlayed = $derived(standings.some(r => r.gp > 0));
</script>

<div class="page">
  <div class="section-head">
    <h2 class="section-title">Standings</h2>
    <span class="section-sub">Regular Season</span>
  </div>

  <!-- Desktop-only column headers -->
  <div class="table-header" aria-hidden="true">
    <span class="th-col th-rank">#</span>
    <span class="th-col th-crest"></span>
    <span class="th-col th-team">Team</span>
    <span class="th-col th-pts">PTS</span>
    <span class="th-col">GP</span>
    <span class="th-col">W</span>
    <span class="th-col">L</span>
    <span class="th-col">WO</span>
    <span class="th-col">PF</span>
    <span class="th-col">PA</span>
    <span class="th-col th-diff">+/–</span>
  </div>

  <div class="rows">
    {#each standings as row, i}
      {@const diff = row.pf - row.pa}
      {@const top2 = i < 2}

      <div class="rank-card" class:top2 style="animation-delay: {i * 50}ms">
        <span class="col-rank" class:gold={top2}>{i + 1}</span>

        <div class="col-crest">
          <Crest team={row.team} />
        </div>

        <div class="col-team">
          <div class="team-name-row">
            <span class="team-name">{row.team.name}</span>
            {#if top2}<span class="playoff-star" aria-label="Playoff seed">&#9733;</span>{/if}
          </div>
          <div class="record">
            <span class="record-w">{row.w}W</span>
            <span class="record-l">{row.l}L</span>
          </div>
        </div>

        <div class="col-stat col-pts">
          <span class="stat-num">{row.pts}</span>
          <span class="stat-lbl">PTS</span>
        </div>
        <div class="col-stat col-gp">
          <span class="stat-num">{row.gp}</span>
          <span class="stat-lbl">GP</span>
        </div>
        <div class="col-stat col-w">
          <span class="stat-num">{row.w}</span>
          <span class="stat-lbl">W</span>
        </div>
        <div class="col-stat col-l">
          <span class="stat-num">{row.l}</span>
          <span class="stat-lbl">L</span>
        </div>
        <div class="col-stat col-wo">
          <span class="stat-num">{row.wo}</span>
          <span class="stat-lbl">WO</span>
        </div>
        <div class="col-stat col-pf">
          <span class="stat-num">{row.pf}</span>
          <span class="stat-lbl">PF</span>
        </div>
        <div class="col-stat col-pa">
          <span class="stat-num">{row.pa}</span>
          <span class="stat-lbl">PA</span>
        </div>
        <div class="col-stat col-diff" class:pos={diff > 0} class:neg={diff < 0}>
          <span class="stat-num">{anyPlayed ? (diff > 0 ? '+' : '') + diff : '–'}</span>
          <span class="stat-lbl">+/–</span>
        </div>
      </div>
    {/each}
  </div>

  <p class="footnote">&#9733; Top 2 advance to semifinals with a bye</p>
</div>

<style>
  .page { padding: 0 1.25rem 6rem; --crest-size: 50px; }

  @media (min-width: 768px) {
    .page { padding: 1rem 2.5rem 2rem; max-width: 44rem; margin: 0 auto; }
  }

  @media (min-width: 1024px) {
    .page { max-width: 60rem; --crest-size: 64px; }
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

  /* Desktop column header row */
  .table-header { display: none; }

  @media (min-width: 1024px) {
    .table-header {
      display: grid;
      grid-template-columns:
        2rem 72px minmax(10rem, 1fr)
        3rem 2.5rem 2.5rem 2.5rem 2.5rem 3rem 3rem 3.25rem;
      align-items: center;
      gap: 0.5rem;
      padding: 0 1.25rem 0.65rem;
      border-bottom: 2px solid var(--text);
      margin-bottom: 0.75rem;
    }

    .th-col {
      font-family: var(--font-display);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
      text-align: center;
    }

    .th-team { text-align: left; }
    .th-pts { color: var(--text); }
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  @media (min-width: 1024px) {
    .rows { gap: 0; }
  }

  /* ========= Rank card (mobile) ========= */
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
    box-shadow: var(--shadow-md), 0 0 0 1.5px color-mix(in srgb, var(--green) 20%, transparent);
    background: linear-gradient(135deg, var(--green-bg), var(--surface));
  }

  .col-rank {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 1.2rem;
    color: var(--text-dim);
    min-width: 1.25rem;
    text-align: center;
  }

  .col-rank.gold { color: var(--accent); }

  .col-crest { flex-shrink: 0; }

  .col-team {
    flex: 1;
    min-width: 0;
  }

  .team-name-row {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .team-name {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text);
  }

  .playoff-star {
    color: var(--accent);
    font-size: 0.8rem;
  }

  .record {
    display: flex;
    gap: 0.375rem;
    margin-top: 0.15rem;
  }

  .record-w { font-size: 0.7rem; font-weight: 700; color: var(--green); }
  .record-l { font-size: 0.7rem; font-weight: 700; color: var(--red); }

  /* Mobile: position the stats as a horizontal group on the right */
  .col-stat {
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

  .col-diff.pos .stat-num { color: var(--green); }
  .col-diff.neg .stat-num { color: var(--red); }

  .col-pts .stat-num {
    color: var(--text);
    font-size: 1.05rem;
  }
  .col-pts .stat-lbl { color: var(--text-secondary); }

  /* Mobile: hide secondary columns; L always hidden (shown in record badge) */
  @media (max-width: 1023px) {
    .col-gp, .col-l, .col-wo, .col-pf, .col-pa { display: none; }
  }

  /* ========= Desktop editorial table (≥1024px) ========= */
  @media (min-width: 1024px) {
    .rank-card {
      display: grid;
      grid-template-columns:
        2rem 72px minmax(10rem, 1fr)
        3rem 2.5rem 2.5rem 2.5rem 2.5rem 3rem 3rem 3.25rem;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border-radius: 0;
      box-shadow: none;
      padding: 0.625rem 1.25rem;
      border-bottom: 1px solid var(--border);
    }

    .rank-card:hover {
      background: color-mix(in srgb, var(--accent) 4%, transparent);
    }

    .rank-card.top2 {
      background: color-mix(in srgb, var(--green) 4%, transparent);
      box-shadow: inset 3px 0 0 0 var(--green);
    }

    .rank-card.top2:hover {
      background: color-mix(in srgb, var(--green) 8%, transparent);
    }

    .col-rank {
      font-size: 1.5rem;
    }

    .team-name {
      font-size: 1.05rem;
      font-weight: 700;
    }

    /* Hide mobile-only affordances on desktop */
    .record { display: none; }
    .playoff-star { display: none; }

    /* Stats in columns: only show the number, labels are in the header */
    .col-stat {
      min-width: 0;
      gap: 0;
    }

    .col-stat .stat-lbl { display: none; }

    .col-stat .stat-num {
      font-size: 1rem;
      color: var(--text-secondary);
    }

    .col-pts .stat-num {
      font-size: 1.25rem;
      color: var(--text);
      font-weight: 900;
    }
  }

  .footnote {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    margin-top: 1rem;
    text-align: center;
  }
</style>
