"use client";

import { useEffect } from "react";
import { TableView, useTableViewCtx } from "@notion-kit/table-view";
import type { PartialTableViewState } from "@notion-kit/table-view";
import { TASK_COLUMNS } from "@/lib/tasks/columns";
import type { TaskRow } from "@/lib/tasks/types";

type Table = ReturnType<typeof useTableViewCtx>["table"];

type Props = {
  data: TaskRow[];
  onDataChange: (rows: TaskRow[]) => void;
  onTableReady?: (table: Table | null) => void;
};

/**
 * Agrupa o board pela propriedade Status usando a API oficial do kit
 * (o mesmo que o botão "Selecionar propriedade de agrupamento" faz).
 */
function BoardGrouping() {
  const { table } = useTableViewCtx();
  useEffect(() => {
    table.setGroupingColumn("status");
  }, [table]);
  return null;
}

/** Captura a instância da tabela do contexto e expõe via callback. */
function TableCapture({ onTableReady }: { onTableReady?: (table: Table | null) => void }) {
  const { table } = useTableViewCtx();
  useEffect(() => {
    onTableReady?.(table);
    return () => onTableReady?.(null);
  }, [table, onTableReady]);
  return null;
}

/**
 * Aba Kanban — o mesmo TableView em layout de board, agrupado por status.
 *
 * Nota do tech lead: a troca Tabela/Kanban remonta o TableView de propósito.
 * O kit guarda o layout num estado interno sem API pública pra trocar sem
 * remontar; o `defaultView` é o caminho documentado. Remontar perde scroll e
 * seleção ao trocar de aba, mas é simples e não depende de API interna.
 */
export function TaskBoard({ data, onDataChange, onTableReady }: Props) {
  return (
    <TableView
      defaultData={data}
      onDataChange={(change) => onDataChange(change.next)}
      defaultProperties={TASK_COLUMNS}
      defaultView={
        {
          layout: "board",
          pluginMethods: {
            groupingMethodByColumn: { status: "value" },
          },
        } as PartialTableViewState
      }
    >
      <BoardGrouping />
      <TableCapture onTableReady={onTableReady} />
    </TableView>
  );
}
