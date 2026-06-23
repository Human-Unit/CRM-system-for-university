package config

import (
	"strings"
	"time"

	"github.com/spf13/viper"
)

// Config holds process configuration for backend and desktop runtime.
type Config struct {
	AppName     string
	Environment string
	HTTPPort    int
	LogLevel    string
	Timezone    string
	Database    DatabaseConfig
	Session     SessionConfig
	Features    FeatureFlags
}

// DatabaseConfig contains database connectivity settings.
type DatabaseConfig struct {
	DSN             string
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime time.Duration
}

// SessionConfig contains auth session settings.
type SessionConfig struct {
	Duration time.Duration
}

// FeatureFlags controls optional desktop capabilities.
type FeatureFlags struct {
	DarkModeDefault bool
}

// Load reads configuration from environment variables and sane defaults.
func Load() Config {
	v := viper.New()
	v.AutomaticEnv()
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.SetDefault("APP_NAME", "University Management CRM")
	v.SetDefault("APP_ENV", "development")
	v.SetDefault("HTTP_PORT", 0)
	v.SetDefault("LOG_LEVEL", "info")
	v.SetDefault("TIMEZONE", "Asia/Tashkent")
	v.SetDefault("DB_MAX_OPEN_CONNS", 25)
	v.SetDefault("DB_MAX_IDLE_CONNS", 5)
	v.SetDefault("DB_CONN_MAX_LIFETIME", "30m")
	v.SetDefault("SESSION_DURATION", "24h")
	v.SetDefault("FEATURE_DARK_MODE_DEFAULT", true)

	return Config{
		AppName:     v.GetString("APP_NAME"),
		Environment: v.GetString("APP_ENV"),
		HTTPPort:    v.GetInt("HTTP_PORT"),
		LogLevel:    v.GetString("LOG_LEVEL"),
		Timezone:    v.GetString("TIMEZONE"),
		Database: DatabaseConfig{
			DSN:             v.GetString("DATABASE_URL"),
			MaxOpenConns:    v.GetInt("DB_MAX_OPEN_CONNS"),
			MaxIdleConns:    v.GetInt("DB_MAX_IDLE_CONNS"),
			ConnMaxLifetime: mustDuration(v.GetString("DB_CONN_MAX_LIFETIME"), 30*time.Minute),
		},
		Session: SessionConfig{
			Duration: mustDuration(v.GetString("SESSION_DURATION"), 24*time.Hour),
		},
		Features: FeatureFlags{
			DarkModeDefault: v.GetBool("FEATURE_DARK_MODE_DEFAULT"),
		},
	}
}

func mustDuration(value string, fallback time.Duration) time.Duration {
	d, err := time.ParseDuration(value)
	if err != nil {
		return fallback
	}
	return d
}
