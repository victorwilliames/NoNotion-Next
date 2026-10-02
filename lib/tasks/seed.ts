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
    mk("t13", "Calendário de posts de outubro da @studupbr", "Em andamento", "Will", 4),
    mk("t14", "Editar vídeo de depoimento da aluna", "Em andamento", "Will", 5),
    mk("t15", "Ajustar responsivo do kanban no mobile", "Em andamento", "Hesron", 3),
    mk("t16", "Subir NoNotion na Vercel pra testar online", "Em andamento", "Will", 1),
    mk("t17", "Criar template de proposta comercial", "Backlog", "Adriane", 20),
    mk("t18", "Revisar copy da landing da StudUP", "Backlog", "Will", 11),
    mk("t19", "Configurar domínio próprio no site da PowerRH", "Backlog", "Hesron", 14),
    mk("t20", "Pesquisar referências de naming pra IZA", "Backlog", "Will", 15),
    mk("t21", "Automatizar relatório mensal de métricas", "Backlog", "Hesron", 22),
    mk("t22", "Criar banco de depoimentos de alunos", "Backlog", "Camila Rocha", 25),
    mk("t23", "Otimizar imagens do site (WebP)", "Backlog", "Hesron", 17),
    mk("t24", "Documentar padrão de commits do NoNotion", "Backlog", "Will", 19),
    mk("t25", "Nova identidade dos stories", "Em revisão", "Will", 2),
    mk("t26", "Texto sobre nós do site PowerRH", "Em revisão", "Gracy", 3),
    mk("t27", "Protótipo da página de matrícula", "Em revisão", "Hesron", 6),
    mk("t28", "Migrar DNS do domínio", "Concluído", "Hesron", -3),
    mk("t29", "Aprovar arte do carrossel de cursos", "Concluído", "Will", -1),
    mk("t30", "Configurar Google Analytics", "Concluído", "Hesron", -4),
  ];
}
