import { ArrowUpRight } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  delta: string;
};

export function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-line bg-panel p-5 shadow-soft">
      <p className="text-sm font-medium text-muted">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-extrabold tracking-tight">{value}</p>
          <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:text-brand-100">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {delta}
          </p>
        </div>
      </div>
    </article>
  );
}

