"use client";

import { useEffect } from "react";
import { TableView, useTableViewCtx } from "@notion-kit/table-view";
import type { PartialTableViewState } from "@notion-kit/table-view";
import { TASK_COLUMNS } from "@/lib/tasks/columns";
import type { TaskRow } from "@/lib/tasks/types";

type Props = {
  data: TaskRow[];
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

/**
 * Aba Kanban — o mesmo TableView em layout de board, agrupado por status.
 *
 * Nota do tech lead: a troca Tabela/Kanban remonta o TableView de propósito.
 * O kit guarda o layout num estado interno sem API pública pra trocar sem
 * remontar; o `defaultView` é o caminho documentado. Remontar perde scroll e
 * seleção ao trocar de aba, mas é simples e não depende de API interna.
 */
export function TaskBoard({ data }: Props) {
  return (
    <TableView
      defaultData={data}
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
    </TableView>
  );
}
