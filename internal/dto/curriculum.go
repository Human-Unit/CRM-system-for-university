package dto

import (
	"time"

	"github.com/google/uuid"
)

type SubjectCreateRequest struct {
	FacultyID   *uuid.UUID `json:"facultyId,omitempty"`
	Code        string     `json:"code" validate:"required,max=50"`
	Name        string     `json:"name" validate:"required,max=150"`
	Description string     `json:"description,omitempty"`
	CreditHours int        `json:"creditHours,omitempty"`
	IsActive    bool       `json:"isActive,omitempty"`
}

type SubjectUpdateRequest struct {
	FacultyID   **uuid.UUID `json:"facultyId,omitempty"`
	Code        *string     `json:"code,omitempty" validate:"omitempty,max=50"`
	Name        *string     `json:"name,omitempty" validate:"omitempty,max=150"`
	Description *string     `json:"description,omitempty"`
	CreditHours *int        `json:"creditHours,omitempty"`
	IsActive    *bool       `json:"isActive,omitempty"`
}

type SubjectResponse struct {
	ID          uuid.UUID  `json:"id"`
	FacultyID   *uuid.UUID `json:"facultyId,omitempty"`
	Code        string     `json:"code"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	CreditHours int        `json:"creditHours"`
	IsActive    bool       `json:"isActive"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

type DisciplineCreateRequest struct {
	SubjectID             uuid.UUID  `json:"subjectId" validate:"required"`
	TeacherStaffProfileID *uuid.UUID `json:"teacherStaffProfileId,omitempty"`
	GroupID               uuid.UUID  `json:"groupId" validate:"required"`
	AcademicYear          string     `json:"academicYear" validate:"required,max=20"`
	Semester              int        `json:"semester" validate:"required"`
	TotalHours            int        `json:"totalHours,omitempty"`
	Status                string     `json:"status,omitempty" validate:"omitempty,max=30"`
	IsActive              bool       `json:"isActive,omitempty"`
}

type DisciplineUpdateRequest struct {
	SubjectID             *uuid.UUID  `json:"subjectId,omitempty"`
	TeacherStaffProfileID **uuid.UUID `json:"teacherStaffProfileId,omitempty"`
	GroupID               *uuid.UUID  `json:"groupId,omitempty"`
	AcademicYear          *string     `json:"academicYear,omitempty" validate:"omitempty,max=20"`
	Semester              *int        `json:"semester,omitempty"`
	TotalHours            *int        `json:"totalHours,omitempty"`
	Status                *string     `json:"status,omitempty" validate:"omitempty,max=30"`
	IsActive              *bool       `json:"isActive,omitempty"`
}

type DisciplineResponse struct {
	ID                    uuid.UUID  `json:"id"`
	SubjectID             uuid.UUID  `json:"subjectId"`
	TeacherStaffProfileID *uuid.UUID `json:"teacherStaffProfileId,omitempty"`
	GroupID               uuid.UUID  `json:"groupId"`
	AcademicYear          string     `json:"academicYear"`
	Semester              int        `json:"semester"`
	TotalHours            int        `json:"totalHours"`
	Status                string     `json:"status"`
	IsActive              bool       `json:"isActive"`
	CreatedAt             time.Time  `json:"createdAt"`
	UpdatedAt             time.Time  `json:"updatedAt"`
}

type WeekCreateRequest struct {
	DisciplineID   uuid.UUID `json:"disciplineId" validate:"required"`
	WeekNumber     int       `json:"weekNumber" validate:"required"`
	Title          string    `json:"title" validate:"required,max=255"`
	Plan           string    `json:"plan,omitempty"`
	PlannedHours   int       `json:"plannedHours,omitempty"`
	DeliveredHours int       `json:"deliveredHours,omitempty"`
	Status         string    `json:"status,omitempty" validate:"omitempty,max=30"`
}

type WeekUpdateRequest struct {
	WeekNumber     *int    `json:"weekNumber,omitempty"`
	Title          *string `json:"title,omitempty" validate:"omitempty,max=255"`
	Plan           *string `json:"plan,omitempty"`
	PlannedHours   *int    `json:"plannedHours,omitempty"`
	DeliveredHours *int    `json:"deliveredHours,omitempty"`
	Status         *string `json:"status,omitempty" validate:"omitempty,max=30"`
}

type WeekResponse struct {
	ID             uuid.UUID `json:"id"`
	DisciplineID   uuid.UUID `json:"disciplineId"`
	WeekNumber     int       `json:"weekNumber"`
	Title          string    `json:"title"`
	Plan           string    `json:"plan"`
	PlannedHours   int       `json:"plannedHours"`
	DeliveredHours int       `json:"deliveredHours"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

type ScheduleCreateRequest struct {
	DisciplineID          uuid.UUID  `json:"disciplineId" validate:"required"`
	GroupID               uuid.UUID  `json:"groupId" validate:"required"`
	TeacherStaffProfileID *uuid.UUID `json:"teacherStaffProfileId,omitempty"`
	AuditoriumID          *uuid.UUID `json:"auditoriumId,omitempty"`
	DayOfWeek             int        `json:"dayOfWeek" validate:"required"`
	StartTime             time.Time  `json:"startTime" validate:"required"`
	EndTime               time.Time  `json:"endTime" validate:"required"`
	WeekPattern           string     `json:"weekPattern,omitempty" validate:"omitempty,max=50"`
	IsActive              bool       `json:"isActive,omitempty"`
}

type ScheduleUpdateRequest struct {
	DisciplineID          *uuid.UUID  `json:"disciplineId,omitempty"`
	GroupID               *uuid.UUID  `json:"groupId,omitempty"`
	TeacherStaffProfileID **uuid.UUID `json:"teacherStaffProfileId,omitempty"`
	AuditoriumID          **uuid.UUID `json:"auditoriumId,omitempty"`
	DayOfWeek             *int        `json:"dayOfWeek,omitempty"`
	StartTime             *time.Time  `json:"startTime,omitempty"`
	EndTime               *time.Time  `json:"endTime,omitempty"`
	WeekPattern           *string     `json:"weekPattern,omitempty" validate:"omitempty,max=50"`
	IsActive              *bool       `json:"isActive,omitempty"`
}

type ScheduleResponse struct {
	ID                    uuid.UUID  `json:"id"`
	DisciplineID          uuid.UUID  `json:"disciplineId"`
	GroupID               uuid.UUID  `json:"groupId"`
	TeacherStaffProfileID *uuid.UUID `json:"teacherStaffProfileId,omitempty"`
	AuditoriumID          *uuid.UUID `json:"auditoriumId,omitempty"`
	DayOfWeek             int        `json:"dayOfWeek"`
	StartTime             time.Time  `json:"startTime"`
	EndTime               time.Time  `json:"endTime"`
	WeekPattern           string     `json:"weekPattern"`
	IsActive              bool       `json:"isActive"`
	CreatedAt             time.Time  `json:"createdAt"`
	UpdatedAt             time.Time  `json:"updatedAt"`
}
