"use client";

import { ViewBoardIcon, ViewTableIcon } from "./icons";
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export type DatabaseViewId = "table" | "board";

type ViewDef = {
  id: DatabaseViewId;
  label: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
};

const VIEWS: ViewDef[] = [
  { id: "table", label: "Tabela", Icon: ViewTableIcon },
  { id: "board", label: "Kanban", Icon: ViewBoardIcon },
];

type Props = {
  title: string;
  view: DatabaseViewId;
  onViewChange: (view: DatabaseViewId) => void;
};

/**
 * Cabeçalho da database no estilo do Notion: título + abas de view
 * (ícone + nome, sem pills — igual ao Notion).
 */
export function DatabaseHeader({ title, view, onViewChange }: Props) {
  return (
    <div>
      <h1 className="text-[32px] font-bold leading-[1.25] tracking-tight">{title}</h1>
      <div role="tablist" aria-label="Views" className="mt-4 flex items-center gap-1">
        {VIEWS.map(({ id, label, Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              onClick={() => onViewChange(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors",
                active
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
