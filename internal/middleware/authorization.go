package middleware

import (
	"context"

	"university-crm/internal/auth"
)

// RequirePermission checks the current session against the supplied scope.
func RequirePermission(ctx context.Context, policy auth.PolicyEngine, scope auth.PermissionScope) error {
	session, ok := SessionFromContext(ctx)
	if !ok {
		return auth.ErrSessionNotFound
	}
	if policy == nil || !policy.Can(session.RoleCode, scope) {
		return auth.ErrPermissionDenied
	}
	return nil
}
