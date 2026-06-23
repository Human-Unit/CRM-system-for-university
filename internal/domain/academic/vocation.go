package academic

import (
	"github.com/google/uuid"
	"university-crm/internal/domain/common"
)

// Vocation represents an academic track or program within a faculty.
type Vocation struct {
	common.ActiveEntity
	FacultyID   uuid.UUID `json:"facultyId" gorm:"type:uuid;not null;index"`
	Code        string    `json:"code" gorm:"type:varchar(50);not null"`
	Name        string    `json:"name" gorm:"type:varchar(150);not null"`
	Description string    `json:"description" gorm:"type:text"`
	Level       string    `json:"level" gorm:"type:varchar(50)"`
}
