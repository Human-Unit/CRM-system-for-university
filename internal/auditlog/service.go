package auditlog

import (
	"context"
	"errors"

	"university-crm/internal/audit"
	"university-crm/internal/repository"
)

// Recorder stores audit events.
type Recorder interface {
	Record(ctx context.Context, entry audit.AuditLog) error
}

// Service persists audit logs through the repository layer.
type Service struct {
	repo repository.AuditLogRepository
}

// NewService creates a concrete audit recorder.
func NewService(repo repository.AuditLogRepository) *Service {
	return &Service{repo: repo}
}

// Record writes an audit entry.
func (s *Service) Record(ctx context.Context, entry audit.AuditLog) error {
	if s.repo == nil {
		return errors.New("audit repository is nil")
	}
	return s.repo.Create(ctx, &entry)
}
