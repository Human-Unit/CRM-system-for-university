package auth

// PermissionScope is the canonical RBAC action-target pair.
type PermissionScope struct {
	Resource string
	Action   string
}

// PolicyEngine performs role-based permission evaluation.
type PolicyEngine interface {
	Can(roleCode string, scope PermissionScope) bool
}

// StaticPolicyEngine uses a fixed permission matrix.
type StaticPolicyEngine struct {
	rules map[string]map[string]map[string]bool
}

// NewStaticPolicyEngine creates the default role matrix.
func NewStaticPolicyEngine() *StaticPolicyEngine {
	return &StaticPolicyEngine{
		rules: map[string]map[string]map[string]bool{
			"admin": {
				"*": map[string]bool{"*": true},
			},
			"registrar": {
				"students":   map[string]bool{"read": true, "create": true, "update": true, "delete": true},
				"teachers":   map[string]bool{"read": true, "create": true, "update": true, "delete": true},
				"faculties":  map[string]bool{"read": true, "create": true, "update": true, "delete": true},
				"vocations":  map[string]bool{"read": true, "create": true, "update": true, "delete": true},
				"groups":     map[string]bool{"read": true, "create": true, "update": true, "delete": true},
				"subjects":   map[string]bool{"read": true, "create": true, "update": true, "delete": true},
				"schedules":  map[string]bool{"read": true, "create": true, "update": true, "delete": true},
				"attendance": map[string]bool{"read": true, "create": true, "update": true},
				"analytics":  map[string]bool{"read": true},
			},
			"instructor": {
				"students":   map[string]bool{"read": true},
				"subjects":   map[string]bool{"read": true},
				"schedules":  map[string]bool{"read": true},
				"attendance": map[string]bool{"read": true, "create": true, "update": true},
				"grades":     map[string]bool{"read": true, "create": true, "update": true},
				"analytics":  map[string]bool{"read": true},
			},
			"student": {
				"self":       map[string]bool{"read": true},
				"transcript": map[string]bool{"read": true},
				"attendance": map[string]bool{"read": true},
				"schedules":  map[string]bool{"read": true},
			},
		},
	}
}

func (p *StaticPolicyEngine) Can(roleCode string, scope PermissionScope) bool {
	if roleCode == "" {
		return false
	}
	roleRules, ok := p.rules[roleCode]
	if !ok {
		return false
	}
	if wildcard, ok := roleRules["*"]; ok && wildcard["*"] {
		return true
	}
	if resourceRules, ok := roleRules[scope.Resource]; ok {
		if resourceRules["*"] {
			return true
		}
		return resourceRules[scope.Action]
	}
	return false
}
