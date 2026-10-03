"use client";

import { useEffect, useRef, useState } from "react";
import { TaskTable } from "./components/TaskTable";
import { TaskBoard } from "./components/TaskBoard";
import { TasksErrorBoundary } from "./components/TasksErrorBoundary";
import { DatabaseHeader, type DatabaseViewId } from "./components/DatabaseHeader";
import { taskRepository } from "@/lib/tasks/local-repository";
import type { TaskRow } from "@/lib/tasks/types";
import type { useTableViewCtx } from "@notion-kit/table-view";

type Table = ReturnType<typeof useTableViewCtx>["table"];

export default function Page() {
  const [initialData, setInitialData] = useState<TaskRow[] | null>(null);
  const [view, setView] = useState<DatabaseViewId>("table");
  const tableRef = useRef<Table | null>(null);

  // Carrega do repositório só no cliente, depois da hidratação,
  // pra não divergir do HTML gerado no servidor.
  useEffect(() => {
    setInitialData(taskRepository.load());
  }, []);

  return (
    <main className="flex min-h-svh w-full flex-col">
      <div className="px-4 pt-10 md:px-24 md:pt-14">
        <DatabaseHeader
          title="Tarefas de Engenharia"
          view={view}
          onViewChange={setView}
          tableRef={tableRef}
        />
      </div>

      <div className="mt-2 flex-1 px-2 pb-10 md:px-24">
        <TasksErrorBoundary>
          {view === "table" ? (
            <TaskTable
              key={initialData ? "ready" : "loading"}
              data={initialData ?? taskRepository.getLatest()}
              onDataChange={(next) => taskRepository.save(next)}
              onTableReady={(table) => {
                tableRef.current = table;
              }}
            />
          ) : (
            <TaskBoard
              key={initialData ? "ready" : "loading"}
              data={initialData ?? taskRepository.getLatest()}
              onDataChange={(next) => taskRepository.save(next)}
              onTableReady={(table) => {
                tableRef.current = table;
              }}
            />
          )}
        </TasksErrorBoundary>
      </div>
    </main>
  );
}
