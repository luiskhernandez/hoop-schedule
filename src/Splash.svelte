<script>
  let { tournamentName = 'Basketball Tournament', onDismiss } = $props();

  let ready = $state(false);

  $effect(() => {
    const reveal = setTimeout(() => { ready = true; }, 1400);
    const auto = setTimeout(() => onDismiss(), 2600);
    return () => {
      clearTimeout(reveal);
      clearTimeout(auto);
    };
  });
</script>

<div class="splash" role="dialog" aria-label="Welcome">
  <button class="skip" onclick={onDismiss} type="button">Skip</button>

  <div class="court-lines" aria-hidden="true"></div>

  <div class="stage">
    <div class="ball-stage">
      <div class="ball">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ballGrad" cx="35%" cy="30%">
              <stop offset="0%" stop-color="#ffa766"/>
              <stop offset="60%" stop-color="#e66a2e"/>
              <stop offset="100%" stop-color="#a13d0e"/>
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#ballGrad)" stroke="#1a0a04" stroke-width="1.5"/>
          <line x1="2" y1="50" x2="98" y2="50" stroke="#1a0a04" stroke-width="1.5"/>
          <line x1="50" y1="2" x2="50" y2="98" stroke="#1a0a04" stroke-width="1.5"/>
          <path d="M14 18 Q50 50 14 82" stroke="#1a0a04" stroke-width="1.5" fill="none"/>
          <path d="M86 18 Q50 50 86 82" stroke="#1a0a04" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
      <div class="floor-shadow"></div>
    </div>

    <div class="title-wrap">
      <p class="pretitle">Season Tipoff</p>
      <h1 class="title">{tournamentName}</h1>
      <div class="accent-bar"></div>
      <p class="tagline">True to the Game</p>
    </div>
  </div>

  <button
    class="enter"
    class:ready
    onclick={onDismiss}
    type="button"
    disabled={!ready}
    aria-label="Enter app"
  >
    <span>Enter</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  </button>
</div>

<style>
  .splash {
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse at 50% 30%, var(--splash-bg-from) 0%, var(--splash-bg-to) 70%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text);
    overflow: hidden;
    animation: splash-fade 0.4s ease-out;
  }

  .splash::after {
    content: '';
    position: absolute;
    inset: -20%;
    background: radial-gradient(ellipse at 50% 35%, var(--splash-glow), transparent 55%);
    pointer-events: none;
    opacity: 0;
    animation: fade-in 0.8s ease-out 0.3s forwards;
  }

  @keyframes splash-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .court-lines {
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        180deg,
        transparent 0,
        transparent 39px,
        color-mix(in srgb, var(--accent) 8%, transparent) 40px
      );
    pointer-events: none;
    opacity: 0;
    animation: fade-in 0.6s ease-out 0.2s forwards;
  }

  @keyframes fade-in {
    to { opacity: 1; }
  }

  .stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.25rem;
    padding: 2rem;
    z-index: 1;
  }

  .ball-stage {
    position: relative;
    width: 140px;
    height: 140px;
  }

  @media (min-width: 768px) {
    .ball-stage { width: 180px; height: 180px; }
  }

  .ball {
    width: 100%;
    height: 100%;
    animation: drop 1.2s cubic-bezier(0.5, 0, 0.75, 0) forwards;
    transform-origin: center;
    filter: drop-shadow(0 22px 28px rgba(0,0,0,0.6));
  }

  @keyframes drop {
    0% {
      transform: translateY(-110vh) rotate(-180deg);
      opacity: 0;
    }
    10% { opacity: 1; }
    55% {
      transform: translateY(0) rotate(0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
    }
    78% {
      transform: translateY(-60px) rotate(35deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
    }
    100% {
      transform: translateY(0) rotate(55deg);
    }
  }

  .floor-shadow {
    position: absolute;
    bottom: -14px;
    left: 50%;
    transform: translateX(-50%) scale(0.3);
    width: 85%;
    height: 16px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(0,0,0,0.65), transparent 70%);
    opacity: 0;
    animation: shadow-flex 1.2s cubic-bezier(0.5, 0, 0.75, 0) forwards;
  }

  @keyframes shadow-flex {
    0% { transform: translateX(-50%) scale(0.3); opacity: 0; }
    15% { opacity: 0.2; }
    55% { transform: translateX(-50%) scale(1); opacity: 0.85; }
    78% { transform: translateX(-50%) scale(0.65); opacity: 0.45; }
    100% { transform: translateX(-50%) scale(1); opacity: 0.85; }
  }

  .title-wrap {
    opacity: 0;
    transform: translateY(14px);
    animation: title-in 0.5s ease-out 1.1s forwards;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  @keyframes title-in {
    to { opacity: 1; transform: translateY(0); }
  }

  .pretitle {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.4em;
    color: var(--accent);
    margin: 0;
    text-transform: uppercase;
  }

  .title {
    font-family: var(--font-display);
    font-size: 1.65rem;
    font-weight: 900;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    text-align: center;
    margin: 0;
    line-height: 1.05;
    color: var(--text);
    max-width: 22ch;
  }

  @media (min-width: 768px) {
    .title { font-size: 2.5rem; }
    .pretitle { font-size: 0.8rem; }
  }

  .accent-bar {
    width: 48px;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    border-radius: 2px;
    margin-top: 0.25rem;
  }

  .tagline {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    color: var(--text-muted);
    margin: 0;
    font-style: italic;
  }

  .skip {
    position: absolute;
    top: max(1rem, env(safe-area-inset-top));
    right: 1rem;
    background: color-mix(in srgb, var(--text) 6%, transparent);
    border: 1px solid color-mix(in srgb, var(--text) 14%, transparent);
    color: var(--text-muted);
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    font-family: inherit;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 2;
  }

  .skip:hover {
    background: color-mix(in srgb, var(--text) 12%, transparent);
    color: var(--text);
    border-color: color-mix(in srgb, var(--text) 25%, transparent);
  }

  .enter {
    position: absolute;
    bottom: max(2.5rem, calc(env(safe-area-inset-bottom) + 2rem));
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.95rem 1.85rem;
    background: linear-gradient(135deg, #ff8c42, #e66a2e);
    color: #fff;
    border: none;
    border-radius: 999px;
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 10px 30px var(--accent-shadow);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.5s, transform 0.25s, box-shadow 0.25s;
    pointer-events: none;
  }

  .enter.ready {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
    animation: pulse 2.4s ease-in-out 0.8s infinite;
  }

  .enter svg {
    width: 16px;
    height: 16px;
  }

  .enter:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px var(--accent-shadow);
    animation: none;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 10px 30px var(--accent-shadow); }
    50% { box-shadow: 0 12px 44px var(--accent-shadow); }
  }

  @media (prefers-reduced-motion: reduce) {
    .ball, .floor-shadow { animation-duration: 0.3s; }
    .title-wrap { animation-delay: 0.3s; }
    .court-lines { animation: none; opacity: 1; }
  }
</style>
