<script>
  // Static content — no props needed
</script>

<div class="page">
  <div class="section-head">
    <h2 class="section-title">Rules</h2>
    <span class="section-sub">How the tournament works</span>
  </div>

  <!-- Points system -->
  <section class="card">
    <h3 class="card-title">Point System</h3>
    <p class="card-intro">Every regular-season game awards points based on the result.</p>

    <div class="points-grid">
      <div class="point-item win">
        <span class="point-num">2</span>
        <span class="point-label">Win</span>
        <span class="point-desc">Winning team</span>
      </div>
      <div class="point-item loss">
        <span class="point-num">1</span>
        <span class="point-label">Loss</span>
        <span class="point-desc">Losing team (participation)</span>
      </div>
      <div class="point-item wo">
        <span class="point-num">0</span>
        <span class="point-label">WO</span>
        <span class="point-desc">Team didn't show up (walkover)</span>
      </div>
    </div>
  </section>

  <!-- Tiebreakers -->
  <section class="card">
    <h3 class="card-title">Tiebreakers</h3>
    <p class="card-intro">If two or more teams finish with the same number of points, these rules apply in order:</p>

    <ol class="rule-list">
      <li>
        <span class="rule-step">Head-to-head</span>
        Only when <strong>exactly 2 teams</strong> are tied. Whoever won the direct matchup wins the tiebreaker. If they split results, move to the next rule.
      </li>
      <li>
        <span class="rule-step">Point Differential</span>
        Used when <strong>3 or more teams</strong> are tied, or when head-to-head didn't resolve. Ranking is decided by season-wide point differential (<strong>PF – PA</strong>).
      </li>
    </ol>
  </section>

  <!-- Playoff format -->
  <section class="card">
    <h3 class="card-title">Playoff Format</h3>
    <p class="card-intro">Double elimination — a team is out after losing <strong>twice</strong>.</p>

    <div class="format-list">
      <div class="format-item">
        <span class="format-num">1</span>
        <div class="format-body">
          <span class="format-title">Regular Season</span>
          <p>6 teams, 10 weeks. Each team plays every other team twice.</p>
        </div>
      </div>
      <div class="format-item">
        <span class="format-num">2</span>
        <div class="format-body">
          <span class="format-title">Seeding</span>
          <p>Teams are ranked by points. <strong>Top 2 seeds</strong> get a bye directly to the semifinals.</p>
        </div>
      </div>
      <div class="format-item">
        <span class="format-num">3</span>
        <div class="format-body">
          <span class="format-title">Winners Bracket</span>
          <p>Quarterfinals → Semifinals → Winners Final. Losing here drops you to the losers bracket.</p>
        </div>
      </div>
      <div class="format-item">
        <span class="format-num">4</span>
        <div class="format-body">
          <span class="format-title">Losers Bracket</span>
          <p>Second-chance bracket. Losing here means you're eliminated.</p>
        </div>
      </div>
      <div class="format-item">
        <span class="format-num">5</span>
        <div class="format-body">
          <span class="format-title">Grand Final</span>
          <p>Winner of the Winners Final vs. Winner of the Losers Final. If the losers-bracket team wins, a reset game is played (they need to be beaten twice).</p>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .page {
    padding: 0 1.25rem 6rem;
  }

  @media (min-width: 768px) {
    .page { padding: 1rem 2.5rem 2rem; max-width: 44rem; margin: 0 auto; }
  }

  @media (min-width: 1024px) {
    .page { max-width: 50rem; }
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

  .card {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 1.25rem 1.25rem 1.35rem;
    box-shadow: var(--shadow-sm);
    margin-bottom: 0.875rem;
    animation: card-in 0.3s ease both;
  }

  @keyframes card-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .card-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text);
    margin-bottom: 0.35rem;
  }

  .card-intro {
    font-size: 0.85rem;
    line-height: 1.45;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  /* Points grid */
  .points-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.625rem;
  }

  .point-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.875rem 0.5rem;
    border-radius: var(--radius-sm);
    text-align: center;
    border: 1px solid var(--border);
  }

  .point-num {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 2.25rem;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .point-label {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 0.3rem;
  }

  .point-desc {
    font-size: 0.68rem;
    font-weight: 500;
    color: var(--text-muted);
    margin-top: 0.3rem;
    line-height: 1.25;
  }

  .point-item.win { background: var(--green-bg); border-color: color-mix(in srgb, var(--green) 20%, transparent); }
  .point-item.win .point-num, .point-item.win .point-label { color: var(--green); }

  .point-item.loss .point-num, .point-item.loss .point-label { color: var(--text-secondary); }

  .point-item.wo { background: var(--red-bg); border-color: color-mix(in srgb, var(--red) 20%, transparent); }
  .point-item.wo .point-num, .point-item.wo .point-label { color: var(--red); }

  /* Rule list (tiebreakers) */
  .rule-list {
    list-style: none;
    padding: 0;
    margin: 0;
    counter-reset: rules;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .rule-list li {
    counter-increment: rules;
    position: relative;
    padding-left: 2.25rem;
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-secondary);
  }

  .rule-list li::before {
    content: counter(rules);
    position: absolute;
    left: 0;
    top: 0;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--accent-bg);
    color: var(--accent);
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 0.8rem;
  }

  .rule-step {
    display: block;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text);
    margin-bottom: 0.15rem;
  }

  /* Format list */
  .format-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .format-item {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
  }

  .format-num {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--accent);
    color: white;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 0.9rem;
  }

  .format-body {
    flex: 1;
    padding-top: 0.15rem;
  }

  .format-title {
    display: block;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 0.9rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text);
    margin-bottom: 0.2rem;
  }

  .format-body p {
    font-size: 0.82rem;
    line-height: 1.5;
    color: var(--text-secondary);
  }

  .format-body strong {
    color: var(--text);
    font-weight: 700;
  }

  .card-intro strong {
    color: var(--text);
    font-weight: 700;
  }
</style>
