"use client";

import { useEffect, useRef, useState } from "react";
import { TableView, useTableViewCtx } from "@notion-kit/table-view";
import type {
  ColumnDefs,
  DefaultPlugins,
  PartialTableViewState,
  Row,
} from "@notion-kit/table-view";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@notion-kit/ui/primitives";

const STORAGE_KEY = "nonotion-tarefas-v1";

type TaskRow = Row<DefaultPlugins>;

const STATUS_OPTIONS = [
  { id: "opt-backlog", name: "Backlog", color: "gray" as const },
  { id: "opt-andamento", name: "Em andamento", color: "blue" as const },
  { id: "opt-revisao", name: "Em revisão", color: "orange" as const },
  { id: "opt-concluido", name: "Concluído", color: "green" as const },
];

const PROPERTIES: ColumnDefs<DefaultPlugins> = [
  { id: "title", name: "Tarefa", type: "title" },
  {
    id: "status",
    name: "Status",
    type: "select",
    config: {
      options: {
        names: STATUS_OPTIONS.map((o) => o.name),
        items: Object.fromEntries(STATUS_OPTIONS.map((o) => [o.name, o])),
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

function seedRows(): TaskRow[] {
  const now = Date.UTC(2026, 9, 2, 12, 0, 0);
  const day = 86400000;
  const mk = (
    id: string,
    title: string,
    status: string,
    assignee: string,
    dueInDays: number,
  ): TaskRow => ({
    id,
    createdAt: now - 3 * day,
    lastEditedAt: now - day,
    properties: {
      title: { id: `${id}-title`, value: title },
      status: { id: `${id}-status`, value: status },
      assignee: { id: `${id}-assignee`, value: assignee },
      due: {
        id: `${id}-due`,
        value: { start: Date.UTC(2026, 9, 2) + dueInDays * day },
      },
    },
  });

  return [
    mk("t01", "Corrigir lentidão nas consultas", "Em andamento", "Rafael Souza", 6),
    mk("t02", "Corrigir importação do Trello", "Backlog", "Camila Rocha", 10),
    mk("t03", "Novos emojis não renderizam", "Backlog", "Thiago Martins", 8),
    mk("t04", "Pedido de funcionalidade: prévia de links", "Backlog", "Ana Beatriz", 13),
    mk("t05", "Modo escuro do e-mail não funciona", "Concluído", "Juliana Castro", 0),
    mk("t06", "Implementar login com Google", "Backlog", "Pedro Henrique", 16),
    mk("t07", "Bug: databases não carregam no Firefox", "Concluído", "Fernanda Lima", -1),
    mk("t08", "Criar grupos e subgrupos na database", "Em revisão", "Lucas Almeida", 7),
    mk("t09", "Filtros rápidos na database", "Em andamento", "Mariana Silva", 9),
    mk("t10", "Testes beta e coleta de feedback", "Em revisão", "Gabriel Oliveira", 12),
    mk("t11", "Desenvolver wireframe do app", "Backlog", "Beatriz Santos", 18),
    mk("t12", "Integração com canais de suporte existentes", "Concluído", "Rafael Souza", -2),
  ];
}

function loadRows(): TaskRow[] {
  if (typeof window === "undefined") return seedRows();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignora e usa seed
  }
  return seedRows();
}

// Agrupa o board pela propriedade Status usando a API oficial do kit
// (o mesmo que o botão "Select a grouping property" faz).
function BoardGrouping() {
  const { table } = useTableViewCtx();
  useEffect(() => {
    table.setGroupingColumn("status");
  }, [table]);
  return null;
}

export default function Page() {
  const latestRows = useRef<TaskRow[]>(seedRows());
  const [initialData, setInitialData] = useState<TaskRow[] | null>(null);
  const [layout, setLayout] = useState<"table" | "board">("table");

  // Carrega do localStorage só no cliente, depois da hidratação,
  // pra não divergir do HTML gerado no servidor.
  useEffect(() => {
    const stored = loadRows();
    latestRows.current = stored;
    setInitialData(stored);
  }, []);

  const persist = (next: TaskRow[]) => {
    latestRows.current = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignora falha de persistência local
    }
  };

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-4 px-6 py-10">
      <h1 className="text-[32px] font-bold tracking-tight">Tarefas de Engenharia</h1>

      <Tabs value={layout} onValueChange={(v) => setLayout(v as "table" | "board")}>
        <TabsList>
          <TabsTrigger value="table">Tabela</TabsTrigger>
          <TabsTrigger value="board">Kanban</TabsTrigger>
        </TabsList>
      </Tabs>

      <TableView
        key={`${layout}-${initialData ? "ready" : "loading"}`}
        defaultData={initialData ?? latestRows.current}
        onDataChange={(change) => persist(change.next)}
        defaultProperties={PROPERTIES}
        defaultView={
          {
            layout,
            ...(layout === "board"
              ? {
                  pluginMethods: {
                    groupingMethodByColumn: { status: "value" },
                  },
                }
              : {}),
          } as PartialTableViewState
        }
      >
        {layout === "board" ? <BoardGrouping /> : null}
      </TableView>
    </main>
  );
}
