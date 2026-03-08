import type { ReadingEntry } from "@/lib/types";

const DB_NAME = "scriptura-offline";
const DB_VERSION = 1;
const ENTRIES_STORE = "reading-entries";
const META_STORE = "meta";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
        db.createObjectStore(ENTRIES_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Cache reading entries to IndexedDB for offline access */
export async function cacheEntries(entries: ReadingEntry[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction([ENTRIES_STORE, META_STORE], "readwrite");
  const store = tx.objectStore(ENTRIES_STORE);
  const metaStore = tx.objectStore(META_STORE);

  // Clear existing entries and replace with fresh data
  store.clear();
  for (const entry of entries) {
    store.put(entry);
  }

  // Track last sync time
  metaStore.put({ key: "lastSync", value: Date.now() });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/** Retrieve cached reading entries from IndexedDB */
export async function getCachedEntries(): Promise<ReadingEntry[]> {
  const db = await openDB();
  const tx = db.transaction(ENTRIES_STORE, "readonly");
  const store = tx.objectStore(ENTRIES_STORE);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      db.close();
      resolve(request.result as ReadingEntry[]);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/** Get last sync timestamp */
export async function getLastSyncTime(): Promise<number | null> {
  const db = await openDB();
  const tx = db.transaction(META_STORE, "readonly");
  const store = tx.objectStore(META_STORE);
  const request = store.get("lastSync");

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      db.close();
      const result = request.result as { key: string; value: number } | undefined;
      resolve(result?.value ?? null);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/** Check if we have any cached data */
export async function hasCachedData(): Promise<boolean> {
  try {
    const entries = await getCachedEntries();
    return entries.length > 0;
  } catch {
    return false;
  }
}
