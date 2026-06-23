package dto

import (
	"time"

	"github.com/google/uuid"
)

type AttendanceCreateRequest struct {
	DisciplineID     uuid.UUID  `json:"disciplineId" validate:"required"`
	StudentProfileID uuid.UUID  `json:"studentProfileId" validate:"required"`
	AttendanceDate   time.Time  `json:"attendanceDate" validate:"required"`
	Status           string     `json:"status" validate:"required,max=30"`
	MarkedByUserID   *uuid.UUID `json:"markedByUserId,omitempty"`
	Remark           string     `json:"remark,omitempty"`
	IsActive         bool       `json:"isActive,omitempty"`
}

type AttendanceUpdateRequest struct {
	Status         *string     `json:"status,omitempty" validate:"omitempty,max=30"`
	MarkedByUserID **uuid.UUID `json:"markedByUserId,omitempty"`
	Remark         *string     `json:"remark,omitempty"`
	IsActive       *bool       `json:"isActive,omitempty"`
}

type AttendanceResponse struct {
	ID               uuid.UUID  `json:"id"`
	DisciplineID     uuid.UUID  `json:"disciplineId"`
	StudentProfileID uuid.UUID  `json:"studentProfileId"`
	AttendanceDate   time.Time  `json:"attendanceDate"`
	Status           string     `json:"status"`
	MarkedByUserID   *uuid.UUID `json:"markedByUserId,omitempty"`
	Remark           string     `json:"remark"`
	IsActive         bool       `json:"isActive"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        time.Time  `json:"updatedAt"`
}

type AcademicPerformanceCreateRequest struct {
	DisciplineID     uuid.UUID  `json:"disciplineId" validate:"required"`
	StudentProfileID uuid.UUID  `json:"studentProfileId" validate:"required"`
	AssessmentType   string     `json:"assessmentType" validate:"required,max=30"`
	AssessmentDate   time.Time  `json:"assessmentDate" validate:"required"`
	Score            float64    `json:"score" validate:"required"`
	MaxScore         float64    `json:"maxScore" validate:"required"`
	Grade            string     `json:"grade,omitempty" validate:"omitempty,max=20"`
	RecordedByUserID *uuid.UUID `json:"recordedByUserId,omitempty"`
	Comment          string     `json:"comment,omitempty"`
	IsActive         bool       `json:"isActive,omitempty"`
}

type AcademicPerformanceUpdateRequest struct {
	AssessmentType   *string     `json:"assessmentType,omitempty" validate:"omitempty,max=30"`
	AssessmentDate   *time.Time  `json:"assessmentDate,omitempty"`
	Score            *float64    `json:"score,omitempty"`
	MaxScore         *float64    `json:"maxScore,omitempty"`
	Grade            *string     `json:"grade,omitempty" validate:"omitempty,max=20"`
	RecordedByUserID **uuid.UUID `json:"recordedByUserId,omitempty"`
	Comment          *string     `json:"comment,omitempty"`
	IsActive         *bool       `json:"isActive,omitempty"`
}

type AcademicPerformanceResponse struct {
	ID               uuid.UUID  `json:"id"`
	DisciplineID     uuid.UUID  `json:"disciplineId"`
	StudentProfileID uuid.UUID  `json:"studentProfileId"`
	AssessmentType   string     `json:"assessmentType"`
	AssessmentDate   time.Time  `json:"assessmentDate"`
	Score            float64    `json:"score"`
	MaxScore         float64    `json:"maxScore"`
	Grade            string     `json:"grade"`
	RecordedByUserID *uuid.UUID `json:"recordedByUserId,omitempty"`
	Comment          string     `json:"comment"`
	IsActive         bool       `json:"isActive"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        time.Time  `json:"updatedAt"`
}

type ExecutionCreateRequest struct {
	DisciplineID          uuid.UUID  `json:"disciplineId" validate:"required"`
	TeacherStaffProfileID *uuid.UUID `json:"teacherStaffProfileId,omitempty"`
	AuditoriumID          *uuid.UUID `json:"auditoriumId,omitempty"`
	ExecutedAt            time.Time  `json:"executedAt" validate:"required"`
	Topic                 string     `json:"topic" validate:"required,max=255"`
	Notes                 string     `json:"notes,omitempty"`
	DurationMinutes       int        `json:"durationMinutes,omitempty"`
	Status                string     `json:"status,omitempty" validate:"omitempty,max=30"`
	IsActive              bool       `json:"isActive,omitempty"`
}

type ExecutionUpdateRequest struct {
	TeacherStaffProfileID **uuid.UUID `json:"teacherStaffProfileId,omitempty"`
	AuditoriumID          **uuid.UUID `json:"auditoriumId,omitempty"`
	ExecutedAt            *time.Time  `json:"executedAt,omitempty"`
	Topic                 *string     `json:"topic,omitempty" validate:"omitempty,max=255"`
	Notes                 *string     `json:"notes,omitempty"`
	DurationMinutes       *int        `json:"durationMinutes,omitempty"`
	Status                *string     `json:"status,omitempty" validate:"omitempty,max=30"`
	IsActive              *bool       `json:"isActive,omitempty"`
}

type ExecutionResponse struct {
	ID                    uuid.UUID  `json:"id"`
	DisciplineID          uuid.UUID  `json:"disciplineId"`
	TeacherStaffProfileID *uuid.UUID `json:"teacherStaffProfileId,omitempty"`
	AuditoriumID          *uuid.UUID `json:"auditoriumId,omitempty"`
	ExecutedAt            time.Time  `json:"executedAt"`
	Topic                 string     `json:"topic"`
	Notes                 string     `json:"notes"`
	DurationMinutes       int        `json:"durationMinutes"`
	Status                string     `json:"status"`
	IsActive              bool       `json:"isActive"`
	CreatedAt             time.Time  `json:"createdAt"`
	UpdatedAt             time.Time  `json:"updatedAt"`
}
