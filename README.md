# NoNotion-Next

Quadro de tarefas interno do Grupo IDE (StudUP + IDE Digital), estilo Notion:
tabela + kanban das tarefas da equipe, em PT-BR.

Stack: Next.js + `@notion-kit/ui` + `@notion-kit/table-view`.

## Rodar

Pré-requisitos: Node 18.18+ (ou 20+) e `pnpm`.

```bash
git clone https://github.com/victorwilliames/NoNotion-Next.git
cd NoNotion-Next
pnpm install
pnpm dev
```

Abre http://localhost:3000 no navegador. No Antigravity, abre a pasta do
projeto e roda os mesmos comandos no terminal integrado.

Na primeira instalação o `pnpm install` gera o `pnpm-lock.yaml` — commita ele.

## Estrutura

```
app/
  page.tsx                    → só composição (header + repositório)
  components/
    DatabaseHeader.tsx        → título + abas de view estilo Notion (ícone + nome)
    TaskTable.tsx             → aba Tabela (TableView, layout "table")
    TaskBoard.tsx             → aba Kanban (TableView, layout "board", agrupado por status)
    TasksErrorBoundary.tsx    → fallback PT-BR se o TableView quebrar
    icons.tsx                 → ícones de view do Notion (extraídos do kit)
lib/
  tasks/
    types.ts                  → TaskRow + interface TaskRepository
    seed.ts                   → 12 tarefas fictícias de exemplo
    columns.ts                → colunas (Tarefa, Status, Responsável, Prazo)
    local-repository.ts       → persistência em localStorage (fase single-user)
patches/                      → patches do pnpm (ver patches/README.md)
```

As duas abas usam o MESMO componente oficial `TableView` do
`@notion-kit/table-view`, igual à doc
(https://notion-ui.vercel.app/docs/blocks/table-view). Nada customizado:
nenhum Kanban separado, nenhum componente visual próprio.

## Persistência

Hoje é `localStorage` (chave `nonotion-tarefas-v1`) — cada navegador tem suas
próprias tarefas. Toda leitura/escrita passa pela interface `TaskRepository`
(`lib/tasks/types.ts`); quando o backend entrar, basta trocar a implementação,
os componentes não mudam.

## Patches

Detalhes em `patches/README.md`. Resumo:

- `patches/@dnd-kit__dom@0.5.0.patch`: corrige o crash de drag do
  `@dnd-kit/dom` 0.5.0 (PRs #2099 e #2102 no repo do dnd-kit, ainda não
  mergeados). O plugin de ordenação otimista move nós do DOM diretamente e o
  React 19 quebra com `removeChild` durante o drag entre colunas. Como o
  `TableView` já atualiza os dados via `setTableData` no drag-over, o
  movimento direto no DOM é redundante aqui — o patch desativa só ele.
  Remover quando o dnd-kit publicar a correção oficial.
- `patches/@notion-kit__table-view@1.2.0.patch`: traduz ~160 strings da
  interface pra PT-BR (o kit não tem suporte a locale) + tooltip com o
  título completo nas células truncadas.
- `patches/@notion-kit__table-hook@1.2.0.patch`: traduz as opções
  "Open in" (Lateral / Central / Página inteira).

**Regra: nunca atualize esses pacotes sem regenerar os patches.** As versões
estão fixadas exatas no `package.json` de propósito — um `pnpm install`
fresco nunca vai resolver versão nova e quebrar o patch.

## Limites atuais (v0.1/v0.2)

- Sem backend: os dados ficam só no navegador de quem usa. Pra equipe usar
  junto vai precisar de banco + API (roadmap: Supabase).
- Sem páginas do Notion: o escopo é só as duas views da database.

## Roadmap

- **v0.1**: MVP single-user PT-BR, testado.
- **v0.2** (atual): higiene + arquitetura (componentes, `TaskRepository`, docs).
- **v0.3**: backend Supabase — tarefas compartilhadas em tempo real.
- **v0.4**: login da equipe + deploy na Vercel.
