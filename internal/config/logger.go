package config

import "go.uber.org/zap"

// NewLogger constructs a structured logger for the app lifecycle.
func NewLogger(level string) (*zap.Logger, error) {
	cfg := zap.NewProductionConfig()
	switch level {
	case "debug":
		cfg.Level.SetLevel(zap.DebugLevel)
	case "warn":
		cfg.Level.SetLevel(zap.WarnLevel)
	case "error":
		cfg.Level.SetLevel(zap.ErrorLevel)
	default:
		cfg.Level.SetLevel(zap.InfoLevel)
	}
	return cfg.Build()
}
