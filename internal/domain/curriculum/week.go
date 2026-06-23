package curriculum

import (
	"time"

	"github.com/google/uuid"
)

// Week represents a planned teaching week inside a discipline.
type Week struct {
	ID             uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	DisciplineID   uuid.UUID `json:"disciplineId" gorm:"type:uuid;not null;index"`
	WeekNumber     int       `json:"weekNumber" gorm:"not null"`
	Title          string    `json:"title" gorm:"type:varchar(255);not null"`
	Plan           string    `json:"plan" gorm:"type:text"`
	PlannedHours   int       `json:"plannedHours" gorm:"not null;default:0"`
	DeliveredHours int       `json:"deliveredHours" gorm:"not null;default:0"`
	Status         string    `json:"status" gorm:"type:varchar(30);not null;default:'planned'"`
	CreatedAt      time.Time `json:"createdAt" gorm:"not null;autoCreateTime"`
	UpdatedAt      time.Time `json:"updatedAt" gorm:"not null;autoUpdateTime"`
}
