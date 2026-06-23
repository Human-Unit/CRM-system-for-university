package service

import (
	"university-crm/internal/domain/identity"
	"university-crm/internal/dto"
)

type RoleService interface {
	CrudService[identity.Role, dto.RoleCreateRequest, dto.RoleUpdateRequest, dto.RoleResponse]
}

type PersonService interface {
	CrudService[identity.Person, dto.PersonCreateRequest, dto.PersonUpdateRequest, dto.PersonResponse]
}

type StaffProfileService interface {
	CrudService[identity.StaffProfile, dto.StaffProfileCreateRequest, dto.StaffProfileUpdateRequest, dto.StaffProfileResponse]
}

type StudentProfileService interface {
	CrudService[identity.StudentProfile, dto.StudentProfileCreateRequest, dto.StudentProfileUpdateRequest, dto.StudentProfileResponse]
}

type UserService interface {
	CrudService[identity.User, dto.UserCreateRequest, dto.UserUpdateRequest, dto.UserResponse]
}
