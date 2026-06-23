package dto

import (
	"time"

	"github.com/google/uuid"
)

type FacultyCreateRequest struct {
	Code         string     `json:"code" validate:"required,max=50"`
	Name         string     `json:"name" validate:"required,max=150"`
	Description  string     `json:"description,omitempty"`
	DeanPersonID *uuid.UUID `json:"deanPersonId,omitempty"`
	IsActive     bool       `json:"isActive,omitempty"`
}

type FacultyUpdateRequest struct {
	Code         *string     `json:"code,omitempty" validate:"omitempty,max=50"`
	Name         *string     `json:"name,omitempty" validate:"omitempty,max=150"`
	Description  *string     `json:"description,omitempty"`
	DeanPersonID **uuid.UUID `json:"deanPersonId,omitempty"`
	IsActive     *bool       `json:"isActive,omitempty"`
}

type FacultyResponse struct {
	ID           uuid.UUID  `json:"id"`
	Code         string     `json:"code"`
	Name         string     `json:"name"`
	Description  string     `json:"description"`
	DeanPersonID *uuid.UUID `json:"deanPersonId,omitempty"`
	IsActive     bool       `json:"isActive"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
}

type VocationCreateRequest struct {
	FacultyID   uuid.UUID `json:"facultyId" validate:"required"`
	Code        string    `json:"code" validate:"required,max=50"`
	Name        string    `json:"name" validate:"required,max=150"`
	Description string    `json:"description,omitempty"`
	Level       string    `json:"level,omitempty" validate:"omitempty,max=50"`
	IsActive    bool      `json:"isActive,omitempty"`
}

type VocationUpdateRequest struct {
	FacultyID   *uuid.UUID `json:"facultyId,omitempty"`
	Code        *string    `json:"code,omitempty" validate:"omitempty,max=50"`
	Name        *string    `json:"name,omitempty" validate:"omitempty,max=150"`
	Description *string    `json:"description,omitempty"`
	Level       *string    `json:"level,omitempty" validate:"omitempty,max=50"`
	IsActive    *bool      `json:"isActive,omitempty"`
}

type VocationResponse struct {
	ID          uuid.UUID `json:"id"`
	FacultyID   uuid.UUID `json:"facultyId"`
	Code        string    `json:"code"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Level       string    `json:"level"`
	IsActive    bool      `json:"isActive"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type GroupCreateRequest struct {
	FacultyID             uuid.UUID  `json:"facultyId" validate:"required"`
	VocationID            *uuid.UUID `json:"vocationId,omitempty"`
	CuratorStaffProfileID *uuid.UUID `json:"curatorStaffProfileId,omitempty"`
	Code                  string     `json:"code" validate:"required,max=50"`
	Name                  string     `json:"name" validate:"required,max=150"`
	AdmissionYear         int        `json:"admissionYear" validate:"required"`
	IsActive              bool       `json:"isActive,omitempty"`
}

type GroupUpdateRequest struct {
	FacultyID             *uuid.UUID  `json:"facultyId,omitempty"`
	VocationID            **uuid.UUID `json:"vocationId,omitempty"`
	CuratorStaffProfileID **uuid.UUID `json:"curatorStaffProfileId,omitempty"`
	Code                  *string     `json:"code,omitempty" validate:"omitempty,max=50"`
	Name                  *string     `json:"name,omitempty" validate:"omitempty,max=150"`
	AdmissionYear         *int        `json:"admissionYear,omitempty"`
	IsActive              *bool       `json:"isActive,omitempty"`
}

type GroupResponse struct {
	ID                    uuid.UUID  `json:"id"`
	FacultyID             uuid.UUID  `json:"facultyId"`
	VocationID            *uuid.UUID `json:"vocationId,omitempty"`
	CuratorStaffProfileID *uuid.UUID `json:"curatorStaffProfileId,omitempty"`
	Code                  string     `json:"code"`
	Name                  string     `json:"name"`
	AdmissionYear         int        `json:"admissionYear"`
	IsActive              bool       `json:"isActive"`
	CreatedAt             time.Time  `json:"createdAt"`
	UpdatedAt             time.Time  `json:"updatedAt"`
}

type AuditoriumCreateRequest struct {
	Building   string `json:"building" validate:"required,max=100"`
	RoomNumber string `json:"roomNumber" validate:"required,max=50"`
	Capacity   int    `json:"capacity" validate:"required"`
	Type       string `json:"type,omitempty" validate:"omitempty,max=50"`
	IsLab      bool   `json:"isLab,omitempty"`
	IsActive   bool   `json:"isActive,omitempty"`
}

type AuditoriumUpdateRequest struct {
	Building   *string `json:"building,omitempty" validate:"omitempty,max=100"`
	RoomNumber *string `json:"roomNumber,omitempty" validate:"omitempty,max=50"`
	Capacity   *int    `json:"capacity,omitempty"`
	Type       *string `json:"type,omitempty" validate:"omitempty,max=50"`
	IsLab      *bool   `json:"isLab,omitempty"`
	IsActive   *bool   `json:"isActive,omitempty"`
}

type AuditoriumResponse struct {
	ID         uuid.UUID `json:"id"`
	Building   string    `json:"building"`
	RoomNumber string    `json:"roomNumber"`
	Capacity   int       `json:"capacity"`
	Type       string    `json:"type"`
	IsLab      bool      `json:"isLab"`
	IsActive   bool      `json:"isActive"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}
