"use client";

import { useEffect, useState } from "react";
import { TaskTable } from "./components/TaskTable";
import { TaskBoard } from "./components/TaskBoard";
import { TasksErrorBoundary } from "./components/TasksErrorBoundary";
import { DatabaseHeader, type DatabaseViewId } from "./components/DatabaseHeader";
import { taskRepository } from "@/lib/tasks/local-repository";
import type { TaskRow } from "@/lib/tasks/types";

export default function Page() {
  const [rows, setRows] = useState<TaskRow[] | null>(null);
  const [view, setView] = useState<DatabaseViewId>("table");

  // Carrega do repositório só no cliente, depois da hidratação,
  // pra não divergir do HTML gerado no servidor.
  useEffect(() => {
    setRows(taskRepository.load());
  }, []);

  // Modo controlado: o TableView recebe `data` (não `defaultData`), então
  // toda mutação (drag no kanban, edição, excluir) atualiza o estado aqui
  // e persiste — trocar de aba remonta a view com o dado atual, sem reverter.
  const handleDataChange = (next: TaskRow[]) => {
    setRows(next);
    taskRepository.save(next);
  };

  return (
    <main className="flex min-h-svh w-full flex-col">
      <div className="px-6 pt-10 md:px-24 md:pt-14">
        <DatabaseHeader title="Tarefas de Engenharia" view={view} onViewChange={setView} />
      </div>

      <div className="mt-2 flex-1 px-2 pb-10 md:px-24">
        <TasksErrorBoundary>
          {view === "table" ? (
            <TaskTable
              key={rows ? "ready" : "loading"}
              data={rows ?? taskRepository.getLatest()}
              onDataChange={handleDataChange}
            />
          ) : (
            <TaskBoard
              key={rows ? "ready" : "loading"}
              data={rows ?? taskRepository.getLatest()}
              onDataChange={handleDataChange}
            />
          )}
        </TasksErrorBoundary>
      </div>
    </main>
  );
}
