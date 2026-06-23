package repository

import (
	"gorm.io/gorm"
	"university-crm/internal/domain/tracking"
	"university-crm/internal/repository/gormrepo"
)

type AttendanceRepository interface {
	CrudRepository[tracking.Attendance]
}

type AcademicPerformanceRepository interface {
	CrudRepository[tracking.AcademicPerformance]
}

type ExecutionRepository interface {
	CrudRepository[tracking.Execution]
}

func NewAttendanceRepository(db *gorm.DB) AttendanceRepository {
	return gormrepo.NewCrudRepository[tracking.Attendance](db)
}

func NewAcademicPerformanceRepository(db *gorm.DB) AcademicPerformanceRepository {
	return gormrepo.NewCrudRepository[tracking.AcademicPerformance](db)
}

func NewExecutionRepository(db *gorm.DB) ExecutionRepository {
	return gormrepo.NewCrudRepository[tracking.Execution](db)
}
