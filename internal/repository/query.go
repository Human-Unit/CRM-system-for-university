package repository

// ListOptions defines the canonical repository query parameters.
type ListOptions struct {
	Search  string
	Limit   int
	Offset  int
	SortBy  string
	Desc    bool
	Filters map[string]any
}

// Normalize applies safe defaults to the query options.
func (o ListOptions) Normalize(defaultLimit int) ListOptions {
	if defaultLimit <= 0 {
		defaultLimit = 20
	}
	if o.Limit <= 0 {
		o.Limit = defaultLimit
	}
	if o.Limit > 200 {
		o.Limit = 200
	}
	if o.Offset < 0 {
		o.Offset = 0
	}
	if o.Filters == nil {
		o.Filters = map[string]any{}
	}
	return o
}

// PageResult wraps a paged response from the repository layer.
type PageResult[T any] struct {
	Items   []T   `json:"items"`
	Total   int64 `json:"total"`
	Limit   int   `json:"limit"`
	Offset  int   `json:"offset"`
	HasNext bool  `json:"hasNext"`
	HasPrev bool  `json:"hasPrev"`
}
