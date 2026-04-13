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
  <div class="overlay" onclick={handleClick} role="dialog" aria-modal="true">
    <div class="wrap">
      <button class="close" onclick={onclose} aria-label="Close">&times;</button>
      <img {src} alt="Game scoresheet" class="img" />
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.92);
    backdrop-filter: blur(12px);
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
    border-radius: 0.5rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    object-fit: contain;
  }

  .close {
    position: absolute;
    top: -2rem;
    right: 0;
    background: none;
    border: none;
    color: #a1a1aa;
    font-size: 2rem;
    cursor: pointer;
    padding: 0.5rem;
    line-height: 1;
    transition: color 0.15s;
  }

  .close:hover { color: white; }
</style>
