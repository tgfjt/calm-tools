import { t } from '../../i18n';

interface Props {
  current?: 'home' | 'breath' | 'grounding';
}

export default function Navigation({ current }: Props) {
  const i18n = t();

  return (
    <nav class="nav">
      <a href="/" class={current === 'home' ? 'active' : ''}>
        {i18n.common.home}
      </a>
      <a href="/breath" class={current === 'breath' ? 'active' : ''}>
        {i18n.nav.breath}
      </a>
      <a href="/grounding" class={current === 'grounding' ? 'active' : ''}>
        {i18n.nav.grounding}
      </a>
    </nav>
  );
}
