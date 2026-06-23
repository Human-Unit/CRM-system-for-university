package main

import (
	"fmt"
	"os"

	"university-crm/internal/app"
	"university-crm/internal/config"
)

func main() {
	cfg := config.Load()
	logger, err := config.NewLogger(cfg.LogLevel)
	if err != nil {
		fmt.Fprintln(os.Stderr, "failed to create logger:", err)
		os.Exit(1)
	}
	defer func() { _ = logger.Sync() }()

	bootstrap := app.NewBootstrap(cfg, logger)
	backend := bootstrap.Backend

	logger.Info("desktop backend scaffold initialized")
	_ = bootstrap.StartedAt()
	_ = backend.Info()
	// Wails v3 runtime wiring is intentionally isolated to this entrypoint phase.
	// The next step is to connect the backend facade to the Wails application runtime.
}
