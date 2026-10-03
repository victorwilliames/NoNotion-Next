# Plano: fidelidade ao Notion (v1)

Data: 2026-10-02. Base: estudo do Notion real (DB_IDE, workspace Will IDE Space) + auditoria funcional do site publicado + análise visual-qa + crítica ux-reviewer + diagnóstico de código.

Regra dura do dono: **somente @notion-kit/ui, @notion-kit/table-view, shadcn e Tailwind**. Nada de CSS ou componente customizado inventado. Correções dentro do kit via `pnpm patch` são aceitas (prática já estabelecida no projeto, como os patches PT-BR).

## Já em voo (commit 49bdebe, deploy automático)
- Aba ativa com pill cinza (igual ao Notion)
- Título 32px, gap de 16px até as abas
- lang="pt-BR" (commit d0ab806)

## Fase 1 — Bugs funcionais (ordem de impacto)

1. **Drag no kanban perde a mudança em silêncio** (data loss, o pior bug)
   Causa: `app/page.tsx` usa `defaultData` (não-controlado) + `initialData` carregado uma vez; na troca de aba o TableView remonta com o dado obsoleto.
   Fix: modo controlado, API pública do kit — `const [rows, setRows] = useState(...)`, `onDataChange={(next) => { setRows(next); taskRepository.save(next); }}`, `<TableView data={rows}>`. Sem patch.

2. **Botão "Novo" (azul) não faz nada**
   Causa: dentro do kit (`ToolbarContent`), o botão é renderizado sem `onClick` e sem dropdown — UI morta no kit v1.2.0. Sem prop que habilite.
   Fix: `pnpm patch` adicionando `onClick={() => table.addRow()}` (`table` via `useTableViewCtx()`, `addRow` é API pública do table-hook).

3. **Menu "⋯" no diálogo de detalhe não abre (excluir bloqueado)**
   Causa: dentro do kit (`ViewNav`), botão sem DropdownMenu — UI morta.
   Fix: `pnpm patch` envolvendo o botão nos `DropdownMenu*` do próprio `@notion-kit/ui`, item "Excluir" chamando `table.deleteRow(rowId)` + `table.openRow(null)` (APIs públicas).

4. **Badge "Backlog" invisível (13 de 30 tarefas sem status legível)**
   Causa: dentro do kit (`@notion-kit/utils`, `COLOR.gray.rgba = "rgba(255,255,255,0.13)"`) — alfa branco, token desenhado para dark mode; aplicado inline pelo `OptionTag`, some no tema claro.
   Fix: `pnpm patch` alinhando com o próprio Badge do kit: `"rgba(206, 205, 202, 0.5)"` (equivale ao `bg-[#cecdca]/50` da variante `tag`). Ressalva: um rgba só não serve perfeito claro+escuro; o kit não tem variante por tema nesse mapa.

## Fase 2 — Mobile (dispositivo principal do dono)

5. **Gutter de 96px do kit esmaga o mobile; toolbar cortada**
   O kit fixa `--table-view-row-action-gutter:96px` sem variante responsiva; em 390px sobram ~198px úteis e a toolbar (`overflow-x-clip`) corta Filtrar/Ordenar/automações.
   Fix: sobrescrever o token no wrapper (mecanismo de theming do próprio kit, não personalização): `[--table-view-row-action-gutter:16px] md:[--table-view-row-action-gutter:96px]`. Devolve ~160px úteis.

6. **Título responsivo**
   Fix: `text-2xl md:text-[32px]` no DatabaseHeader (nosso componente, Tailwind permitido).

7. **Validação visual mobile**
   O ambiente de automação não faz emulação de viewport, então validar no aparelho real (o dono usa o site no celular) + nova auditoria desktop pós-fase 1.

## Fase 3 — Fidelidade visual (investigar, depois implementar o viável via kit/patch)

8. **Tabela não usa a largura disponível** — colunas herdam 200px fixos do kit (`defaultColumn`), títulos truncam, vazio à direita.
   Fix kit-only: `defaultColumn={{ size: 280 }}` (prop pública). Limite declarado: coluna de título elástica como no Notion não é suportada por props do kit; sem patch no sizing, 280px é o máximo kit-only.

9. **Badges de status: pill chapada vs pill pastel + bolinha do Notion** — investigar se `OptionTag` suporta dot; se não, avaliar patch mínimo ou aceitar pill chapada (pós-fix do gray).

10. **Títulos sublinhados** — no Notion o título é texto puro. Investigar origem do underline (kit?) e remover via patch se for do kit.

11. **Datas em formato numérico ("07/10/2026") vs "2 de outubro de 2026"** — verificar formato de data do kit; provavelmente coberto por patch de locale como os PT-BR.

12. **Kanban** — colunas no Notion têm wash pastel da cor do status (marca visual forte); cards mostram só título (coluna já indica o status); "+ Nova página" no fim de cada coluna; cabeçalho com botões "…" e "+". Investigar o que o board do kit expõe via props antes de decidir patch.

13. **Comportamento do clique no título** — no Notion, clique simples edita inline na célula; abrir a página exige o botão "ABRIR" no hover. O nosso abre o painel direto. Avaliar se o kit tem edição inline (provável que sim, via célula) e alinhar.

## Fora do escopo / declarado sem fix kit-legal
- **Sidebar esquerda do Notion** (~272px): maior diferença estrutural. Hoje o produto é só a página da database (decisão de escopo). **Pende decisão do dono.**
- **Touch targets < 44px** na toolbar: o kit não expõe prop de tamanho; aumentar via CSS seria personalização. Sem fix hoje; mitigação parcial pelo item 5.
- **Botão "+" de adicionar view**: não existe feature de criar view no MVP; não adicionar UI morta.
- **Seta "▶" de expandir**: nossos dados não têm subpáginas; nada a fazer.

## Ordem de execução proposta
Fase 1 (itens 1–4) → teste funcional → Fase 2 (5–7) → validação mobile no aparelho real → Fase 3 (8–13, investigar + implementar) → auditoria final desktop.
