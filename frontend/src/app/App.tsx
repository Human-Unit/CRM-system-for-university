import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  BookOpen,
  BarChart3,
  CalendarDays,
  ChevronRight,
  Command,
  GraduationCap,
  LayoutDashboard,
  MoonStar,
  Search,
  SunMedium,
  Users2,
} from "lucide-react";
import { CommandPalette } from "../components/command-palette";
import { DataTable, type ActivityRow } from "../components/data-table";
import { Sidebar } from "../components/sidebar";
import { StatCard } from "../components/stat-card";
import { useTheme } from "../hooks/use-theme";
import { backend } from "../lib/backend";
import { cn } from "../lib/cn";
import type { AppInfoResponse, DashboardSummaryResponse } from "../types/backend";
import { toast } from "sonner";
import { AnalyticsModule } from "../modules/analytics/AnalyticsModule";
import { StudentModule } from "../modules/students/StudentModule";
import { TeacherModule } from "../modules/teachers/TeacherModule";
import { ScheduleModule } from "../modules/schedule/ScheduleModule";

type NavItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const navigation: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Students", icon: Users2 },
  { label: "Teachers", icon: GraduationCap },
  { label: "Subjects", icon: BookOpen },
  { label: "Schedule", icon: CalendarDays },
  { label: "Analytics", icon: BarChart3 },
];

const fallbackDashboard: DashboardSummaryResponse = {
  generatedAt: new Date().toISOString(),
  studentsTotal: 10482,
  teachersTotal: 1128,
  groupsTotal: 384,
  subjectsTotal: 216,
  attendance: {
    total: 18420,
    present: 16491,
    absent: 1124,
    late: 805,
    other: 0,
    attendanceRate: 89.6,
  },
  grades: {
    totalAssessments: 24880,
    averageScore: 82.4,
    distribution: {
      A: 7420,
      B: 9180,
      C: 5730,
      D: 1840,
      F: 710,
    },
  },
  teacherWorkload: {
    teachersTotal: 1128,
    disciplinesTotal: 1684,
    averageDisciplinesPerTeacher: 1.5,
  },
  recentActivity: [
    {
      id: "1",
      entityName: "students",
      entityId: "student-001",
      action: "CREATE",
      username: "registrar",
      createdAt: new Date(Date.now() - 120_000).toISOString(),
    },
    {
      id: "2",
      entityName: "attendance",
      entityId: "attendance-184",
      action: "UPDATE",
      username: "instructor",
      createdAt: new Date(Date.now() - 840_000).toISOString(),
    },
    {
      id: "3",
      entityName: "schedule",
      entityId: "schedule-44",
      action: "DELETE",
      username: "admin",
      createdAt: new Date(Date.now() - 2_800_000).toISOString(),
    },
    {
      id: "4",
      entityName: "users",
      entityId: "user-74",
      action: "LOGIN",
      username: "student",
      createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    },
  ],
};

const fallbackInfo: AppInfoResponse = {
  name: "University Management CRM",
  environment: "development",
  version: "0.1.0",
  startedAt: new Date().toISOString(),
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function toActivityRows(items: DashboardSummaryResponse["recentActivity"]): ActivityRow[] {
  return items.map((item) => ({
    actor: item.username ?? "system",
    entity: item.entityName,
    action: item.action,
    time: timeAgo(item.createdAt),
  }));
}

function DashboardView({
  dashboard,
  info,
  theme,
  toggleTheme,
  loading,
}: {
  dashboard: DashboardSummaryResponse;
  info: AppInfoResponse;
  theme: "dark" | "light";
  toggleTheme: () => void;
  loading: boolean;
}) {
  const stats = [
    { label: "Total students", value: dashboard.studentsTotal.toLocaleString(), delta: "+4.8%" },
    { label: "Total teachers", value: dashboard.teachersTotal.toLocaleString(), delta: "+2.1%" },
    { label: "Total groups", value: dashboard.groupsTotal.toLocaleString(), delta: "+1.4%" },
    { label: "Total subjects", value: dashboard.subjectsTotal.toLocaleString(), delta: "+3.2%" },
  ];

  const gradientLabel = theme === "dark" ? "Night operations" : "Light workspace";

  return (
    <div className="flex flex-1 flex-col bg-bg text-text">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-bg/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                {info.name} {info.version ? `· v${info.version}` : ""}
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
                Linear operations for academic administration
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-panel shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => toast.success("Notifications ready for the next phase")}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-panel shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </div>
      </header>

      <section className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                Dashboard
              </p>
              <h2 className="mt-1 text-lg font-bold">Backend summary</h2>
            </div>
            <span className="rounded-full border border-line bg-panel px-3 py-1 text-xs font-medium text-muted">
              {loading ? "Syncing" : "Live"}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-line bg-panel/90 p-6 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                    Today
                  </p>
                  <h2 className="mt-1 text-xl font-bold">Operational snapshot</h2>
                </div>
                <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-100">
                  {gradientLabel}
                </span>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-line bg-bg/70 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Attendance rate</h3>
                    <span className="text-xs text-success">{dashboard.attendance.attendanceRate}%</span>
                  </div>
                  <div className="mt-4 h-36 rounded-2xl bg-[linear-gradient(135deg,rgba(59,130,246,0.22),rgba(20,184,166,0.18))] p-4">
                    <div className="flex h-full items-end gap-2">
                      {[dashboard.attendance.present, dashboard.attendance.absent, dashboard.attendance.late, dashboard.attendance.other].map(
                        (value, index) => {
                          const total = Math.max(1, dashboard.attendance.total);
                          const height = Math.max(18, Math.round((value / total) * 100));
                          return (
                            <div
                              key={index}
                              className="flex-1 rounded-t-xl bg-brand-600/90"
                              style={{ height: `${height}%` }}
                            />
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-bg/70 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Teacher workload</h3>
                    <span className="text-xs text-muted">
                      {dashboard.teacherWorkload.averageDisciplinesPerTeacher} / teacher
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      ["Teachers", dashboard.teacherWorkload.teachersTotal],
                      ["Disciplines", dashboard.teacherWorkload.disciplinesTotal],
                      ["Avg load", Math.round(dashboard.teacherWorkload.averageDisciplinesPerTeacher * 10)],
                    ].map(([name, value]) => {
                      const percent = Math.min(100, Number(value));
                      return (
                        <div key={name as string} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{name as string}</span>
                            <span className="font-semibold">{value as number}</span>
                          </div>
                          <div className="h-2 rounded-full bg-line">
                            <div className="h-2 rounded-full bg-brand-600" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                      Quick actions
                    </p>
                    <h2 className="mt-1 text-lg font-bold">Command center</h2>
                  </div>
                  <Search className="h-5 w-5 text-muted" />
                </div>

                <div className="mt-4 space-y-3">
                  {["Register student", "Assign teacher", "Open attendance journal", "Create schedule"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toast.message(item)}
                      className="flex w-full items-center justify-between rounded-2xl border border-line bg-bg px-4 py-3 text-left text-sm font-medium transition hover:border-brand-500/40 hover:bg-brand-50/50 dark:hover:bg-brand-50/10"
                    >
                      <span>{item}</span>
                      <ChevronRight className="h-4 w-4 text-muted" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                  Schedule health
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    { time: "08:30", title: "Attendance rate", room: `${dashboard.attendance.present} present`, status: "Tracked" },
                    { time: "10:00", title: "Assessment volume", room: `${dashboard.grades.totalAssessments} records`, status: "Synced" },
                    { time: "13:30", title: "Teacher load", room: `${dashboard.teacherWorkload.disciplinesTotal} disciplines`, status: "Balanced" },
                  ].map((row) => (
                    <div key={row.time} className="rounded-2xl border border-line bg-bg p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{row.title}</p>
                          <p className="text-sm text-muted">{row.room}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm font-semibold">{row.time}</p>
                          <p className="text-xs text-success">{row.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                    Recent activity
                  </p>
                  <h2 className="mt-1 text-lg font-bold">Live operations feed</h2>
                </div>
                <span className="rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-muted">
                  {dashboard.recentActivity.length} events
                </span>
              </div>

              <div className="mt-4">
                <DataTable rows={toActivityRows(dashboard.recentActivity)} />
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                Workspace
              </p>
              <div className="mt-4 rounded-3xl border border-dashed border-line bg-bg/60 p-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold text-muted">
                  <Bell className="h-3.5 w-3.5" />
                  Backend data bound to React Query
                </div>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight">
                  A focused, command-driven desktop workspace
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  The dashboard is now reading aggregated metrics from the backend
                  layer, with counts, attendance, grade distribution, teacher load,
                  and recent audit events all routed through a single query flow.
                </p>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeModule, setActiveModule] = useState("Dashboard");

  const dashboardQuery = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => (await backend.dashboard()) ?? fallbackDashboard,
  });

  const infoQuery = useQuery({
    queryKey: ["app-info"],
    queryFn: async () => (await backend.info()) ?? fallbackInfo,
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const dashboard = dashboardQuery.data ?? fallbackDashboard;
  const info = infoQuery.data ?? fallbackInfo;
  const loading = dashboardQuery.isLoading || infoQuery.isLoading;

  return (
    <div className="flex min-h-full bg-bg text-text">
      <Sidebar items={navigation} activeLabel={activeModule} onSelect={setActiveModule} />

      <main className="flex min-h-full flex-1 flex-col">
        {activeModule === "Students" ? (
          <>
            <header className="sticky top-0 z-20 border-b border-line/80 bg-bg/85 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    {info.name} {info.version ? `· v${info.version}` : ""}
                  </p>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
                    Student management workspace
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaletteOpen(true)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-4 py-2 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft",
                    )}
                  >
                    <Command className="h-4 w-4 text-muted" />
                    Search
                    <kbd className="rounded-md border border-line bg-bg px-2 py-0.5 text-[11px] font-semibold text-muted">
                      Ctrl K
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-panel shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </header>

            <section className="flex-1 p-6">
              <StudentModule />
            </section>
          </>
        ) : activeModule === "Teachers" ? (
          <>
            <header className="sticky top-0 z-20 border-b border-line/80 bg-bg/85 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    {info.name} {info.version ? `· v${info.version}` : ""}
                  </p>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
                    Teacher management workspace
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaletteOpen(true)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-4 py-2 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft",
                    )}
                  >
                    <Command className="h-4 w-4 text-muted" />
                    Search
                    <kbd className="rounded-md border border-line bg-bg px-2 py-0.5 text-[11px] font-semibold text-muted">
                      Ctrl K
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-panel shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </header>

            <section className="flex-1 p-6">
              <TeacherModule />
            </section>
          </>
        ) : activeModule === "Schedule" ? (
          <>
            <header className="sticky top-0 z-20 border-b border-line/80 bg-bg/85 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    {info.name} {info.version ? `· v${info.version}` : ""}
                  </p>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
                    Scheduling workspace
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaletteOpen(true)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-4 py-2 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft",
                    )}
                  >
                    <Command className="h-4 w-4 text-muted" />
                    Search
                    <kbd className="rounded-md border border-line bg-bg px-2 py-0.5 text-[11px] font-semibold text-muted">
                      Ctrl K
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-panel shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </header>

            <section className="flex-1 p-6">
              <ScheduleModule />
            </section>
          </>
        ) : activeModule === "Analytics" ? (
          <>
            <header className="sticky top-0 z-20 border-b border-line/80 bg-bg/85 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    {info.name} {info.version ? `· v${info.version}` : ""}
                  </p>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
                    Analytics workspace
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaletteOpen(true)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-4 py-2 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft",
                    )}
                  >
                    <Command className="h-4 w-4 text-muted" />
                    Search
                    <kbd className="rounded-md border border-line bg-bg px-2 py-0.5 text-[11px] font-semibold text-muted">
                      Ctrl K
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-panel shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </header>

            <section className="flex-1 p-6">
              <AnalyticsModule />
            </section>
          </>
        ) : (
          <DashboardView dashboard={dashboard} info={info} theme={theme} toggleTheme={toggleTheme} loading={loading} />
        )}

        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </main>
    </div>
  );
}
