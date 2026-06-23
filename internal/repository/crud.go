package repository

import (
	"context"

	"github.com/google/uuid"
)

// CrudRepository is the minimum contract needed by the service layer.
type CrudRepository[T any] interface {
	Create(ctx context.Context, entity *T) error
	FindByID(ctx context.Context, id uuid.UUID) (*T, error)
	List(ctx context.Context, opts ListOptions) ([]T, int64, error)
	Update(ctx context.Context, entity *T) error
	Delete(ctx context.Context, id uuid.UUID) error
}
