import type { DefaultPlugins, Row } from "@notion-kit/table-view";

/** Uma linha de tarefa na database. */
export type TaskRow = Row<DefaultPlugins>;

export type TaskStatus = "Backlog" | "Em andamento" | "Em revisão" | "Concluído";

/**
 * Contrato de persistência das tarefas.
 *
 * Hoje a implementação é localStorage (single-user). Quando o backend
 * (Supabase) entrar, basta trocar a implementação — os componentes
 * não mudam. É por isso que tudo passa por aqui e nunca acessa
 * localStorage direto.
 */
export interface TaskRepository {
  /** Carrega as tarefas (seed na primeira vez / no servidor). */
  load(): TaskRow[];
  /** Salva a lista atual. */
  save(rows: TaskRow[]): void;
  /** Última lista conhecida (seed antes do primeiro load). */
  getLatest(): TaskRow[];
  /** Apaga os dados locais. */
  clear(): void;
}
