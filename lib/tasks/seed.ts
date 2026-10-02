import type { TaskRow, TaskStatus } from "./types";

export const TASK_STATUSES: { id: string; name: TaskStatus; color: "gray" | "blue" | "orange" | "green" }[] = [
  { id: "opt-backlog", name: "Backlog", color: "gray" },
  { id: "opt-andamento", name: "Em andamento", color: "blue" },
  { id: "opt-revisao", name: "Em revisão", color: "orange" },
  { id: "opt-concluido", name: "Concluído", color: "green" },
];

/** Tarefas iniciais (primeira execução / banco vazio). */
export function seedRows(): TaskRow[] {
  const now = Date.UTC(2026, 9, 2, 12, 0, 0);
  const day = 86400000;
  const mk = (
    id: string,
    title: string,
    status: TaskStatus,
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
