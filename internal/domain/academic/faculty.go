package academic

import (
	"github.com/google/uuid"
	"university-crm/internal/domain/common"
)

// Faculty is the top-level academic structure.
type Faculty struct {
	common.ActiveEntity
	Code         string     `json:"code" gorm:"type:varchar(50);not null;uniqueIndex"`
	Name         string     `json:"name" gorm:"type:varchar(150);not null"`
	Description  string     `json:"description" gorm:"type:text"`
	DeanPersonID *uuid.UUID `json:"deanPersonId" gorm:"type:uuid"`
}
