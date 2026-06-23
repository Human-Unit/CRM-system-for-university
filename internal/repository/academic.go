package repository

import (
	"gorm.io/gorm"
	"university-crm/internal/domain/academic"
	"university-crm/internal/repository/gormrepo"
)

type FacultyRepository interface {
	CrudRepository[academic.Faculty]
}

type VocationRepository interface {
	CrudRepository[academic.Vocation]
}

type GroupRepository interface {
	CrudRepository[academic.Group]
}

type AuditoriumRepository interface {
	CrudRepository[academic.Auditorium]
}

func NewFacultyRepository(db *gorm.DB) FacultyRepository {
	return gormrepo.NewCrudRepository[academic.Faculty](db)
}

func NewVocationRepository(db *gorm.DB) VocationRepository {
	return gormrepo.NewCrudRepository[academic.Vocation](db)
}

func NewGroupRepository(db *gorm.DB) GroupRepository {
	return gormrepo.NewCrudRepository[academic.Group](db)
}

func NewAuditoriumRepository(db *gorm.DB) AuditoriumRepository {
	return gormrepo.NewCrudRepository[academic.Auditorium](db)
}
