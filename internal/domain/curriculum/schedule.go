package curriculum

import (
	"time"

	"github.com/google/uuid"
	"university-crm/internal/domain/common"
)

// Schedule defines a repeating class meeting.
type Schedule struct {
	common.ActiveEntity
	DisciplineID          uuid.UUID  `json:"disciplineId" gorm:"type:uuid;not null;index"`
	GroupID               uuid.UUID  `json:"groupId" gorm:"type:uuid;not null;index"`
	TeacherStaffProfileID *uuid.UUID `json:"teacherStaffProfileId" gorm:"type:uuid;index"`
	AuditoriumID          *uuid.UUID `json:"auditoriumId" gorm:"type:uuid;index"`
	DayOfWeek             int        `json:"dayOfWeek" gorm:"not null"`
	StartTime             time.Time  `json:"startTime" gorm:"type:time;not null"`
	EndTime               time.Time  `json:"endTime" gorm:"type:time;not null"`
	WeekPattern           string     `json:"weekPattern" gorm:"type:varchar(50);not null;default:'weekly'"`
}
