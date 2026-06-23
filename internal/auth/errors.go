package auth

import "errors"

var (
	// ErrInvalidCredentials is returned when username/password verification fails.
	ErrInvalidCredentials = errors.New("invalid credentials")
	// ErrSessionNotFound is returned when a session token cannot be resolved.
	ErrSessionNotFound = errors.New("session not found")
	// ErrSessionExpired is returned when a session is no longer valid.
	ErrSessionExpired = errors.New("session expired")
	// ErrPermissionDenied is returned when a user lacks access to a resource.
	ErrPermissionDenied = errors.New("permission denied")
)
