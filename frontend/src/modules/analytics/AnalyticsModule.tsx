import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  ChevronRight,
  Filter,
  Flame,
  Search,
  ShieldAlert,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../lib/cn";
import { toast } from "sonner";

const filterSchema = z.object({
  period: z.enum(["7d", "30d", "semester"]).default("30d"),
  focus: z.enum(["attendance", "grades", "faculty", "workload"]).default("attendance"),
  faculty: z.enum(["all", "engineering", "business", "law", "medicine"]).default("all"),
});

type FilterValues = z.infer<typeof filterSchema>;

type AttendancePoint = { day: string; rate: number; present: number; absent: number; late: number };
type GradeBucket = { grade: string; count: number };
type FacultyStat = { faculty: string; students: number; teachers: number; averageScore: number; attendanceRate: number };
type WorkloadStat = { teacher: string; disciplines: number; students: number; loadIndex: number };

const attendance7d: AttendancePoint[] = [
  { day: "Mon", rate: 91, present: 412, absent: 28, late: 19 },
  { day: "Tue", rate: 89, present: 405, absent: 34, late: 20 },
  { day: "Wed", rate: 93, present: 420, absent: 21, late: 17 },
  { day: "Thu", rate: 87, present: 398, absent: 40, late: 23 },
  { day: "Fri", rate: 92, present: 417, absent: 25, late: 18 },
  { day: "Sat", rate: 95, present: 425, absent: 16, late: 14 },
  { day: "Sun", rate: 88, present: 401, absent: 35, late: 22 },
];

const attendance30d: AttendancePoint[] = [
  { day: "W1", rate: 89, present: 1680, absent: 150, late: 88 },
  { day: "W2", rate: 90, present: 1702, absent: 141, late: 81 },
  { day: "W3", rate: 92, present: 1735, absent: 122, late: 76 },
  { day: "W4", rate: 91, present: 1714, absent: 136, late: 80 },
];

const attendanceSemester: AttendancePoint[] = [
  { day: "Aug", rate: 87, present: 7300, absent: 1040, late: 480 },
  { day: "Sep", rate: 89, present: 7600, absent: 920, late: 455 },
  { day: "Oct", rate: 91, present: 7750, absent: 840, late: 420 },
  { day: "Nov", rate: 92, present: 7820, absent: 810, late: 402 },
  { day: "Dec", rate: 90, present: 7680, absent: 940, late: 438 },
];

const grades: GradeBucket[] = [
  { grade: "A", count: 7420 },
  { grade: "B", count: 9180 },
  { grade: "C", count: 5730 },
  { grade: "D", count: 1840 },
  { grade: "F", count: 710 },
];

const facultyStats: FacultyStat[] = [
  { faculty: "Engineering", students: 4120, teachers: 420, averageScore: 84.1, attendanceRate: 92.2 },
  { faculty: "Business", students: 2780, teachers: 265, averageScore: 82.7, attendanceRate: 90.1 },
  { faculty: "Law", students: 1980, teachers: 182, averageScore: 78.3, attendanceRate: 86.4 },
  { faculty: "Medicine", students: 1602, teachers: 261, averageScore: 88.5, attendanceRate: 94.0 },
];

const workload: WorkloadStat[] = [
  { teacher: "Dr. Farrukh Ismailov", disciplines: 4, students: 186, loadIndex: 88 },
  { teacher: "Prof. Malika Yuldasheva", disciplines: 3, students: 142, loadIndex: 73 },
  { teacher: "Dr. Dilnoza Nazarova", disciplines: 5, students: 196, loadIndex: 95 },
  { teacher: "Dr. Rustam Yusupov", disciplines: 2, students: 96, loadIndex: 54 },
  { teacher: "Prof. Bobur Karimov", disciplines: 1, students: 54, loadIndex: 34 },
];

const recentInsights = [
  { label: "Attendance anomaly", detail: "Friday attendance dipped below the 90% target in two cohorts.", tone: "warning" as const },
  { label: "Grade spread", detail: "The B band remains the largest cluster, with stable median performance.", tone: "neutral" as const },
  { label: "Workload pressure", detail: "Two engineering teachers are above the recommended discipline threshold.", tone: "danger" as const },
  { label: "Faculty trend", detail: "Medicine continues to lead in attendance and average grade scores.", tone: "success" as const },
];

function pickAttendance(period: FilterValues["period"]) {
  if (period === "7d") return attendance7d;
  if (period === "semester") return attendanceSemester;
  return attendance30d;
}

export function AnalyticsModule() {
  const [selectedInsight, setSelectedInsight] = useState(recentInsights[0]?.label ?? "");

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      period: "30d",
      focus: "attendance",
      faculty: "all",
    },
  });

  const filters = form.watch();
  const attendance = useMemo(() => pickAttendance(filters.period), [filters.period]);
  const facultyData = useMemo(() => {
    return filters.faculty === "all"
      ? facultyStats
      : facultyStats.filter((item) => item.faculty.toLowerCase() === filters.faculty);
  }, [filters.faculty]);

  const stats = useMemo(() => {
    const attendanceRate = Math.round(attendance.reduce((sum, item) => sum + item.rate, 0) / attendance.length);
    const avgGrade = 82.4;
    const riskStudents = Math.round((100 - attendanceRate) * 4.2);
    const heavyLoad = workload.filter((item) => item.loadIndex >= 80).length;
    return { attendanceRate, avgGrade, riskStudents, heavyLoad };
  }, [attendance]);

  useEffect(() => {
    setSelectedInsight(recentInsights[0]?.label ?? "");
  }, [filters.period, filters.focus, filters.faculty]);

  const selected = recentInsights.find((item) => item.label === selectedInsight) ?? recentInsights[0];
  const attendanceMax = Math.max(1, ...attendance.map((item) => item.rate));
  const gradeMax = Math.max(1, ...grades.map((item) => item.count));
  const facultyMax = Math.max(1, ...facultyData.map((item) => item.students));
  const workloadMax = Math.max(1, ...workload.map((item) => item.loadIndex));

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-bg">
              <BarChart3 className="h-4 w-4 text-muted" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Analytics</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Institution intelligence center</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.message("Analytics export will be connected to backend reporting")}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-bg px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <ShieldCheck className="h-4 w-4" />
            Export report
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Attendance rate", `${stats.attendanceRate}%`, "+1.8%"],
            ["Average score", stats.avgGrade.toFixed(1), "+0.6"],
            ["At-risk students", stats.riskStudents.toString(), "-8"],
            ["Heavy workloads", stats.heavyLoad.toString(), "2 above threshold"],
          ].map(([label, value, delta]) => (
            <div key={label as string} className="rounded-2xl border border-line bg-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-2xl font-extrabold tracking-tight">{value}</p>
                <span className="text-xs font-semibold text-success">{delta as string}</span>
              </div>
            </div>
          ))}
        </div>

        <form className="mt-6 grid gap-3 lg:grid-cols-5">
          <select
            {...form.register("period")}
            className="h-11 rounded-2xl border border-line bg-bg px-4 text-sm outline-none transition focus:border-brand-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="semester">This semester</option>
          </select>

          <select
            {...form.register("focus")}
            className="h-11 rounded-2xl border border-line bg-bg px-4 text-sm outline-none transition focus:border-brand-500"
          >
            <option value="attendance">Attendance</option>
            <option value="grades">Grades</option>
            <option value="faculty">Faculty</option>
            <option value="workload">Workload</option>
          </select>

          <select
            {...form.register("faculty")}
            className="h-11 rounded-2xl border border-line bg-bg px-4 text-sm outline-none transition focus:border-brand-500 lg:col-span-2"
          >
            <option value="all">All faculties</option>
            <option value="engineering">Engineering</option>
            <option value="business">Business</option>
            <option value="law">Law</option>
            <option value="medicine">Medicine</option>
          </select>

          <button
            type="button"
            onClick={() => toast.message("Filters applied")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-line bg-bg px-4 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <Filter className="h-4 w-4" />
            Apply
          </button>
        </form>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Attendance chart</p>
                  <h3 className="mt-1 text-lg font-bold">Trend overview</h3>
                </div>
                <span className="rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-muted">
                  {filters.period}
                </span>
              </div>

              <div className="mt-6 flex h-64 items-end gap-3 rounded-3xl border border-line bg-bg/70 p-4">
                {attendance.map((point) => {
                  const height = Math.max(18, Math.round((point.rate / attendanceMax) * 100));
                  return (
                    <div key={point.day} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-44 w-full items-end rounded-2xl bg-[linear-gradient(180deg,rgba(59,130,246,0.14),rgba(16,185,129,0.06))] p-2">
                        <div className="flex w-full items-end gap-1">
                          <div className="h-full flex-1 rounded-t-xl bg-brand-600/80" style={{ height: `${height}%` }} />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-mono text-xs font-semibold text-muted">{point.day}</p>
                        <p className="text-sm font-bold">{point.rate}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Grade distribution</p>
                  <h3 className="mt-1 text-lg font-bold">Assessment spread</h3>
                </div>
                <Flame className="h-5 w-5 text-muted" />
              </div>

              <div className="mt-6 space-y-4">
                {grades.map((grade) => {
                  const width = Math.max(12, Math.round((grade.count / gradeMax) * 100));
                  return (
                    <div key={grade.grade} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">{grade.grade}</span>
                        <span className="text-muted">{grade.count.toLocaleString()}</span>
                      </div>
                      <div className="h-3 rounded-full bg-line">
                        <div className="h-3 rounded-full bg-brand-600" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Faculty statistics</p>
                  <h3 className="mt-1 text-lg font-bold">Comparative performance</h3>
                </div>
                <Users2 className="h-5 w-5 text-muted" />
              </div>

              <div className="mt-6 space-y-4">
                {facultyData.map((faculty) => (
                  <div key={faculty.faculty} className="rounded-2xl border border-line bg-bg p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{faculty.faculty}</p>
                        <p className="text-xs text-muted">
                          {faculty.students.toLocaleString()} students · {faculty.teachers} teachers
                        </p>
                      </div>
                      <span className="rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold">
                        {faculty.averageScore.toFixed(1)}
                      </span>
                    </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {[
                            ["Attendance", `${faculty.attendanceRate}%`],
                            ["Students", faculty.students.toLocaleString()],
                          ].map(([label, value]) => (
                            <div key={label as string} className="rounded-2xl border border-line bg-panel p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
                              <p className="mt-2 font-semibold">{value as string}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-line">
                          <div className="h-2 rounded-full bg-brand-600" style={{ width: `${Math.max(14, Math.round((faculty.students / facultyMax) * 100))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
            </div>

            <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Teacher workload</p>
                  <h3 className="mt-1 text-lg font-bold">Load distribution</h3>
                </div>
                <ShieldAlert className="h-5 w-5 text-muted" />
              </div>

              <div className="mt-6 space-y-4">
                {workload.map((row) => {
                  const width = Math.max(14, Math.round((row.loadIndex / workloadMax) * 100));
                  return (
                    <div key={row.teacher} className="rounded-2xl border border-line bg-bg p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{row.teacher}</p>
                          <p className="text-xs text-muted">
                            {row.disciplines} disciplines · {row.students} students
                          </p>
                        </div>
                        <span className="text-sm font-semibold">{row.loadIndex}%</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-line">
                        <div className="h-2 rounded-full bg-success" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Insights</p>
                <h3 className="mt-1 text-lg font-bold">Operational notes</h3>
              </div>
              <Search className="h-5 w-5 text-muted" />
            </div>

            <div className="mt-4 space-y-3">
              {recentInsights.map((item) => {
                const active = item.label === selectedInsight;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSelectedInsight(item.label)}
                    className={cn(
                      "flex w-full items-start justify-between rounded-2xl border p-4 text-left transition",
                      active ? "border-brand-500 bg-brand-50/50 dark:bg-brand-50/10" : "border-line bg-bg hover:bg-panel",
                    )}
                  >
                    <div className="pr-3">
                      <p className="font-semibold">{item.label}</p>
                      <p className="mt-1 text-sm text-muted">{item.detail}</p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 text-muted" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Focused view</p>
            <div className="mt-4 rounded-3xl border border-dashed border-line bg-bg/60 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Selected insight</p>
              <h4 className="mt-2 text-xl font-extrabold tracking-tight">{selected?.label}</h4>
              <p className="mt-3 text-sm leading-6 text-muted">{selected?.detail}</p>

              <div className="mt-6 space-y-3">
                {[
                  ["Attendance focus", `${stats.attendanceRate}%`],
                  ["Average score", stats.avgGrade.toFixed(1)],
                  ["At-risk students", stats.riskStudents.toString()],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-2xl border border-line bg-panel p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
                    <p className="mt-2 font-semibold">{value as string}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => toast.message("Drill-down view will connect to backend reporting")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                Open drill-down
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
