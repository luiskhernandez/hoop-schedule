<script>
  let { team, size } = $props();

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

  let shortCode = $derived((team.short ?? team.name ?? '?').toUpperCase());
  let isSplit = $derived(!!team.color2);
</script>

<div
  class="crest"
  class:is-split={isSplit}
  style:background={bgStyle}
  style:--inline-size={size ? `${size}px` : null}
  style:--ink={contrastText(team.color)}
  aria-label={team.name}
  title={team.name}
>
  <span class="crest-code">{shortCode}</span>
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
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--text) 22%, transparent),
      inset 0 -2px 5px color-mix(in srgb, #000 18%, transparent),
      inset 0 1px 3px color-mix(in srgb, #fff 12%, transparent);
  }

  .crest-code {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: calc(var(--inline-size, var(--crest-size, 32px)) * 0.32);
    letter-spacing: 0.03em;
    color: var(--ink);
    line-height: 1;
    padding-top: 0.06em;
    user-select: none;
  }

  /* Split-color teams (e.g. Chiguiros): add a subtle stroke around the
     letters so they stay legible over both halves. */
  .crest.is-split .crest-code {
    text-shadow:
      0 0 2px color-mix(in srgb, #000 65%, transparent),
      0 1px 0 color-mix(in srgb, #000 45%, transparent);
  }
</style>
