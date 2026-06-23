package academic

import "university-crm/internal/domain/common"

// Auditorium represents a physical room for classes.
type Auditorium struct {
	common.ActiveEntity
	Building   string `json:"building" gorm:"type:varchar(100);not null"`
	RoomNumber string `json:"roomNumber" gorm:"type:varchar(50);not null;uniqueIndex"`
	Capacity   int    `json:"capacity" gorm:"not null"`
	Type       string `json:"type" gorm:"type:varchar(50)"`
	IsLab      bool   `json:"isLab" gorm:"not null;default:false"`
}
