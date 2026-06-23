package dto

import "github.com/google/uuid"

// PageQuery represents a paginated list request.
type PageQuery struct {
	Search string `json:"search,omitempty"`
	Limit  int    `json:"limit,omitempty"`
	Offset int    `json:"offset,omitempty"`
	SortBy string `json:"sortBy,omitempty"`
	Desc   bool   `json:"desc,omitempty"`
}

// PageResponse is the DTO counterpart of a paged list result.
type PageResponse[T any] struct {
	Items   []T   `json:"items"`
	Total   int64 `json:"total"`
	Limit   int   `json:"limit"`
	Offset  int   `json:"offset"`
	HasNext bool  `json:"hasNext"`
	HasPrev bool  `json:"hasPrev"`
}

// UUIDRef provides a lightweight identifier-only DTO.
type UUIDRef struct {
	ID uuid.UUID `json:"id"`
}
