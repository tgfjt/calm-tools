import { describe, it, expect, beforeAll } from 'vitest';
import 'fake-indexeddb/auto';
import {
  initDB,
  saveBreathSession,
  getBreathSessions,
  saveGroundingSession,
  getGroundingSessions,
  deleteGroundingSession,
} from '../../src/lib/db';

describe('CalmToolsDB', () => {
  beforeAll(async () => {
    await initDB();
  });

  describe('Breath Sessions', () => {
    it('セッションを保存して取得できる', async () => {
      // Arrange
      const session = {
        timestamp: new Date().toISOString(),
        completed: true,
        duration: 60,
        pattern: '555' as const,
      };

      // Act
      const id = await saveBreathSession(session);
      const sessions = await getBreathSessions();

      // Assert
      expect(id).toBeGreaterThan(0);
      expect(sessions.length).toBeGreaterThanOrEqual(1);
      const saved = sessions.find(s => s.id === id);
      expect(saved).toBeDefined();
      expect(saved!.completed).toBe(true);
      expect(saved!.pattern).toBe('555');
    });
  });

  describe('Grounding Sessions', () => {
    it('セッションを保存して取得できる', async () => {
      // Arrange
      const session = {
        timestamp: new Date().toISOString(),
        responses: [
          { step: 0, category: 'sight', title: '見えるもの 5つ', data: ['空', '雲', '', '', ''] },
        ],
      };

      // Act
      const id = await saveGroundingSession(session);
      const sessions = await getGroundingSessions();

      // Assert
      expect(id).toBeGreaterThan(0);
      const saved = sessions.find(s => s.id === id);
      expect(saved).toBeDefined();
      expect(saved!.responses).toHaveLength(1);
      expect(saved!.responses[0].category).toBe('sight');
    });

    it('セッションを削除できる', async () => {
      // Arrange
      const session = {
        timestamp: new Date().toISOString(),
        responses: [],
      };
      const id = await saveGroundingSession(session);

      // Act
      await deleteGroundingSession(id);
      const sessions = await getGroundingSessions();

      // Assert
      const deleted = sessions.find(s => s.id === id);
      expect(deleted).toBeUndefined();
    });
  });
});
