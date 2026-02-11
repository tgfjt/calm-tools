import { describe, it, expect } from 'vitest';
import { detectLocaleFromHeader, getTranslations } from '../../src/i18n';

describe('detectLocaleFromHeader', () => {
  it('null の場合は en を返す', () => {
    // Arrange
    const header = null;

    // Act
    const result = detectLocaleFromHeader(header);

    // Assert
    expect(result).toBe('en');
  });

  it('ja で始まるヘッダーは ja を返す', () => {
    // Arrange
    const header = 'ja';

    // Act
    const result = detectLocaleFromHeader(header);

    // Assert
    expect(result).toBe('ja');
  });

  it('ja-JP のような地域コード付きも ja を返す', () => {
    // Arrange
    const header = 'ja-JP,ja;q=0.9,en;q=0.8';

    // Act
    const result = detectLocaleFromHeader(header);

    // Assert
    expect(result).toBe('ja');
  });

  it('JA (大文字) でも ja を返す', () => {
    // Arrange
    const header = 'JA';

    // Act
    const result = detectLocaleFromHeader(header);

    // Assert
    expect(result).toBe('ja');
  });

  it('en で始まるヘッダーは en を返す', () => {
    // Arrange
    const header = 'en-US,en;q=0.9';

    // Act
    const result = detectLocaleFromHeader(header);

    // Assert
    expect(result).toBe('en');
  });

  it('未知の言語は en にフォールバック', () => {
    // Arrange
    const header = 'fr-FR,fr;q=0.9';

    // Act
    const result = detectLocaleFromHeader(header);

    // Assert
    expect(result).toBe('en');
  });

  it('空文字は en を返す', () => {
    // Arrange
    const header = '';

    // Act
    const result = detectLocaleFromHeader(header);

    // Assert
    expect(result).toBe('en');
  });
});

describe('getTranslations', () => {
  it('ja ロケールで日本語翻訳を返す', () => {
    // Arrange & Act
    const t = getTranslations('ja');

    // Assert
    expect(t.breath.title).toBe('深呼吸');
    expect(t.grounding.title).toBe('54321');
    expect(t.index.tagline).toBe('心を落ち着けるためのツール');
  });

  it('en ロケールで英語翻訳を返す', () => {
    // Arrange & Act
    const t = getTranslations('en');

    // Assert
    expect(t.breath.title).toBe('Deep Breathing');
    expect(t.grounding.title).toBe('54321');
    expect(t.index.tagline).toBe('Tools to calm your mind');
  });

  it('翻訳オブジェクトに必要なキーが全て存在する', () => {
    // Arrange & Act
    const t = getTranslations('ja');

    // Assert
    expect(t.common).toBeDefined();
    expect(t.nav).toBeDefined();
    expect(t.index).toBeDefined();
    expect(t.breath).toBeDefined();
    expect(t.grounding).toBeDefined();
    expect(t.grounding.steps.sight).toBeDefined();
    expect(t.grounding.steps.touch).toBeDefined();
    expect(t.grounding.steps.sound).toBeDefined();
    expect(t.grounding.steps.smell).toBeDefined();
    expect(t.grounding.steps.taste).toBeDefined();
  });
});
