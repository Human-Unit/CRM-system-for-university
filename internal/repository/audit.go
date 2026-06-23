package repository

import (
	"gorm.io/gorm"
	"university-crm/internal/audit"
	"university-crm/internal/repository/gormrepo"
)

type AuditLogRepository interface {
	CrudRepository[audit.AuditLog]
}

func NewAuditLogRepository(db *gorm.DB) AuditLogRepository {
	return gormrepo.NewCrudRepository[audit.AuditLog](db)
}
