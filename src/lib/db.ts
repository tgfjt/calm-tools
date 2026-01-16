// IndexedDB共通層
const DB_NAME = 'CalmToolsDB';
const DB_VERSION = 1;

export interface BreathSession {
  id?: number;
  timestamp: string;
  completed: boolean;
  duration: number;
  pattern: '555' | '478';
}

export interface GroundingStepResponse {
  step: number;
  category: string;
  title: string;
  data: string[];
}

export interface GroundingSession {
  id?: number;
  timestamp: string;
  responses: GroundingStepResponse[];
}

let db: IDBDatabase | null = null;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains('breathSessions')) {
        const breathStore = database.createObjectStore('breathSessions', {
          keyPath: 'id',
          autoIncrement: true,
        });
        breathStore.createIndex('timestamp', 'timestamp', { unique: false });
        breathStore.createIndex('completed', 'completed', { unique: false });
      }

      if (!database.objectStoreNames.contains('groundingSessions')) {
        const groundingStore = database.createObjectStore('groundingSessions', {
          keyPath: 'id',
          autoIncrement: true,
        });
        groundingStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Breath Sessions
export function saveBreathSession(session: Omit<BreathSession, 'id'>): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    const transaction = db.transaction(['breathSessions'], 'readwrite');
    const store = transaction.objectStore('breathSessions');
    const request = store.add(session);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export function getBreathSessions(): Promise<BreathSession[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    const transaction = db.transaction(['breathSessions'], 'readonly');
    const store = transaction.objectStore('breathSessions');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Grounding Sessions
export function saveGroundingSession(session: Omit<GroundingSession, 'id'>): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    const transaction = db.transaction(['groundingSessions'], 'readwrite');
    const store = transaction.objectStore('groundingSessions');
    const request = store.add(session);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export function getGroundingSessions(): Promise<GroundingSession[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    const transaction = db.transaction(['groundingSessions'], 'readonly');
    const store = transaction.objectStore('groundingSessions');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function deleteGroundingSession(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    const transaction = db.transaction(['groundingSessions'], 'readwrite');
    const store = transaction.objectStore('groundingSessions');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
