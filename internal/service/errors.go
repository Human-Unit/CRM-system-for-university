package service

import "errors"

var (
	// ErrValidation is returned when a request DTO fails validation.
	ErrValidation = errors.New("validation failed")
	// ErrForbidden is returned when the caller lacks permission.
	ErrForbidden = errors.New("forbidden")
	// ErrUnauthorized is returned when authentication is missing or invalid.
	ErrUnauthorized = errors.New("unauthorized")
)
