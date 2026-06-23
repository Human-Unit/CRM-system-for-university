import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, GraduationCap, Search, ShieldCheck, Users2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../lib/cn";
import { toast } from "sonner";

const filterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "active", "graduated", "suspended"]).default("all"),
  faculty: z.enum(["all", "engineering", "business", "law", "medicine"]).default("all"),
  group: z.enum(["all", "it-21", "it-22", "eco-11", "law-12", "med-31"]).default("all"),
  sortBy: z.enum(["name", "attendance", "score"]).default("name"),
});

type FilterValues = z.infer<typeof filterSchema>;

type StudentRow = {
  id: string;
  name: string;
  studentNo: string;
  faculty: "engineering" | "business" | "law" | "medicine";
  group: "it-21" | "it-22" | "eco-11" | "law-12" | "med-31";
  status: "active" | "graduated" | "suspended";
  attendanceRate: number;
  averageScore: number;
  advisor: string;
  transcript: Array<{ subject: string; grade: string; score: number }>;
  attendance: Array<{ date: string; status: "Present" | "Late" | "Absent"; lesson: string }>;
};

const students: StudentRow[] = [
  {
    id: "stu-001",
    name: "Amina Karimova",
    studentNo: "UCRM-2021-001",
    faculty: "engineering",
    group: "it-21",
    status: "active",
    attendanceRate: 96,
    averageScore: 89,
    advisor: "Dr. Ismailov",
    transcript: [
      { subject: "Database Systems", grade: "A", score: 94 },
      { subject: "Discrete Math", grade: "A-", score: 90 },
      { subject: "English for IT", grade: "B+", score: 85 },
    ],
    attendance: [
      { date: "2026-06-18", status: "Present", lesson: "Database Systems" },
      { date: "2026-06-19", status: "Late", lesson: "Discrete Math" },
      { date: "2026-06-20", status: "Present", lesson: "English for IT" },
    ],
  },
  {
    id: "stu-002",
    name: "Bekzod Tursunov",
    studentNo: "UCRM-2021-014",
    faculty: "engineering",
    group: "it-22",
    status: "active",
    attendanceRate: 91,
    averageScore: 82,
    advisor: "Dr. Ergashev",
    transcript: [
      { subject: "Algorithms", grade: "B+", score: 87 },
      { subject: "Operating Systems", grade: "B", score: 80 },
      { subject: "Networking", grade: "A-", score: 90 },
    ],
    attendance: [
      { date: "2026-06-18", status: "Present", lesson: "Algorithms" },
      { date: "2026-06-19", status: "Present", lesson: "Operating Systems" },
      { date: "2026-06-20", status: "Absent", lesson: "Networking" },
    ],
  },
  {
    id: "stu-003",
    name: "Dilnoza Rakhmatova",
    studentNo: "UCRM-2020-077",
    faculty: "business",
    group: "eco-11",
    status: "graduated",
    attendanceRate: 98,
    averageScore: 93,
    advisor: "Prof. Qodirov",
    transcript: [
      { subject: "Financial Accounting", grade: "A", score: 95 },
      { subject: "Management", grade: "A", score: 92 },
      { subject: "Econometrics", grade: "A-", score: 90 },
    ],
    attendance: [
      { date: "2026-04-18", status: "Present", lesson: "Financial Accounting" },
      { date: "2026-04-19", status: "Present", lesson: "Management" },
      { date: "2026-04-20", status: "Present", lesson: "Econometrics" },
    ],
  },
  {
    id: "stu-004",
    name: "Javlon Sodiqov",
    studentNo: "UCRM-2022-109",
    faculty: "law",
    group: "law-12",
    status: "suspended",
    attendanceRate: 64,
    averageScore: 58,
    advisor: "Dr. Yusupov",
    transcript: [
      { subject: "Civil Law", grade: "C", score: 61 },
      { subject: "Constitutional Law", grade: "D+", score: 54 },
      { subject: "Procedure", grade: "C-", score: 59 },
    ],
    attendance: [
      { date: "2026-06-18", status: "Absent", lesson: "Civil Law" },
      { date: "2026-06-19", status: "Late", lesson: "Constitutional Law" },
      { date: "2026-06-20", status: "Absent", lesson: "Procedure" },
    ],
  },
  {
    id: "stu-005",
    name: "Madina Sattarova",
    studentNo: "UCRM-2023-041",
    faculty: "medicine",
    group: "med-31",
    status: "active",
    attendanceRate: 95,
    averageScore: 88,
    advisor: "Dr. Nazarov",
    transcript: [
      { subject: "Anatomy", grade: "A-", score: 91 },
      { subject: "Physiology", grade: "B+", score: 86 },
      { subject: "Biochemistry", grade: "A", score: 92 },
    ],
    attendance: [
      { date: "2026-06-18", status: "Present", lesson: "Anatomy" },
      { date: "2026-06-19", status: "Present", lesson: "Physiology" },
      { date: "2026-06-20", status: "Late", lesson: "Biochemistry" },
    ],
  },
];

const pageSize = 3;

const statusPill: Record<StudentRow["status"], string> = {
  active: "bg-success/10 text-success border-success/20",
  graduated: "bg-brand-50 text-brand-700 border-brand-100 dark:text-brand-100",
  suspended: "bg-danger/10 text-danger border-danger/20",
};

function facultyLabel(value: StudentRow["faculty"]) {
  return {
    engineering: "Engineering",
    business: "Business",
    law: "Law",
    medicine: "Medicine",
  }[value];
}

function groupLabel(value: StudentRow["group"]) {
  return value.toUpperCase();
}

function pager(total: number, page: number) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return Math.min(Math.max(1, page), totalPages);
}

export function StudentModule() {
  const [selectedId, setSelectedId] = useState(students[0]?.id ?? "");
  const [page, setPage] = useState(1);

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      status: "all",
      faculty: "all",
      group: "all",
      sortBy: "name",
    },
  });

  const filters = form.watch();

  const filteredStudents = useMemo(() => {
    const search = (filters.search ?? "").trim().toLowerCase();
    return students
      .filter((student) => {
        const matchesSearch =
          search.length === 0 ||
          student.name.toLowerCase().includes(search) ||
          student.studentNo.toLowerCase().includes(search) ||
          student.advisor.toLowerCase().includes(search);
        const matchesStatus = filters.status === "all" || student.status === filters.status;
        const matchesFaculty = filters.faculty === "all" || student.faculty === filters.faculty;
        const matchesGroup = filters.group === "all" || student.group === filters.group;
        return matchesSearch && matchesStatus && matchesFaculty && matchesGroup;
      })
      .sort((a, b) => {
        if (filters.sortBy === "attendance") return b.attendanceRate - a.attendanceRate;
        if (filters.sortBy === "score") return b.averageScore - a.averageScore;
        return a.name.localeCompare(b.name);
      });
  }, [filters]);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.status, filters.faculty, filters.group, filters.sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const safePage = pager(filteredStudents.length, page);
  const pagedStudents = filteredStudents.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selected = filteredStudents.find((student) => student.id === selectedId) ?? pagedStudents[0] ?? filteredStudents[0];

  useEffect(() => {
    if (selected?.id && selected.id !== selectedId) {
      setSelectedId(selected.id);
    }
  }, [selected?.id, selectedId]);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-bg">
                <Filter className="h-4 w-4 text-muted" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Students</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Student management</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast.message("Create student flow will be wired in Phase 7.1")}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-bg px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <Users2 className="h-4 w-4" />
              New student
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Visible", filteredStudents.length],
              ["Active", filteredStudents.filter((item) => item.status === "active").length],
              ["Graduated", filteredStudents.filter((item) => item.status === "graduated").length],
              ["Suspended", filteredStudents.filter((item) => item.status === "suspended").length],
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
                placeholder="Search by name, number, or advisor"
                className="h-11 w-full rounded-2xl border border-line bg-bg pl-10 pr-4 text-sm outline-none transition focus:border-brand-500"
              />
            </label>

            <select
              {...form.register("status")}
              className="h-11 rounded-2xl border border-line bg-bg px-4 text-sm outline-none transition focus:border-brand-500"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
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

            <select
              {...form.register("group")}
              className="h-11 rounded-2xl border border-line bg-bg px-4 text-sm outline-none transition focus:border-brand-500"
            >
              <option value="all">All groups</option>
              <option value="it-21">IT-21</option>
              <option value="it-22">IT-22</option>
              <option value="eco-11">ECO-11</option>
              <option value="law-12">LAW-12</option>
              <option value="med-31">MED-31</option>
            </select>

            <select
              {...form.register("sortBy")}
              className="h-11 rounded-2xl border border-line bg-bg px-4 text-sm outline-none transition focus:border-brand-500"
            >
              <option value="name">Sort by name</option>
              <option value="attendance">Sort by attendance</option>
              <option value="score">Sort by score</option>
            </select>
          </form>

          <div className="mt-6 overflow-hidden rounded-2xl border border-line">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-bg/80 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Student</th>
                  <th className="px-4 py-3 text-left font-semibold">Faculty / Group</th>
                  <th className="px-4 py-3 text-left font-semibold">Attendance</th>
                  <th className="px-4 py-3 text-left font-semibold">Avg score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-panel">
                {pagedStudents.map((student) => {
                  const selected = student.id === selectedId;
                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedId(student.id)}
                      className={cn(
                        "cursor-pointer transition hover:bg-bg/50",
                        selected && "bg-brand-50/50 dark:bg-brand-50/10",
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-sm font-bold text-white">
                            {student.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-xs text-muted">{student.studentNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{facultyLabel(student.faculty)}</p>
                        <p className="text-xs text-muted">{groupLabel(student.group)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", statusPill[student.status])}>
                          {student.attendanceRate}%
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-success" />
                          <span className="font-semibold">{student.averageScore}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {pagedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted">
                      No students match the current search and filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Showing {pagedStudents.length} of {filteredStudents.length} records
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={safePage === 1}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-bg px-3 text-sm font-medium disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <span className="text-sm text-muted">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={safePage >= totalPages}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-bg px-3 text-sm font-medium disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <aside className="rounded-3xl border border-line bg-panel p-6 shadow-soft">
          {selected ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Selected student</p>
                <h3 className="mt-1 text-2xl font-extrabold tracking-tight">{selected.name}</h3>
                <p className="mt-2 text-sm text-muted">{selected.studentNo}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Faculty", facultyLabel(selected.faculty)],
                  ["Group", groupLabel(selected.group)],
                  ["Advisor", selected.advisor],
                  ["Status", selected.status],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-2xl border border-line bg-bg p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
                    <p className="mt-2 font-semibold">{value as string}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-line bg-bg p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Academic overview</p>
                  <GraduationCap className="h-4 w-4 text-muted" />
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Attendance</span>
                      <span className="font-semibold">{selected.attendanceRate}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-line">
                      <div className="h-2 rounded-full bg-brand-600" style={{ width: `${selected.attendanceRate}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Average score</span>
                      <span className="font-semibold">{selected.averageScore}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-line">
                      <div className="h-2 rounded-full bg-success" style={{ width: `${selected.averageScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-bg p-4">
                <p className="font-semibold">Transcript</p>
                <div className="mt-4 overflow-hidden rounded-xl border border-line">
                  <table className="min-w-full divide-y divide-line text-sm">
                    <thead className="bg-panel text-muted">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Subject</th>
                        <th className="px-3 py-2 text-left font-semibold">Grade</th>
                        <th className="px-3 py-2 text-right font-semibold">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line bg-panel">
                      {selected.transcript.map((row) => (
                        <tr key={row.subject}>
                          <td className="px-3 py-2">{row.subject}</td>
                          <td className="px-3 py-2">
                            <span className="rounded-full border border-line bg-bg px-2 py-1 text-xs font-semibold">
                              {row.grade}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right font-semibold">{row.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-bg p-4">
                <p className="font-semibold">Attendance history</p>
                <div className="mt-4 space-y-3">
                  {selected.attendance.map((item) => (
                    <div key={`${item.date}-${item.lesson}`} className="flex items-center justify-between rounded-xl border border-line bg-panel px-3 py-3">
                      <div>
                        <p className="font-medium">{item.lesson}</p>
                        <p className="text-xs text-muted">{item.date}</p>
                      </div>
                      <span className="rounded-full border border-line bg-bg px-2.5 py-1 text-xs font-semibold">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-line bg-bg/60 p-6 text-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">No selection</p>
                <p className="mt-2 text-lg font-bold">Choose a student to inspect transcript and attendance</p>
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
