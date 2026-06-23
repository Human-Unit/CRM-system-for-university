package repository

import "errors"

var (
	// ErrNotFound is returned when an entity cannot be found by its identifier.
	ErrNotFound = errors.New("entity not found")
	// ErrConflict is returned when a unique or business constraint is violated.
	ErrConflict = errors.New("conflict")
	// ErrInvalidQuery is returned when list/filter parameters are not valid.
	ErrInvalidQuery = errors.New("invalid query")
)
