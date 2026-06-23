package dto

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type AuditLogResponse struct {
	ID         uuid.UUID       `json:"id"`
	UserID     *uuid.UUID      `json:"userId,omitempty"`
	EntityName string          `json:"entityName"`
	EntityID   string          `json:"entityId"`
	Action     string          `json:"action"`
	OldValue   json.RawMessage `json:"oldValue,omitempty"`
	NewValue   json.RawMessage `json:"newValue,omitempty"`
	CreatedAt  time.Time       `json:"createdAt"`
}
