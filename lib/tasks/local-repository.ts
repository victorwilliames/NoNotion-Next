import { seedRows } from "./seed";
import type { TaskRepository, TaskRow } from "./types";

const STORAGE_KEY = "nonotion-tarefas-v1";

/**
 * Persistência em localStorage (fase single-user).
 *
 * Comportamento preservado do v0.1:
 * - no servidor (SSR), retorna o seed — o dado real só carrega no cliente,
 *   depois da hidratação, pra não divergir do HTML gerado no servidor;
 * - nunca sobrescreve a lista salva com array vazio: um onDataChange
 *   espúrio não pode apagar as tarefas do usuário (vazio = reseed).
 */
export function createLocalRepository(): TaskRepository {
  let latest: TaskRow[] | null = null;
  let loaded = false;

  const readStorage = (): TaskRow[] | null => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignora e usa seed
    }
    return null;
  };

  return {
    load(): TaskRow[] {
      if (typeof window === "undefined") return seedRows();
      if (!loaded) {
        latest = readStorage() ?? seedRows();
        loaded = true;
      }
      return latest!;
    },

    save(next: TaskRow[]): void {
      latest = next;
      if (!Array.isArray(next) || next.length === 0) return;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignora falha de persistência local
      }
    },

    getLatest(): TaskRow[] {
      return latest ?? seedRows();
    },

    clear(): void {
      latest = null;
      loaded = false;
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignora
      }
    },
  };
}

/** Instância compartilhada usada pela página. */
export const taskRepository = createLocalRepository();
