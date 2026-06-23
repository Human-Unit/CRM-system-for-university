package tracking

import (
	"time"

	"github.com/google/uuid"
	"university-crm/internal/domain/common"
)

// Execution captures a lesson delivery instance.
type Execution struct {
	common.ActiveEntity
	DisciplineID          uuid.UUID  `json:"disciplineId" gorm:"type:uuid;not null;index"`
	TeacherStaffProfileID *uuid.UUID `json:"teacherStaffProfileId" gorm:"type:uuid;index"`
	AuditoriumID          *uuid.UUID `json:"auditoriumId" gorm:"type:uuid;index"`
	ExecutedAt            time.Time  `json:"executedAt" gorm:"not null;index"`
	Topic                 string     `json:"topic" gorm:"type:varchar(255);not null"`
	Notes                 string     `json:"notes" gorm:"type:text"`
	DurationMinutes       int        `json:"durationMinutes" gorm:"not null;default:0"`
	Status                string     `json:"status" gorm:"type:varchar(30);not null;default:'completed'"`
}
