package service

import (
	"context"

	"github.com/google/uuid"
	"university-crm/internal/repository"
)

// CreateMapper converts a create DTO into a domain entity.
type CreateMapper[T any, TCreate any] func(TCreate) (T, error)

// UpdateMapper applies an update DTO onto an existing domain entity.
type UpdateMapper[T any, TUpdate any] func(*T, TUpdate) error

// ResponseMapper converts a domain entity into a DTO.
type ResponseMapper[T any, TResponse any] func(T) TResponse

// CrudService is the canonical CRUD application service contract.
type CrudService[T any, TCreate any, TUpdate any, TResponse any] interface {
	Create(ctx context.Context, input TCreate) (TResponse, error)
	FindByID(ctx context.Context, id uuid.UUID) (TResponse, error)
	List(ctx context.Context, opts repository.ListOptions) (repository.PageResult[TResponse], error)
	Update(ctx context.Context, id uuid.UUID, input TUpdate) (TResponse, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

// GenericCrudService wires repositories to DTO mappers.
type GenericCrudService[T any, TCreate any, TUpdate any, TResponse any] struct {
	repo           repository.CrudRepository[T]
	createMapper   CreateMapper[T, TCreate]
	updateMapper   UpdateMapper[T, TUpdate]
	responseMapper ResponseMapper[T, TResponse]
}

// NewGenericCrudService creates a service with the supplied repository and mappers.
func NewGenericCrudService[T any, TCreate any, TUpdate any, TResponse any](
	repo repository.CrudRepository[T],
	createMapper CreateMapper[T, TCreate],
	updateMapper UpdateMapper[T, TUpdate],
	responseMapper ResponseMapper[T, TResponse],
) *GenericCrudService[T, TCreate, TUpdate, TResponse] {
	return &GenericCrudService[T, TCreate, TUpdate, TResponse]{
		repo:           repo,
		createMapper:   createMapper,
		updateMapper:   updateMapper,
		responseMapper: responseMapper,
	}
}

func (s *GenericCrudService[T, TCreate, TUpdate, TResponse]) Create(ctx context.Context, input TCreate) (TResponse, error) {
	entity, err := s.createMapper(input)
	if err != nil {
		var zero TResponse
		return zero, err
	}
	if err := s.repo.Create(ctx, &entity); err != nil {
		var zero TResponse
		return zero, err
	}
	return s.responseMapper(entity), nil
}

func (s *GenericCrudService[T, TCreate, TUpdate, TResponse]) FindByID(ctx context.Context, id uuid.UUID) (TResponse, error) {
	entity, err := s.repo.FindByID(ctx, id)
	if err != nil {
		var zero TResponse
		return zero, err
	}
	return s.responseMapper(*entity), nil
}

func (s *GenericCrudService[T, TCreate, TUpdate, TResponse]) List(ctx context.Context, opts repository.ListOptions) (repository.PageResult[TResponse], error) {
	opts = opts.Normalize(20)
	items, total, err := s.repo.List(ctx, opts)
	if err != nil {
		return repository.PageResult[TResponse]{}, err
	}
	result := repository.PageResult[TResponse]{
		Items:   make([]TResponse, 0, len(items)),
		Total:   total,
		Limit:   opts.Limit,
		Offset:  opts.Offset,
		HasNext: int64(opts.Offset+opts.Limit) < total,
		HasPrev: opts.Offset > 0,
	}
	for _, item := range items {
		result.Items = append(result.Items, s.responseMapper(item))
	}
	return result, nil
}

func (s *GenericCrudService[T, TCreate, TUpdate, TResponse]) Update(ctx context.Context, id uuid.UUID, input TUpdate) (TResponse, error) {
	entity, err := s.repo.FindByID(ctx, id)
	if err != nil {
		var zero TResponse
		return zero, err
	}
	if err := s.updateMapper(entity, input); err != nil {
		var zero TResponse
		return zero, err
	}
	if err := s.repo.Update(ctx, entity); err != nil {
		var zero TResponse
		return zero, err
	}
	return s.responseMapper(*entity), nil
}

func (s *GenericCrudService[T, TCreate, TUpdate, TResponse]) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}
