package service

import (
	"university-crm/internal/domain/academic"
	"university-crm/internal/dto"
)

type FacultyService interface {
	CrudService[academic.Faculty, dto.FacultyCreateRequest, dto.FacultyUpdateRequest, dto.FacultyResponse]
}

type VocationService interface {
	CrudService[academic.Vocation, dto.VocationCreateRequest, dto.VocationUpdateRequest, dto.VocationResponse]
}

type GroupService interface {
	CrudService[academic.Group, dto.GroupCreateRequest, dto.GroupUpdateRequest, dto.GroupResponse]
}

type AuditoriumService interface {
	CrudService[academic.Auditorium, dto.AuditoriumCreateRequest, dto.AuditoriumUpdateRequest, dto.AuditoriumResponse]
}
