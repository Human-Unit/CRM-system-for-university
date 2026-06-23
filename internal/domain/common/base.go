package common

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// BaseEntity is the shared persistence shape for business entities.
type BaseEntity struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt time.Time      `json:"createdAt" gorm:"not null;autoCreateTime"`
	UpdatedAt time.Time      `json:"updatedAt" gorm:"not null;autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deletedAt,omitempty" gorm:"index"`
}

// ActiveEntity adds a conventional active flag to BaseEntity.
type ActiveEntity struct {
	BaseEntity
	IsActive bool `json:"isActive" gorm:"not null;default:true"`
}
