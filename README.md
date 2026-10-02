# NoNotion-Next

MVP interno do Grupo IDE: database de tarefas com Table View e Kanban,
usando os componentes reais do [Notion UI Kit](https://notion-ui.vercel.app/)
(`@notion-kit/ui` + `@notion-kit/table-view`) sobre Next.js + shadcn.

## Rodar

```bash
pnpm install
pnpm dev
```

Abre http://localhost:3000 no navegador.

## No Antigravity

Abre a pasta do projeto no Antigravity e roda os mesmos comandos acima
no terminal integrado.

## O que tem

- Uma database de tarefas ("Tarefas de Engenharia"), em PT-BR
- As duas abas usam o MESMO componente oficial `TableView` do
  `@notion-kit/table-view`, igual à doc
  (https://notion-ui.vercel.app/docs/blocks/table-view):
  - Aba **Tabela**: `layout: "table"`
  - Aba **Kanban**: `layout: "board"`, agrupado por Status via
    `table.setGroupingColumn("status")` (a mesma API que o botão
    "Select a grouping property" do kit usa)
- Nada customizado: nenhum Kanban separado, nenhum componente visual próprio.
  Só o renderer oficial do kit nas duas views.
- Arrastar-e-soltar cards entre colunas (atualiza o Status da tarefa)
- Colunas: Tarefa (título), Status (Backlog / Em andamento / Em revisão / Concluído),
  Responsável, Prazo
- 12 tarefas fictícias de exemplo
- Alterações salvas no navegador (localStorage)

## Nota técnica: patch no @dnd-kit/dom

O board oficial usa `@dnd-kit` por dentro pro arrastar-e-soltar. A versão
`0.5.0` tem um bug conhecido (PRs #2099 e #2102 no repo do dnd-kit, ainda
não mergeados): durante o drag entre colunas, o plugin de ordenação otimista
move nós do DOM diretamente e o React 19 quebra a reconciliação com o erro
`removeChild: The node to be removed is not a child of this node`, derrubando
a página.

Como o `TableView` já atualiza os dados via `setTableData` no drag-over
(o React re-renderiza o preview sozinho), o movimento direto no DOM é
redundante aqui. O patch em `patches/@dnd-kit__dom@0.5.0.patch`
(via `patchedDependencies` no `pnpm-workspace.yaml`) desativa só esse
movimento direto no DOM. Nenhum código do app foi alterado por causa disso:
continua 100% o `TableView` oficial nas duas abas. Quando o dnd-kit lançar
a correção oficial, é só remover o patch.

## Limites atuais

- Sem backend: os dados ficam só no navegador de quem usa (localStorage).
  Pra equipe usar junto vai precisar de banco + API depois.
- Sem páginas do Notion: o escopo é só as duas views da database.
