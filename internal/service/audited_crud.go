package service

import (
	"context"
	"encoding/json"

	"github.com/google/uuid"
	"university-crm/internal/audit"
	"university-crm/internal/auditlog"
	"university-crm/internal/middleware"
	"university-crm/internal/repository"
)

// AuditedCrudService is a CRUD service that writes an audit log for every mutation.
type AuditedCrudService[T any, TCreate any, TUpdate any, TResponse any] struct {
	repo           repository.CrudRepository[T]
	createMapper   CreateMapper[T, TCreate]
	updateMapper   UpdateMapper[T, TUpdate]
	responseMapper ResponseMapper[T, TResponse]
	entityIDMapper func(T) string
	auditRecorder  auditlog.Recorder
	entityName     string
}

// NewAuditedCrudService creates a service that mirrors GenericCrudService and logs mutations.
func NewAuditedCrudService[T any, TCreate any, TUpdate any, TResponse any](
	repo repository.CrudRepository[T],
	entityName string,
	entityIDMapper func(T) string,
	createMapper CreateMapper[T, TCreate],
	updateMapper UpdateMapper[T, TUpdate],
	responseMapper ResponseMapper[T, TResponse],
	auditRecorder auditlog.Recorder,
) *AuditedCrudService[T, TCreate, TUpdate, TResponse] {
	return &AuditedCrudService[T, TCreate, TUpdate, TResponse]{
		repo:           repo,
		entityName:     entityName,
		entityIDMapper: entityIDMapper,
		createMapper:   createMapper,
		updateMapper:   updateMapper,
		responseMapper: responseMapper,
		auditRecorder:  auditRecorder,
	}
}

func (s *AuditedCrudService[T, TCreate, TUpdate, TResponse]) Create(ctx context.Context, input TCreate) (TResponse, error) {
	entity, err := s.createMapper(input)
	if err != nil {
		var zero TResponse
		return zero, err
	}
	if err := s.repo.Create(ctx, &entity); err != nil {
		var zero TResponse
		return zero, err
	}
	s.record(ctx, audit.ActionCreate, s.entityID(entity), entity, nil)
	return s.responseMapper(entity), nil
}

func (s *AuditedCrudService[T, TCreate, TUpdate, TResponse]) FindByID(ctx context.Context, id uuid.UUID) (TResponse, error) {
	entity, err := s.repo.FindByID(ctx, id)
	if err != nil {
		var zero TResponse
		return zero, err
	}
	return s.responseMapper(*entity), nil
}

func (s *AuditedCrudService[T, TCreate, TUpdate, TResponse]) List(ctx context.Context, opts repository.ListOptions) (repository.PageResult[TResponse], error) {
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

func (s *AuditedCrudService[T, TCreate, TUpdate, TResponse]) Update(ctx context.Context, id uuid.UUID, input TUpdate) (TResponse, error) {
	entity, err := s.repo.FindByID(ctx, id)
	if err != nil {
		var zero TResponse
		return zero, err
	}
	oldValue := cloneJSON(entity)
	if err := s.updateMapper(entity, input); err != nil {
		var zero TResponse
		return zero, err
	}
	if err := s.repo.Update(ctx, entity); err != nil {
		var zero TResponse
		return zero, err
	}
	s.record(ctx, audit.ActionUpdate, id.String(), entity, oldValue)
	return s.responseMapper(*entity), nil
}

func (s *AuditedCrudService[T, TCreate, TUpdate, TResponse]) Delete(ctx context.Context, id uuid.UUID) error {
	entity, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	oldValue := cloneJSON(entity)
	if err := s.repo.Delete(ctx, id); err != nil {
		return err
	}
	s.record(ctx, audit.ActionDelete, id.String(), nil, oldValue)
	return nil
}

func (s *AuditedCrudService[T, TCreate, TUpdate, TResponse]) record(ctx context.Context, action audit.ActionType, entityID string, newValue any, oldValue json.RawMessage) {
	if s.auditRecorder == nil {
		return
	}
	entry := audit.AuditLog{
		EntityName: s.entityName,
		EntityID:   entityID,
		Action:     action,
		OldValue:   oldValue,
		NewValue:   cloneJSON(newValue),
	}
	if session, ok := middleware.SessionFromContext(ctx); ok {
		entry.UserID = &session.UserID
	}
	_ = s.auditRecorder.Record(ctx, entry)
}

func (s *AuditedCrudService[T, TCreate, TUpdate, TResponse]) entityID(entity T) string {
	if s.entityIDMapper == nil {
		return ""
	}
	return s.entityIDMapper(entity)
}

func cloneJSON(v any) json.RawMessage {
	if v == nil {
		return nil
	}
	b, _ := json.Marshal(v)
	return b
}
