import { useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { BarChart3, BookOpen, GraduationCap, LayoutDashboard, Search, Settings, Users2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../lib/cn";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const commands = [
  { label: "Go to Dashboard", icon: LayoutDashboard, action: () => toast.message("Dashboard selected") },
  { label: "Open Students", icon: Users2, action: () => toast.message("Students module selected") },
  { label: "Open Teachers", icon: GraduationCap, action: () => toast.message("Teachers module selected") },
  { label: "Open Subjects", icon: BookOpen, action: () => toast.message("Subjects module selected") },
  { label: "Open Analytics", icon: BarChart3, action: () => toast.message("Analytics module selected") },
  { label: "Settings", icon: Settings, action: () => toast.message("Settings selected") },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const items = useMemo(() => commands, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-24 z-50 w-[min(680px,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl border border-line bg-panel shadow-glow outline-none">
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-line px-4 py-4">
            <Search className="h-4 w-4 text-muted" />
            <CommandPrimitive.Input
              autoFocus
              placeholder="Search modules, commands, or records..."
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
            <Dialog.Close className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-bg text-muted transition hover:text-text">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <CommandPrimitive className="max-h-[420px] overflow-auto p-2">
            <CommandPrimitive.List className="space-y-1">
              <CommandPrimitive.Empty className="px-4 py-10 text-center text-sm text-muted">
                No matching commands yet.
              </CommandPrimitive.Empty>

              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandPrimitive.Item
                    key={item.label}
                    value={item.label}
                    onSelect={() => {
                      item.action();
                      onOpenChange(false);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm outline-none transition aria-selected:bg-brand-50 aria-selected:text-brand-700 dark:aria-selected:bg-brand-50/15 dark:aria-selected:text-brand-100",
                    )}
                  >
                    <Icon className="h-4 w-4 text-muted" />
                    <span className="font-medium">{item.label}</span>
                  </CommandPrimitive.Item>
                );
              })}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
