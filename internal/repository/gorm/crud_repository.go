package gormrepo

import (
	"context"
	"errors"
	"fmt"
	"unicode"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"university-crm/internal/repository"
)

// CrudRepository implements repository.CrudRepository using GORM.
type CrudRepository[T any] struct {
	db *gorm.DB
}

// NewCrudRepository creates a generic repository for a GORM-backed entity.
func NewCrudRepository[T any](db *gorm.DB) *CrudRepository[T] {
	return &CrudRepository[T]{db: db}
}

func (r *CrudRepository[T]) Create(ctx context.Context, entity *T) error {
	return r.db.WithContext(ctx).Create(entity).Error
}

func (r *CrudRepository[T]) FindByID(ctx context.Context, id uuid.UUID) (*T, error) {
	var entity T
	err := r.db.WithContext(ctx).First(&entity, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, repository.ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return &entity, nil
}

func (r *CrudRepository[T]) List(ctx context.Context, opts repository.ListOptions) ([]T, int64, error) {
	opts = opts.Normalize(20)
	query := r.db.WithContext(ctx).Model(new(T))
	for key, value := range opts.Filters {
		if !isSafeColumnName(key) {
			return nil, 0, repository.ErrInvalidQuery
		}
		query = query.Where(fmt.Sprintf("%s = ?", key), value)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	order := "created_at DESC"
	if opts.SortBy != "" {
		if !isSafeColumnName(opts.SortBy) {
			return nil, 0, repository.ErrInvalidQuery
		}
		order = opts.SortBy
		if opts.Desc {
			order += " DESC"
		}
	}

	var items []T
	err := query.Order(order).Limit(opts.Limit).Offset(opts.Offset).Find(&items).Error
	if err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *CrudRepository[T]) Update(ctx context.Context, entity *T) error {
	return r.db.WithContext(ctx).Save(entity).Error
}

func (r *CrudRepository[T]) Delete(ctx context.Context, id uuid.UUID) error {
	var entity T
	return r.db.WithContext(ctx).Delete(&entity, "id = ?", id).Error
}

func isSafeColumnName(name string) bool {
	if name == "" {
		return false
	}
	for _, r := range name {
		if r == '_' || unicode.IsLetter(r) || unicode.IsDigit(r) {
			continue
		}
		return false
	}
	return true
}
