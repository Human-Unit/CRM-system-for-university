package tracking

import (
	"time"

	"github.com/google/uuid"
	"university-crm/internal/domain/common"
)

// AcademicPerformance stores assessment results.
type AcademicPerformance struct {
	common.ActiveEntity
	DisciplineID     uuid.UUID  `json:"disciplineId" gorm:"type:uuid;not null;index"`
	StudentProfileID uuid.UUID  `json:"studentProfileId" gorm:"type:uuid;not null;index"`
	AssessmentType   string     `json:"assessmentType" gorm:"type:varchar(30);not null"`
	AssessmentDate   time.Time  `json:"assessmentDate" gorm:"type:date;not null;index"`
	Score            float64    `json:"score" gorm:"not null"`
	MaxScore         float64    `json:"maxScore" gorm:"not null"`
	Grade            string     `json:"grade" gorm:"type:varchar(20)"`
	RecordedByUserID *uuid.UUID `json:"recordedByUserId" gorm:"type:uuid;index"`
	Comment          string     `json:"comment" gorm:"type:text"`
}
