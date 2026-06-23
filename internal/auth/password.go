package auth

import "golang.org/x/crypto/bcrypt"

// PasswordHasher hashes and verifies password secrets.
type PasswordHasher interface {
	Hash(password string) (string, error)
	Compare(hash, password string) error
}

// BcryptHasher implements PasswordHasher with bcrypt.
type BcryptHasher struct {
	cost int
}

// NewBcryptHasher creates a bcrypt-based hasher.
func NewBcryptHasher(cost int) *BcryptHasher {
	if cost < bcrypt.MinCost {
		cost = bcrypt.DefaultCost
	}
	return &BcryptHasher{cost: cost}
}

func (h *BcryptHasher) Hash(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), h.cost)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

func (h *BcryptHasher) Compare(hash, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}
