package identity

import (
	"time"

	"github.com/google/uuid"
)

// User links a person to a login account and authorization role.
type User struct {
	ID           uuid.UUID  `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	PersonID     uuid.UUID  `json:"personId" gorm:"type:uuid;not null;uniqueIndex"`
	RoleID       uuid.UUID  `json:"roleId" gorm:"type:uuid;not null;index"`
	Username     string     `json:"username" gorm:"type:varchar(100);not null;uniqueIndex"`
	PasswordHash string     `json:"-" gorm:"type:varchar(255);not null"`
	LastLogin    *time.Time `json:"lastLogin"`
	CreatedAt    time.Time  `json:"createdAt" gorm:"not null;autoCreateTime"`
	UpdatedAt    time.Time  `json:"updatedAt" gorm:"not null;autoUpdateTime"`
	IsActive     bool       `json:"isActive" gorm:"not null;default:true"`
}
