import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock3, GraduationCap, Search, ShieldCheck, Users2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../lib/cn";
import { toast } from "sonner";

const filterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "active", "on-leave", "inactive"]).default("all"),
  faculty: z.enum(["all", "engineering", "business", "law", "medicine"]).default("all"),
  sortBy: z.enum(["name", "load", "disciplines"]).default("name"),
});

type FilterValues = z.infer<typeof filterSchema>;

type TeacherRow = {
  id: string;
  name: string;
  employeeNo: string;
  faculty: "engineering" | "business" | "law" | "medicine";
  status: "active" | "on-leave" | "inactive";
  teachingLoad: number;
  disciplines: string[];
  workloadScore: number;
  office: string;
  email: string;
  timetable: Array<{ day: string; time: string; subject: string; group: string }>;
};

const teachers: TeacherRow[] = [
  {
    id: "tea-001",
    name: "Dr. Farrukh Ismailov",
    employeeNo: "EMP-204",
    faculty: "engineering",
    status: "active",
    teachingLoad: 4,
    disciplines: ["Database Systems", "Web Engineering", "Software Architecture"],
    workloadScore: 86,
    office: "Block A, Room 310",
    email: "f.ismailov@university.local",
    timetable: [
      { day: "Mon", time: "08:30", subject: "Database Systems", group: "IT-21" },
      { day: "Wed", time: "10:00", subject: "Web Engineering", group: "IT-22" },
      { day: "Fri", time: "13:30", subject: "Software Architecture", group: "IT-21" },
    ],
  },
  {
    id: "tea-002",
    name: "Prof. Malika Yuldasheva",
    employeeNo: "EMP-117",
    faculty: "business",
    status: "active",
    teachingLoad: 3,
    disciplines: ["Financial Accounting", "Corporate Finance", "Management"],
    workloadScore: 79,
    office: "Block B, Room 201",
    email: "m.yuldasheva@university.local",
    timetable: [
      { day: "Tue", time: "09:00", subject: "Financial Accounting", group: "ECO-11" },
      { day: "Thu", time: "11:30", subject: "Corporate Finance", group: "ECO-11" },
    ],
  },
  {
    id: "tea-003",
    name: "Dr. Rustam Yusupov",
    employeeNo: "EMP-311",
    faculty: "law",
    status: "on-leave",
    teachingLoad: 2,
    disciplines: ["Civil Law", "Procedure"],
    workloadScore: 54,
    office: "Block C, Room 115",
    email: "r.yusupov@university.local",
    timetable: [
      { day: "Mon", time: "10:00", subject: "Civil Law", group: "LAW-12" },
      { day: "Wed", time: "14:00", subject: "Procedure", group: "LAW-12" },
    ],
  },
  {
    id: "tea-004",
    name: "Dr. Dilnoza Nazarova",
    employeeNo: "EMP-092",
    faculty: "medicine",
    status: "active",
    teachingLoad: 5,
    disciplines: ["Anatomy", "Physiology", "Biochemistry", "Clinical Practice"],
    workloadScore: 91,
    office: "Medical Building, Room 12",
    email: "d.nazarova@university.local",
    timetable: [
      { day: "Tue", time: "08:30", subject: "Anatomy", group: "MED-31" },
      { day: "Thu", time: "10:30", subject: "Physiology", group: "MED-31" },
      { day: "Fri", time: "15:00", subject: "Clinical Practice", group: "MED-31" },
    ],
  },
  {
    id: "tea-005",
    name: "Prof. Bobur Karimov",
    employeeNo: "EMP-221",
    faculty: "engineering",
    status: "inactive",
    teachingLoad: 1,
    disciplines: ["Applied Mathematics"],
    workloadScore: 33,
    office: "Block A, Room 109",
    email: "b.karimov@university.local",
    timetable: [{ day: "Fri", time: "09:30", subject: "Applied Mathematics", group: "IT-22" }],
  },
];

const pageSize = 3;

const statusPill: Record<TeacherRow["status"], string> = {
  active: "bg-success/10 text-success border-success/20",
  "on-leave": "bg-brand-50 text-brand-700 border-brand-100 dark:text-brand-100",
  inactive: "bg-danger/10 text-danger border-danger/20",
};

function facultyLabel(value: TeacherRow["faculty"]) {
  return {
    engineering: "Engineering",
    business: "Business",
    law: "Law",
    medicine: "Medicine",
  }[value];
}

function pager(total: number, page: number) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return Math.min(Math.max(1, page), totalPages);
}

export function TeacherModule() {
  const [selectedId, setSelectedId] = useState(teachers[0]?.id ?? "");
  const [page, setPage] = useState(1);

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      status: "all",
      faculty: "all",
      sortBy: "name",
    },
  });

  const filters = form.watch();

  const filteredTeachers = useMemo(() => {
    const search = (filters.search ?? "").trim().toLowerCase();
    return teachers
      .filter((teacher) => {
        const matchesSearch =
          search.length === 0 ||
          teacher.name.toLowerCase().includes(search) ||
          teacher.employeeNo.toLowerCase().includes(search) ||
          teacher.email.toLowerCase().includes(search) ||
          teacher.disciplines.some((item) => item.toLowerCase().includes(search));
        const matchesStatus = filters.status === "all" || teacher.status === filters.status;
        const matchesFaculty = filters.faculty === "all" || teacher.faculty === filters.faculty;
        return matchesSearch && matchesStatus && matchesFaculty;
      })
      .sort((a, b) => {
        if (filters.sortBy === "load") return b.teachingLoad - a.teachingLoad;
        if (filters.sortBy === "disciplines") return b.disciplines.length - a.disciplines.length;
        return a.name.localeCompare(b.name);
      });
  }, [filters]);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.status, filters.faculty, filters.sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / pageSize));
  const safePage = pager(filteredTeachers.length, page);
  const pagedTeachers = filteredTeachers.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selected = filteredTeachers.find((teacher) => teacher.id === selectedId) ?? pagedTeachers[0] ?? filteredTeachers[0];

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
                <GraduationCap className="h-4 w-4 text-muted" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Teachers</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Teacher management</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast.message("Create teacher flow will be wired in the next backend phase")}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-bg px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <Users2 className="h-4 w-4" />
              New teacher
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Visible", filteredTeachers.length],
              ["Active", filteredTeachers.filter((item) => item.status === "active").length],
              ["On leave", filteredTeachers.filter((item) => item.status === "on-leave").length],
              ["Inactive", filteredTeachers.filter((item) => item.status === "inactive").length],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-2xl border border-line bg-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
                <p className="mt-2 text-2xl font-extrabold tracking-tight">{value as number}</p>
              </div>
            ))}
          </div>

          <form className="mt-6 grid gap-3 lg:grid-cols-4">
            <label className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                {...form.register("search")}
                placeholder="Search by name, number, email, or discipline"
                className="h-11 w-full rounded-2xl border border-line bg-bg pl-10 pr-4 text-sm outline-none transition focus:border-brand-500"
              />
            </label>

            <select
              {...form.register("status")}
              className="h-11 rounded-2xl border border-line bg-bg px-4 text-sm outline-none transition focus:border-brand-500"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="on-leave">On leave</option>
              <option value="inactive">Inactive</option>
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
              {...form.register("sortBy")}
              className="h-11 rounded-2xl border border-line bg-bg px-4 text-sm outline-none transition focus:border-brand-500"
            >
              <option value="name">Sort by name</option>
              <option value="load">Sort by load</option>
              <option value="disciplines">Sort by disciplines</option>
            </select>
          </form>

          <div className="mt-6 overflow-hidden rounded-2xl border border-line">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-bg/80 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Teacher</th>
                  <th className="px-4 py-3 text-left font-semibold">Faculty / Load</th>
                  <th className="px-4 py-3 text-left font-semibold">Disciplines</th>
                  <th className="px-4 py-3 text-left font-semibold">Workload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-panel">
                {pagedTeachers.map((teacher) => {
                  const selectedRow = teacher.id === selectedId;
                  return (
                    <tr
                      key={teacher.id}
                      onClick={() => setSelectedId(teacher.id)}
                      className={cn(
                        "cursor-pointer transition hover:bg-bg/50",
                        selectedRow && "bg-brand-50/50 dark:bg-brand-50/10",
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-sm font-bold text-white">
                            {teacher.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold">{teacher.name}</p>
                            <p className="text-xs text-muted">{teacher.employeeNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{facultyLabel(teacher.faculty)}</p>
                        <p className="text-xs text-muted">{teacher.teachingLoad} active classes</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{teacher.disciplines.length} assigned</p>
                        <p className="text-xs text-muted">{teacher.disciplines[0]}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", statusPill[teacher.status])}>
                          {teacher.workloadScore}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {pagedTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted">
                      No teachers match the current search and filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Showing {pagedTeachers.length} of {filteredTeachers.length} records
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
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Selected teacher</p>
                <h3 className="mt-1 text-2xl font-extrabold tracking-tight">{selected.name}</h3>
                <p className="mt-2 text-sm text-muted">{selected.employeeNo}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Faculty", facultyLabel(selected.faculty)],
                  ["Status", selected.status],
                  ["Office", selected.office],
                  ["Email", selected.email],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-2xl border border-line bg-bg p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
                    <p className="mt-2 font-semibold">{value as string}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-line bg-bg p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Teaching load</p>
                  <ShieldCheck className="h-4 w-4 text-muted" />
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Active classes</span>
                      <span className="font-semibold">{selected.teachingLoad}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-line">
                      <div className="h-2 rounded-full bg-brand-600" style={{ width: `${Math.min(100, selected.teachingLoad * 20)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Workload score</span>
                      <span className="font-semibold">{selected.workloadScore}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-line">
                      <div className="h-2 rounded-full bg-success" style={{ width: `${selected.workloadScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-bg p-4">
                <p className="font-semibold">Assigned disciplines</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selected.disciplines.map((item) => (
                    <span key={item} className="rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-bg p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Weekly schedule</p>
                  <Clock3 className="h-4 w-4 text-muted" />
                </div>
                <div className="mt-4 space-y-3">
                  {selected.timetable.map((item) => (
                    <div key={`${item.day}-${item.time}-${item.subject}`} className="flex items-center justify-between rounded-xl border border-line bg-panel px-3 py-3">
                      <div>
                        <p className="font-medium">{item.subject}</p>
                        <p className="text-xs text-muted">
                          {item.day} · {item.group}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-line bg-bg/60 p-6 text-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">No selection</p>
                <p className="mt-2 text-lg font-bold">Choose a teacher to inspect workload and schedule</p>
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
