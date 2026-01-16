interface Props {
  current?: 'home' | 'breath' | 'grounding';
}

export default function Navigation({ current }: Props) {
  return (
    <nav class="nav">
      <a href="/" class={current === 'home' ? 'active' : ''}>
        Home
      </a>
      <a href="/breath" class={current === 'breath' ? 'active' : ''}>
        深呼吸
      </a>
      <a href="/grounding" class={current === 'grounding' ? 'active' : ''}>
        54321
      </a>
    </nav>
  );
}
