"use client";

import { TableView } from "@notion-kit/table-view";
import { TASK_COLUMNS } from "@/lib/tasks/columns";
import type { TaskRow } from "@/lib/tasks/types";

type Props = {
  data: TaskRow[];
  onDataChange: (rows: TaskRow[]) => void;
};

/** Aba Tabela — TableView oficial do kit em layout de tabela. */
export function TaskTable({ data, onDataChange }: Props) {
  return (
    <TableView
      data={data}
      onDataChange={(change) => onDataChange(change.next)}
      defaultProperties={TASK_COLUMNS}
      defaultColumn={{ size: 280 }}
      defaultView={{ layout: "table" }}
    />
  );
}
