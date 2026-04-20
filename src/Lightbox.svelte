<script>
  let { src, onclose } = $props();

  function handleKey(e) {
    if (e.key === 'Escape') onclose();
  }

  function handleClick(e) {
    if (e.target === e.currentTarget) onclose();
  }
</script>

<svelte:window onkeydown={handleKey} />

{#if src}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="overlay" onclick={handleClick} role="dialog" aria-modal="true" tabindex="-1">
    <div class="wrap">
      <button class="close" onclick={onclose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <img {src} alt="Game scoresheet" class="img" />
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: var(--overlay);
    backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: lb-in 0.2s ease;
  }

  @keyframes lb-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .wrap {
    position: relative;
    max-width: 100%;
    max-height: 100%;
  }

  .img {
    max-width: 100%;
    max-height: calc(100vh - 4rem);
    max-height: calc(100dvh - 4rem);
    border-radius: 0.75rem;
    box-shadow: 0 24px 48px rgba(0,0,0,0.3);
    object-fit: contain;
  }

  .close {
    position: absolute;
    top: -2.5rem;
    right: 0;
    background: rgba(255,255,255,0.15);
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.35rem;
    border-radius: 50%;
    line-height: 0;
    transition: background 0.15s;
    backdrop-filter: blur(4px);
  }

  .close:hover { background: rgba(255,255,255,0.25); }
</style>
