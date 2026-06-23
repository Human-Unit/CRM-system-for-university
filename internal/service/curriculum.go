package service

import (
	"university-crm/internal/domain/curriculum"
	"university-crm/internal/dto"
)

type SubjectService interface {
	CrudService[curriculum.Subject, dto.SubjectCreateRequest, dto.SubjectUpdateRequest, dto.SubjectResponse]
}

type DisciplineService interface {
	CrudService[curriculum.Discipline, dto.DisciplineCreateRequest, dto.DisciplineUpdateRequest, dto.DisciplineResponse]
}

type WeekService interface {
	CrudService[curriculum.Week, dto.WeekCreateRequest, dto.WeekUpdateRequest, dto.WeekResponse]
}

type ScheduleService interface {
	CrudService[curriculum.Schedule, dto.ScheduleCreateRequest, dto.ScheduleUpdateRequest, dto.ScheduleResponse]
}
