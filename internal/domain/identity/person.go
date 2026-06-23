package identity

import (
	"time"

	"github.com/google/uuid"
	"university-crm/internal/domain/common"
)

// Person stores the common identity and contact data for staff and students.
type Person struct {
	common.ActiveEntity
	FirstName   string     `json:"firstName" gorm:"type:varchar(100);not null"`
	LastName    string     `json:"lastName" gorm:"type:varchar(100);not null"`
	MiddleName  string     `json:"middleName" gorm:"type:varchar(100)"`
	Gender      string     `json:"gender" gorm:"type:varchar(20)"`
	DateOfBirth *time.Time `json:"dateOfBirth"`
	Phone       string     `json:"phone" gorm:"type:varchar(30)"`
	Email       string     `json:"email" gorm:"type:varchar(255);uniqueIndex"`
	Address     string     `json:"address" gorm:"type:text"`
}

func (Person) TableName() string {
	return "persons"
}

// FullName returns a display-friendly name assembled from the identity fields.
func (p Person) FullName() string {
	if p.MiddleName == "" {
		return p.FirstName + " " + p.LastName
	}
	return p.FirstName + " " + p.MiddleName + " " + p.LastName
}

// StaffProfile identifies employment-specific data for a person.
type StaffProfile struct {
	common.ActiveEntity
	PersonID     uuid.UUID  `json:"personId" gorm:"type:uuid;not null;uniqueIndex"`
	EmployeeNo   string     `json:"employeeNo" gorm:"type:varchar(50);not null;uniqueIndex"`
	Position     string     `json:"position" gorm:"type:varchar(120);not null"`
	FacultyID    *uuid.UUID `json:"facultyId" gorm:"type:uuid;index"`
	HiredAt      *time.Time `json:"hiredAt"`
	AcademicRank string     `json:"academicRank" gorm:"type:varchar(120)"`
}

// StudentProfile identifies enrollment-specific data for a person.
type StudentProfile struct {
	common.ActiveEntity
	PersonID       uuid.UUID  `json:"personId" gorm:"type:uuid;not null;uniqueIndex"`
	StudentNo      string     `json:"studentNo" gorm:"type:varchar(50);not null;uniqueIndex"`
	FacultyID      *uuid.UUID `json:"facultyId" gorm:"type:uuid;index"`
	VocationID     *uuid.UUID `json:"vocationId" gorm:"type:uuid;index"`
	GroupID        *uuid.UUID `json:"groupId" gorm:"type:uuid;index"`
	EnrollmentDate *time.Time `json:"enrollmentDate"`
	Status         string     `json:"status" gorm:"type:varchar(40);not null;default:'active'"`
}
