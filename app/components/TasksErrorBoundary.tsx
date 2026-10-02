"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { failed: boolean };

/**
 * Se o TableView quebrar (ex: patch do kit desatualizado), mostra uma
 * mensagem em PT-BR em vez de tela branca.
 */
export class TasksErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <p className="font-medium">Algo deu errado ao carregar as tarefas.</p>
          <p className="text-sm text-muted-foreground">
            Tenta recarregar a página. Se persistir, fala com o Will.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
