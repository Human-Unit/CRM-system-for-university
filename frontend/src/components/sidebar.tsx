import type { ComponentType } from "react";
import { cn } from "../lib/cn";

type SidebarItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
};

type SidebarProps = {
  items: SidebarItem[];
  activeLabel: string;
  onSelect: (label: string) => void;
};

export function Sidebar({ items, activeLabel, onSelect }: SidebarProps) {
  return (
    <aside className="hidden w-[280px] border-r border-line bg-panel/80 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="rounded-3xl border border-line bg-bg/80 px-4 py-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
          Campus OS
        </p>
        <h2 className="mt-2 text-xl font-extrabold tracking-tight">University CRM</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Clean admin surfaces for academic operations.
        </p>
      </div>

      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.label === activeLabel;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.label)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-brand-600 text-white shadow-glow"
                  : "text-muted hover:bg-bg hover:text-text",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-line bg-bg p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Status
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-success" />
          Connected to backend facade
        </div>
      </div>
    </aside>
  );
}
