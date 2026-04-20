<script>
  let { team, size } = $props();

  const base = import.meta.env.BASE_URL;

  function contrastText(hex) {
    if (!hex) return '#ffffff';
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 150 ? '#0f2e26' : '#ffffff';
  }

  let bgStyle = $derived(
    team.color2
      ? `linear-gradient(180deg, ${team.color} 0 50%, ${team.color2} 50% 100%)`
      : team.color
  );

  let initialsText = $derived((team.short ?? team.name ?? '?').slice(0, 2).toUpperCase());
</script>

<div
  class="crest"
  class:has-logo={!!team.logo}
  style:background={bgStyle}
  style:--inline-size={size ? `${size}px` : null}
  style:--ink={contrastText(team.color)}
  aria-label={team.name}
>
  {#if team.logo}
    <img class="crest-img" src="{base}{team.logo}" alt="" loading="lazy" />
  {:else}
    <span class="crest-initials">{initialsText}</span>
  {/if}
</div>

<style>
  .crest {
    width: var(--inline-size, var(--crest-size, 32px));
    height: var(--inline-size, var(--crest-size, 32px));
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--text) 18%, transparent);
  }

  .crest.has-logo {
    padding: 2px;
  }

  .crest-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background: #fff;
    display: block;
  }

  .crest-initials {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: calc(var(--inline-size, var(--crest-size, 32px)) * 0.42);
    letter-spacing: 0.04em;
    color: var(--ink);
    line-height: 1;
    padding-top: 0.08em;
  }
</style>
