package dto

import "time"

// AppInfoResponse describes the running desktop shell.
type AppInfoResponse struct {
	Name        string    `json:"name"`
	Environment string    `json:"environment"`
	Version     string    `json:"version"`
	StartedAt   time.Time `json:"startedAt"`
}

// HealthResponse provides a small readiness snapshot for the frontend.
type HealthResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
}

// SessionResponse is returned to the frontend when a session is active.
type SessionResponse struct {
	Token     string    `json:"token"`
	UserID    string    `json:"userId"`
	RoleID    string    `json:"roleId"`
	RoleCode  string    `json:"roleCode"`
	Username  string    `json:"username"`
	ExpiresAt time.Time `json:"expiresAt"`
}
