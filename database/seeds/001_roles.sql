INSERT INTO roles (code, name, description, is_system, is_active)
VALUES
    ('admin', 'Admin', 'Full system access', true, true),
    ('registrar', 'Registrar', 'Academic administration access', true, true),
    ('instructor', 'Instructor', 'Teaching and grading access', true, true),
    ('student', 'Student', 'Learner access', true, true)
ON CONFLICT (code) DO UPDATE
SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_system = EXCLUDED.is_system,
    is_active = EXCLUDED.is_active;
