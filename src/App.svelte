<script>
  import Schedule from './Schedule.svelte';
  import Standings from './Standings.svelte';
  import Playoffs from './Playoffs.svelte';
  import Lightbox from './Lightbox.svelte';

  let tournament = $state(null);
  let photoMap = $state({});
  let currentTab = $state('schedule');
  let lightboxSrc = $state(null);

  const tabs = [
    { id: 'schedule', label: 'Games', icon: 'calendar' },
    { id: 'standings', label: 'Standings', icon: 'trophy' },
    { id: 'playoffs', label: 'Playoffs', icon: 'bracket' },
  ];

  async function load() {
    const res = await fetch('/tournament.json');
    tournament = await res.json();
    await detectPhotos();
  }

  async function detectPhotos() {
    const allGames = [...tournament.regularSeason, ...tournament.playoffs];
    const exts = ['jpg', 'jpeg', 'png', 'webp'];
    const checks = allGames.flatMap(g =>
      exts.map(ext => {
        const url = `/photos/${g.id}.${ext}`;
        return fetch(url, { method: 'HEAD' })
          .then(r => {
            const ct = r.headers.get('content-type') || '';
            return (r.ok && ct.startsWith('image/')) ? { id: g.id, url } : null;
          })
          .catch(() => null);
      })
    );
    const results = await Promise.all(checks);
    const map = {};
    for (const r of results) {
      if (r) map[r.id] = r.url;
    }
    photoMap = map;
  }

  function openPhoto(gameId) {
    lightboxSrc = photoMap[gameId] || null;
  }

  let played = $derived(tournament ? tournament.regularSeason.filter(g => g.score1 !== null).length : 0);
  let total = $derived(tournament ? tournament.regularSeason.length : 0);

  load();
</script>

<div class="shell">
  <!-- Header -->
  <header class="header">
    <div class="header-inner">
      <div class="brand">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none" class="logo">
          <circle cx="20" cy="20" r="18" stroke="var(--amber)" stroke-width="2"/>
          <path d="M20 2 L20 38" stroke="var(--amber)" stroke-width="1" opacity="0.3"/>
          <path d="M2 20 L38 20" stroke="var(--amber)" stroke-width="1" opacity="0.3"/>
          <path d="M20 8 C26 8, 32 14, 32 20" stroke="var(--amber)" stroke-width="1.5" opacity="0.4"/>
          <path d="M20 32 C14 32, 8 26, 8 20" stroke="var(--amber)" stroke-width="1.5" opacity="0.4"/>
        </svg>
        {#if tournament}
          <div>
            <h1 class="title">{tournament.name}</h1>
            <p class="meta">{played}/{total} games played</p>
          </div>
        {/if}
      </div>
    </div>
  </header>

  <!-- Content -->
  <main class="content">
    {#if tournament}
      {#if currentTab === 'schedule'}
        <Schedule games={tournament.regularSeason} teams={tournament.teams} {photoMap} {openPhoto} />
      {:else if currentTab === 'standings'}
        <Standings games={tournament.regularSeason} teams={tournament.teams} />
      {:else if currentTab === 'playoffs'}
        <Playoffs games={tournament.playoffs} teams={tournament.teams} {photoMap} {openPhoto} />
      {/if}
    {/if}
  </main>

  <!-- Bottom Nav -->
  <nav class="bottom-nav">
    {#each tabs as tab}
      <button
        class="nav-btn"
        class:active={currentTab === tab.id}
        onclick={() => currentTab = tab.id}
        type="button"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          {#if tab.icon === 'calendar'}
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
            <line x1="9" y1="2" x2="9" y2="6"/>
            <line x1="15" y1="2" x2="15" y2="6"/>
          {:else if tab.icon === 'trophy'}
            <path d="M6 9H4a2 2 0 01-2-2V5h4"/>
            <path d="M18 9h2a2 2 0 002-2V5h-4"/>
            <path d="M4 5h16v4a6 6 0 01-6 6h-4a6 6 0 01-6-6V5z"/>
            <path d="M12 15v3"/>
            <path d="M8 21h8"/>
            <path d="M8 18h8"/>
          {:else if tab.icon === 'bracket'}
            <path d="M4 4v6a2 2 0 002 2h2"/>
            <path d="M4 20v-6a2 2 0 012-2h2"/>
            <path d="M20 4v6a2 2 0 01-2 2h-2"/>
            <path d="M20 20v-6a2 2 0 00-2-2h-2"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          {/if}
        </svg>
        <span class="nav-label">{tab.label}</span>
      </button>
    {/each}
  </nav>
</div>

<Lightbox src={lightboxSrc} onclose={() => lightboxSrc = null} />

<style>
  .shell {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 30rem;
    margin: 0 auto;
    width: 100%;
  }

  /* --- Header --- */
  .header {
    flex-shrink: 0;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    padding: 0.75rem 1rem;
    padding-top: max(0.75rem, env(safe-area-inset-top));
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo { flex-shrink: 0; }

  .title {
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    line-height: 1.1;
    color: var(--text);
  }

  .meta {
    font-size: 0.7rem;
    color: var(--text-dim);
    margin-top: 0.1rem;
    letter-spacing: 0.03em;
  }

  /* --- Content --- */
  .content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  /* --- Bottom Nav --- */
  .bottom-nav {
    flex-shrink: 0;
    display: flex;
    border-top: 1px solid var(--border);
    background: var(--surface);
    padding-bottom: var(--safe-bottom);
  }

  .nav-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    padding: 0.6rem 0;
    background: none;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    transition: color 0.2s;
    position: relative;
  }

  .nav-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 25%;
    right: 25%;
    height: 2px;
    background: var(--amber);
    border-radius: 0 0 2px 2px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .nav-btn.active {
    color: var(--amber);
  }

  .nav-btn.active::before {
    opacity: 1;
  }

  .nav-icon {
    width: 22px;
    height: 22px;
  }

  .nav-label {
    font-family: var(--font-display);
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  @media (min-width: 640px) {
    .shell { max-width: 48rem; }
    .header { padding: 1rem 1.5rem; }
    .title { font-size: 1.4rem; }
  }
</style>
