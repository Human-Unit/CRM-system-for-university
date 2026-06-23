package curriculum

import (
	"github.com/google/uuid"
	"university-crm/internal/domain/common"
)

// Subject is the catalog-level academic unit.
type Subject struct {
	common.ActiveEntity
	FacultyID   *uuid.UUID `json:"facultyId" gorm:"type:uuid;index"`
	Code        string     `json:"code" gorm:"type:varchar(50);not null;uniqueIndex"`
	Name        string     `json:"name" gorm:"type:varchar(150);not null"`
	Description string     `json:"description" gorm:"type:text"`
	CreditHours int        `json:"creditHours" gorm:"not null;default:0"`
}
