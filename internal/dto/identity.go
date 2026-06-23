package dto

import (
	"time"

	"github.com/google/uuid"
)

type RoleCreateRequest struct {
	Code        string `json:"code" validate:"required,max=50"`
	Name        string `json:"name" validate:"required,max=120"`
	Description string `json:"description,omitempty"`
	IsSystem    bool   `json:"isSystem,omitempty"`
	IsActive    bool   `json:"isActive,omitempty"`
}

type RoleUpdateRequest struct {
	Code        *string `json:"code,omitempty" validate:"omitempty,max=50"`
	Name        *string `json:"name,omitempty" validate:"omitempty,max=120"`
	Description *string `json:"description,omitempty"`
	IsSystem    *bool   `json:"isSystem,omitempty"`
	IsActive    *bool   `json:"isActive,omitempty"`
}

type RoleResponse struct {
	ID          uuid.UUID `json:"id"`
	Code        string    `json:"code"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	IsSystem    bool      `json:"isSystem"`
	IsActive    bool      `json:"isActive"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type PersonCreateRequest struct {
	FirstName   string     `json:"firstName" validate:"required,max=100"`
	LastName    string     `json:"lastName" validate:"required,max=100"`
	MiddleName  string     `json:"middleName,omitempty" validate:"omitempty,max=100"`
	Gender      string     `json:"gender,omitempty" validate:"omitempty,max=20"`
	DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	Phone       string     `json:"phone,omitempty" validate:"omitempty,max=30"`
	Email       string     `json:"email,omitempty" validate:"omitempty,email,max=255"`
	Address     string     `json:"address,omitempty"`
	IsActive    bool       `json:"isActive,omitempty"`
}

type PersonUpdateRequest struct {
	FirstName   *string    `json:"firstName,omitempty" validate:"omitempty,max=100"`
	LastName    *string    `json:"lastName,omitempty" validate:"omitempty,max=100"`
	MiddleName  *string    `json:"middleName,omitempty" validate:"omitempty,max=100"`
	Gender      *string    `json:"gender,omitempty" validate:"omitempty,max=20"`
	DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	Phone       *string    `json:"phone,omitempty" validate:"omitempty,max=30"`
	Email       *string    `json:"email,omitempty" validate:"omitempty,email,max=255"`
	Address     *string    `json:"address,omitempty"`
	IsActive    *bool      `json:"isActive,omitempty"`
}

type PersonResponse struct {
	ID          uuid.UUID  `json:"id"`
	FirstName   string     `json:"firstName"`
	LastName    string     `json:"lastName"`
	MiddleName  string     `json:"middleName"`
	FullName    string     `json:"fullName"`
	Gender      string     `json:"gender"`
	DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	Phone       string     `json:"phone"`
	Email       string     `json:"email"`
	Address     string     `json:"address"`
	IsActive    bool       `json:"isActive"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

type StaffProfileCreateRequest struct {
	PersonID     uuid.UUID  `json:"personId" validate:"required"`
	EmployeeNo   string     `json:"employeeNo" validate:"required,max=50"`
	Position     string     `json:"position" validate:"required,max=120"`
	FacultyID    *uuid.UUID `json:"facultyId,omitempty"`
	HiredAt      *time.Time `json:"hiredAt,omitempty"`
	AcademicRank string     `json:"academicRank,omitempty" validate:"omitempty,max=120"`
	IsActive     bool       `json:"isActive,omitempty"`
}

type StaffProfileUpdateRequest struct {
	PersonID     *uuid.UUID  `json:"personId,omitempty"`
	EmployeeNo   *string     `json:"employeeNo,omitempty" validate:"omitempty,max=50"`
	Position     *string     `json:"position,omitempty" validate:"omitempty,max=120"`
	FacultyID    **uuid.UUID `json:"facultyId,omitempty"`
	HiredAt      **time.Time `json:"hiredAt,omitempty"`
	AcademicRank *string     `json:"academicRank,omitempty" validate:"omitempty,max=120"`
	IsActive     *bool       `json:"isActive,omitempty"`
}

type StaffProfileResponse struct {
	ID           uuid.UUID  `json:"id"`
	PersonID     uuid.UUID  `json:"personId"`
	EmployeeNo   string     `json:"employeeNo"`
	Position     string     `json:"position"`
	FacultyID    *uuid.UUID `json:"facultyId,omitempty"`
	HiredAt      *time.Time `json:"hiredAt,omitempty"`
	AcademicRank string     `json:"academicRank"`
	IsActive     bool       `json:"isActive"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
}

type StudentProfileCreateRequest struct {
	PersonID       uuid.UUID  `json:"personId" validate:"required"`
	StudentNo      string     `json:"studentNo" validate:"required,max=50"`
	FacultyID      *uuid.UUID `json:"facultyId,omitempty"`
	VocationID     *uuid.UUID `json:"vocationId,omitempty"`
	GroupID        *uuid.UUID `json:"groupId,omitempty"`
	EnrollmentDate *time.Time `json:"enrollmentDate,omitempty"`
	Status         string     `json:"status,omitempty" validate:"omitempty,max=40"`
	IsActive       bool       `json:"isActive,omitempty"`
}

type StudentProfileUpdateRequest struct {
	PersonID       *uuid.UUID  `json:"personId,omitempty"`
	StudentNo      *string     `json:"studentNo,omitempty" validate:"omitempty,max=50"`
	FacultyID      **uuid.UUID `json:"facultyId,omitempty"`
	VocationID     **uuid.UUID `json:"vocationId,omitempty"`
	GroupID        **uuid.UUID `json:"groupId,omitempty"`
	EnrollmentDate **time.Time `json:"enrollmentDate,omitempty"`
	Status         *string     `json:"status,omitempty" validate:"omitempty,max=40"`
	IsActive       *bool       `json:"isActive,omitempty"`
}

type StudentProfileResponse struct {
	ID             uuid.UUID  `json:"id"`
	PersonID       uuid.UUID  `json:"personId"`
	StudentNo      string     `json:"studentNo"`
	FacultyID      *uuid.UUID `json:"facultyId,omitempty"`
	VocationID     *uuid.UUID `json:"vocationId,omitempty"`
	GroupID        *uuid.UUID `json:"groupId,omitempty"`
	EnrollmentDate *time.Time `json:"enrollmentDate,omitempty"`
	Status         string     `json:"status"`
	IsActive       bool       `json:"isActive"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
}

type UserCreateRequest struct {
	PersonID uuid.UUID `json:"personId" validate:"required"`
	RoleID   uuid.UUID `json:"roleId" validate:"required"`
	Username string    `json:"username" validate:"required,max=100"`
	Password string    `json:"password" validate:"required,min=8,max=255"`
	IsActive bool      `json:"isActive,omitempty"`
}

type UserUpdateRequest struct {
	RoleID   *uuid.UUID `json:"roleId,omitempty"`
	Username *string    `json:"username,omitempty" validate:"omitempty,max=100"`
	Password *string    `json:"password,omitempty" validate:"omitempty,min=8,max=255"`
	IsActive *bool      `json:"isActive,omitempty"`
}

type UserResponse struct {
	ID        uuid.UUID  `json:"id"`
	PersonID  uuid.UUID  `json:"personId"`
	RoleID    uuid.UUID  `json:"roleId"`
	Username  string     `json:"username"`
	LastLogin *time.Time `json:"lastLogin,omitempty"`
	IsActive  bool       `json:"isActive"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type LoginResponse struct {
	AccessToken  string       `json:"accessToken"`
	RefreshToken string       `json:"refreshToken,omitempty"`
	User         UserResponse `json:"user"`
}
