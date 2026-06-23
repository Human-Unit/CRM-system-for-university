package auth

import (
	"context"
	"sync"
	"time"

	"github.com/google/uuid"
)

// Session stores authenticated identity details for a desktop session.
type Session struct {
	Token     string
	UserID    uuid.UUID
	RoleID    uuid.UUID
	RoleCode  string
	Username  string
	ExpiresAt time.Time
	IssuedAt  time.Time
}

// SessionManager manages auth sessions without global state.
type SessionManager interface {
	Create(ctx context.Context, session Session) (Session, error)
	Get(ctx context.Context, token string) (Session, error)
	Revoke(ctx context.Context, token string) error
}

// InMemorySessionManager is suitable for a single-user desktop process.
type InMemorySessionManager struct {
	mu       sync.RWMutex
	sessions map[string]Session
	ttl      time.Duration
}

// NewInMemorySessionManager constructs an in-memory session registry.
func NewInMemorySessionManager(ttl time.Duration) *InMemorySessionManager {
	if ttl <= 0 {
		ttl = 24 * time.Hour
	}
	return &InMemorySessionManager{
		sessions: make(map[string]Session),
		ttl:      ttl,
	}
}

func (m *InMemorySessionManager) Create(ctx context.Context, session Session) (Session, error) {
	now := time.Now().UTC()
	if session.Token == "" {
		session.Token = uuid.NewString()
	}
	session.IssuedAt = now
	if session.ExpiresAt.IsZero() {
		session.ExpiresAt = now.Add(m.ttl)
	}
	m.mu.Lock()
	m.sessions[session.Token] = session
	m.mu.Unlock()
	return session, nil
}

func (m *InMemorySessionManager) Get(ctx context.Context, token string) (Session, error) {
	m.mu.RLock()
	session, ok := m.sessions[token]
	m.mu.RUnlock()
	if !ok {
		return Session{}, ErrSessionNotFound
	}
	if time.Now().UTC().After(session.ExpiresAt) {
		m.mu.Lock()
		delete(m.sessions, token)
		m.mu.Unlock()
		return Session{}, ErrSessionExpired
	}
	return session, nil
}

func (m *InMemorySessionManager) Revoke(ctx context.Context, token string) error {
	m.mu.Lock()
	delete(m.sessions, token)
	m.mu.Unlock()
	return nil
}
