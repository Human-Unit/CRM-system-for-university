package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"university-crm/internal/domain/identity"
	"university-crm/internal/repository/gormrepo"
)

type RoleRepository interface {
	CrudRepository[identity.Role]
}

type PersonRepository interface {
	CrudRepository[identity.Person]
}

type StaffProfileRepository interface {
	CrudRepository[identity.StaffProfile]
}

type StudentProfileRepository interface {
	CrudRepository[identity.StudentProfile]
}

type UserRepository interface {
	CrudRepository[identity.User]
	FindByUsername(ctx context.Context, username string) (*UserAuthRecord, error)
	MarkLastLogin(ctx context.Context, userID uuid.UUID, at time.Time) error
}

// UserAuthRecord is the auth projection needed for login verification.
type UserAuthRecord struct {
	UserID       uuid.UUID  `gorm:"column:user_id"`
	PersonID     uuid.UUID  `gorm:"column:person_id"`
	RoleID       uuid.UUID  `gorm:"column:role_id"`
	RoleCode     string     `gorm:"column:role_code"`
	Username     string     `gorm:"column:username"`
	PasswordHash string     `gorm:"column:password_hash"`
	LastLogin    *time.Time `gorm:"column:last_login"`
	CreatedAt    time.Time  `gorm:"column:created_at"`
	UpdatedAt    time.Time  `gorm:"column:updated_at"`
	IsActive     bool       `gorm:"column:is_active"`
	RoleActive   bool       `gorm:"column:role_active"`
}

func NewRoleRepository(db *gorm.DB) RoleRepository {
	return gormrepo.NewCrudRepository[identity.Role](db)
}

func NewPersonRepository(db *gorm.DB) PersonRepository {
	return gormrepo.NewCrudRepository[identity.Person](db)
}

func NewStaffProfileRepository(db *gorm.DB) StaffProfileRepository {
	return gormrepo.NewCrudRepository[identity.StaffProfile](db)
}

func NewStudentProfileRepository(db *gorm.DB) StudentProfileRepository {
	return gormrepo.NewCrudRepository[identity.StudentProfile](db)
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return gormrepo.NewUserRepository(db)
}
