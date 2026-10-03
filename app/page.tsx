"use client";

import { useState } from "react";
import { TaskTable } from "./components/TaskTable";
import { TaskBoard } from "./components/TaskBoard";
import { TasksErrorBoundary } from "./components/TasksErrorBoundary";
import { DatabaseHeader, type DatabaseViewId } from "./components/DatabaseHeader";
import { taskRepository } from "@/lib/tasks/local-repository";
import type { TaskRow } from "@/lib/tasks/types";

export default function Page() {
  const [view, setView] = useState<DatabaseViewId>("table");
  const [data] = useState<TaskRow[]>(() => taskRepository.load());

  return (
    <main className="flex min-h-svh w-full flex-col">
      <div className="px-6 pt-10 md:px-24 md:pt-14">
        <DatabaseHeader title="Tarefas de Engenharia" view={view} onViewChange={setView} />
      </div>

      <div className="mt-2 flex-1 px-2 pb-10 md:px-24">
        <TasksErrorBoundary>
          {view === "table" ? (
            <TaskTable data={data} />
          ) : (
            <TaskBoard data={data} />
          )}
        </TasksErrorBoundary>
      </div>
    </main>
  );
}
