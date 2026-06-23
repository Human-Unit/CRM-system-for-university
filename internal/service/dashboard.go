package service

import (
	"context"
	"math"
	"time"

	"university-crm/internal/domain/academic"
	"university-crm/internal/domain/curriculum"
	"university-crm/internal/domain/identity"
	"university-crm/internal/domain/tracking"
	"university-crm/internal/dto"
	"university-crm/internal/repository"
)

// DashboardService assembles dashboard metrics from the data layer.
type DashboardService interface {
	Summary(ctx context.Context) (dto.DashboardSummaryResponse, error)
}

// DefaultDashboardService composes the repositories needed for the dashboard.
type DefaultDashboardService struct {
	students    repository.StudentProfileRepository
	staff       repository.StaffProfileRepository
	groups      repository.GroupRepository
	subjects    repository.SubjectRepository
	disciplines repository.DisciplineRepository
	attendance  repository.AttendanceRepository
	performance repository.AcademicPerformanceRepository
	audits      repository.AuditLogRepository
}

// NewDefaultDashboardService creates the dashboard application service.
func NewDefaultDashboardService(
	students repository.StudentProfileRepository,
	staff repository.StaffProfileRepository,
	groups repository.GroupRepository,
	subjects repository.SubjectRepository,
	disciplines repository.DisciplineRepository,
	attendance repository.AttendanceRepository,
	performance repository.AcademicPerformanceRepository,
	audits repository.AuditLogRepository,
) *DefaultDashboardService {
	return &DefaultDashboardService{
		students:    students,
		staff:       staff,
		groups:      groups,
		subjects:    subjects,
		disciplines: disciplines,
		attendance:  attendance,
		performance: performance,
		audits:      audits,
	}
}

func (s *DefaultDashboardService) Summary(ctx context.Context) (dto.DashboardSummaryResponse, error) {
	now := time.Now().UTC()

	studentsTotal, err := countAll[identity.StudentProfile](ctx, s.students)
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}
	teachersTotal, err := countAll[identity.StaffProfile](ctx, s.staff)
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}
	groupsTotal, err := countAll[academic.Group](ctx, s.groups)
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}
	subjectsTotal, err := countAll[curriculum.Subject](ctx, s.subjects)
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}
	disciplinesTotal, err := countAll[curriculum.Discipline](ctx, s.disciplines)
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}

	present, err := countAttendanceStatus(ctx, s.attendance, "present")
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}
	absent, err := countAttendanceStatus(ctx, s.attendance, "absent")
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}
	late, err := countAttendanceStatus(ctx, s.attendance, "late")
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}
	totalAttendance, err := countAll[tracking.Attendance](ctx, s.attendance)
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}
	other := totalAttendance - present - absent - late
	if other < 0 {
		other = 0
	}
	attendanceRate := 0.0
	if totalAttendance > 0 {
		attendanceRate = math.Round((float64(present)/float64(totalAttendance))*1000) / 10
	}

	totalAssessments, err := countAll[tracking.AcademicPerformance](ctx, s.performance)
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}
	distribution, err := gradeDistribution(ctx, s.performance)
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}
	averageScore, err := averageAssessmentScore(ctx, s.performance)
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}

	recentActivity, err := recentAuditActivity(ctx, s.audits)
	if err != nil {
		return dto.DashboardSummaryResponse{}, err
	}

	teacherWorkload := 0.0
	if teachersTotal > 0 {
		teacherWorkload = math.Round((float64(disciplinesTotal)/float64(teachersTotal))*10) / 10
	}

	return dto.DashboardSummaryResponse{
		GeneratedAt:   now,
		StudentsTotal: studentsTotal,
		TeachersTotal: teachersTotal,
		GroupsTotal:   groupsTotal,
		SubjectsTotal: subjectsTotal,
		Attendance: dto.AttendanceSummary{
			Total:          totalAttendance,
			Present:        present,
			Absent:         absent,
			Late:           late,
			Other:          other,
			AttendanceRate: attendanceRate,
		},
		Grades: dto.GradeSummary{
			TotalAssessments: totalAssessments,
			AverageScore:     averageScore,
			Distribution:     distribution,
		},
		TeacherWorkload: dto.TeacherWorkloadSummary{
			TeachersTotal:                teachersTotal,
			DisciplinesTotal:             disciplinesTotal,
			AverageDisciplinesPerTeacher: teacherWorkload,
		},
		RecentActivity: recentActivity,
	}, nil
}

func countAll[T any](ctx context.Context, repo repository.CrudRepository[T]) (int64, error) {
	if repo == nil {
		return 0, nil
	}
	_, total, err := repo.List(ctx, repository.ListOptions{Limit: 1, Offset: 0})
	return total, err
}

func countAttendanceStatus(ctx context.Context, repo repository.AttendanceRepository, status string) (int64, error) {
	if repo == nil {
		return 0, nil
	}
	items, total, err := repo.List(ctx, repository.ListOptions{
		Limit:   1,
		Offset:  0,
		Filters: map[string]any{"status": status},
	})
	_ = items
	return total, err
}

func gradeDistribution(ctx context.Context, repo repository.AcademicPerformanceRepository) (map[string]int64, error) {
	if repo == nil {
		return map[string]int64{"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}, nil
	}
	grades := []string{"A", "B", "C", "D", "F"}
	distribution := make(map[string]int64, len(grades))
	for _, grade := range grades {
		_, total, err := repo.List(ctx, repository.ListOptions{
			Limit:   1,
			Offset:  0,
			Filters: map[string]any{"grade": grade},
		})
		if err != nil {
			return nil, err
		}
		distribution[grade] = total
	}
	return distribution, nil
}

func averageAssessmentScore(ctx context.Context, repo repository.AcademicPerformanceRepository) (float64, error) {
	if repo == nil {
		return 0, nil
	}
	items, _, err := repo.List(ctx, repository.ListOptions{Limit: 5000, Offset: 0})
	if err != nil {
		return 0, err
	}
	if len(items) == 0 {
		return 0, nil
	}
	var total float64
	for _, item := range items {
		total += item.Score
	}
	return math.Round((total/float64(len(items)))*10) / 10, nil
}

func recentAuditActivity(ctx context.Context, repo repository.AuditLogRepository) ([]dto.AuditActivityResponse, error) {
	if repo == nil {
		return nil, nil
	}
	items, _, err := repo.List(ctx, repository.ListOptions{Limit: 8, Offset: 0})
	if err != nil {
		return nil, err
	}
	out := make([]dto.AuditActivityResponse, 0, len(items))
	for _, item := range items {
		out = append(out, dto.AuditActivityResponse{
			ID:         item.ID.String(),
			EntityName: item.EntityName,
			EntityID:   item.EntityID,
			Action:     string(item.Action),
			CreatedAt:  item.CreatedAt,
		})
	}
	return out, nil
}
