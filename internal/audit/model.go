package audit

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// ActionType stores the canonical audit action vocabulary.
type ActionType string

const (
	ActionCreate ActionType = "CREATE"
	ActionUpdate ActionType = "UPDATE"
	ActionDelete ActionType = "DELETE"
	ActionLogin  ActionType = "LOGIN"
	ActionLogout ActionType = "LOGOUT"
)

// AuditLog records security-relevant business activity.
type AuditLog struct {
	ID         uuid.UUID       `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID     *uuid.UUID      `json:"userId" gorm:"type:uuid;index"`
	EntityName string          `json:"entityName" gorm:"type:varchar(120);not null;index"`
	EntityID   string          `json:"entityId" gorm:"type:varchar(64);not null;index"`
	Action     ActionType      `json:"action" gorm:"type:varchar(20);not null;index"`
	OldValue   json.RawMessage `json:"oldValue" gorm:"type:jsonb"`
	NewValue   json.RawMessage `json:"newValue" gorm:"type:jsonb"`
	CreatedAt  time.Time       `json:"createdAt" gorm:"not null;autoCreateTime"`
}
