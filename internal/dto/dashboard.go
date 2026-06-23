package dto

import "time"

// DashboardSummaryResponse aggregates the headline dashboard metrics.
type DashboardSummaryResponse struct {
	GeneratedAt     time.Time               `json:"generatedAt"`
	StudentsTotal   int64                   `json:"studentsTotal"`
	TeachersTotal   int64                   `json:"teachersTotal"`
	GroupsTotal     int64                   `json:"groupsTotal"`
	SubjectsTotal   int64                   `json:"subjectsTotal"`
	Attendance      AttendanceSummary       `json:"attendance"`
	Grades          GradeSummary            `json:"grades"`
	TeacherWorkload TeacherWorkloadSummary  `json:"teacherWorkload"`
	RecentActivity  []AuditActivityResponse `json:"recentActivity"`
}

// AttendanceSummary describes classroom attendance performance.
type AttendanceSummary struct {
	Total          int64   `json:"total"`
	Present        int64   `json:"present"`
	Absent         int64   `json:"absent"`
	Late           int64   `json:"late"`
	Other          int64   `json:"other"`
	AttendanceRate float64 `json:"attendanceRate"`
}

// GradeSummary describes academic performance distribution.
type GradeSummary struct {
	TotalAssessments int64            `json:"totalAssessments"`
	AverageScore     float64          `json:"averageScore"`
	Distribution     map[string]int64 `json:"distribution"`
}

// TeacherWorkloadSummary describes teaching allocation.
type TeacherWorkloadSummary struct {
	TeachersTotal                int64   `json:"teachersTotal"`
	DisciplinesTotal             int64   `json:"disciplinesTotal"`
	AverageDisciplinesPerTeacher float64 `json:"averageDisciplinesPerTeacher"`
}

// AuditActivityResponse is a compact dashboard view of an audit event.
type AuditActivityResponse struct {
	ID         string    `json:"id"`
	EntityName string    `json:"entityName"`
	EntityID   string    `json:"entityId"`
	Action     string    `json:"action"`
	Username   string    `json:"username,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
}
