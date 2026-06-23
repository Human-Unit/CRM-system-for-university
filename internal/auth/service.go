package auth

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"university-crm/internal/audit"
	"university-crm/internal/auditlog"
	"university-crm/internal/dto"
	"university-crm/internal/repository"
)

// UserLookupRepository adds auth-specific lookups on top of the generic user repository.
type UserLookupRepository interface {
	repository.UserRepository
	FindByUsername(ctx context.Context, username string) (*repository.UserAuthRecord, error)
	MarkLastLogin(ctx context.Context, userID uuid.UUID, at time.Time) error
}

// AuthService handles login/logout and session management.
type AuthService struct {
	users    UserLookupRepository
	hasher   PasswordHasher
	sessions SessionManager
	policy   PolicyEngine
	audit    auditlog.Recorder
}

// NewAuthService constructs the auth workflow.
func NewAuthService(
	users UserLookupRepository,
	hasher PasswordHasher,
	sessions SessionManager,
	policy PolicyEngine,
	audit auditlog.Recorder,
) *AuthService {
	return &AuthService{
		users:    users,
		hasher:   hasher,
		sessions: sessions,
		policy:   policy,
		audit:    audit,
	}
}

// Login validates the supplied credentials and creates a session.
func (s *AuthService) Login(ctx context.Context, req dto.LoginRequest) (dto.LoginResponse, error) {
	username := strings.TrimSpace(req.Username)
	if username == "" || req.Password == "" {
		return dto.LoginResponse{}, ErrInvalidCredentials
	}

	user, err := s.users.FindByUsername(ctx, username)
	if err != nil {
		return dto.LoginResponse{}, ErrInvalidCredentials
	}
	if !user.IsActive || !user.RoleActive {
		return dto.LoginResponse{}, ErrInvalidCredentials
	}
	if err := s.hasher.Compare(user.PasswordHash, req.Password); err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return dto.LoginResponse{}, ErrInvalidCredentials
		}
		return dto.LoginResponse{}, err
	}

	now := time.Now().UTC()
	if err := s.users.MarkLastLogin(ctx, user.UserID, now); err != nil {
		return dto.LoginResponse{}, err
	}

	session, err := s.sessions.Create(ctx, Session{
		UserID:   user.UserID,
		RoleID:   user.RoleID,
		RoleCode: user.RoleCode,
		Username: user.Username,
	})
	if err != nil {
		return dto.LoginResponse{}, err
	}

	if s.audit != nil {
		_ = s.audit.Record(ctx, audit.AuditLog{
			UserID:     &user.UserID,
			EntityName: "users",
			EntityID:   user.UserID.String(),
			Action:     audit.ActionLogin,
			NewValue:   jsonRaw(map[string]any{"username": user.Username, "roleCode": user.RoleCode}),
			CreatedAt:  now,
		})
	}

	return dto.LoginResponse{
		AccessToken: session.Token,
		User: dto.UserResponse{
			ID:        user.UserID,
			PersonID:  user.PersonID,
			RoleID:    user.RoleID,
			Username:  user.Username,
			LastLogin: &now,
			IsActive:  user.IsActive,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
		},
	}, nil
}

// Logout revokes the current session and audits the event.
func (s *AuthService) Logout(ctx context.Context, token string, userID *uuid.UUID) error {
	if token == "" {
		return ErrSessionNotFound
	}
	_ = s.sessions.Revoke(ctx, token)
	if s.audit != nil && userID != nil {
		_ = s.audit.Record(ctx, audit.AuditLog{
			UserID:     userID,
			EntityName: "users",
			EntityID:   userID.String(),
			Action:     audit.ActionLogout,
			CreatedAt:  time.Now().UTC(),
		})
	}
	return nil
}

// Authorize checks whether a role may perform an action on a resource.
func (s *AuthService) Authorize(roleCode string, scope PermissionScope) error {
	if s.policy == nil || !s.policy.Can(roleCode, scope) {
		return ErrPermissionDenied
	}
	return nil
}

// SessionFromToken resolves a token to a live session.
func (s *AuthService) SessionFromToken(ctx context.Context, token string) (Session, error) {
	return s.sessions.Get(ctx, token)
}

func jsonRaw(v any) json.RawMessage {
	b, _ := json.Marshal(v)
	return b
}
