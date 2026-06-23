package tracking

import (
	"time"

	"github.com/google/uuid"
	"university-crm/internal/domain/common"
)

// Attendance records student presence for a discipline session.
type Attendance struct {
	common.ActiveEntity
	DisciplineID     uuid.UUID  `json:"disciplineId" gorm:"type:uuid;not null;index"`
	StudentProfileID uuid.UUID  `json:"studentProfileId" gorm:"type:uuid;not null;index"`
	AttendanceDate   time.Time  `json:"attendanceDate" gorm:"type:date;not null;index"`
	Status           string     `json:"status" gorm:"type:varchar(30);not null"`
	MarkedByUserID   *uuid.UUID `json:"markedByUserId" gorm:"type:uuid;index"`
	Remark           string     `json:"remark" gorm:"type:text"`
}
