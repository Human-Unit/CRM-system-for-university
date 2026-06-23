CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar(50) NOT NULL UNIQUE,
    name varchar(120) NOT NULL,
    description text NOT NULL DEFAULT '',
    is_system boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL
);

CREATE TABLE IF NOT EXISTS persons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    middle_name varchar(100) NOT NULL DEFAULT '',
    gender varchar(20) NOT NULL DEFAULT '',
    date_of_birth date NULL,
    phone varchar(30) NOT NULL DEFAULT '',
    email varchar(255) NOT NULL DEFAULT '',
    address text NOT NULL DEFAULT '',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_persons_email_not_empty
    ON persons (email)
    WHERE email <> '';

CREATE TABLE IF NOT EXISTS faculties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar(50) NOT NULL UNIQUE,
    name varchar(150) NOT NULL,
    description text NOT NULL DEFAULT '',
    dean_person_id uuid NULL REFERENCES persons(id) ON DELETE SET NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL
);

CREATE TABLE IF NOT EXISTS vocations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id uuid NOT NULL REFERENCES faculties(id) ON DELETE RESTRICT,
    code varchar(50) NOT NULL,
    name varchar(150) NOT NULL,
    description text NOT NULL DEFAULT '',
    level varchar(50) NOT NULL DEFAULT '',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL,
    CONSTRAINT uq_vocations_faculty_code UNIQUE (faculty_id, code)
);

CREATE TABLE IF NOT EXISTS groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id uuid NOT NULL REFERENCES faculties(id) ON DELETE RESTRICT,
    vocation_id uuid NULL REFERENCES vocations(id) ON DELETE SET NULL,
    curator_staff_profile_id uuid NULL REFERENCES staff_profiles(id) ON DELETE SET NULL,
    code varchar(50) NOT NULL UNIQUE,
    name varchar(150) NOT NULL,
    admission_year integer NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL
);

CREATE INDEX IF NOT EXISTS idx_groups_faculty_id ON groups (faculty_id);
CREATE INDEX IF NOT EXISTS idx_groups_vocation_id ON groups (vocation_id);

CREATE TABLE IF NOT EXISTS auditoriums (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    building varchar(100) NOT NULL,
    room_number varchar(50) NOT NULL UNIQUE,
    capacity integer NOT NULL CHECK (capacity >= 0),
    type varchar(50) NOT NULL DEFAULT '',
    is_lab boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL
);

CREATE TABLE IF NOT EXISTS staff_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id uuid NOT NULL UNIQUE REFERENCES persons(id) ON DELETE CASCADE,
    employee_no varchar(50) NOT NULL UNIQUE,
    position varchar(120) NOT NULL,
    faculty_id uuid NULL REFERENCES faculties(id) ON DELETE SET NULL,
    hired_at date NULL,
    academic_rank varchar(120) NOT NULL DEFAULT '',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL
);

CREATE INDEX IF NOT EXISTS idx_staff_profiles_faculty_id ON staff_profiles (faculty_id);

CREATE TABLE IF NOT EXISTS student_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id uuid NOT NULL UNIQUE REFERENCES persons(id) ON DELETE CASCADE,
    student_no varchar(50) NOT NULL UNIQUE,
    faculty_id uuid NULL REFERENCES faculties(id) ON DELETE SET NULL,
    vocation_id uuid NULL REFERENCES vocations(id) ON DELETE SET NULL,
    group_id uuid NULL REFERENCES groups(id) ON DELETE SET NULL,
    enrollment_date date NULL,
    status varchar(40) NOT NULL DEFAULT 'active',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_faculty_id ON student_profiles (faculty_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_vocation_id ON student_profiles (vocation_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_group_id ON student_profiles (group_id);

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id uuid NOT NULL UNIQUE REFERENCES persons(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    username varchar(100) NOT NULL UNIQUE,
    password_hash varchar(255) NOT NULL,
    last_login timestamptz NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    is_active boolean NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_users_role_id ON users (role_id);

CREATE TABLE IF NOT EXISTS subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id uuid NULL REFERENCES faculties(id) ON DELETE SET NULL,
    code varchar(50) NOT NULL UNIQUE,
    name varchar(150) NOT NULL,
    description text NOT NULL DEFAULT '',
    credit_hours integer NOT NULL DEFAULT 0 CHECK (credit_hours >= 0),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL
);

CREATE INDEX IF NOT EXISTS idx_subjects_faculty_id ON subjects (faculty_id);

CREATE TABLE IF NOT EXISTS disciplines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    teacher_staff_profile_id uuid NULL REFERENCES staff_profiles(id) ON DELETE SET NULL,
    group_id uuid NOT NULL REFERENCES groups(id) ON DELETE RESTRICT,
    academic_year varchar(20) NOT NULL,
    semester integer NOT NULL CHECK (semester > 0),
    total_hours integer NOT NULL DEFAULT 0 CHECK (total_hours >= 0),
    status varchar(30) NOT NULL DEFAULT 'planned',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL
);

CREATE INDEX IF NOT EXISTS idx_disciplines_subject_id ON disciplines (subject_id);
CREATE INDEX IF NOT EXISTS idx_disciplines_teacher_staff_profile_id ON disciplines (teacher_staff_profile_id);
CREATE INDEX IF NOT EXISTS idx_disciplines_group_id ON disciplines (group_id);

CREATE TABLE IF NOT EXISTS weeks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    discipline_id uuid NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
    week_number integer NOT NULL CHECK (week_number > 0),
    title varchar(255) NOT NULL,
    plan text NOT NULL DEFAULT '',
    planned_hours integer NOT NULL DEFAULT 0 CHECK (planned_hours >= 0),
    delivered_hours integer NOT NULL DEFAULT 0 CHECK (delivered_hours >= 0),
    status varchar(30) NOT NULL DEFAULT 'planned',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (discipline_id, week_number)
);

CREATE INDEX IF NOT EXISTS idx_weeks_discipline_id ON weeks (discipline_id);

CREATE TABLE IF NOT EXISTS schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    discipline_id uuid NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
    group_id uuid NOT NULL REFERENCES groups(id) ON DELETE RESTRICT,
    teacher_staff_profile_id uuid NULL REFERENCES staff_profiles(id) ON DELETE SET NULL,
    auditorium_id uuid NULL REFERENCES auditoriums(id) ON DELETE SET NULL,
    day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time time NOT NULL,
    end_time time NOT NULL,
    week_pattern varchar(50) NOT NULL DEFAULT 'weekly',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL,
    CONSTRAINT ck_schedules_time_order CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS idx_schedules_discipline_id ON schedules (discipline_id);
CREATE INDEX IF NOT EXISTS idx_schedules_group_id ON schedules (group_id);
CREATE INDEX IF NOT EXISTS idx_schedules_teacher_staff_profile_id ON schedules (teacher_staff_profile_id);
CREATE INDEX IF NOT EXISTS idx_schedules_auditorium_id ON schedules (auditorium_id);

CREATE TABLE IF NOT EXISTS attendance (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    discipline_id uuid NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
    student_profile_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    attendance_date date NOT NULL,
    status varchar(30) NOT NULL,
    marked_by_user_id uuid NULL REFERENCES users(id) ON DELETE SET NULL,
    remark text NOT NULL DEFAULT '',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL,
    CONSTRAINT uq_attendance_session UNIQUE (discipline_id, student_profile_id, attendance_date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_discipline_id ON attendance (discipline_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_profile_id ON attendance (student_profile_id);
CREATE INDEX IF NOT EXISTS idx_attendance_attendance_date ON attendance (attendance_date);

CREATE TABLE IF NOT EXISTS academic_performances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    discipline_id uuid NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
    student_profile_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    assessment_type varchar(30) NOT NULL,
    assessment_date date NOT NULL,
    score numeric(10,2) NOT NULL,
    max_score numeric(10,2) NOT NULL,
    grade varchar(20) NOT NULL DEFAULT '',
    recorded_by_user_id uuid NULL REFERENCES users(id) ON DELETE SET NULL,
    comment text NOT NULL DEFAULT '',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL
);

CREATE INDEX IF NOT EXISTS idx_academic_performances_discipline_id ON academic_performances (discipline_id);
CREATE INDEX IF NOT EXISTS idx_academic_performances_student_profile_id ON academic_performances (student_profile_id);
CREATE INDEX IF NOT EXISTS idx_academic_performances_assessment_date ON academic_performances (assessment_date);

CREATE TABLE IF NOT EXISTS executions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    discipline_id uuid NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
    teacher_staff_profile_id uuid NULL REFERENCES staff_profiles(id) ON DELETE SET NULL,
    auditorium_id uuid NULL REFERENCES auditoriums(id) ON DELETE SET NULL,
    executed_at timestamptz NOT NULL,
    topic varchar(255) NOT NULL,
    notes text NOT NULL DEFAULT '',
    duration_minutes integer NOT NULL DEFAULT 0 CHECK (duration_minutes >= 0),
    status varchar(30) NOT NULL DEFAULT 'completed',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL
);

CREATE INDEX IF NOT EXISTS idx_executions_discipline_id ON executions (discipline_id);
CREATE INDEX IF NOT EXISTS idx_executions_teacher_staff_profile_id ON executions (teacher_staff_profile_id);
CREATE INDEX IF NOT EXISTS idx_executions_auditorium_id ON executions (auditorium_id);
CREATE INDEX IF NOT EXISTS idx_executions_executed_at ON executions (executed_at);

CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NULL REFERENCES users(id) ON DELETE SET NULL,
    entity_name varchar(120) NOT NULL,
    entity_id varchar(64) NOT NULL,
    action varchar(20) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT')),
    old_value jsonb NULL,
    new_value jsonb NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_name ON audit_logs (entity_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs (entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);
