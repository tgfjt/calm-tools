import { describe, it, expect } from 'vitest';
import { stepResponseSchema } from '../../src/lib/schemas';

describe('stepResponseSchema', () => {
  it('少なくとも1つ入力があれば valid', () => {
    // Arrange
    const input = ['テスト', '', ''];

    // Act
    const result = stepResponseSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(true);
  });

  it('全て空文字だと invalid', () => {
    // Arrange
    const input = ['', '', ''];

    // Act
    const result = stepResponseSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(false);
  });

  it('空白文字のみでも invalid', () => {
    // Arrange
    const input = ['  ', '   '];

    // Act
    const result = stepResponseSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(false);
  });

  it('混在 (一部入力、一部空) は valid', () => {
    // Arrange
    const input = ['テスト1', '', 'テスト2', '', ''];

    // Act
    const result = stepResponseSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(true);
  });

  it('配列でない場合は invalid', () => {
    // Arrange
    const input = 'not an array';

    // Act
    const result = stepResponseSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(false);
  });
});
