package service

import (
	"university-crm/internal/domain/tracking"
	"university-crm/internal/dto"
)

type AttendanceService interface {
	CrudService[tracking.Attendance, dto.AttendanceCreateRequest, dto.AttendanceUpdateRequest, dto.AttendanceResponse]
}

type AcademicPerformanceService interface {
	CrudService[tracking.AcademicPerformance, dto.AcademicPerformanceCreateRequest, dto.AcademicPerformanceUpdateRequest, dto.AcademicPerformanceResponse]
}

type ExecutionService interface {
	CrudService[tracking.Execution, dto.ExecutionCreateRequest, dto.ExecutionUpdateRequest, dto.ExecutionResponse]
}
