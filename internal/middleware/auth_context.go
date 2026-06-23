package middleware

import (
	"context"

	"university-crm/internal/auth"
)

type contextKey string

const sessionContextKey contextKey = "auth_session"

// WithSession stores the authenticated session in context.
func WithSession(ctx context.Context, session auth.Session) context.Context {
	return context.WithValue(ctx, sessionContextKey, session)
}

// SessionFromContext retrieves the authenticated session if present.
func SessionFromContext(ctx context.Context) (auth.Session, bool) {
	session, ok := ctx.Value(sessionContextKey).(auth.Session)
	return session, ok
}
