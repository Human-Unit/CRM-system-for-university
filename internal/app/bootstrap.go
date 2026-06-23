package app

import (
	"time"

	"go.uber.org/zap"
	"university-crm/internal/config"
	"university-crm/internal/service"
)

// Bootstrap groups the runtime services needed by the desktop shell.
type Bootstrap struct {
	Config  config.Config
	Logger  *zap.Logger
	Backend *Backend
}

// NewBootstrap creates the minimal runtime wiring for Phase 4.
func NewBootstrap(cfg config.Config, logger *zap.Logger) *Bootstrap {
	dashboard := service.NewDefaultDashboardService(nil, nil, nil, nil, nil, nil, nil, nil)
	return &Bootstrap{
		Config:  cfg,
		Logger:  logger,
		Backend: NewBackend(cfg, logger, nil, dashboard),
	}
}

// StartedAt returns a stable bootstrap timestamp for diagnostics.
func (b *Bootstrap) StartedAt() time.Time {
	if b == nil || b.Backend == nil {
		return time.Time{}
	}
	return b.Backend.startedAt
}
