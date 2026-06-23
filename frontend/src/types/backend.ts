export type AppInfoResponse = {
  name: string;
  environment: string;
  version: string;
  startedAt: string;
};

export type HealthResponse = {
  status: string;
  timestamp: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type UserResponse = {
  id: string;
  personId: string;
  roleId: string;
  username: string;
  lastLogin?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: UserResponse;
};

export type SessionResponse = {
  token: string;
  userId: string;
  roleId: string;
  roleCode: string;
  username: string;
  expiresAt: string;
};

export type DashboardSummaryResponse = {
  generatedAt: string;
  studentsTotal: number;
  teachersTotal: number;
  groupsTotal: number;
  subjectsTotal: number;
  attendance: {
    total: number;
    present: number;
    absent: number;
    late: number;
    other: number;
    attendanceRate: number;
  };
  grades: {
    totalAssessments: number;
    averageScore: number;
    distribution: Record<string, number>;
  };
  teacherWorkload: {
    teachersTotal: number;
    disciplinesTotal: number;
    averageDisciplinesPerTeacher: number;
  };
  recentActivity: Array<{
    id: string;
    entityName: string;
    entityId: string;
    action: string;
    username?: string;
    createdAt: string;
  }>;
};
