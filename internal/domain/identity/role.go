package identity

import "university-crm/internal/domain/common"

// Role defines a system access role.
type Role struct {
	common.ActiveEntity
	Code        string `json:"code" gorm:"type:varchar(50);not null;uniqueIndex"`
	Name        string `json:"name" gorm:"type:varchar(120);not null"`
	Description string `json:"description" gorm:"type:text"`
	IsSystem    bool   `json:"isSystem" gorm:"not null;default:false"`
}
