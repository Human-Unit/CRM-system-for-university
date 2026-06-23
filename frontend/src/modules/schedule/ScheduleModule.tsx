import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CalendarRange,
  Clock3,
  Filter,
  Search,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../lib/cn";
import { toast } from "sonner";

const filterSchema = z.object({
  search: z.string().optional(),
  view: z.enum(["daily", "weekly", "teacher", "group", "auditorium"]).default("weekly"),
  day: z.enum(["all", "mon", "tue", "wed", "thu", "fri", "sat"]).default("all"),
  faculty: z.enum(["all", "engineering", "business", "law", "medicine"]).default("all"),
});

type FilterValues = z.infer<typeof filterSchema>;

type ScheduleEntry = {
  id: string;
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
  start: string;
  end: string;
  teacher: string;
  teacherId: string;
  group: string;
  groupId: string;
  faculty: "engineering" | "business" | "law" | "medicine";
  auditorium: string;
  subject: string;
  type: "lecture" | "seminar" | "lab";
};

type ConflictKind = "teacher" | "group" | "auditorium";

type Conflict = {
  kind: ConflictKind;
  firstId: string;
  secondId: string;
  message: string;
};

const schedule: ScheduleEntry[] = [
  { id: "sch-001", day: "mon", start: "08:30", end: "10:00", teacher: "Dr. Farrukh Ismailov", teacherId: "tea-001", group: "IT-21", groupId: "grp-it-21", faculty: "engineering", auditorium: "A-101", subject: "Database Systems", type: "lecture" },
  { id: "sch-002", day: "mon", start: "09:30", end: "11:00", teacher: "Dr. Farrukh Ismailov", teacherId: "tea-001", group: "IT-22", groupId: "grp-it-22", faculty: "engineering", auditorium: "A-102", subject: "Web Engineering", type: "seminar" },
  { id: "sch-003", day: "mon", start: "10:15", end: "11:45", teacher: "Prof. Malika Yuldasheva", teacherId: "tea-002", group: "ECO-11", groupId: "grp-eco-11", faculty: "business", auditorium: "B-203", subject: "Financial Accounting", type: "lecture" },
  { id: "sch-004", day: "tue", start: "08:30", end: "10:00", teacher: "Dr. Rustam Yusupov", teacherId: "tea-003", group: "LAW-12", groupId: "grp-law-12", faculty: "law", auditorium: "C-115", subject: "Civil Law", type: "lecture" },
  { id: "sch-005", day: "tue", start: "09:45", end: "11:15", teacher: "Dr. Rustam Yusupov", teacherId: "tea-003", group: "LAW-12", groupId: "grp-law-12", faculty: "law", auditorium: "C-115", subject: "Procedure", type: "seminar" },
  { id: "sch-006", day: "wed", start: "10:00", end: "11:30", teacher: "Dr. Dilnoza Nazarova", teacherId: "tea-004", group: "MED-31", groupId: "grp-med-31", faculty: "medicine", auditorium: "M-12", subject: "Anatomy", type: "lab" },
  { id: "sch-007", day: "thu", start: "13:30", end: "15:00", teacher: "Dr. Dilnoza Nazarova", teacherId: "tea-004", group: "MED-31", groupId: "grp-med-31", faculty: "medicine", auditorium: "M-12", subject: "Physiology", type: "lecture" },
  { id: "sch-008", day: "fri", start: "09:30", end: "11:00", teacher: "Prof. Bobur Karimov", teacherId: "tea-005", group: "IT-22", groupId: "grp-it-22", faculty: "engineering", auditorium: "A-101", subject: "Applied Mathematics", type: "lecture" },
  { id: "sch-009", day: "fri", start: "10:15", end: "11:45", teacher: "Prof. Bobur Karimov", teacherId: "tea-005", group: "IT-21", groupId: "grp-it-21", faculty: "engineering", auditorium: "A-101", subject: "Applied Mathematics", type: "seminar" },
  { id: "sch-010", day: "sat", start: "08:00", end: "09:30", teacher: "Prof. Malika Yuldasheva", teacherId: "tea-002", group: "ECO-11", groupId: "grp-eco-11", faculty: "business", auditorium: "B-203", subject: "Corporate Finance", type: "seminar" },
];

const dayOrder = ["mon", "tue", "wed", "thu", "fri", "sat"] as const;
const dayLabels: Record<ScheduleEntry["day"], string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function overlaps(a: ScheduleEntry, b: ScheduleEntry) {
  return a.day === b.day && toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
}

function detectConflicts(entries: ScheduleEntry[]) {
  const conflicts: Conflict[] = [];
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const first = entries[i];
      const second = entries[j];
      if (!overlaps(first, second)) continue;

      if (first.teacherId === second.teacherId) {
        conflicts.push({
          kind: "teacher",
          firstId: first.id,
          secondId: second.id,
          message: `${first.teacher} is assigned to two overlapping lessons on ${dayLabels[first.day]}.`,
        });
      }

      if (first.groupId === second.groupId) {
        conflicts.push({
          kind: "group",
          firstId: first.id,
          secondId: second.id,
          message: `${first.group} has overlapping lessons on ${dayLabels[first.day]}.`,
        });
      }

      if (first.auditorium === second.auditorium) {
        conflicts.push({
          kind: "auditorium",
          firstId: first.id,
          secondId: second.id,
          message: `${first.auditorium} is double-booked on ${dayLabels[first.day]}.`,
        });
      }
    }
  }
  return conflicts;
}

function conflictClass(entry: ScheduleEntry, conflicts: Conflict[]) {
  const hit = conflicts.some((conflict) => conflict.firstId === entry.id || conflict.secondId === entry.id);
  return hit ? "ring-2 ring-danger/70 bg-danger/5" : "";
}

export function ScheduleModule() {
  const [selectedId, setSelectedId] = useState(schedule[0]?.id ?? "");
  const [dayScope, setDayScope] = useState<ScheduleEntry["day"] | "all">("all");

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      view: "weekly",
      day: "all",
      faculty: "all",
    },
  });

  const filters = form.watch();
  const conflicts = useMemo(() => detectConflicts(schedule), []);

  const filtered = useMemo(() => {
    const search = (filters.search ?? "").trim().toLowerCase();
    return schedule
      .filter((entry) => {
        const matchesSearch =
          search.length === 0 ||
          entry.teacher.toLowerCase().includes(search) ||
          entry.group.toLowerCase().includes(search) ||
          entry.subject.toLowerCase().includes(search) ||
          entry.auditorium.toLowerCase().includes(search);
        const matchesDay = filters.day === "all" || entry.day === filters.day;
        const matchesFaculty = filters.faculty === "all" || entry.faculty === filters.faculty;
        const matchesScope = dayScope === "all" || entry.day === dayScope;
        return matchesSearch && matchesDay && matchesFaculty && matchesScope;
      })
      .sort((a, b) => {
        const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;
        return toMinutes(a.start) - toMinutes(b.start);
      });
  }, [dayScope, filters.day, filters.faculty, filters.search]);

  const selected = filtered.find((entry) => entry.id === selectedId) ?? filtered[0] ?? schedule[0];

  useEffect(() => {
    if (selected?.id && selected.id !== selectedId) {
      setSelectedId(selected.id);
    }
  }, [selected?.id, selectedId]);

  const conflictCounts = {
    teacher: conflicts.filter((item) => item.kind === "teacher").length,
    group: conflicts.filter((item) => item.kind === "group").length,
    auditorium: conflicts.filter((item) => item.kind === "auditorium").length,
  };

  const scheduleByDay = dayOrder.map((day) => ({
    day,
    entries: filtered.filter((entry) => entry.day === day),
  }));

  const dailyDay = filters.day !== "all" ? filters.day : dayScope === "all" ? "mon" : dayScope;
  const visibleEntries = filters.view === "daily" ? filtered.filter((entry) => entry.day === dailyDay) : filtered;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-bg">
                <CalendarRange className="h-4 w-4 text-muted" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Scheduling</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Timetable control center</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast.message("Scheduling creation flow will be connected in the next backend phase")}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-bg px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <CalendarDays className="h-4 w-4" />
              New slot
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Lessons", filtered.length],
              ["Teacher conflicts", conflictCounts.teacher],
              ["Group conflicts", conflictCounts.group],
              ["Auditorium conflicts", conflictCounts.auditorium],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-2xl border border-line bg-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
                <p className="mt-2 text-2xl font-extrabold tracking-tight">{value as number}</p>
              </div>
            ))}
          </div>

          <form className="mt-6 grid gap-3 lg:grid-cols-5">
            <label className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                {...form.register("search")}
                placeholder="Search teacher, group, auditorium, or subject"
                className="h-11 w-full rounded-2xl border border-line bg-bg pl-10 pr-4 text-sm outline-none transition focus:border-brand-500"
              />
            </label>

            <select
              {...form.register("view")}
              className="h-11 rounded-2xl border border-line bg-bg px-4 text-sm outline-none transition focus:border-brand-500"
            >
              <option value="daily">Daily view</option>
              <option value="weekly">Weekly view</option>
              <option value="teacher">Teacher view</option>
              <option value="group">Group view</option>
              <option value="auditorium">Auditorium view</option>
            </select>

            <select
              {...form.register("day")}
              className="h-11 rounded-2xl border border-line bg-bg px-4 text-sm outline-none transition focus:border-brand-500"
            >
              <option value="all">All days</option>
              <option value="mon">Monday</option>
              <option value="tue">Tuesday</option>
              <option value="wed">Wednesday</option>
              <option value="thu">Thursday</option>
              <option value="fri">Friday</option>
              <option value="sat">Saturday</option>
            </select>

            <select
              {...form.register("faculty")}
              className="h-11 rounded-2xl border border-line bg-bg px-4 text-sm outline-none transition focus:border-brand-500"
            >
              <option value="all">All faculties</option>
              <option value="engineering">Engineering</option>
              <option value="business">Business</option>
              <option value="law">Law</option>
              <option value="medicine">Medicine</option>
            </select>
          </form>

          {filters.view === "daily" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {dayOrder.map((day) => {
                const active = dailyDay === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setDayScope(day)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition",
                      active
                        ? "border-brand-500 bg-brand-600 text-white"
                        : "border-line bg-bg text-muted hover:text-text",
                    )}
                  >
                    {dayLabels[day]}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4">
            {filters.view === "weekly" ? (
              scheduleByDay.map((day) => (
                <div key={day.day} className="rounded-3xl border border-line bg-bg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                      {dayLabels[day.day]}
                    </h3>
                    <span className="rounded-full border border-line bg-panel px-3 py-1 text-xs font-medium text-muted">
                      {day.entries.length} slots
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {day.entries.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setSelectedId(entry.id)}
                        className={cn(
                          "flex items-start justify-between rounded-2xl border border-line bg-panel p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft",
                          conflictClass(entry, conflicts),
                          selected?.id === entry.id && "border-brand-500/50",
                        )}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{entry.subject}</p>
                            <span className="rounded-full border border-line bg-bg px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                              {entry.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted">
                            {entry.teacher} · {entry.group} · {entry.auditorium}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm font-semibold">
                            {entry.start} - {entry.end}
                          </p>
                          <p className="text-xs text-muted">{dayLabels[entry.day]}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="overflow-hidden rounded-3xl border border-line">
                <table className="min-w-full divide-y divide-line text-sm">
                  <thead className="bg-bg/80 text-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Time</th>
                      <th className="px-4 py-3 text-left font-semibold">Subject</th>
                      <th className="px-4 py-3 text-left font-semibold">Teacher / Group</th>
                      <th className="px-4 py-3 text-left font-semibold">Room</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-panel">
                    {visibleEntries.map((entry) => (
                      <tr
                        key={entry.id}
                        onClick={() => setSelectedId(entry.id)}
                        className={cn("cursor-pointer transition hover:bg-bg/50", conflictClass(entry, conflicts))}
                      >
                        <td className="px-4 py-4 font-mono font-semibold">
                          {entry.start} - {entry.end}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-semibold">{entry.subject}</p>
                          <p className="text-xs text-muted">{dayLabels[entry.day]}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium">{entry.teacher}</p>
                          <p className="text-xs text-muted">{entry.group}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted" />
                            <span>{entry.auditorium}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {visibleEntries.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted">
                          No slots match the current filters.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
          {selected ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Selected slot</p>
                <h3 className="mt-1 text-2xl font-extrabold tracking-tight">{selected.subject}</h3>
                <p className="mt-2 text-sm text-muted">{dayLabels[selected.day]} · {selected.start} - {selected.end}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Teacher", selected.teacher],
                  ["Group", selected.group],
                  ["Auditorium", selected.auditorium],
                  ["Faculty", selected.faculty],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-2xl border border-line bg-bg p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
                    <p className="mt-2 font-semibold">{value as string}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-line bg-bg p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Conflict status</p>
                  <ShieldCheck className="h-4 w-4 text-muted" />
                </div>
                <div className="mt-4 space-y-2">
                  {conflicts
                    .filter((item) => item.firstId === selected.id || item.secondId === selected.id)
                    .map((conflict) => (
                      <div key={`${conflict.kind}-${conflict.firstId}-${conflict.secondId}`} className="flex items-start gap-2 rounded-2xl border border-danger/20 bg-danger/5 p-3 text-sm">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-danger" />
                        <p>{conflict.message}</p>
                      </div>
                    ))}
                  {conflicts.filter((item) => item.firstId === selected.id || item.secondId === selected.id).length === 0 ? (
                    <div className="rounded-2xl border border-success/20 bg-success/5 p-3 text-sm text-success">
                      This slot has no detected conflicts.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-bg p-4">
                <p className="font-semibold">Quick actions</p>
                <div className="mt-4 space-y-3">
                  {["Reschedule lesson", "Assign alternate room", "Notify teacher", "Publish timetable"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toast.message(item)}
                      className="flex w-full items-center justify-between rounded-2xl border border-line bg-panel px-4 py-3 text-left text-sm font-medium transition hover:border-brand-500/40 hover:bg-brand-50/50 dark:hover:bg-brand-50/10"
                    >
                      <span>{item}</span>
                      <Filter className="h-4 w-4 text-muted" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-line bg-bg/60 p-6 text-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">No selection</p>
                <p className="mt-2 text-lg font-bold">Choose a schedule slot to inspect conflicts</p>
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
