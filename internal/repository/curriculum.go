package repository

import (
	"gorm.io/gorm"
	"university-crm/internal/domain/curriculum"
	"university-crm/internal/repository/gormrepo"
)

type SubjectRepository interface {
	CrudRepository[curriculum.Subject]
}

type DisciplineRepository interface {
	CrudRepository[curriculum.Discipline]
}

type WeekRepository interface {
	CrudRepository[curriculum.Week]
}

type ScheduleRepository interface {
	CrudRepository[curriculum.Schedule]
}

func NewSubjectRepository(db *gorm.DB) SubjectRepository {
	return gormrepo.NewCrudRepository[curriculum.Subject](db)
}

func NewDisciplineRepository(db *gorm.DB) DisciplineRepository {
	return gormrepo.NewCrudRepository[curriculum.Discipline](db)
}

func NewWeekRepository(db *gorm.DB) WeekRepository {
	return gormrepo.NewCrudRepository[curriculum.Week](db)
}

func NewScheduleRepository(db *gorm.DB) ScheduleRepository {
	return gormrepo.NewCrudRepository[curriculum.Schedule](db)
}
