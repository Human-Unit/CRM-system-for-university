package academic

import (
	"github.com/google/uuid"
	"university-crm/internal/domain/common"
)

// Group contains a cohort of students.
type Group struct {
	common.ActiveEntity
	FacultyID             uuid.UUID  `json:"facultyId" gorm:"type:uuid;not null;index"`
	VocationID            *uuid.UUID `json:"vocationId" gorm:"type:uuid;index"`
	CuratorStaffProfileID *uuid.UUID `json:"curatorStaffProfileId" gorm:"type:uuid;index"`
	Code                  string     `json:"code" gorm:"type:varchar(50);not null;uniqueIndex"`
	Name                  string     `json:"name" gorm:"type:varchar(150);not null"`
	AdmissionYear         int        `json:"admissionYear" gorm:"not null"`
}
