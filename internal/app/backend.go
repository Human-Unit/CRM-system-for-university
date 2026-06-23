package app

import (
	"context"
	"errors"
	"time"

	"go.uber.org/zap"
	"university-crm/internal/auth"
	"university-crm/internal/config"
	"university-crm/internal/dto"
	"university-crm/internal/service"
)

// Backend exposes methods that Wails can bind to the frontend.
type Backend struct {
	cfg       config.Config
	logger    *zap.Logger
	auth      *auth.AuthService
	dashboard service.DashboardService
	startedAt time.Time
	version   string
}

// NewBackend creates the application facade.
func NewBackend(cfg config.Config, logger *zap.Logger, authService *auth.AuthService, dashboard service.DashboardService) *Backend {
	return &Backend{
		cfg:       cfg,
		logger:    logger,
		auth:      authService,
		dashboard: dashboard,
		startedAt: time.Now().UTC(),
		version:   "0.1.0",
	}
}

// Info returns application metadata to the frontend.
func (b *Backend) Info() dto.AppInfoResponse {
	return dto.AppInfoResponse{
		Name:        b.cfg.AppName,
		Environment: b.cfg.Environment,
		Version:     b.version,
		StartedAt:   b.startedAt,
	}
}

// Health returns a light-weight readiness response.
func (b *Backend) Health() dto.HealthResponse {
	return dto.HealthResponse{
		Status:    "ok",
		Timestamp: time.Now().UTC(),
	}
}

// Login is exposed to the frontend for authentication.
func (b *Backend) Login(ctx context.Context, req dto.LoginRequest) (dto.LoginResponse, error) {
	if b.auth == nil {
		return dto.LoginResponse{}, errors.New("auth service not initialized")
	}
	return b.auth.Login(ctx, req)
}

// Logout terminates the current session token.
func (b *Backend) Logout(ctx context.Context, token string) error {
	if b.auth == nil {
		return errors.New("auth service not initialized")
	}
	return b.auth.Logout(ctx, token, nil)
}

// CurrentSession resolves a token into session information.
func (b *Backend) CurrentSession(ctx context.Context, token string) (dto.SessionResponse, error) {
	if b.auth == nil {
		return dto.SessionResponse{}, errors.New("auth service not initialized")
	}
	session, err := b.auth.SessionFromToken(ctx, token)
	if err != nil {
		return dto.SessionResponse{}, err
	}
	return dto.SessionResponse{
		Token:     session.Token,
		UserID:    session.UserID.String(),
		RoleID:    session.RoleID.String(),
		RoleCode:  session.RoleCode,
		Username:  session.Username,
		ExpiresAt: session.ExpiresAt,
	}, nil
}

// Can checks the in-memory policy engine for the current session role.
func (b *Backend) Can(ctx context.Context, resource string, action string, token string) (bool, error) {
	if b.auth == nil {
		return false, errors.New("auth service not initialized")
	}
	session, err := b.auth.SessionFromToken(ctx, token)
	if err != nil {
		return false, err
	}
	if err := b.auth.Authorize(session.RoleCode, auth.PermissionScope{Resource: resource, Action: action}); err != nil {
		return false, err
	}
	return true, nil
}

// Dashboard returns the latest aggregated metrics for the frontend.
func (b *Backend) Dashboard(ctx context.Context) (dto.DashboardSummaryResponse, error) {
	if b.dashboard == nil {
		return dto.DashboardSummaryResponse{GeneratedAt: time.Now().UTC()}, nil
	}
	return b.dashboard.Summary(ctx)
}

// LogDebug writes a structured diagnostic message when a logger is available.
func (b *Backend) LogDebug(message string, fields ...zap.Field) {
	if b.logger != nil {
		b.logger.Debug(message, fields...)
	}
}
