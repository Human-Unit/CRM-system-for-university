package gormrepo

import (
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"university-crm/internal/domain/identity"
	"university-crm/internal/repository"
)

// UserRepository extends the generic repository with auth-specific lookups.
type UserRepository struct {
	*CrudRepository[identity.User]
	db *gorm.DB
}

// NewUserRepository creates a user repository with login-specific methods.
func NewUserRepository(db *gorm.DB) repository.UserRepository {
	return &UserRepository{
		CrudRepository: NewCrudRepository[identity.User](db),
		db:             db,
	}
}

func (r *UserRepository) FindByUsername(ctx context.Context, username string) (*repository.UserAuthRecord, error) {
	var result repository.UserAuthRecord
	err := r.db.WithContext(ctx).
		Table("users").
		Select(`
			users.id AS user_id,
			users.person_id,
			users.role_id,
			roles.code AS role_code,
			users.username,
			users.password_hash,
			users.last_login,
			users.created_at,
			users.updated_at,
			users.is_active,
			roles.is_active AS role_active`).
		Joins("JOIN roles ON roles.id = users.role_id").
		Where("users.username = ?", username).
		Scan(&result).Error
	if err != nil {
		return nil, err
	}
	if result.UserID == uuid.Nil {
		return nil, repository.ErrNotFound
	}
	return &result, nil
}

func (r *UserRepository) MarkLastLogin(ctx context.Context, userID uuid.UUID, at time.Time) error {
	return r.db.WithContext(ctx).
		Model(&identity.User{}).
		Where("id = ?", userID).
		Update("last_login", at.UTC()).Error
}
