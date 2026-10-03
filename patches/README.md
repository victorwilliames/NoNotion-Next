# Patches (pnpm `patchedDependencies`)

O kit (`@notion-kit/*`) não tem suporte a PT-BR e o `@dnd-kit/dom` 0.5.0 tem
um bug de drag. Em vez de fork, usamos `pnpm patch`: cada arquivo aqui é um
diff aplicado sobre a versão exata do pacote no `pnpm install`.

## Arquivos

| Patch | Pacote | O quê |
|---|---|---|
| `@dnd-kit__dom@0.5.0.patch` | `@dnd-kit/dom` 0.5.0 | Desativa o movimento direto de nós do DOM no drag (crash `removeChild` com React 19). Redundante aqui porque o TableView já re-renderiza o preview via `setTableData`. |
| `@notion-kit__table-view@1.2.0.patch` | `@notion-kit/table-view` 1.2.0 | Traduz ~160 strings de exibição pra PT-BR (botões, diálogos, menus, toolbar de seleção, presets de data). Só display — nenhuma chave lógica foi tocada. Também adiciona `title` (tooltip) no span do título da célula da tabela. **Correções funcionais/visuais (2026-10-03):** botão "Novo" da toolbar cria a linha via `table.addRow()` e abre o detalhe via `table.openRow(id)`; menu "⋯" do detalhe da linha usa `DropdownMenu` do `@notion-kit/ui` com item "Excluir" (`table.deleteRow`); gutter de ações da linha responsivo (`16px` mobile, `96px` desktop via `md:`); remove `underline` do texto do título na tabela (`TitleTableSlot`) pra ficar igual ao Notion. |
| `@notion-kit__table-hook@1.2.0.patch` | `@notion-kit/table-hook` 1.2.0 | Traduz `ROW_VIEW_OPTIONS` ("Open in side/center/full peek" → "Abrir em painel lateral/central/página inteira"). |

## Regras

1. **Nunca atualize esses pacotes sem regenerar os patches.** As versões
   estão fixadas exatas no `package.json` de propósito.
2. Pra regenerar/editar um patch:
   ```bash
   pnpm patch "@notion-kit/table-view@1.2.0" --edit-dir /tmp/tv-patch
   # edita os arquivos em /tmp/tv-patch
   pnpm patch-commit /tmp/tv-patch
   ```
3. Quando o dnd-kit publicar a correção oficial do drag, remover o patch
   dele (é o único temporário; os de PT-BR ficam até o kit ter i18n).
