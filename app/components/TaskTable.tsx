"use client";

import { useEffect } from "react";
import { TableView, useTableViewCtx } from "@notion-kit/table-view";
import { TASK_COLUMNS } from "@/lib/tasks/columns";
import type { TaskRow } from "@/lib/tasks/types";

type Table = ReturnType<typeof useTableViewCtx>["table"];

type Props = {
  data: TaskRow[];
  onDataChange: (rows: TaskRow[]) => void;
  onTableReady?: (table: Table | null) => void;
};

/** Captura a instância da tabela do contexto e expõe via callback. */
function TableCapture({ onTableReady }: { onTableReady?: (table: Table | null) => void }) {
  const { table } = useTableViewCtx();
  useEffect(() => {
    onTableReady?.(table);
    return () => onTableReady?.(null);
  }, [table, onTableReady]);
  return null;
}

/** Aba Tabela — TableView oficial do kit em layout de tabela. */
export function TaskTable({ data, onDataChange, onTableReady }: Props) {
  return (
    <TableView
      defaultData={data}
      onDataChange={(change) => onDataChange(change.next)}
      defaultProperties={TASK_COLUMNS}
      defaultColumn={{ size: 280 }}
      defaultView={{ layout: "table" }}
    >
      <TableCapture onTableReady={onTableReady} />
    </TableView>
  );
}
