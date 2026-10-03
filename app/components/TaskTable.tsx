"use client";

import { TableView } from "@notion-kit/table-view";
import { TASK_COLUMNS } from "@/lib/tasks/columns";
import type { TaskRow } from "@/lib/tasks/types";

type Props = {
  data: TaskRow[];
};

/** Aba Tabela — TableView oficial do kit em layout de tabela. */
export function TaskTable({ data }: Props) {
  return (
    <TableView
      defaultData={data}
      defaultProperties={TASK_COLUMNS}
      defaultColumn={{ size: 280 }}
      defaultView={{ layout: "table" }}
    />
  );
}
