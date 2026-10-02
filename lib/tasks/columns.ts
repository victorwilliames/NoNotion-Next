import type { ColumnDefs, DefaultPlugins } from "@notion-kit/table-view";
import { TASK_STATUSES } from "./seed";

/** Colunas da database de tarefas (compartilhadas entre tabela e kanban). */
export const TASK_COLUMNS: ColumnDefs<DefaultPlugins> = [
  { id: "title", name: "Tarefa", type: "title" },
  {
    id: "status",
    name: "Status",
    type: "select",
    config: {
      options: {
        names: TASK_STATUSES.map((o) => o.name),
        items: Object.fromEntries(TASK_STATUSES.map((o) => [o.name, o])),
      },
      sort: "manual",
    },
  },
  { id: "assignee", name: "Responsável", type: "text" },
  {
    id: "due",
    name: "Prazo",
    type: "date",
    config: { dateFormat: "dd/MM/yyyy", timeFormat: "hidden" },
  },
];
