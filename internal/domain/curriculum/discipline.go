package curriculum

import (
	"github.com/google/uuid"
	"university-crm/internal/domain/common"
)

// Discipline represents an offered teaching unit for a group and teacher.
type Discipline struct {
	common.ActiveEntity
	SubjectID             uuid.UUID  `json:"subjectId" gorm:"type:uuid;not null;index"`
	TeacherStaffProfileID *uuid.UUID `json:"teacherStaffProfileId" gorm:"type:uuid;index"`
	GroupID               uuid.UUID  `json:"groupId" gorm:"type:uuid;not null;index"`
	AcademicYear          string     `json:"academicYear" gorm:"type:varchar(20);not null"`
	Semester              int        `json:"semester" gorm:"not null"`
	TotalHours            int        `json:"totalHours" gorm:"not null;default:0"`
	Status                string     `json:"status" gorm:"type:varchar(30);not null;default:'planned'"`
}
