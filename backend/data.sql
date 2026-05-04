--
-- PostgreSQL database dump
--

\restrict qkV8WIagUDjyPHYGmnrqltcV0bUUg9OlmExAkx3yvdkfPy8KDpXdtEOpviNRnZ8

-- Dumped from database version 16.12 (9893e46)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: academic_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public.academic_sessions DISABLE TRIGGER ALL;

INSERT INTO public.academic_sessions (id, name, is_active, created_at) VALUES (1, '2021/2022', false, '2026-05-03 00:51:37.775554');
INSERT INTO public.academic_sessions (id, name, is_active, created_at) VALUES (2, '2022/2023', false, '2026-05-03 00:51:37.775554');
INSERT INTO public.academic_sessions (id, name, is_active, created_at) VALUES (3, '2023/2024', false, '2026-05-03 00:51:37.775554');
INSERT INTO public.academic_sessions (id, name, is_active, created_at) VALUES (4, '2024/2025', true, '2026-05-03 00:51:37.775554');


ALTER TABLE public.academic_sessions ENABLE TRIGGER ALL;

--
-- Data for Name: academic_semesters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.academic_semesters DISABLE TRIGGER ALL;

INSERT INTO public.academic_semesters (id, name, session_id, is_active, created_at) VALUES (1, 'First Semester', 1, false, '2026-05-03 00:51:37.784825');
INSERT INTO public.academic_semesters (id, name, session_id, is_active, created_at) VALUES (2, 'Second Semester', 1, false, '2026-05-03 00:51:37.784825');
INSERT INTO public.academic_semesters (id, name, session_id, is_active, created_at) VALUES (3, 'First Semester', 2, false, '2026-05-03 00:51:37.784825');
INSERT INTO public.academic_semesters (id, name, session_id, is_active, created_at) VALUES (4, 'Second Semester', 2, false, '2026-05-03 00:51:37.784825');
INSERT INTO public.academic_semesters (id, name, session_id, is_active, created_at) VALUES (5, 'First Semester', 3, false, '2026-05-03 00:51:37.784825');
INSERT INTO public.academic_semesters (id, name, session_id, is_active, created_at) VALUES (6, 'Second Semester', 3, false, '2026-05-03 00:51:37.784825');
INSERT INTO public.academic_semesters (id, name, session_id, is_active, created_at) VALUES (7, 'First Semester', 4, true, '2026-05-03 00:51:37.784825');
INSERT INTO public.academic_semesters (id, name, session_id, is_active, created_at) VALUES (8, 'Second Semester', 4, false, '2026-05-03 00:51:37.784825');


ALTER TABLE public.academic_semesters ENABLE TRIGGER ALL;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.users DISABLE TRIGGER ALL;

INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (1, 'Dr. Aminu Kano', 'admin@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'super_admin', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (2, 'Prof. Halima Ibrahim', 'halima.ibrahim@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'admin', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (3, 'Dr. Hadiza Musa', 'hadiza.musa@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'admin', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (4, 'Prof. Abubakar Shehu', 'abubakar.shehu@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'dean', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (5, 'Mr. Samuel Okafor', 'samuel.okafor@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'registrar', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (6, 'Mrs. Fatima Bello', 'fatima.bello@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'bursar', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (7, 'Prof. Ahmad Usman', 'ahmad.usman@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'hod', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (8, 'Dr. Kemi Adesanya', 'kemi.adesanya@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'hod', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (9, 'Prof. Garba Idris', 'garba.idris@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'hod', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (10, 'Miss Amina Danladi', 'amina.danladi@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'counsellor', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (11, 'Mr. Chukwudi Eze', 'chukwudi.eze@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'counsellor', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (12, 'Prof. Ibrahim Musa', 'ibrahim.musa@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'lecturer', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (13, 'Dr. Fatima Al-Rashid', 'fatima.rashid@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'lecturer', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (14, 'Prof. Sule Adamu', 'sule.adamu@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'lecturer', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (15, 'Dr. Chioma Obi', 'chioma.obi@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'lecturer', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (16, 'Mr. Emeka Nwosu', 'emeka.nwosu@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'lecturer', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (17, 'Mrs. Ngozi Adeyemi', 'ngozi.adeyemi@maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'lecturer', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (18, 'Aisha Mohammed', 'aisha.mohammed@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (19, 'Usman Bello', 'usman.bello@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (20, 'Fatima Abdullahi', 'fatima.abdullahi@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (21, 'Kabiru Hassan', 'kabiru.hassan@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (22, 'Maryam Sani', 'maryam.sani@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (23, 'Chukwuemeka Obi', 'chukwuemeka.obi@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (24, 'Amina Yusuf', 'amina.yusuf@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (25, 'Ibrahim Lawal', 'ibrahim.lawal@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (26, 'Zainab Aliyu', 'zainab.aliyu@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (27, 'Mustapha Garba', 'mustapha.garba@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (28, 'Blessing Okonkwo', 'blessing.okonkwo@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (29, 'Yakubu Danladi', 'yakubu.danladi@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (30, 'Ramatu Shehu', 'ramatu.shehu@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (31, 'Emmanuel Eze', 'emmanuel.eze@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (32, 'Hauwa Ismail', 'hauwa.ismail@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (33, 'Tunde Adebayo', 'tunde.adebayo@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (34, 'Grace Nwosu', 'grace.nwosu@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (35, 'Mohammed Bashir', 'mohammed.bashir@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (36, 'Ngozi Okafor', 'ngozi.okafor@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (37, 'Abdullahi Musa', 'abdullahi.musa@student.maaun.edu.ng', '$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq', 'student', '2026-05-03 00:51:37.89548', '2026-05-03 00:51:37.89548');
INSERT INTO public.users (id, name, email, password_hash, role, created_at, updated_at) VALUES (38, 'Victor Harmani', 'harmanicodes@gmail.com', '$2b$10$5ZNyXNTBdjdFECAAtooEVOwguMhTxdMlU6QfnbwGYsz/1lKO6U4Pu', 'student', '2026-05-03 01:55:41.500229', '2026-05-03 01:55:41.500229');


ALTER TABLE public.users ENABLE TRIGGER ALL;

--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.students DISABLE TRIGGER ALL;

INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (18, 35, 'MAAUN/MC/24/018', 'Mass Communication', 'Arts and Social Sciences', '100', 2.01, '2024', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (19, 36, 'MAAUN/MC/23/019', 'Mass Communication', 'Arts and Social Sciences', '200', 3.88, '2023', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (20, 37, 'MAAUN/MC/22/020', 'Mass Communication', 'Arts and Social Sciences', '300', 1.02, '2022', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (21, 38, 'MAAUN/2026/CSC/6070', 'Computer Science', 'Science and Technology', '100', NULL, '2026', '2026-05-03 01:55:41.795917', '2026-05-03 01:55:41.795917');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (1, 18, 'MAAUN/CS/22/001', 'Computer Science', 'Science and Technology', '300', 3.82, '2022', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (2, 19, 'MAAUN/CS/23/002', 'Computer Science', 'Science and Technology', '200', 4.76, '2023', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (3, 20, 'MAAUN/CS/24/003', 'Computer Science', 'Science and Technology', '100', 4.1, '2024', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (4, 21, 'MAAUN/CS/22/004', 'Computer Science', 'Science and Technology', '300', 2.14, '2022', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (5, 22, 'MAAUN/CS/21/005', 'Computer Science', 'Science and Technology', '400', 4.76, '2021', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (6, 23, 'MAAUN/CS/23/006', 'Computer Science', 'Science and Technology', '200', 3.12, '2023', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (7, 24, 'MAAUN/CS/21/007', 'Computer Science', 'Science and Technology', '400', 1.18, '2021', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (8, 25, 'MAAUN/BA/22/008', 'Business Administration', 'Management Sciences', '300', 3.71, '2022', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (9, 26, 'MAAUN/BA/24/009', 'Business Administration', 'Management Sciences', '100', 4.9, '2024', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (10, 27, 'MAAUN/BA/23/010', 'Business Administration', 'Management Sciences', '200', 3.14, '2023', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (11, 28, 'MAAUN/BA/21/011', 'Business Administration', 'Management Sciences', '400', 3.62, '2021', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (12, 29, 'MAAUN/BA/22/012', 'Business Administration', 'Management Sciences', '300', 2.21, '2022', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (13, 30, 'MAAUN/BA/23/013', 'Business Administration', 'Management Sciences', '200', 3.08, '2023', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (14, 31, 'MAAUN/BA/24/014', 'Business Administration', 'Management Sciences', '100', 4.05, '2024', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (15, 32, 'MAAUN/MC/22/015', 'Mass Communication', 'Arts and Social Sciences', '300', 4.61, '2022', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (16, 33, 'MAAUN/MC/23/016', 'Mass Communication', 'Arts and Social Sciences', '200', 3.09, '2023', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');
INSERT INTO public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) VALUES (17, 34, 'MAAUN/MC/21/017', 'Mass Communication', 'Arts and Social Sciences', '400', 2.84, '2021', '2026-05-03 00:51:37.903027', '2026-05-03 00:51:37.903027');


ALTER TABLE public.students ENABLE TRIGGER ALL;

--
-- Data for Name: academic_standings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.academic_standings DISABLE TRIGGER ALL;

INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (1, 1, 3.82, 'Second Class Upper', 'good', 20, 76.4, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (2, 2, 4.76, 'First Class', 'good', 20, 95.2, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (3, 3, 4.1, 'First Class', 'good', 20, 82, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (4, 4, 2.14, 'Third Class', 'probation', 20, 42.8, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (5, 5, 4.76, 'First Class', 'good', 20, 95.2, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (6, 6, 3.12, 'Second Class Lower', 'good', 20, 62.4, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (7, 7, 1.18, 'Pass', 'probation', 20, 23.6, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (8, 8, 3.71, 'Second Class Upper', 'good', 20, 74.2, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (9, 9, 4.9, 'First Class', 'good', 20, 98, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (10, 10, 3.14, 'Second Class Lower', 'good', 20, 62.8, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (11, 11, 3.62, 'Second Class Upper', 'good', 20, 72.4, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (12, 12, 2.21, 'Third Class', 'probation', 20, 44.2, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (13, 13, 3.08, 'Second Class Lower', 'good', 20, 61.6, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (14, 14, 4.05, 'First Class', 'good', 20, 81, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (15, 15, 4.61, 'First Class', 'good', 20, 92.2, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (16, 16, 3.09, 'Second Class Lower', 'good', 20, 61.8, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (17, 17, 2.84, 'Second Class Lower', 'good', 20, 56.8, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (18, 18, 2.01, 'Third Class', 'probation', 20, 40.2, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (19, 19, 3.88, 'Second Class Upper', 'good', 20, 77.6, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (20, 20, 1.02, 'Pass', 'probation', 20, 20.4, '2026-05-03 00:51:40.074808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (21, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:26:51.50201');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (22, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:26:52.012515');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (23, 20, 0, 'Insufficient Credits', 'withdrawal_risk', 20, 0, '2026-05-03 01:26:52.012728');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (24, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:26:52.012862');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (25, 9, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:26:52.013516');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (26, 5, 5, 'First Class Honours', 'good', 38, 190, '2026-05-03 01:26:52.013304');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (27, 4, 1.9, 'Insufficient Credits', 'probation', 20, 38, '2026-05-03 01:26:52.014028');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (28, 10, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:26:52.014012');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (29, 11, 5, 'First Class Honours', 'good', 38, 190, '2026-05-03 01:26:52.014028');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (30, 7, 0, 'Fail', 'withdrawal_risk', 36, 0, '2026-05-03 01:26:52.014446');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (31, 8, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:26:52.014577');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (32, 3, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:26:52.015613');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (33, 19, 5, 'Insufficient Credits', 'good', 10, 50, '2026-05-03 01:26:52.018842');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (34, 2, 5, 'Insufficient Credits', 'good', 10, 50, '2026-05-03 01:26:52.018975');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (35, 13, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:26:52.019013');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (36, 14, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:26:52.019084');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (37, 15, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:26:52.019141');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (38, 17, 4.11, 'Second Class Honours (Upper Division)', 'good', 38, 156, '2026-05-03 01:26:52.019358');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (39, 6, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:26:52.019393');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (40, 16, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:26:52.019504');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (41, 12, 2.2, 'Insufficient Credits', 'good', 20, 44, '2026-05-03 01:26:52.019478');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (42, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:26:52.338572');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (43, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:26:52.35645');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (44, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:31:00.60358');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (45, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:31:00.826655');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (46, 20, 0, 'Insufficient Credits', 'withdrawal_risk', 20, 0, '2026-05-03 01:31:00.827334');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (47, 19, 5, 'Insufficient Credits', 'good', 10, 50, '2026-05-03 01:31:00.827481');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (48, 8, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:31:00.82766');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (49, 9, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:31:00.827933');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (50, 10, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:31:00.828406');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (51, 11, 5, 'First Class Honours', 'good', 38, 190, '2026-05-03 01:31:00.828465');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (52, 4, 1.9, 'Insufficient Credits', 'probation', 20, 38, '2026-05-03 01:31:00.828977');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (53, 2, 5, 'Insufficient Credits', 'good', 10, 50, '2026-05-03 01:31:00.829285');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (54, 5, 5, 'First Class Honours', 'good', 38, 190, '2026-05-03 01:31:00.830366');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (55, 3, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:31:00.831191');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (56, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:31:00.833103');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (57, 6, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:31:00.833331');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (58, 12, 2.2, 'Insufficient Credits', 'good', 20, 44, '2026-05-03 01:31:00.833492');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (59, 13, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:31:00.833567');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (60, 14, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:31:00.833687');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (61, 15, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:31:00.833835');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (62, 17, 4.11, 'Second Class Honours (Upper Division)', 'good', 38, 156, '2026-05-03 01:31:00.834072');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (63, 16, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:31:00.83406');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (64, 7, 0, 'Fail', 'withdrawal_risk', 36, 0, '2026-05-03 01:31:00.835808');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (65, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:31:01.169925');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (66, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:31:01.202936');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (67, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:32:05.474264');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (68, 19, 5, 'Insufficient Credits', 'good', 10, 50, '2026-05-03 01:32:05.677003');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (70, 9, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:05.677487');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (69, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:05.677237');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (71, 5, 5, 'First Class Honours', 'good', 38, 190, '2026-05-03 01:32:05.677727');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (72, 7, 0, 'Fail', 'withdrawal_risk', 36, 0, '2026-05-03 01:32:05.678224');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (74, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:32:05.678612');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (73, 2, 5, 'Insufficient Credits', 'good', 10, 50, '2026-05-03 01:32:05.67853');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (75, 8, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:32:05.678804');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (76, 20, 0, 'Insufficient Credits', 'withdrawal_risk', 20, 0, '2026-05-03 01:32:05.679063');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (77, 3, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:05.679425');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (78, 11, 5, 'First Class Honours', 'good', 38, 190, '2026-05-03 01:32:05.680069');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (79, 12, 2.2, 'Insufficient Credits', 'good', 20, 44, '2026-05-03 01:32:05.690773');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (80, 13, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:32:05.69089');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (81, 16, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:32:05.691168');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (82, 15, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:32:05.691191');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (83, 14, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:05.691468');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (84, 17, 4.11, 'Second Class Honours (Upper Division)', 'good', 38, 156, '2026-05-03 01:32:05.69149');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (85, 4, 1.9, 'Insufficient Credits', 'probation', 20, 38, '2026-05-03 01:32:05.691656');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (86, 6, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:32:05.692083');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (87, 10, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:32:05.693188');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (88, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:06.052825');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (89, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:06.090444');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (90, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:32:16.991933');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (91, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:17.187695');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (92, 20, 0, 'Insufficient Credits', 'withdrawal_risk', 20, 0, '2026-05-03 01:32:17.18814');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (93, 9, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:17.188434');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (94, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:32:17.188679');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (95, 3, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:17.189247');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (96, 2, 5, 'Insufficient Credits', 'good', 10, 50, '2026-05-03 01:32:17.18927');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (97, 7, 0, 'Fail', 'withdrawal_risk', 36, 0, '2026-05-03 01:32:17.189508');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (105, 14, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:17.193751');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (106, 15, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:32:17.193898');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (107, 16, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:32:17.194013');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (98, 5, 5, 'First Class Honours', 'good', 38, 190, '2026-05-03 01:32:17.189961');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (99, 4, 1.9, 'Insufficient Credits', 'probation', 20, 38, '2026-05-03 01:32:17.1901');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (100, 19, 5, 'Insufficient Credits', 'good', 10, 50, '2026-05-03 01:32:17.190357');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (104, 13, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:32:17.193671');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (108, 17, 4.11, 'Second Class Honours (Upper Division)', 'good', 38, 156, '2026-05-03 01:32:17.194052');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (110, 10, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:32:17.194429');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (111, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:17.598654');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (112, 18, 0, 'Insufficient Credits', 'probation', 0, 0, '2026-05-03 01:32:17.629387');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (101, 8, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 01:32:17.191305');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (102, 11, 5, 'First Class Honours', 'good', 38, 190, '2026-05-03 01:32:17.19347');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (103, 12, 2.2, 'Insufficient Credits', 'good', 20, 44, '2026-05-03 01:32:17.193639');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (109, 6, 4, 'Insufficient Credits', 'good', 10, 40, '2026-05-03 01:32:17.194138');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (113, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 02:53:05.179184');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (146, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 03:00:03.030304');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (147, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 03:02:00.799873');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (148, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 03:02:07.612024');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (149, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 03:06:49.909508');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (150, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 03:07:27.628907');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (151, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 03:07:27.673126');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (152, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 03:15:49.86519');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (153, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 03:15:49.955893');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (154, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 03:20:01.433281');
INSERT INTO public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) VALUES (155, 1, 5, 'Insufficient Credits', 'good', 20, 100, '2026-05-03 03:22:51.840732');


ALTER TABLE public.academic_standings ENABLE TRIGGER ALL;

--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.activity_logs DISABLE TRIGGER ALL;

INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (1, 12, 'create_result', 'result', 172, NULL, '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:26:51.855Z"}', '2026-05-03 01:26:51.859691');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (2, 12, 'submit_result', 'result', 172, '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:26:51.855Z"}', '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:26:51.950Z"}', '2026-05-03 01:26:51.955061');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (3, 2, 'ANNOUNCEMENT_CREATED', 'announcements', 9, NULL, '{"title":"System Auto-Test Announcement","targetRoles":["student","lecturer"],"ip":"127.0.0.1"}', '2026-05-03 01:26:52.054939');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (4, 2, 'ANNOUNCEMENT_DELETED', 'announcements', 9, NULL, '{"title":"Auto-Test Announcement (Updated)","ip":"127.0.0.1"}', '2026-05-03 01:26:52.070729');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (5, 2, 'DISCIPLINARY_CASE_CREATED', 'disciplinary_cases', 6, NULL, '{"title":"Auto-Test Case — Safe to Ignore","severity":"minor","studentId":18,"ip":"127.0.0.1"}', '2026-05-03 01:26:52.206494');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (6, 2, 'DISCIPLINARY_STATUS_CHANGED', 'disciplinary_cases', 6, NULL, '{"from":"open","to":"under_review","ip":"127.0.0.1"}', '2026-05-03 01:26:52.22357');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (7, 2, 'DISCIPLINARY_STATUS_CHANGED', 'disciplinary_cases', 6, NULL, '{"from":"under_review","to":"resolved","ip":"127.0.0.1"}', '2026-05-03 01:26:52.240634');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (8, 2, 'WELFARE_CASE_ASSIGNED', 'welfare_assignments', 6, NULL, '{"caseId":1,"ip":"127.0.0.1"}', '2026-05-03 01:26:52.280102');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (9, 2, 'WELFARE_STATUS_CHANGED', 'welfare_cases', 1, NULL, '{"from":"assigned","to":"in_progress","ip":"127.0.0.1"}', '2026-05-03 01:26:52.293854');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (10, 2, 'WELFARE_NOTE_ADDED', 'welfare_notes', 7, NULL, '{"caseId":1,"isPrivate":false,"ip":"127.0.0.1"}', '2026-05-03 01:26:52.307734');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (11, 2, 'WELFARE_PRIORITY_CHANGED', 'welfare_cases', 1, NULL, '{"priority":"medium","ip":"127.0.0.1"}', '2026-05-03 01:26:52.317581');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (12, 2, 'TRANSCRIPT_GENERATED', 'transcript', 5, NULL, '{"ref":"MAAUN-TXN-2026-0C18A7C4","role":"admin","ip":"127.0.0.1"}', '2026-05-03 01:26:52.332393');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (13, 2, 'TRANSCRIPT_APPROVED', 'transcript', 5, NULL, '{"status":"approved","ip":"127.0.0.1"}', '2026-05-03 01:26:52.348098');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (14, 18, 'WELFARE_CASE_SUBMITTED', 'welfare_cases', 7, NULL, '{"category":"academic_stress","priority":"low","ip":"127.0.0.1"}', '2026-05-03 01:31:00.712607');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (15, 12, 'update_result', 'result', 172, '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:26:51.950Z"}', '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:31:00.748Z"}', '2026-05-03 01:31:00.751895');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (16, 12, 'submit_result', 'result', 172, '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:31:00.748Z"}', '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:31:00.758Z"}', '2026-05-03 01:31:00.761316');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (17, 2, 'ANNOUNCEMENT_CREATED', 'announcements', 10, NULL, '{"title":"System Auto-Test Announcement","targetRoles":["student","lecturer"],"ip":"127.0.0.1"}', '2026-05-03 01:31:00.870193');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (18, 2, 'ANNOUNCEMENT_DELETED', 'announcements', 10, NULL, '{"title":"Auto-Test (Updated)","ip":"127.0.0.1"}', '2026-05-03 01:31:00.884938');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (19, 2, 'DISCIPLINARY_CASE_CREATED', 'disciplinary_cases', 7, NULL, '{"title":"Auto-Test Case — Safe to Ignore","severity":"minor","studentId":18,"ip":"127.0.0.1"}', '2026-05-03 01:31:01.023052');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (20, 2, 'DISCIPLINARY_STATUS_CHANGED', 'disciplinary_cases', 7, NULL, '{"from":"open","to":"under_review","ip":"127.0.0.1"}', '2026-05-03 01:31:01.042858');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (21, 2, 'DISCIPLINARY_ACTION_APPLIED', 'disciplinary_actions', 6, NULL, '{"caseId":7,"actionType":"warning","ip":"127.0.0.1"}', '2026-05-03 01:31:01.056132');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (22, 2, 'DISCIPLINARY_STATUS_CHANGED', 'disciplinary_cases', 7, NULL, '{"from":"under_review","to":"resolved","ip":"127.0.0.1"}', '2026-05-03 01:31:01.072745');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (23, 2, 'WELFARE_CASE_ASSIGNED', 'welfare_assignments', 7, NULL, '{"caseId":7,"ip":"127.0.0.1"}', '2026-05-03 01:31:01.11454');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (24, 2, 'WELFARE_STATUS_CHANGED', 'welfare_cases', 7, NULL, '{"from":"assigned","to":"in_progress","ip":"127.0.0.1"}', '2026-05-03 01:31:01.127752');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (25, 2, 'WELFARE_NOTE_ADDED', 'welfare_notes', 8, NULL, '{"caseId":7,"isPrivate":false,"ip":"127.0.0.1"}', '2026-05-03 01:31:01.140701');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (26, 2, 'WELFARE_PRIORITY_CHANGED', 'welfare_cases', 7, NULL, '{"priority":"medium","ip":"127.0.0.1"}', '2026-05-03 01:31:01.148813');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (27, 2, 'TRANSCRIPT_GENERATED', 'transcript', 6, NULL, '{"ref":"MAAUN-TXN-2026-FEC2DBC0","role":"admin","ip":"127.0.0.1"}', '2026-05-03 01:31:01.162846');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (28, 2, 'TRANSCRIPT_PENDING', 'transcript', 6, NULL, '{"status":"pending","ip":"127.0.0.1"}', '2026-05-03 01:31:01.178821');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (29, 2, 'TRANSCRIPT_APPROVED', 'transcript', 6, NULL, '{"status":"approved","ip":"127.0.0.1"}', '2026-05-03 01:31:01.187172');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (30, 2, 'TRANSCRIPT_OFFICIAL', 'transcript', 6, NULL, '{"status":"official","ip":"127.0.0.1"}', '2026-05-03 01:31:01.196495');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (31, 18, 'WELFARE_CASE_SUBMITTED', 'welfare_cases', 8, NULL, '{"category":"academic_stress","priority":"low","ip":"127.0.0.1"}', '2026-05-03 01:32:05.559323');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (32, 12, 'update_result', 'result', 172, '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:31:00.758Z"}', '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:05.595Z"}', '2026-05-03 01:32:05.599363');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (33, 12, 'submit_result', 'result', 172, '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:05.595Z"}', '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:05.605Z"}', '2026-05-03 01:32:05.608764');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (34, 2, 'ANNOUNCEMENT_CREATED', 'announcements', 11, NULL, '{"title":"System Auto-Test Announcement","targetRoles":["student","lecturer"],"ip":"127.0.0.1"}', '2026-05-03 01:32:05.728055');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (35, 2, 'ANNOUNCEMENT_DELETED', 'announcements', 11, NULL, '{"title":"Auto-Test (Updated)","ip":"127.0.0.1"}', '2026-05-03 01:32:05.741938');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (36, 2, 'DISCIPLINARY_CASE_CREATED', 'disciplinary_cases', 8, NULL, '{"title":"Auto-Test Case — Safe to Ignore","severity":"minor","studentId":1,"ip":"127.0.0.1"}', '2026-05-03 01:32:05.872684');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (37, 2, 'DISCIPLINARY_STATUS_CHANGED', 'disciplinary_cases', 8, NULL, '{"from":"open","to":"under_review","ip":"127.0.0.1"}', '2026-05-03 01:32:05.890819');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (38, 2, 'DISCIPLINARY_ACTION_APPLIED', 'disciplinary_actions', 7, NULL, '{"caseId":8,"actionType":"warning","ip":"127.0.0.1"}', '2026-05-03 01:32:05.905146');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (39, 18, 'APPEAL_SUBMITTED', 'disciplinary_appeals', 3, NULL, '{"caseId":8,"ip":"127.0.0.1"}', '2026-05-03 01:32:05.924286');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (40, 2, 'APPEAL_REVIEW_STARTED', 'disciplinary_appeals', 3, NULL, '{"caseId":8,"ip":"127.0.0.1"}', '2026-05-03 01:32:05.945766');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (41, 2, 'DISCIPLINARY_STATUS_CHANGED', 'disciplinary_cases', 8, NULL, '{"from":"under_review","to":"resolved","ip":"127.0.0.1"}', '2026-05-03 01:32:05.95921');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (42, 2, 'WELFARE_CASE_ASSIGNED', 'welfare_assignments', 8, NULL, '{"caseId":8,"ip":"127.0.0.1"}', '2026-05-03 01:32:06.000797');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (43, 2, 'WELFARE_STATUS_CHANGED', 'welfare_cases', 8, NULL, '{"from":"assigned","to":"in_progress","ip":"127.0.0.1"}', '2026-05-03 01:32:06.011078');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (44, 2, 'WELFARE_NOTE_ADDED', 'welfare_notes', 9, NULL, '{"caseId":8,"isPrivate":false,"ip":"127.0.0.1"}', '2026-05-03 01:32:06.022933');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (45, 2, 'WELFARE_PRIORITY_CHANGED', 'welfare_cases', 8, NULL, '{"priority":"medium","ip":"127.0.0.1"}', '2026-05-03 01:32:06.032523');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (46, 2, 'TRANSCRIPT_GENERATED', 'transcript', 7, NULL, '{"ref":"MAAUN-TXN-2026-310E9BFF","role":"admin","ip":"127.0.0.1"}', '2026-05-03 01:32:06.046611');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (47, 2, 'TRANSCRIPT_PENDING', 'transcript', 7, NULL, '{"status":"pending","ip":"127.0.0.1"}', '2026-05-03 01:32:06.062018');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (48, 2, 'TRANSCRIPT_APPROVED', 'transcript', 7, NULL, '{"status":"approved","ip":"127.0.0.1"}', '2026-05-03 01:32:06.070095');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (49, 2, 'TRANSCRIPT_OFFICIAL', 'transcript', 7, NULL, '{"status":"official","ip":"127.0.0.1"}', '2026-05-03 01:32:06.083259');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (50, 18, 'WELFARE_CASE_SUBMITTED', 'welfare_cases', 9, NULL, '{"category":"academic_stress","priority":"low","ip":"127.0.0.1"}', '2026-05-03 01:32:17.081797');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (51, 12, 'update_result', 'result', 172, '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:05.605Z"}', '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:17.116Z"}', '2026-05-03 01:32:17.120269');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (52, 12, 'submit_result', 'result', 172, '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:17.116Z"}', '{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:17.126Z"}', '2026-05-03 01:32:17.129257');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (53, 2, 'ANNOUNCEMENT_CREATED', 'announcements', 12, NULL, '{"title":"System Auto-Test Announcement","targetRoles":["student","lecturer"],"ip":"127.0.0.1"}', '2026-05-03 01:32:17.240207');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (54, 2, 'ANNOUNCEMENT_DELETED', 'announcements', 12, NULL, '{"title":"Auto-Test (Updated)","ip":"127.0.0.1"}', '2026-05-03 01:32:17.253516');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (55, 2, 'DISCIPLINARY_CASE_CREATED', 'disciplinary_cases', 9, NULL, '{"title":"Auto-Test Case — Safe to Ignore","severity":"minor","studentId":1,"ip":"127.0.0.1"}', '2026-05-03 01:32:17.394781');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (56, 2, 'DISCIPLINARY_STATUS_CHANGED', 'disciplinary_cases', 9, NULL, '{"from":"open","to":"under_review","ip":"127.0.0.1"}', '2026-05-03 01:32:17.413297');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (57, 2, 'DISCIPLINARY_ACTION_APPLIED', 'disciplinary_actions', 8, NULL, '{"caseId":9,"actionType":"warning","ip":"127.0.0.1"}', '2026-05-03 01:32:17.427423');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (58, 18, 'APPEAL_SUBMITTED', 'disciplinary_appeals', 4, NULL, '{"caseId":9,"ip":"127.0.0.1"}', '2026-05-03 01:32:17.445384');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (59, 2, 'APPEAL_REVIEW_STARTED', 'disciplinary_appeals', 4, NULL, '{"caseId":9,"ip":"127.0.0.1"}', '2026-05-03 01:32:17.466027');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (60, 2, 'APPEAL_DECISION_MADE', 'appeal_decisions', 3, NULL, '{"appealId":4,"caseId":9,"decision":"dismiss","ip":"127.0.0.1"}', '2026-05-03 01:32:17.491405');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (61, 2, 'DISCIPLINARY_STATUS_CHANGED', 'disciplinary_cases', 9, NULL, '{"from":"dismissed","to":"resolved","ip":"127.0.0.1"}', '2026-05-03 01:32:17.50397');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (62, 2, 'WELFARE_CASE_ASSIGNED', 'welfare_assignments', 9, NULL, '{"caseId":9,"ip":"127.0.0.1"}', '2026-05-03 01:32:17.541894');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (63, 2, 'WELFARE_STATUS_CHANGED', 'welfare_cases', 9, NULL, '{"from":"assigned","to":"in_progress","ip":"127.0.0.1"}', '2026-05-03 01:32:17.553939');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (64, 2, 'WELFARE_NOTE_ADDED', 'welfare_notes', 10, NULL, '{"caseId":9,"isPrivate":false,"ip":"127.0.0.1"}', '2026-05-03 01:32:17.567067');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (65, 2, 'WELFARE_PRIORITY_CHANGED', 'welfare_cases', 9, NULL, '{"priority":"medium","ip":"127.0.0.1"}', '2026-05-03 01:32:17.575643');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (66, 2, 'TRANSCRIPT_GENERATED', 'transcript', 8, NULL, '{"ref":"MAAUN-TXN-2026-90000B7A","role":"admin","ip":"127.0.0.1"}', '2026-05-03 01:32:17.590597');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (67, 2, 'TRANSCRIPT_PENDING', 'transcript', 8, NULL, '{"status":"pending","ip":"127.0.0.1"}', '2026-05-03 01:32:17.607129');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (68, 2, 'TRANSCRIPT_APPROVED', 'transcript', 8, NULL, '{"status":"approved","ip":"127.0.0.1"}', '2026-05-03 01:32:17.61505');
INSERT INTO public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) VALUES (69, 2, 'TRANSCRIPT_OFFICIAL', 'transcript', 8, NULL, '{"status":"official","ip":"127.0.0.1"}', '2026-05-03 01:32:17.623051');


ALTER TABLE public.activity_logs ENABLE TRIGGER ALL;

--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.announcements DISABLE TRIGGER ALL;

INSERT INTO public.announcements (id, title, content, created_by, target_roles, target_departments, target_levels, is_pinned, expires_at, created_at, updated_at) VALUES (1, '2nd Semester Course Registration — Deadline Notice', 'All students are reminded that 2nd semester course registration closes on January 20, 2025. Students who fail to register before the deadline will be unable to attend lectures or sit exams. Log in to the Student Portal > My Enrollments to complete registration. Clearance of outstanding fees is required before registration can proceed.', 1, '["student","lecturer"]', NULL, NULL, true, '2025-01-20 00:00:00', '2026-05-03 00:51:40.144941', '2026-05-03 00:51:40.144941');
INSERT INTO public.announcements (id, title, content, created_by, target_roles, target_departments, target_levels, is_pinned, expires_at, created_at, updated_at) VALUES (2, 'Second Semester Tuition Fee Payment Deadline', 'The deadline for payment of 2024/2025 Second Semester school fees is February 1, 2025. Students with outstanding balances will be barred from examination halls. Payment can be made through the Paystack portal on the Student Portal. For queries, contact the Bursary office at bursary@maaun.edu.ng.', 1, '["student"]', NULL, NULL, true, NULL, '2026-05-03 00:51:40.144941', '2026-05-03 00:51:40.144941');
INSERT INTO public.announcements (id, title, content, created_by, target_roles, target_departments, target_levels, is_pinned, expires_at, created_at, updated_at) VALUES (3, '17th Convocation Ceremony — July 12, 2025', 'The 17th Convocation Ceremony for graduating students of the 2020/2021 and 2021/2022 academic sessions is scheduled for Saturday, July 12, 2025, at the MAAUN Main Auditorium. Eligible graduates must collect academic gowns from the Registry (Block B, Room 14) between June 30 and July 8, 2025. Attendance is compulsory. Four (4) guest seats are allocated per graduate.', 1, '["student","admin","registrar","dean"]', NULL, NULL, true, NULL, '2026-05-03 00:51:40.144941', '2026-05-03 00:51:40.144941');
INSERT INTO public.announcements (id, title, content, created_by, target_roles, target_departments, target_levels, is_pinned, expires_at, created_at, updated_at) VALUES (4, 'Library Extended Hours — Examination Period', 'The university library will operate extended hours from Monday to Saturday (7:00 AM – 10:00 PM) throughout the examination period (January 27 – February 20, 2025). Students are advised to bring valid student ID cards. Group study rooms must be booked 24 hours in advance via the library portal.', 1, '["student"]', NULL, NULL, false, NULL, '2026-05-03 00:51:40.144941', '2026-05-03 00:51:40.144941');
INSERT INTO public.announcements (id, title, content, created_by, target_roles, target_departments, target_levels, is_pinned, expires_at, created_at, updated_at) VALUES (5, 'Monthly Staff Senate Meeting — January 2025', 'The January 2025 Staff Senate meeting is scheduled for Wednesday, January 8, 2025 at 2:00 PM in the Senate Chamber, Main Administration Block. All academic staff are required to attend. Items for discussion include examination timetable approval, research grant applications, and 2025/2026 session planning.', 1, '["lecturer","admin","hod","dean","registrar"]', NULL, NULL, false, NULL, '2026-05-03 00:51:40.144941', '2026-05-03 00:51:40.144941');
INSERT INTO public.announcements (id, title, content, created_by, target_roles, target_departments, target_levels, is_pinned, expires_at, created_at, updated_at) VALUES (6, 'New Course Offerings — 2nd Semester 2024/2025', 'The following new elective courses are available for registration in the 2024/2025 Second Semester: CSC Dept — Cloud Computing (CSC410); BA Dept — Digital Marketing (BUS410); MC Dept — Social Media Analytics (MCM410). These courses are open to all 400L students. Enrolment is first-come-first-served with a cap of 30 students each.', 5, '["student","hod","lecturer"]', NULL, NULL, false, NULL, '2026-05-03 00:51:40.144941', '2026-05-03 00:51:40.144941');
INSERT INTO public.announcements (id, title, content, created_by, target_roles, target_departments, target_levels, is_pinned, expires_at, created_at, updated_at) VALUES (7, 'MAAUN Merit Scholarship Applications Open', 'Applications for the 2025/2026 MAAUN Merit Scholarship are now open. Eligible students must have a minimum CGPA of 3.50, no outstanding disciplinary record, and at least 3 semesters remaining. The scholarship covers 50% of tuition for one academic year. Submit applications with supporting documents to the Registry by March 15, 2025.', 1, '["student"]', NULL, NULL, false, NULL, '2026-05-03 00:51:40.144941', '2026-05-03 00:51:40.144941');
INSERT INTO public.announcements (id, title, content, created_by, target_roles, target_departments, target_levels, is_pinned, expires_at, created_at, updated_at) VALUES (8, 'IT Week 2025 — Innovation, Code & Career Fair', 'MAAUN IT Week 2025 runs from February 17–21, 2025. Events include a 24-hour Hackathon, Developer Career Fair with 15+ top tech companies, AI/ML Workshop by Google Developer Group, and a CS Project Exhibition. All students and staff are welcome. Registration is free at itweek.maaun.edu.ng. First prize for hackathon: ₦500,000 + internship placement.', 1, '["student","lecturer","admin","hod","dean"]', NULL, NULL, false, NULL, '2026-05-03 00:51:40.144941', '2026-05-03 00:51:40.144941');


ALTER TABLE public.announcements ENABLE TRIGGER ALL;

--
-- Data for Name: disciplinary_cases; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.disciplinary_cases DISABLE TRIGGER ALL;

INSERT INTO public.disciplinary_cases (id, student_id, reported_by, title, description, severity, status, resolution_note, created_at, updated_at) VALUES (1, 4, 2, 'Examination Malpractice — Unauthorized Material', 'Student was found with unauthorized notes during the CSC301 mid-semester examination. Invigilator confiscated the material and reported immediately.', 'major', 'resolved', 'Case reviewed by Dean. Suspension applied.', '2026-05-03 00:51:40.028688', '2026-05-03 00:51:40.028688');
INSERT INTO public.disciplinary_cases (id, student_id, reported_by, title, description, severity, status, resolution_note, created_at, updated_at) VALUES (2, 20, 1, 'Physical Assault on Fellow Student', 'Student physically assaulted a fellow student outside the library on 2nd October 2024 resulting in injuries requiring medical attention. CCTV evidence confirmed.', 'critical', 'resolved', 'University Senate upheld expulsion recommendation after appeal review.', '2026-05-03 00:51:40.028688', '2026-05-03 00:51:40.028688');
INSERT INTO public.disciplinary_cases (id, student_id, reported_by, title, description, severity, status, resolution_note, created_at, updated_at) VALUES (3, 14, 2, 'Persistent Lateness to Lectures', 'Student has been consistently late to 60% of lectures in BUS101 over four weeks. Lecturer filed formal complaint after verbal warnings failed.', 'minor', 'resolved', 'Warning issued and acknowledged by student.', '2026-05-03 00:51:40.028688', '2026-05-03 00:51:40.028688');
INSERT INTO public.disciplinary_cases (id, student_id, reported_by, title, description, severity, status, resolution_note, created_at, updated_at) VALUES (4, 18, 2, 'Disruptive Behaviour in Lecture Hall', 'Student repeatedly disrupted MCM101 lectures by talking loudly, using mobile phone, and ignoring instructor''s warnings.', 'moderate', 'under_review', NULL, '2026-05-03 00:51:40.028688', '2026-05-03 00:51:40.028688');
INSERT INTO public.disciplinary_cases (id, student_id, reported_by, title, description, severity, status, resolution_note, created_at, updated_at) VALUES (5, 12, 2, 'Habitual Absenteeism', 'Student has exceeded the allowed 30% absenteeism threshold in BUS301. Attendance records show 65% absence across October–November 2024.', 'minor', 'resolved', 'Student counselled and issued attendance warning.', '2026-05-03 00:51:40.028688', '2026-05-03 00:51:40.028688');
INSERT INTO public.disciplinary_cases (id, student_id, reported_by, title, description, severity, status, resolution_note, created_at, updated_at) VALUES (6, 18, 2, 'Auto-Test Case — Safe to Ignore', 'Created by system test runner to verify endpoint functionality.', 'minor', 'resolved', 'Auto-test resolved', '2026-05-03 01:26:52.200097', '2026-05-03 01:26:52.234');
INSERT INTO public.disciplinary_cases (id, student_id, reported_by, title, description, severity, status, resolution_note, created_at, updated_at) VALUES (7, 18, 2, 'Auto-Test Case — Safe to Ignore', 'Created by system test runner to verify endpoint functionality.', 'minor', 'resolved', 'Auto-test resolved', '2026-05-03 01:31:01.01682', '2026-05-03 01:31:01.065');
INSERT INTO public.disciplinary_cases (id, student_id, reported_by, title, description, severity, status, resolution_note, created_at, updated_at) VALUES (8, 1, 2, 'Auto-Test Case — Safe to Ignore', 'Created by system test runner to verify endpoint functionality.', 'minor', 'resolved', 'Auto-test resolved', '2026-05-03 01:32:05.866854', '2026-05-03 01:32:05.952');
INSERT INTO public.disciplinary_cases (id, student_id, reported_by, title, description, severity, status, resolution_note, created_at, updated_at) VALUES (9, 1, 2, 'Auto-Test Case — Safe to Ignore', 'Created by system test runner to verify endpoint functionality.', 'minor', 'resolved', 'Auto-test resolved', '2026-05-03 01:32:17.388055', '2026-05-03 01:32:17.496');


ALTER TABLE public.disciplinary_cases ENABLE TRIGGER ALL;

--
-- Data for Name: disciplinary_appeals; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.disciplinary_appeals DISABLE TRIGGER ALL;

INSERT INTO public.disciplinary_appeals (id, case_id, student_id, reason, evidence, status, reviewed_by, admin_response, created_at, resolved_at) VALUES (1, 1, 4, 'I strongly contest the allegation of examination malpractice. The notes found were pre-existing margin notes in my textbook which I inadvertently brought into the exam hall. I had no intention of using them to cheat and deeply regret the misunderstanding.', 'My textbook with annotations predating the exam, character references from two lecturers.', 'accepted', 1, 'After reviewing the evidence, the committee acknowledges mitigating circumstances. Suspension reduced from 4 weeks to 2 weeks. Hostel block remains.', '2024-11-05 00:00:00', '2024-11-12 00:00:00');
INSERT INTO public.disciplinary_appeals (id, case_id, student_id, reason, evidence, status, reviewed_by, admin_response, created_at, resolved_at) VALUES (2, 2, 20, 'I accept responsibility for my actions but plead for leniency considering my family circumstances. This was an isolated incident triggered by extreme personal stress and I have since undergone counselling.', 'Counselling session certificates, medical report, family financial hardship letter.', 'rejected', 1, 'The severity of the physical assault and clear CCTV evidence leaves no basis for reversal. The University Senate''s decision to expel stands. The student may reapply for admission after a minimum of 2 years.', '2024-11-08 00:00:00', '2024-11-20 00:00:00');
INSERT INTO public.disciplinary_appeals (id, case_id, student_id, reason, evidence, status, reviewed_by, admin_response, created_at, resolved_at) VALUES (3, 8, 1, 'Auto-test appeal — requesting review of this system-generated case.', 'No evidence — system test only', 'under_review', 2, NULL, '2026-05-03 01:32:05.913665', NULL);
INSERT INTO public.disciplinary_appeals (id, case_id, student_id, reason, evidence, status, reviewed_by, admin_response, created_at, resolved_at) VALUES (4, 9, 1, 'Auto-test appeal — requesting review of this system-generated case.', 'No evidence — system test only', 'accepted', 2, 'System test — no action required', '2026-05-03 01:32:17.435253', '2026-05-03 01:32:17.48');


ALTER TABLE public.disciplinary_appeals ENABLE TRIGGER ALL;

--
-- Data for Name: appeal_decisions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.appeal_decisions DISABLE TRIGGER ALL;

INSERT INTO public.appeal_decisions (id, appeal_id, decision, modified_action, remarks, decided_by, created_at) VALUES (1, 1, 'modify', 'Suspension reduced to 2 weeks. Hostel block retained. Academic restriction lifted after suspension.', 'Evidence of unintentional misconduct is credible. Sanction modified proportionately.', 1, '2026-05-03 00:51:40.044891');
INSERT INTO public.appeal_decisions (id, appeal_id, decision, modified_action, remarks, decided_by, created_at) VALUES (2, 2, 'dismiss', NULL, 'CCTV footage is conclusive. Physical assault causing injury warrants expulsion per Section 14(b) of the Student Conduct Policy. No grounds for modification.', 1, '2026-05-03 00:51:40.044891');
INSERT INTO public.appeal_decisions (id, appeal_id, decision, modified_action, remarks, decided_by, created_at) VALUES (3, 4, 'dismiss', NULL, 'Auto-test decision', 2, '2026-05-03 01:32:17.473622');


ALTER TABLE public.appeal_decisions ENABLE TRIGGER ALL;

--
-- Data for Name: hostels; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.hostels DISABLE TRIGGER ALL;

INSERT INTO public.hostels (id, name, gender, total_rooms, location, description, is_active, created_at) VALUES (1, 'Al-Amin Hall', 'male', 10, 'North Campus', 'Male students hostel, single and double occupancy rooms.', true, '2026-05-03 00:51:39.805972');
INSERT INTO public.hostels (id, name, gender, total_rooms, location, description, is_active, created_at) VALUES (2, 'Khadija Hall', 'female', 10, 'South Campus', 'Female students hostel, modern facilities with 24h security.', true, '2026-05-03 00:51:39.805972');
INSERT INTO public.hostels (id, name, gender, total_rooms, location, description, is_active, created_at) VALUES (3, 'Auto-Test Hostel', 'mixed', 1, 'Test Block', NULL, true, '2026-05-03 01:26:52.153385');
INSERT INTO public.hostels (id, name, gender, total_rooms, location, description, is_active, created_at) VALUES (4, 'Auto-Test Hostel', 'mixed', 1, 'Test Block', NULL, true, '2026-05-03 01:31:00.974667');
INSERT INTO public.hostels (id, name, gender, total_rooms, location, description, is_active, created_at) VALUES (5, 'Auto-Test Hostel', 'mixed', 1, 'Test Block', NULL, true, '2026-05-03 01:32:05.822872');
INSERT INTO public.hostels (id, name, gender, total_rooms, location, description, is_active, created_at) VALUES (6, 'Auto-Test Hostel', 'mixed', 1, 'Test Block', NULL, true, '2026-05-03 01:32:17.338958');


ALTER TABLE public.hostels ENABLE TRIGGER ALL;

--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.rooms DISABLE TRIGGER ALL;

INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (1, 1, 'A101', 4, 'available', 1, '2026-05-03 00:51:39.810631');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (2, 1, 'A102', 4, 'available', 1, '2026-05-03 00:51:39.810631');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (3, 1, 'A103', 4, 'available', 1, '2026-05-03 00:51:39.810631');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (4, 1, 'A104', 4, 'available', 2, '2026-05-03 00:51:39.810631');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (5, 1, 'A105', 4, 'available', 2, '2026-05-03 00:51:39.810631');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (6, 2, 'B101', 4, 'available', 1, '2026-05-03 00:51:39.81568');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (7, 2, 'B102', 4, 'available', 1, '2026-05-03 00:51:39.81568');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (8, 2, 'B103', 4, 'available', 1, '2026-05-03 00:51:39.81568');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (9, 2, 'B104', 4, 'available', 2, '2026-05-03 00:51:39.81568');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (10, 2, 'B105', 4, 'available', 2, '2026-05-03 00:51:39.81568');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (11, 3, 'T01', 2, 'available', 1, '2026-05-03 01:26:52.158649');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (12, 4, 'T01', 2, 'available', 1, '2026-05-03 01:31:00.980995');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (13, 5, 'T01', 2, 'available', 1, '2026-05-03 01:32:05.827328');
INSERT INTO public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) VALUES (14, 6, 'T01', 2, 'available', 1, '2026-05-03 01:32:17.345026');


ALTER TABLE public.rooms ENABLE TRIGGER ALL;

--
-- Data for Name: bed_spaces; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.bed_spaces DISABLE TRIGGER ALL;

INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (8, 2, 'D', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (9, 3, 'A', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (10, 3, 'B', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (11, 3, 'C', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (12, 3, 'D', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (13, 4, 'A', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (14, 4, 'B', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (15, 4, 'C', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (16, 4, 'D', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (17, 5, 'A', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (18, 5, 'B', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (19, 5, 'C', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (20, 5, 'D', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (29, 8, 'A', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (30, 8, 'B', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (31, 8, 'C', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (32, 8, 'D', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (33, 9, 'A', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (34, 9, 'B', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (35, 9, 'C', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (36, 9, 'D', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (37, 10, 'A', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (38, 10, 'B', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (39, 10, 'C', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (40, 10, 'D', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (1, 1, 'A', 2, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (2, 1, 'B', 6, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (3, 1, 'C', 8, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (4, 1, 'D', 10, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (5, 2, 'A', 14, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (6, 2, 'B', 16, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (7, 2, 'C', 18, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (21, 6, 'A', 1, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (22, 6, 'B', 3, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (23, 6, 'C', 5, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (24, 6, 'D', 9, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (25, 7, 'A', 11, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (26, 7, 'B', 13, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (27, 7, 'C', 15, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (28, 7, 'D', 19, 'occupied');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (41, 11, 'A', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (42, 11, 'B', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (43, 12, 'A', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (44, 12, 'B', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (45, 13, 'A', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (46, 13, 'B', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (47, 14, 'A', NULL, 'vacant');
INSERT INTO public.bed_spaces (id, room_id, bed_label, student_id, status) VALUES (48, 14, 'B', NULL, 'vacant');


ALTER TABLE public.bed_spaces ENABLE TRIGGER ALL;

--
-- Data for Name: lecturers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.lecturers DISABLE TRIGGER ALL;

INSERT INTO public.lecturers (id, user_id, staff_id, department, faculty, designation, created_at, updated_at) VALUES (1, 12, 'MAAUN/LEC/001', 'Computer Science', 'Science and Technology', 'Professor', '2026-05-03 00:51:37.909126', '2026-05-03 00:51:37.909126');
INSERT INTO public.lecturers (id, user_id, staff_id, department, faculty, designation, created_at, updated_at) VALUES (2, 13, 'MAAUN/LEC/002', 'Computer Science', 'Science and Technology', 'Senior Lecturer', '2026-05-03 00:51:37.909126', '2026-05-03 00:51:37.909126');
INSERT INTO public.lecturers (id, user_id, staff_id, department, faculty, designation, created_at, updated_at) VALUES (3, 14, 'MAAUN/LEC/003', 'Business Administration', 'Management Sciences', 'Professor', '2026-05-03 00:51:37.909126', '2026-05-03 00:51:37.909126');
INSERT INTO public.lecturers (id, user_id, staff_id, department, faculty, designation, created_at, updated_at) VALUES (4, 15, 'MAAUN/LEC/004', 'Business Administration', 'Management Sciences', 'Lecturer I', '2026-05-03 00:51:37.909126', '2026-05-03 00:51:37.909126');
INSERT INTO public.lecturers (id, user_id, staff_id, department, faculty, designation, created_at, updated_at) VALUES (5, 16, 'MAAUN/LEC/005', 'Mass Communication', 'Arts and Social Sciences', 'Senior Lecturer', '2026-05-03 00:51:37.909126', '2026-05-03 00:51:37.909126');
INSERT INTO public.lecturers (id, user_id, staff_id, department, faculty, designation, created_at, updated_at) VALUES (6, 17, 'MAAUN/LEC/006', 'Mass Communication', 'Arts and Social Sciences', 'Lecturer I', '2026-05-03 00:51:37.909126', '2026-05-03 00:51:37.909126');


ALTER TABLE public.lecturers ENABLE TRIGGER ALL;

--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.courses DISABLE TRIGGER ALL;

INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (1, 'CSC101', 'Programming Fundamentals', 3, 'Computer Science', 'Science and Technology', '100', 'first', NULL, 1, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (2, 'CSC102', 'Introduction to Databases', 3, 'Computer Science', 'Science and Technology', '100', 'second', NULL, 2, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (3, 'CSC201', 'Data Structures & Algorithms', 3, 'Computer Science', 'Science and Technology', '200', 'first', NULL, 1, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (4, 'CSC202', 'Computer Architecture', 3, 'Computer Science', 'Science and Technology', '200', 'second', NULL, 2, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (5, 'CSC301', 'Software Engineering', 3, 'Computer Science', 'Science and Technology', '300', 'first', NULL, 1, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (6, 'CSC302', 'Operating Systems', 3, 'Computer Science', 'Science and Technology', '300', 'second', NULL, 2, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (7, 'CSC401', 'Artificial Intelligence', 3, 'Computer Science', 'Science and Technology', '400', 'first', NULL, 1, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (8, 'CSC402', 'Final Year Project (CS)', 6, 'Computer Science', 'Science and Technology', '400', 'second', NULL, 1, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (9, 'BUS101', 'Principles of Management', 3, 'Business Administration', 'Management Sciences', '100', 'first', NULL, 3, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (10, 'BUS102', 'Introduction to Accounting', 3, 'Business Administration', 'Management Sciences', '100', 'second', NULL, 4, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (11, 'BUS201', 'Organisational Behaviour', 3, 'Business Administration', 'Management Sciences', '200', 'first', NULL, 3, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (12, 'BUS202', 'Business Finance', 3, 'Business Administration', 'Management Sciences', '200', 'second', NULL, 4, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (13, 'BUS301', 'Strategic Management', 3, 'Business Administration', 'Management Sciences', '300', 'first', NULL, 3, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (14, 'BUS302', 'Business Law', 3, 'Business Administration', 'Management Sciences', '300', 'second', NULL, 4, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (15, 'BUS401', 'Business Policy', 3, 'Business Administration', 'Management Sciences', '400', 'first', NULL, 3, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (16, 'BUS402', 'Final Year Project (BA)', 6, 'Business Administration', 'Management Sciences', '400', 'second', NULL, 3, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (17, 'MCM101', 'Intro to Mass Communication', 3, 'Mass Communication', 'Arts and Social Sciences', '100', 'first', NULL, 5, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (18, 'MCM102', 'Media Writing', 3, 'Mass Communication', 'Arts and Social Sciences', '100', 'second', NULL, 6, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (19, 'MCM201', 'Broadcast Journalism', 3, 'Mass Communication', 'Arts and Social Sciences', '200', 'first', NULL, 5, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (20, 'MCM202', 'Media Ethics', 3, 'Mass Communication', 'Arts and Social Sciences', '200', 'second', NULL, 6, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (21, 'MCM301', 'Digital Media Production', 3, 'Mass Communication', 'Arts and Social Sciences', '300', 'first', NULL, 5, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (22, 'MCM302', 'Public Relations', 3, 'Mass Communication', 'Arts and Social Sciences', '300', 'second', NULL, 6, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (23, 'MCM401', 'Media Research Methods', 3, 'Mass Communication', 'Arts and Social Sciences', '400', 'first', NULL, 5, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (24, 'MCM402', 'Final Year Project (MC)', 6, 'Mass Communication', 'Arts and Social Sciences', '400', 'second', NULL, 5, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (25, 'GST101', 'Use of English I', 2, 'General Studies', 'General Studies', '100', 'first', NULL, 1, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (26, 'GST102', 'Nigerian History & Culture', 2, 'General Studies', 'General Studies', '100', 'second', NULL, 2, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (27, 'GST201', 'Philosophy & Logic', 2, 'General Studies', 'General Studies', '200', 'first', NULL, 3, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (28, 'GST202', 'Leadership & Ethics', 2, 'General Studies', 'General Studies', '200', 'second', NULL, 4, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (29, 'GST301', 'Research Skills', 2, 'General Studies', 'General Studies', '300', 'first', NULL, 5, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (30, 'GST302', 'Innovation & Society', 2, 'General Studies', 'General Studies', '300', 'second', NULL, 6, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (31, 'GST401', 'Community Development', 2, 'General Studies', 'General Studies', '400', 'first', NULL, 1, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (32, 'GST402', 'Sustainable Development', 2, 'General Studies', 'General Studies', '400', 'second', NULL, 2, '2026-05-03 00:51:37.918535', '2026-05-03 00:51:37.918535');
INSERT INTO public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) VALUES (35, 'X', 'X', 1, 'X', 'X', '100', 'first', NULL, NULL, '2026-05-03 01:26:52.567544', '2026-05-03 01:26:52.567544');


ALTER TABLE public.courses ENABLE TRIGGER ALL;

--
-- Data for Name: disciplinary_actions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.disciplinary_actions DISABLE TRIGGER ALL;

INSERT INTO public.disciplinary_actions (id, case_id, action_type, start_date, end_date, remarks, applied_by, applied_at) VALUES (1, 1, 'suspension', '2026-04-19', '2026-05-17', 'Two-week suspension from all academic activities and hostel access. To be reviewed after suspension period.', 1, '2026-05-03 00:51:40.032682');
INSERT INTO public.disciplinary_actions (id, case_id, action_type, start_date, end_date, remarks, applied_by, applied_at) VALUES (2, 2, 'expulsion', '2026-04-19', NULL, 'Student expelled from MAAUN effective immediately. All academic records frozen pending final processing.', 1, '2026-05-03 00:51:40.032682');
INSERT INTO public.disciplinary_actions (id, case_id, action_type, start_date, end_date, remarks, applied_by, applied_at) VALUES (3, 3, 'warning', '2026-05-03', NULL, 'Official written warning issued. Further violations will result in escalated action.', 2, '2026-05-03 00:51:40.032682');
INSERT INTO public.disciplinary_actions (id, case_id, action_type, start_date, end_date, remarks, applied_by, applied_at) VALUES (4, 4, 'restriction', '2026-05-03', '2026-05-17', 'Student restricted to front-row seating and must surrender phone to invigilator at start of each lecture.', 2, '2026-05-03 00:51:40.032682');
INSERT INTO public.disciplinary_actions (id, case_id, action_type, start_date, end_date, remarks, applied_by, applied_at) VALUES (5, 5, 'warning', '2026-05-03', NULL, 'Counselling session attended. Attendance contract signed. Academic advisor assigned.', 1, '2026-05-03 00:51:40.032682');
INSERT INTO public.disciplinary_actions (id, case_id, action_type, start_date, end_date, remarks, applied_by, applied_at) VALUES (6, 7, 'warning', '2026-05-03', NULL, 'Auto-test sanction', 2, '2026-05-03 01:31:01.048698');
INSERT INTO public.disciplinary_actions (id, case_id, action_type, start_date, end_date, remarks, applied_by, applied_at) VALUES (7, 8, 'warning', '2026-05-03', NULL, 'Auto-test sanction', 2, '2026-05-03 01:32:05.89811');
INSERT INTO public.disciplinary_actions (id, case_id, action_type, start_date, end_date, remarks, applied_by, applied_at) VALUES (8, 9, 'warning', '2026-05-03', NULL, 'Auto-test sanction', 2, '2026-05-03 01:32:17.420552');


ALTER TABLE public.disciplinary_actions ENABLE TRIGGER ALL;

--
-- Data for Name: disciplinary_flags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.disciplinary_flags DISABLE TRIGGER ALL;

INSERT INTO public.disciplinary_flags (id, student_id, flag_type, active, related_case_id, created_at) VALUES (1, 4, 'hostel_block', true, 1, '2026-05-03 00:51:40.036209');
INSERT INTO public.disciplinary_flags (id, student_id, flag_type, active, related_case_id, created_at) VALUES (2, 20, 'graduation_block', true, 2, '2026-05-03 00:51:40.036209');
INSERT INTO public.disciplinary_flags (id, student_id, flag_type, active, related_case_id, created_at) VALUES (3, 20, 'hostel_block', true, 2, '2026-05-03 00:51:40.036209');
INSERT INTO public.disciplinary_flags (id, student_id, flag_type, active, related_case_id, created_at) VALUES (4, 20, 'academic_hold', true, 2, '2026-05-03 00:51:40.036209');


ALTER TABLE public.disciplinary_flags ENABLE TRIGGER ALL;

--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.enrollments DISABLE TRIGGER ALL;

INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (1, 1, 1, 'first', '2022/2023', 'completed', '2026-05-03 00:51:37.926023');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (2, 1, 25, 'first', '2022/2023', 'completed', '2026-05-03 00:51:37.934916');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (3, 1, 2, 'second', '2022/2023', 'completed', '2026-05-03 00:51:37.942333');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (4, 1, 26, 'second', '2022/2023', 'completed', '2026-05-03 00:51:37.950078');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (5, 1, 3, 'first', '2023/2024', 'completed', '2026-05-03 00:51:37.957998');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (6, 1, 27, 'first', '2023/2024', 'completed', '2026-05-03 00:51:37.964669');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (7, 1, 4, 'second', '2023/2024', 'completed', '2026-05-03 00:51:37.971852');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (8, 1, 28, 'second', '2023/2024', 'completed', '2026-05-03 00:51:37.978839');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (9, 1, 5, 'first', '2024/2025', 'active', '2026-05-03 00:51:37.986199');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (10, 1, 29, 'first', '2024/2025', 'active', '2026-05-03 00:51:37.993773');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (11, 2, 1, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.004689');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (12, 2, 25, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.014729');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (13, 2, 2, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.021788');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (14, 2, 26, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.029802');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (15, 2, 3, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.037228');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (16, 2, 27, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.044952');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (17, 3, 1, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.055651');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (18, 3, 25, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.062312');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (19, 4, 1, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.072981');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (20, 4, 25, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.079202');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (21, 4, 2, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.085187');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (22, 4, 26, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.091574');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (23, 4, 3, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.098259');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (24, 4, 27, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.105027');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (25, 4, 4, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.112068');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (26, 4, 28, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.118076');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (27, 4, 5, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.123777');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (28, 4, 29, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.129753');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (29, 4, 3, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.136612');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (30, 5, 1, 'first', '2021/2022', 'completed', '2026-05-03 00:51:38.146');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (31, 5, 25, 'first', '2021/2022', 'completed', '2026-05-03 00:51:38.152193');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (32, 5, 2, 'second', '2021/2022', 'completed', '2026-05-03 00:51:38.15798');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (33, 5, 26, 'second', '2021/2022', 'completed', '2026-05-03 00:51:38.16414');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (34, 5, 3, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.170641');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (35, 5, 27, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.177464');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (36, 5, 4, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.184105');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (37, 5, 28, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.190761');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (38, 5, 5, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.197104');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (39, 5, 29, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.20426');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (40, 5, 6, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.210001');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (41, 5, 30, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.215718');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (42, 5, 7, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.221813');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (43, 5, 31, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.227679');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (44, 5, 8, 'second', '2024/2025', 'completed', '2026-05-03 00:51:38.233686');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (45, 5, 32, 'second', '2024/2025', 'completed', '2026-05-03 00:51:38.239817');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (46, 6, 1, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.250433');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (47, 6, 25, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.257581');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (48, 6, 2, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.264035');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (49, 6, 26, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.270477');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (50, 6, 3, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.276754');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (51, 6, 27, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.28358');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (52, 7, 1, 'first', '2021/2022', 'completed', '2026-05-03 00:51:38.292649');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (53, 7, 25, 'first', '2021/2022', 'completed', '2026-05-03 00:51:38.299502');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (54, 7, 2, 'second', '2021/2022', 'completed', '2026-05-03 00:51:38.305412');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (55, 7, 26, 'second', '2021/2022', 'completed', '2026-05-03 00:51:38.311573');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (56, 7, 3, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.317246');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (57, 7, 27, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.323619');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (58, 7, 4, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.329722');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (59, 7, 28, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.339369');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (60, 7, 5, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.346577');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (61, 7, 29, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.352774');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (62, 7, 3, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.359079');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (63, 7, 6, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.365429');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (64, 7, 30, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.371597');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (65, 7, 4, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.377659');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (66, 7, 7, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.383453');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (67, 7, 31, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.389649');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (68, 7, 5, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.397488');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (69, 8, 9, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.405706');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (70, 8, 25, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.411534');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (71, 8, 10, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.417215');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (72, 8, 26, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.519422');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (73, 8, 11, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.526227');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (74, 8, 27, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.532017');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (75, 8, 12, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.538712');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (76, 8, 28, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.545005');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (77, 8, 13, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.551846');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (78, 8, 29, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.558733');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (79, 9, 9, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.569246');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (80, 9, 25, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.575572');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (81, 10, 9, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.585772');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (82, 10, 25, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.592542');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (83, 10, 10, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.59867');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (84, 10, 26, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.604403');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (85, 10, 11, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.610399');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (86, 10, 27, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.61584');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (87, 11, 9, 'first', '2021/2022', 'completed', '2026-05-03 00:51:38.625116');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (88, 11, 25, 'first', '2021/2022', 'completed', '2026-05-03 00:51:38.630965');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (89, 11, 10, 'second', '2021/2022', 'completed', '2026-05-03 00:51:38.638176');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (90, 11, 26, 'second', '2021/2022', 'completed', '2026-05-03 00:51:38.64432');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (91, 11, 11, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.649523');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (92, 11, 27, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.656098');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (93, 11, 12, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.662105');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (94, 11, 28, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.668111');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (95, 11, 13, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.674726');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (96, 11, 29, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.681431');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (97, 11, 14, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.687114');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (98, 11, 30, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.692941');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (99, 11, 15, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.698636');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (100, 11, 31, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.704844');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (101, 11, 16, 'second', '2024/2025', 'completed', '2026-05-03 00:51:38.711209');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (102, 11, 32, 'second', '2024/2025', 'completed', '2026-05-03 00:51:38.71763');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (103, 12, 9, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.727442');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (104, 12, 25, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.733395');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (105, 12, 10, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.739005');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (106, 12, 26, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.746682');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (107, 12, 11, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.753021');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (108, 12, 27, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.761108');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (109, 12, 12, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.767575');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (110, 12, 28, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.773745');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (111, 12, 13, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.780556');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (112, 12, 29, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.786573');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (113, 13, 9, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.795627');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (114, 13, 25, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.801753');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (115, 13, 10, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.808192');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (116, 13, 26, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.814753');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (117, 13, 11, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.820703');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (118, 13, 27, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.827104');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (119, 14, 9, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.835829');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (120, 14, 25, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.841023');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (121, 15, 17, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.849641');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (122, 15, 25, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.85527');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (123, 15, 18, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.860742');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (124, 15, 26, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.866136');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (125, 15, 19, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.871846');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (126, 15, 27, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.877557');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (127, 15, 20, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.883535');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (128, 15, 28, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.889212');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (129, 15, 21, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.894868');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (130, 15, 29, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.900596');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (131, 16, 17, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.913269');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (132, 16, 25, 'first', '2023/2024', 'completed', '2026-05-03 00:51:38.919718');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (133, 16, 18, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.927238');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (134, 16, 26, 'second', '2023/2024', 'completed', '2026-05-03 00:51:38.934102');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (135, 16, 19, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.940764');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (136, 16, 27, 'first', '2024/2025', 'active', '2026-05-03 00:51:38.947001');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (137, 17, 17, 'first', '2021/2022', 'completed', '2026-05-03 00:51:38.955891');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (138, 17, 25, 'first', '2021/2022', 'completed', '2026-05-03 00:51:38.961499');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (139, 17, 18, 'second', '2021/2022', 'completed', '2026-05-03 00:51:38.967969');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (140, 17, 26, 'second', '2021/2022', 'completed', '2026-05-03 00:51:38.974284');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (141, 17, 19, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.980642');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (142, 17, 27, 'first', '2022/2023', 'completed', '2026-05-03 00:51:38.986383');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (143, 17, 20, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.992064');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (144, 17, 28, 'second', '2022/2023', 'completed', '2026-05-03 00:51:38.997991');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (145, 17, 21, 'first', '2023/2024', 'completed', '2026-05-03 00:51:39.004016');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (146, 17, 29, 'first', '2023/2024', 'completed', '2026-05-03 00:51:39.010141');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (147, 17, 22, 'second', '2023/2024', 'completed', '2026-05-03 00:51:39.016004');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (148, 17, 30, 'second', '2023/2024', 'completed', '2026-05-03 00:51:39.021951');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (149, 17, 23, 'first', '2024/2025', 'active', '2026-05-03 00:51:39.028624');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (150, 17, 31, 'first', '2024/2025', 'active', '2026-05-03 00:51:39.034338');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (151, 17, 24, 'second', '2024/2025', 'completed', '2026-05-03 00:51:39.040251');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (152, 17, 32, 'second', '2024/2025', 'completed', '2026-05-03 00:51:39.045806');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (153, 18, 17, 'first', '2024/2025', 'active', '2026-05-03 00:51:39.054929');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (154, 18, 25, 'first', '2024/2025', 'active', '2026-05-03 00:51:39.06093');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (155, 19, 17, 'first', '2023/2024', 'completed', '2026-05-03 00:51:39.069462');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (156, 19, 25, 'first', '2023/2024', 'completed', '2026-05-03 00:51:39.075175');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (157, 19, 18, 'second', '2023/2024', 'completed', '2026-05-03 00:51:39.080594');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (158, 19, 26, 'second', '2023/2024', 'completed', '2026-05-03 00:51:39.086078');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (159, 19, 19, 'first', '2024/2025', 'active', '2026-05-03 00:51:39.092059');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (160, 19, 27, 'first', '2024/2025', 'active', '2026-05-03 00:51:39.097907');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (161, 20, 17, 'first', '2022/2023', 'completed', '2026-05-03 00:51:39.106973');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (162, 20, 25, 'first', '2022/2023', 'completed', '2026-05-03 00:51:39.112644');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (163, 20, 18, 'second', '2022/2023', 'completed', '2026-05-03 00:51:39.118084');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (164, 20, 26, 'second', '2022/2023', 'completed', '2026-05-03 00:51:39.123726');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (165, 20, 19, 'first', '2023/2024', 'completed', '2026-05-03 00:51:39.12925');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (166, 20, 27, 'first', '2023/2024', 'completed', '2026-05-03 00:51:39.134906');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (167, 20, 20, 'second', '2023/2024', 'completed', '2026-05-03 00:51:39.141062');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (168, 20, 28, 'second', '2023/2024', 'completed', '2026-05-03 00:51:39.146148');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (169, 20, 21, 'first', '2024/2025', 'active', '2026-05-03 00:51:39.152507');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (170, 20, 29, 'first', '2024/2025', 'active', '2026-05-03 00:51:39.157811');
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) VALUES (171, 20, 19, 'first', '2024/2025', 'active', '2026-05-03 00:51:39.163204');


ALTER TABLE public.enrollments ENABLE TRIGGER ALL;

--
-- Data for Name: fees; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.fees DISABLE TRIGGER ALL;

INSERT INTO public.fees (id, name, amount, department, level, description, created_at) VALUES (1, 'Tuition Fee 2024/2025', 200000, NULL, NULL, 'Annual tuition fee', '2026-05-03 00:51:39.172461');
INSERT INTO public.fees (id, name, amount, department, level, description, created_at) VALUES (2, 'Registration Fee 2024/2025', 10000, NULL, NULL, 'Course registration fee', '2026-05-03 00:51:39.172461');
INSERT INTO public.fees (id, name, amount, department, level, description, created_at) VALUES (3, 'Library Levy 2024/2025', 5000, NULL, NULL, 'Library access levy', '2026-05-03 00:51:39.172461');
INSERT INTO public.fees (id, name, amount, department, level, description, created_at) VALUES (4, 'Hostel Fee 2024/2025', 50000, NULL, NULL, 'Hostel accommodation fee', '2026-05-03 00:51:39.172461');


ALTER TABLE public.fees ENABLE TRIGGER ALL;

--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.payments DISABLE TRIGGER ALL;

INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (1, 18, 1, 'PAY-00000101', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.1769');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (2, 18, 2, 'PAY-00000201', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.188945');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (3, 18, 3, 'PAY-00000301', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.204321');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (4, 19, 1, 'PAY-00000402', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.214073');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (5, 19, 2, 'PAY-00000502', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.224534');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (6, 19, 3, 'PAY-00000602', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.234485');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (7, 20, 1, 'PAY-00000703', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.243681');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (8, 20, 2, 'PAY-00000803', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.253363');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (9, 20, 3, 'PAY-00000903', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.263813');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (10, 21, 2, 'PAY-00001004', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.273015');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (11, 21, 1, 'PAY-00006104', 200000, 'failed', NULL, '2026-05-03 00:51:39.281971');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (12, 22, 1, 'PAY-00001205', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.284473');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (13, 22, 2, 'PAY-00001305', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.293661');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (14, 22, 3, 'PAY-00001405', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.30245');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (15, 23, 1, 'PAY-00001506', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.393114');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (16, 23, 2, 'PAY-00001606', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.40197');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (17, 23, 3, 'PAY-00001706', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.411173');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (18, 25, 1, 'PAY-00001808', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.420111');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (19, 25, 2, 'PAY-00001908', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.430499');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (20, 25, 3, 'PAY-00002008', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.440877');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (21, 26, 1, 'PAY-00002109', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.451965');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (22, 26, 2, 'PAY-00002209', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.462777');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (23, 26, 3, 'PAY-00002309', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.474048');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (24, 27, 1, 'PAY-00002410', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.484822');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (25, 27, 2, 'PAY-00002510', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.497104');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (26, 27, 3, 'PAY-00002610', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.509774');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (27, 28, 1, 'PAY-00002711', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.520437');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (28, 28, 2, 'PAY-00002811', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.529648');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (29, 28, 3, 'PAY-00002911', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.541008');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (30, 29, 2, 'PAY-00003012', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.551777');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (31, 29, 1, 'PAY-00008112', 200000, 'failed', NULL, '2026-05-03 00:51:39.563807');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (32, 30, 1, 'PAY-00003213', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.566633');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (33, 30, 2, 'PAY-00003313', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.577425');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (34, 30, 3, 'PAY-00003413', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.587735');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (35, 31, 1, 'PAY-00003514', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.598978');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (36, 31, 2, 'PAY-00003614', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.608858');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (37, 31, 3, 'PAY-00003714', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.619979');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (38, 32, 1, 'PAY-00003815', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.629871');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (39, 32, 2, 'PAY-00003915', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.641328');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (40, 32, 3, 'PAY-00004015', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.650976');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (41, 33, 1, 'PAY-00004116', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.660996');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (42, 33, 2, 'PAY-00004216', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.670734');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (43, 33, 3, 'PAY-00004316', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.68146');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (44, 34, 2, 'PAY-00004417', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.691718');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (45, 34, 1, 'PAY-00009517', 200000, 'failed', NULL, '2026-05-03 00:51:39.703476');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (46, 35, 1, 'PAY-00004618', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.707381');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (47, 35, 2, 'PAY-00004718', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.720019');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (48, 35, 3, 'PAY-00004818', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.730582');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (49, 36, 1, 'PAY-00004919', 200000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.743611');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (50, 36, 2, 'PAY-00005019', 10000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.759478');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (51, 36, 3, 'PAY-00005119', 5000, 'success', '2024-08-15 00:00:00', '2026-05-03 00:51:39.773998');
INSERT INTO public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) VALUES (52, 21, 3, 'PAY-00099901', 5000, 'success', '2024-09-01 00:00:00', '2026-05-03 00:51:39.783988');


ALTER TABLE public.payments ENABLE TRIGGER ALL;

--
-- Data for Name: receipts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.receipts DISABLE TRIGGER ALL;

INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (1, 1, 18, 'RCP-00000101', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.180525');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (2, 2, 18, 'RCP-00000201', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.193216');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (3, 3, 18, 'RCP-00000301', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.20697');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (4, 4, 19, 'RCP-00000402', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.217723');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (5, 5, 19, 'RCP-00000502', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.227654');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (6, 6, 19, 'RCP-00000602', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.237687');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (7, 7, 20, 'RCP-00000703', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.246836');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (8, 8, 20, 'RCP-00000803', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.257049');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (9, 9, 20, 'RCP-00000903', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.266412');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (10, 10, 21, 'RCP-00001004', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.276101');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (11, 12, 22, 'RCP-00001105', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.287589');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (12, 13, 22, 'RCP-00001205', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.296483');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (13, 14, 22, 'RCP-00001305', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.385868');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (14, 15, 23, 'RCP-00001406', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.396011');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (15, 16, 23, 'RCP-00001506', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.405132');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (16, 17, 23, 'RCP-00001606', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.413898');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (17, 18, 25, 'RCP-00001708', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.423569');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (18, 19, 25, 'RCP-00001808', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.433373');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (19, 20, 25, 'RCP-00001908', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.444939');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (20, 21, 26, 'RCP-00002009', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.455102');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (21, 22, 26, 'RCP-00002109', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.466411');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (22, 23, 26, 'RCP-00002209', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.476875');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (23, 24, 27, 'RCP-00002310', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.488882');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (24, 25, 27, 'RCP-00002410', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.500898');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (25, 26, 27, 'RCP-00002510', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.514098');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (26, 27, 28, 'RCP-00002611', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.523317');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (27, 28, 28, 'RCP-00002711', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.533427');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (28, 29, 28, 'RCP-00002811', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.545417');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (29, 30, 29, 'RCP-00002912', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.556714');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (30, 32, 30, 'RCP-00003013', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.570544');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (31, 33, 30, 'RCP-00003113', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.580887');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (32, 34, 30, 'RCP-00003213', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.591726');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (33, 35, 31, 'RCP-00003314', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.60242');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (34, 36, 31, 'RCP-00003414', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.612786');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (35, 37, 31, 'RCP-00003514', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.623065');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (36, 38, 32, 'RCP-00003615', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.633766');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (37, 39, 32, 'RCP-00003715', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.644186');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (38, 40, 32, 'RCP-00003815', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.654665');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (39, 41, 33, 'RCP-00003916', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.663917');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (40, 42, 33, 'RCP-00004016', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.674876');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (41, 43, 33, 'RCP-00004116', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.684789');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (42, 44, 34, 'RCP-00004217', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.695153');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (43, 46, 35, 'RCP-00004318', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.7119');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (44, 47, 35, 'RCP-00004418', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.723696');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (45, 48, 35, 'RCP-00004518', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.735279');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (46, 49, 36, 'RCP-00004619', 200000, 'Tuition Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.747568');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (47, 50, 36, 'RCP-00004719', 10000, 'Registration Fee 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.766952');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (48, 51, 36, 'RCP-00004819', 5000, 'Library Levy 2024/2025', 'confirmed', 6, '2024-08-15 00:00:00', NULL, NULL, '41.58.100.12', '2026-05-03 00:51:39.777029');
INSERT INTO public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) VALUES (49, 52, 21, 'RCP-00099901', 5000, 'Library Levy 2024/2025', 'reversed', 6, '2024-09-01 00:00:00', '2024-09-10 00:00:00', 'Duplicate payment — student paid twice. Refund issued.', '41.58.100.12', '2026-05-03 00:51:39.787791');


ALTER TABLE public.receipts ENABLE TRIGGER ALL;

--
-- Data for Name: financial_ledger; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.financial_ledger DISABLE TRIGGER ALL;

INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (1, 18, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 1, 1, 200000, '2026-05-03 00:51:39.18423');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (4, 19, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 4, 4, 200000, '2026-05-03 00:51:39.2208');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (7, 20, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 7, 7, 200000, '2026-05-03 00:51:39.249815');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (10, 21, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 10, 10, 10000, '2026-05-03 00:51:39.278934');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (11, 22, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 12, 11, 200000, '2026-05-03 00:51:39.290343');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (14, 23, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 15, 14, 200000, '2026-05-03 00:51:39.399115');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (17, 25, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 18, 17, 200000, '2026-05-03 00:51:39.427114');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (20, 26, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 21, 20, 200000, '2026-05-03 00:51:39.459115');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (23, 27, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 24, 23, 200000, '2026-05-03 00:51:39.492648');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (26, 28, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 27, 26, 200000, '2026-05-03 00:51:39.526815');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (29, 29, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 30, 29, 10000, '2026-05-03 00:51:39.560822');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (30, 30, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 32, 30, 200000, '2026-05-03 00:51:39.573699');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (33, 31, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 35, 33, 200000, '2026-05-03 00:51:39.605906');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (36, 32, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 38, 36, 200000, '2026-05-03 00:51:39.637765');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (39, 33, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 41, 39, 200000, '2026-05-03 00:51:39.667626');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (42, 34, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 44, 42, 10000, '2026-05-03 00:51:39.699562');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (43, 35, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 46, 43, 200000, '2026-05-03 00:51:39.71593');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (46, 36, 'credit', 200000, 'Payment for Tuition Fee 2024/2025', 49, 46, 200000, '2026-05-03 00:51:39.752703');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (2, 18, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 2, 2, 210000, '2026-05-03 00:51:39.196048');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (3, 18, 'credit', 5000, 'Payment for Library Levy 2024/2025', 3, 3, 215000, '2026-05-03 00:51:39.210814');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (5, 19, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 5, 5, 210000, '2026-05-03 00:51:39.231365');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (6, 19, 'credit', 5000, 'Payment for Library Levy 2024/2025', 6, 6, 215000, '2026-05-03 00:51:39.240355');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (8, 20, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 8, 8, 210000, '2026-05-03 00:51:39.259902');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (9, 20, 'credit', 5000, 'Payment for Library Levy 2024/2025', 9, 9, 215000, '2026-05-03 00:51:39.270094');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (49, 21, 'credit', 5000, 'Payment for Library Levy 2024/2025', 52, 49, 15000, '2026-05-03 00:51:39.791302');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (50, 21, 'debit', 5000, 'Reversal: Library Levy 2024/2025 — duplicate payment', 52, 49, 10000, '2026-05-03 00:51:39.791302');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (12, 22, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 13, 12, 210000, '2026-05-03 00:51:39.300024');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (13, 22, 'credit', 5000, 'Payment for Library Levy 2024/2025', 14, 13, 215000, '2026-05-03 00:51:39.389448');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (15, 23, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 16, 15, 210000, '2026-05-03 00:51:39.407647');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (16, 23, 'credit', 5000, 'Payment for Library Levy 2024/2025', 17, 16, 215000, '2026-05-03 00:51:39.417252');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (18, 25, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 19, 18, 210000, '2026-05-03 00:51:39.437725');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (19, 25, 'credit', 5000, 'Payment for Library Levy 2024/2025', 20, 19, 215000, '2026-05-03 00:51:39.448506');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (21, 26, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 22, 21, 210000, '2026-05-03 00:51:39.469895');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (22, 26, 'credit', 5000, 'Payment for Library Levy 2024/2025', 23, 22, 215000, '2026-05-03 00:51:39.481402');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (24, 27, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 25, 24, 210000, '2026-05-03 00:51:39.505936');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (25, 27, 'credit', 5000, 'Payment for Library Levy 2024/2025', 26, 25, 215000, '2026-05-03 00:51:39.517033');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (27, 28, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 28, 27, 210000, '2026-05-03 00:51:39.536363');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (28, 28, 'credit', 5000, 'Payment for Library Levy 2024/2025', 29, 28, 215000, '2026-05-03 00:51:39.548791');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (31, 30, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 33, 31, 210000, '2026-05-03 00:51:39.58456');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (32, 30, 'credit', 5000, 'Payment for Library Levy 2024/2025', 34, 32, 215000, '2026-05-03 00:51:39.595329');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (34, 31, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 36, 34, 210000, '2026-05-03 00:51:39.616265');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (35, 31, 'credit', 5000, 'Payment for Library Levy 2024/2025', 37, 35, 215000, '2026-05-03 00:51:39.626587');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (37, 32, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 39, 37, 210000, '2026-05-03 00:51:39.647949');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (38, 32, 'credit', 5000, 'Payment for Library Levy 2024/2025', 40, 38, 215000, '2026-05-03 00:51:39.657807');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (40, 33, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 42, 40, 210000, '2026-05-03 00:51:39.677888');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (41, 33, 'credit', 5000, 'Payment for Library Levy 2024/2025', 43, 41, 215000, '2026-05-03 00:51:39.688776');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (44, 35, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 47, 44, 210000, '2026-05-03 00:51:39.727545');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (45, 35, 'credit', 5000, 'Payment for Library Levy 2024/2025', 48, 45, 215000, '2026-05-03 00:51:39.73955');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (47, 36, 'credit', 10000, 'Payment for Registration Fee 2024/2025', 50, 47, 210000, '2026-05-03 00:51:39.770558');
INSERT INTO public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) VALUES (48, 36, 'credit', 5000, 'Payment for Library Levy 2024/2025', 51, 48, 215000, '2026-05-03 00:51:39.780658');


ALTER TABLE public.financial_ledger ENABLE TRIGGER ALL;

--
-- Data for Name: graduation_applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.graduation_applications DISABLE TRIGGER ALL;

INSERT INTO public.graduation_applications (id, student_id, session_id, status, reviewed_by, rejection_reason, admin_override, override_reason, reviewed_at, created_at) VALUES (1, 5, 4, 'approved', 1, NULL, false, NULL, '2024-11-01 00:00:00', '2026-05-03 00:51:40.065679');
INSERT INTO public.graduation_applications (id, student_id, session_id, status, reviewed_by, rejection_reason, admin_override, override_reason, reviewed_at, created_at) VALUES (2, 11, 4, 'approved', 1, NULL, false, NULL, '2024-11-01 00:00:00', '2026-05-03 00:51:40.065679');
INSERT INTO public.graduation_applications (id, student_id, session_id, status, reviewed_by, rejection_reason, admin_override, override_reason, reviewed_at, created_at) VALUES (3, 17, 4, 'rejected', 1, 'Outstanding tuition fees of ₦190,000 must be cleared before graduation can be approved.', false, NULL, '2024-11-05 00:00:00', '2026-05-03 00:51:40.065679');


ALTER TABLE public.graduation_applications ENABLE TRIGGER ALL;

--
-- Data for Name: graduation_clearances; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.graduation_clearances DISABLE TRIGGER ALL;

INSERT INTO public.graduation_clearances (id, student_id, cgpa, academic_status, financial_status, admin_status, overall_status, academic_remarks, financial_remarks, admin_remarks, evaluated_at, evaluated_by) VALUES (1, 5, 4.76, 'passed', 'cleared', 'cleared', 'eligible', 'All required courses passed. CGPA: 4.76. First Class.', 'All fees cleared.', 'Records complete.', '2026-05-03 00:51:40.061424', 5);
INSERT INTO public.graduation_clearances (id, student_id, cgpa, academic_status, financial_status, admin_status, overall_status, academic_remarks, financial_remarks, admin_remarks, evaluated_at, evaluated_by) VALUES (2, 11, 3.62, 'passed', 'cleared', 'cleared', 'eligible', 'All required courses passed. CGPA: 3.62. Second Class Upper.', 'All fees cleared.', 'Records complete.', '2026-05-03 00:51:40.061424', 5);
INSERT INTO public.graduation_clearances (id, student_id, cgpa, academic_status, financial_status, admin_status, overall_status, academic_remarks, financial_remarks, admin_remarks, evaluated_at, evaluated_by) VALUES (3, 17, 2.84, 'passed', 'blocked', 'pending', 'not_eligible', 'Academic requirements met. CGPA: 2.84.', 'Outstanding tuition balance of ₦190,000. Must be cleared before graduation.', 'Pending financial clearance.', '2026-05-03 00:51:40.061424', 5);
INSERT INTO public.graduation_clearances (id, student_id, cgpa, academic_status, financial_status, admin_status, overall_status, academic_remarks, financial_remarks, admin_remarks, evaluated_at, evaluated_by) VALUES (4, 7, 1.18, 'failed', 'blocked', 'pending', 'not_eligible', 'Active carryovers in CSC201, CSC202, CSC301. CGPA: 1.18 below minimum 1.50 threshold.', 'No tuition payment recorded.', 'Academic hold prevents graduation processing.', '2026-05-03 00:51:40.061424', 5);
INSERT INTO public.graduation_clearances (id, student_id, cgpa, academic_status, financial_status, admin_status, overall_status, academic_remarks, financial_remarks, admin_remarks, evaluated_at, evaluated_by) VALUES (12, 18, 0, 'failed', 'cleared', 'cleared', 'not_eligible', 'CGPA 0.00 is below minimum pass of 1.50', '3 confirmed payment(s) — Total: ₦215,000', 'Official transcript issued (Ref: MAAUN-TXN-2026-FEC2DBC0)', '2026-05-03 01:32:17.304613', 2);
INSERT INTO public.graduation_clearances (id, student_id, cgpa, academic_status, financial_status, admin_status, overall_status, academic_remarks, financial_remarks, admin_remarks, evaluated_at, evaluated_by) VALUES (13, 1, 5, 'passed', 'cleared', 'pending', 'not_eligible', 'CGPA 5.00 — Insufficient Credits — No carryovers', '3 confirmed payment(s) — Total: ₦215,000', 'No official transcript issued — pending registrar approval', '2026-05-03 02:53:25.702411', 18);


ALTER TABLE public.graduation_clearances ENABLE TRIGGER ALL;

--
-- Data for Name: hostel_allocations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.hostel_allocations DISABLE TRIGGER ALL;

INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (1, 2, 1, 1, '2026-05-03 00:51:39.861222', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (2, 6, 2, 1, '2026-05-03 00:51:39.876098', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (3, 8, 3, 1, '2026-05-03 00:51:39.887171', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (4, 10, 4, 1, '2026-05-03 00:51:39.897415', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (5, 14, 5, 1, '2026-05-03 00:51:39.909965', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (6, 16, 6, 1, '2026-05-03 00:51:39.918319', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (7, 18, 7, 1, '2026-05-03 00:51:39.927768', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (8, 1, 21, 1, '2026-05-03 00:51:39.940925', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (9, 3, 22, 1, '2026-05-03 00:51:39.954047', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (10, 5, 23, 1, '2026-05-03 00:51:39.964146', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (11, 9, 24, 1, '2026-05-03 00:51:39.977012', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (12, 11, 25, 1, '2026-05-03 00:51:39.987848', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (13, 13, 26, 1, '2026-05-03 00:51:40.002008', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (14, 15, 27, 1, '2026-05-03 00:51:40.011008', 'active', NULL);
INSERT INTO public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) VALUES (15, 19, 28, 1, '2026-05-03 00:51:40.022471', 'active', NULL);


ALTER TABLE public.hostel_allocations ENABLE TRIGGER ALL;

--
-- Data for Name: hostel_applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.hostel_applications DISABLE TRIGGER ALL;

INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (1, 2, 4, 'allocated', 75, 'male', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.857313');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (2, 4, 4, 'rejected', 30, 'male', NULL, 'Active disciplinary block prevents hostel allocation.', 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.869605');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (3, 6, 4, 'allocated', 75, 'male', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.87257');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (4, 8, 4, 'allocated', 75, 'male', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.88359');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (5, 10, 4, 'allocated', 75, 'male', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.893604');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (6, 12, 4, 'rejected', 30, 'male', NULL, 'Outstanding tuition fees must be cleared before allocation.', 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.903962');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (7, 14, 4, 'allocated', 75, 'male', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.906955');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (8, 16, 4, 'allocated', 75, 'male', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.915713');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (9, 18, 4, 'allocated', 75, 'male', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.924623');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (10, 20, 4, 'rejected', 30, 'male', NULL, 'Graduation block and poor academic standing disqualify applicant.', 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.93497');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (11, 1, 4, 'allocated', 70, 'female', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.937854');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (12, 3, 4, 'allocated', 70, 'female', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.946568');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (13, 5, 4, 'allocated', 70, 'female', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.961019');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (14, 7, 4, 'rejected', 25, 'female', NULL, 'Outstanding tuition fees and active academic carryovers prevent allocation.', 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.970572');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (15, 9, 4, 'allocated', 70, 'female', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.973375');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (16, 11, 4, 'allocated', 70, 'female', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.984941');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (17, 13, 4, 'allocated', 70, 'female', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:39.994306');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (18, 15, 4, 'allocated', 70, 'female', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:40.008138');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (19, 17, 4, 'rejected', 25, 'female', NULL, 'Partial fee payment — full tuition clearance required for hostel allocation.', 1, '2024-08-20 00:00:00', '2026-05-03 00:51:40.017141');
INSERT INTO public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) VALUES (20, 19, 4, 'allocated', 70, 'female', NULL, NULL, 1, '2024-08-20 00:00:00', '2026-05-03 00:51:40.01999');


ALTER TABLE public.hostel_applications ENABLE TRIGGER ALL;

--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.notifications DISABLE TRIGGER ALL;

INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (3, 19, 'Course Registration Open', '2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.', 'enrollment', false, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (4, 19, 'Results Published', 'Your 2024/2025 First Semester results are now available. Log in to view your performance.', 'result', true, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (5, 20, 'Course Registration Open', '2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.', 'enrollment', false, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (6, 20, 'Results Published', 'Your 2024/2025 First Semester results are now available. Log in to view your performance.', 'result', true, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (7, 21, 'Course Registration Open', '2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.', 'enrollment', false, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (8, 21, 'Results Published', 'Your 2024/2025 First Semester results are now available. Log in to view your performance.', 'result', true, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (9, 22, 'Course Registration Open', '2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.', 'enrollment', false, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (10, 22, 'Results Published', 'Your 2024/2025 First Semester results are now available. Log in to view your performance.', 'result', true, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (11, 23, 'Course Registration Open', '2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.', 'enrollment', false, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (12, 23, 'Results Published', 'Your 2024/2025 First Semester results are now available. Log in to view your performance.', 'result', true, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (13, 24, 'Course Registration Open', '2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.', 'enrollment', false, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (14, 24, 'Results Published', 'Your 2024/2025 First Semester results are now available. Log in to view your performance.', 'result', true, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (15, 25, 'Course Registration Open', '2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.', 'enrollment', false, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (16, 25, 'Results Published', 'Your 2024/2025 First Semester results are now available. Log in to view your performance.', 'result', true, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (17, 26, 'Course Registration Open', '2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.', 'enrollment', false, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (18, 26, 'Results Published', 'Your 2024/2025 First Semester results are now available. Log in to view your performance.', 'result', true, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (19, 27, 'Course Registration Open', '2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.', 'enrollment', false, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (20, 27, 'Results Published', 'Your 2024/2025 First Semester results are now available. Log in to view your performance.', 'result', true, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (22, 2, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (23, 3, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (24, 4, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (25, 5, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (26, 6, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (27, 7, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (28, 8, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (29, 9, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (30, 10, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (31, 11, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (32, 12, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (33, 13, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (34, 14, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (35, 15, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (36, 16, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (37, 17, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (39, 19, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (40, 20, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (41, 21, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (42, 22, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (43, 23, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (44, 24, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (45, 25, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (46, 26, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (47, 27, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (48, 28, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (49, 29, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (50, 30, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (51, 31, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (52, 32, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (53, 33, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (54, 34, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (55, 35, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (56, 36, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (57, 37, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (58, 35, 'Disciplinary Case Opened', 'A disciplinary case has been opened against your record: "Auto-Test Case — Safe to Ignore". Please check your student portal.', 'warning', false, '2026-05-03 01:26:52.202917');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (59, 35, 'Disciplinary Case Update', 'Your disciplinary case is now under review.', 'warning', false, '2026-05-03 01:26:52.221405');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (60, 35, 'Disciplinary Case Update', 'Your disciplinary case has been resolved.', 'success', false, '2026-05-03 01:26:52.237956');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (21, 1, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', true, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (61, 10, 'Welfare Case Assigned to You', 'A welfare case has been assigned to you for review. Please log in to the counsellor portal to review.', 'info', false, '2026-05-03 01:26:52.272398');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (62, 29, 'Welfare Case Assigned', 'Your welfare case has been assigned to a counsellor. They will reach out to you shortly.', 'info', false, '2026-05-03 01:26:52.275888');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (63, 29, 'Welfare Case Update', 'Your welfare case is now in progress. A counsellor is actively working on your case.', 'info', false, '2026-05-03 01:26:52.290852');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (64, 29, 'Response on Your Welfare Case', 'A counsellor has added a response to your welfare case. Log in to view the update.', 'info', false, '2026-05-03 01:26:52.30473');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (66, 2, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (67, 3, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (68, 4, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (69, 5, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (70, 6, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (71, 7, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (72, 8, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (73, 9, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (74, 10, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (75, 11, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (76, 12, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (77, 13, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (78, 14, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (79, 15, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (80, 16, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (81, 17, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (83, 19, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (84, 20, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (85, 21, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (86, 22, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (87, 23, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (88, 24, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (89, 25, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (90, 26, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (91, 27, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (92, 28, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (93, 29, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (94, 30, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (95, 31, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (96, 32, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (97, 33, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (98, 34, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (99, 35, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (100, 36, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (101, 37, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (102, 2, 'New Welfare Request Submitted', 'A new welfare case has been submitted. Please review and assign in the welfare panel.', 'warning', false, '2026-05-03 01:31:00.706452');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (103, 3, 'New Welfare Request Submitted', 'A new welfare case has been submitted. Please review and assign in the welfare panel.', 'warning', false, '2026-05-03 01:31:00.709985');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (105, 2, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (106, 3, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (107, 4, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (108, 5, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (109, 6, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (110, 7, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (111, 8, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (112, 9, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (113, 10, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (114, 11, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (115, 12, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (116, 13, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (117, 14, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (118, 15, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (119, 16, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (120, 17, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (65, 1, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', true, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (104, 1, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', true, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (122, 19, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (123, 20, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (124, 21, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (125, 22, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (126, 23, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (127, 24, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (128, 25, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (129, 26, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (130, 27, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (131, 28, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (132, 29, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (133, 30, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (134, 31, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (135, 32, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (136, 33, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (137, 34, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (138, 35, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (139, 36, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (140, 37, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (141, 35, 'Disciplinary Case Opened', 'A disciplinary case has been opened against your record: "Auto-Test Case — Safe to Ignore". Please check your student portal.', 'warning', false, '2026-05-03 01:31:01.020235');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (142, 35, 'Disciplinary Case Update', 'Your disciplinary case is now under review.', 'warning', false, '2026-05-03 01:31:01.035199');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (143, 35, 'Disciplinary Sanction Applied', 'A formal warning has been issued against your record for case: "Auto-Test Case — Safe to Ignore".', 'warning', false, '2026-05-03 01:31:01.053322');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (144, 35, 'Disciplinary Case Update', 'Your disciplinary case has been resolved.', 'success', false, '2026-05-03 01:31:01.069384');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (145, 10, 'Welfare Case Assigned to You', 'A welfare case has been assigned to you for review. Please log in to the counsellor portal to review.', 'info', false, '2026-05-03 01:31:01.107469');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (1, 18, 'Course Registration Open', '2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.', 'enrollment', true, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (2, 18, 'Results Published', 'Your 2024/2025 First Semester results are now available. Log in to view your performance.', 'result', true, '2026-05-03 00:51:40.141309');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (38, 18, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', true, '2026-05-03 01:26:52.086981');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (150, 2, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (151, 3, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (152, 4, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (153, 5, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (154, 6, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (155, 7, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (156, 8, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (157, 9, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (158, 10, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (159, 11, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (160, 12, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (161, 13, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (162, 14, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (163, 15, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (164, 16, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (165, 17, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (167, 19, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (168, 20, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (169, 21, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (170, 22, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (171, 23, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (172, 24, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (173, 25, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (174, 26, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (175, 27, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (149, 1, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', true, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (82, 18, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', true, '2026-05-03 01:26:52.466778');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (176, 28, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (177, 29, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (178, 30, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (179, 31, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (180, 32, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (181, 33, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (182, 34, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (183, 35, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (184, 36, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (185, 37, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (186, 2, 'New Welfare Request Submitted', 'A new welfare case has been submitted. Please review and assign in the welfare panel.', 'warning', false, '2026-05-03 01:32:05.55343');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (187, 3, 'New Welfare Request Submitted', 'A new welfare case has been submitted. Please review and assign in the welfare panel.', 'warning', false, '2026-05-03 01:32:05.556095');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (189, 2, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (190, 3, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (191, 4, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (192, 5, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (193, 6, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (194, 7, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (195, 8, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (196, 9, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (197, 10, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (198, 11, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (199, 12, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (200, 13, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (201, 14, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (202, 15, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (203, 16, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (204, 17, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (206, 19, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (207, 20, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (208, 21, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (209, 22, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (210, 23, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (211, 24, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (212, 25, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (213, 26, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (214, 27, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (215, 28, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (216, 29, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (217, 30, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (218, 31, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (219, 32, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (220, 33, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (221, 34, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (222, 35, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (223, 36, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (224, 37, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (228, 2, 'Disciplinary Appeal Submitted', 'A student has submitted an appeal for Case #8. Please review in the disciplinary panel.', 'warning', false, '2026-05-03 01:32:05.917911');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (229, 3, 'Disciplinary Appeal Submitted', 'A student has submitted an appeal for Case #8. Please review in the disciplinary panel.', 'warning', false, '2026-05-03 01:32:05.921564');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (232, 10, 'Welfare Case Assigned to You', 'A welfare case has been assigned to you for review. Please log in to the counsellor portal to review.', 'info', false, '2026-05-03 01:32:05.995483');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (121, 18, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', true, '2026-05-03 01:31:00.903676');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (146, 18, 'Welfare Case Assigned', 'Your welfare case has been assigned to a counsellor. They will reach out to you shortly.', 'info', true, '2026-05-03 01:31:01.111738');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (147, 18, 'Welfare Case Update', 'Your welfare case is now in progress. A counsellor is actively working on your case.', 'info', true, '2026-05-03 01:31:01.124625');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (188, 1, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', true, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (237, 2, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (238, 3, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (239, 4, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (240, 5, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (241, 6, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (242, 7, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (243, 8, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (244, 9, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (245, 10, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (246, 11, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (247, 12, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (248, 13, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (249, 14, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (250, 15, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (251, 16, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (252, 17, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (254, 19, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (255, 20, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (256, 21, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (257, 22, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (258, 23, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (259, 24, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (260, 25, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (261, 26, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (262, 27, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (263, 28, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (264, 29, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (265, 30, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (266, 31, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (267, 32, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (268, 33, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (269, 34, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (270, 35, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (271, 36, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (272, 37, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (273, 2, 'New Welfare Request Submitted', 'A new welfare case has been submitted. Please review and assign in the welfare panel.', 'warning', false, '2026-05-03 01:32:17.073684');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (274, 3, 'New Welfare Request Submitted', 'A new welfare case has been submitted. Please review and assign in the welfare panel.', 'warning', false, '2026-05-03 01:32:17.076517');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (276, 2, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (277, 3, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (278, 4, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (279, 5, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (280, 6, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (281, 7, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (282, 8, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (283, 9, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (284, 10, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (285, 11, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (286, 12, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (287, 13, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (236, 1, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', true, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (275, 1, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', true, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (288, 14, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (289, 15, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (290, 16, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (291, 17, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (293, 19, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (294, 20, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (295, 21, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (296, 22, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (297, 23, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (298, 24, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (299, 25, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (300, 26, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (301, 27, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (302, 28, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (303, 29, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (304, 30, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (305, 31, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (306, 32, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (307, 33, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (308, 34, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (309, 35, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (310, 36, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (311, 37, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', false, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (315, 2, 'Disciplinary Appeal Submitted', 'A student has submitted an appeal for Case #9. Please review in the disciplinary panel.', 'warning', false, '2026-05-03 01:32:17.439518');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (316, 3, 'Disciplinary Appeal Submitted', 'A student has submitted an appeal for Case #9. Please review in the disciplinary panel.', 'warning', false, '2026-05-03 01:32:17.442014');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (320, 10, 'Welfare Case Assigned to You', 'A welfare case has been assigned to you for review. Please log in to the counsellor portal to review.', 'info', false, '2026-05-03 01:32:17.535231');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (148, 18, 'Response on Your Welfare Case', 'A counsellor has added a response to your welfare case. Log in to view the update.', 'info', true, '2026-05-03 01:31:01.138371');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (166, 18, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', true, '2026-05-03 01:31:01.221008');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (205, 18, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', true, '2026-05-03 01:32:05.758427');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (225, 18, 'Disciplinary Case Opened', 'A disciplinary case has been opened against your record: "Auto-Test Case — Safe to Ignore". Please check your student portal.', 'warning', true, '2026-05-03 01:32:05.869867');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (226, 18, 'Disciplinary Case Update', 'Your disciplinary case is now under review.', 'warning', true, '2026-05-03 01:32:05.88739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (227, 18, 'Disciplinary Sanction Applied', 'A formal warning has been issued against your record for case: "Auto-Test Case — Safe to Ignore".', 'warning', true, '2026-05-03 01:32:05.901781');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (230, 18, 'Appeal Under Review', 'Your appeal for Case #8 is now being reviewed by the administration.', 'info', true, '2026-05-03 01:32:05.943064');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (231, 18, 'Disciplinary Case Update', 'Your disciplinary case has been resolved.', 'success', true, '2026-05-03 01:32:05.95651');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (233, 18, 'Welfare Case Assigned', 'Your welfare case has been assigned to a counsellor. They will reach out to you shortly.', 'info', true, '2026-05-03 01:32:05.998654');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (234, 18, 'Welfare Case Update', 'Your welfare case is now in progress. A counsellor is actively working on your case.', 'info', true, '2026-05-03 01:32:06.00895');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (235, 18, 'Response on Your Welfare Case', 'A counsellor has added a response to your welfare case. Log in to view the update.', 'info', true, '2026-05-03 01:32:06.02013');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (253, 18, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', true, '2026-05-03 01:32:06.115669');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (292, 18, 'Auto-Test Notification', 'System test broadcast — safe to ignore', 'info', true, '2026-05-03 01:32:17.270702');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (312, 18, 'Disciplinary Case Opened', 'A disciplinary case has been opened against your record: "Auto-Test Case — Safe to Ignore". Please check your student portal.', 'warning', true, '2026-05-03 01:32:17.391786');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (313, 18, 'Disciplinary Case Update', 'Your disciplinary case is now under review.', 'warning', true, '2026-05-03 01:32:17.409389');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (314, 18, 'Disciplinary Sanction Applied', 'A formal warning has been issued against your record for case: "Auto-Test Case — Safe to Ignore".', 'warning', true, '2026-05-03 01:32:17.424704');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (317, 18, 'Appeal Under Review', 'Your appeal for Case #9 is now being reviewed by the administration.', 'info', true, '2026-05-03 01:32:17.46332');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (318, 18, 'Appeal Decision: Accepted', 'Your appeal for Case #9 has been accepted. The case has been dismissed and all restrictions lifted.', 'success', true, '2026-05-03 01:32:17.48407');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (319, 18, 'Disciplinary Case Update', 'Your disciplinary case has been resolved.', 'success', true, '2026-05-03 01:32:17.500725');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (321, 18, 'Welfare Case Assigned', 'Your welfare case has been assigned to a counsellor. They will reach out to you shortly.', 'info', true, '2026-05-03 01:32:17.538305');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (322, 18, 'Welfare Case Update', 'Your welfare case is now in progress. A counsellor is actively working on your case.', 'info', true, '2026-05-03 01:32:17.551038');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (323, 18, 'Response on Your Welfare Case', 'A counsellor has added a response to your welfare case. Log in to view the update.', 'info', true, '2026-05-03 01:32:17.564394');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (325, 2, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (326, 3, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (327, 4, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (328, 5, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (329, 6, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (330, 7, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (331, 8, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (332, 9, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (333, 10, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (334, 11, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (335, 12, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (336, 13, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (337, 14, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (338, 15, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (339, 16, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (340, 17, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (341, 18, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (342, 19, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (343, 20, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (344, 21, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (345, 22, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (346, 23, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (347, 24, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (348, 25, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (349, 26, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (350, 27, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (351, 28, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (352, 29, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (353, 30, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (354, 31, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (355, 32, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (356, 33, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (357, 34, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (358, 35, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (359, 36, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (360, 37, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', false, '2026-05-03 01:32:17.651739');
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at) VALUES (324, 1, 'Test Notification Delivery', 'Verifying notification delivery pipeline', 'info', true, '2026-05-03 01:32:17.651739');


ALTER TABLE public.notifications ENABLE TRIGGER ALL;

--
-- Data for Name: results; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.results DISABLE TRIGGER ALL;

INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (1, 1, 1, 'first', '2022/2023', 30, 47, 77, 'A', 5, '2026-05-03 00:51:37.930225', '2026-05-03 00:51:37.930225', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (2, 1, 25, 'first', '2022/2023', 31, 50, 81, 'A', 5, '2026-05-03 00:51:37.938905', '2026-05-03 00:51:37.938905', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (3, 1, 2, 'second', '2022/2023', 32, 46, 78, 'A', 5, '2026-05-03 00:51:37.946377', '2026-05-03 00:51:37.946377', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (4, 1, 26, 'second', '2022/2023', 33, 49, 82, 'A', 5, '2026-05-03 00:51:37.95365', '2026-05-03 00:51:37.95365', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (5, 1, 3, 'first', '2023/2024', 34, 52, 86, 'A', 5, '2026-05-03 00:51:37.9609', '2026-05-03 00:51:37.9609', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (6, 1, 27, 'first', '2023/2024', 35, 48, 83, 'A', 5, '2026-05-03 00:51:37.968019', '2026-05-03 00:51:37.968019', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (7, 1, 4, 'second', '2023/2024', 30, 51, 81, 'A', 5, '2026-05-03 00:51:37.974985', '2026-05-03 00:51:37.974985', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (8, 1, 28, 'second', '2023/2024', 31, 47, 78, 'A', 5, '2026-05-03 00:51:37.982113', '2026-05-03 00:51:37.982113', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (9, 1, 5, 'first', '2024/2025', 32, 50, 82, 'A', 5, '2026-05-03 00:51:37.989856', '2026-05-03 00:51:37.989856', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (10, 1, 29, 'first', '2024/2025', 33, 46, 79, 'A', 5, '2026-05-03 00:51:37.996837', '2026-05-03 00:51:37.996837', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (11, 2, 1, 'first', '2023/2024', 36, 55, 91, 'A', 5, '2026-05-03 00:51:38.011514', '2026-05-03 00:51:38.011514', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (12, 2, 25, 'first', '2023/2024', 37, 58, 95, 'A', 5, '2026-05-03 00:51:38.018784', '2026-05-03 00:51:38.018784', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (13, 2, 2, 'second', '2023/2024', 38, 54, 92, 'A', 5, '2026-05-03 00:51:38.025895', '2026-05-03 00:51:38.025895', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (14, 2, 26, 'second', '2023/2024', 39, 57, 96, 'A', 5, '2026-05-03 00:51:38.032892', '2026-05-03 00:51:38.032892', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (15, 2, 3, 'first', '2024/2025', 40, 60, 100, 'A', 5, '2026-05-03 00:51:38.040949', '2026-05-03 00:51:38.040949', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (16, 2, 27, 'first', '2024/2025', 36, 56, 92, 'A', 5, '2026-05-03 00:51:38.049004', '2026-05-03 00:51:38.049004', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (17, 3, 1, 'first', '2024/2025', 30, 47, 77, 'A', 5, '2026-05-03 00:51:38.058844', '2026-05-03 00:51:38.058844', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (18, 3, 25, 'first', '2024/2025', 31, 50, 81, 'A', 5, '2026-05-03 00:51:38.065905', '2026-05-03 00:51:38.065905', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (19, 4, 1, 'first', '2022/2023', 16, 29, 45, 'D', 2, '2026-05-03 00:51:38.076628', '2026-05-03 00:51:38.076628', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (20, 4, 25, 'first', '2022/2023', 17, 32, 49, 'D', 2, '2026-05-03 00:51:38.082454', '2026-05-03 00:51:38.082454', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (21, 4, 2, 'second', '2022/2023', 18, 29, 47, 'D', 2, '2026-05-03 00:51:38.088913', '2026-05-03 00:51:38.088913', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (22, 4, 26, 'second', '2022/2023', 19, 32, 51, 'C', 3, '2026-05-03 00:51:38.095053', '2026-05-03 00:51:38.095053', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (23, 4, 3, 'first', '2023/2024', 11, 16, 27, 'F', 0, '2026-05-03 00:51:38.101951', '2026-05-03 00:51:38.101951', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (24, 4, 27, 'first', '2023/2024', 21, 32, 53, 'C', 3, '2026-05-03 00:51:38.108999', '2026-05-03 00:51:38.108999', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (25, 4, 4, 'second', '2023/2024', 16, 29, 45, 'D', 2, '2026-05-03 00:51:38.115085', '2026-05-03 00:51:38.115085', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (26, 4, 28, 'second', '2023/2024', 17, 32, 49, 'D', 2, '2026-05-03 00:51:38.121185', '2026-05-03 00:51:38.121185', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (27, 4, 5, 'first', '2024/2025', 18, 29, 47, 'D', 2, '2026-05-03 00:51:38.127022', '2026-05-03 00:51:38.127022', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (28, 4, 29, 'first', '2024/2025', 19, 32, 51, 'C', 3, '2026-05-03 00:51:38.134003', '2026-05-03 00:51:38.134003', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (29, 4, 3, 'first', '2024/2025', 28, 38, 66, 'B', 4, '2026-05-03 00:51:38.139719', '2026-05-03 00:51:38.139719', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (30, 5, 1, 'first', '2021/2022', 36, 55, 91, 'A', 5, '2026-05-03 00:51:38.148561', '2026-05-03 00:51:38.148561', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (31, 5, 25, 'first', '2021/2022', 37, 58, 95, 'A', 5, '2026-05-03 00:51:38.154774', '2026-05-03 00:51:38.154774', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (32, 5, 2, 'second', '2021/2022', 38, 54, 92, 'A', 5, '2026-05-03 00:51:38.160677', '2026-05-03 00:51:38.160677', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (33, 5, 26, 'second', '2021/2022', 39, 57, 96, 'A', 5, '2026-05-03 00:51:38.167173', '2026-05-03 00:51:38.167173', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (34, 5, 3, 'first', '2022/2023', 40, 60, 100, 'A', 5, '2026-05-03 00:51:38.173802', '2026-05-03 00:51:38.173802', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (35, 5, 27, 'first', '2022/2023', 36, 56, 92, 'A', 5, '2026-05-03 00:51:38.181027', '2026-05-03 00:51:38.181027', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (36, 5, 4, 'second', '2022/2023', 37, 59, 96, 'A', 5, '2026-05-03 00:51:38.186916', '2026-05-03 00:51:38.186916', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (37, 5, 28, 'second', '2022/2023', 38, 55, 93, 'A', 5, '2026-05-03 00:51:38.193786', '2026-05-03 00:51:38.193786', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (38, 5, 5, 'first', '2023/2024', 39, 58, 97, 'A', 5, '2026-05-03 00:51:38.200523', '2026-05-03 00:51:38.200523', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (39, 5, 29, 'first', '2023/2024', 40, 54, 94, 'A', 5, '2026-05-03 00:51:38.20687', '2026-05-03 00:51:38.20687', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (40, 5, 6, 'second', '2023/2024', 36, 57, 93, 'A', 5, '2026-05-03 00:51:38.212664', '2026-05-03 00:51:38.212664', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (41, 5, 30, 'second', '2023/2024', 37, 60, 97, 'A', 5, '2026-05-03 00:51:38.218499', '2026-05-03 00:51:38.218499', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (42, 5, 7, 'first', '2024/2025', 38, 56, 94, 'A', 5, '2026-05-03 00:51:38.224703', '2026-05-03 00:51:38.224703', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (43, 5, 31, 'first', '2024/2025', 39, 59, 98, 'A', 5, '2026-05-03 00:51:38.230351', '2026-05-03 00:51:38.230351', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (44, 5, 8, 'second', '2024/2025', 40, 55, 95, 'A', 5, '2026-05-03 00:51:38.236524', '2026-05-03 00:51:38.236524', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (45, 5, 32, 'second', '2024/2025', 36, 58, 94, 'A', 5, '2026-05-03 00:51:38.242746', '2026-05-03 00:51:38.242746', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (46, 6, 1, 'first', '2023/2024', 24, 38, 62, 'B', 4, '2026-05-03 00:51:38.254287', '2026-05-03 00:51:38.254287', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (47, 6, 25, 'first', '2023/2024', 25, 41, 66, 'B', 4, '2026-05-03 00:51:38.260929', '2026-05-03 00:51:38.260929', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (48, 6, 2, 'second', '2023/2024', 26, 38, 64, 'B', 4, '2026-05-03 00:51:38.267415', '2026-05-03 00:51:38.267415', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (49, 6, 26, 'second', '2023/2024', 27, 41, 68, 'B', 4, '2026-05-03 00:51:38.273881', '2026-05-03 00:51:38.273881', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (50, 6, 3, 'first', '2024/2025', 28, 38, 66, 'B', 4, '2026-05-03 00:51:38.280663', '2026-05-03 00:51:38.280663', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (51, 6, 27, 'first', '2024/2025', 29, 41, 70, 'A', 5, '2026-05-03 00:51:38.286776', '2026-05-03 00:51:38.286776', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (52, 7, 1, 'first', '2021/2022', 7, 16, 23, 'F', 0, '2026-05-03 00:51:38.296402', '2026-05-03 00:51:38.296402', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (53, 7, 25, 'first', '2021/2022', 8, 19, 27, 'F', 0, '2026-05-03 00:51:38.3023', '2026-05-03 00:51:38.3023', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (54, 7, 2, 'second', '2021/2022', 9, 16, 25, 'F', 0, '2026-05-03 00:51:38.308533', '2026-05-03 00:51:38.308533', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (55, 7, 26, 'second', '2021/2022', 10, 19, 29, 'F', 0, '2026-05-03 00:51:38.314045', '2026-05-03 00:51:38.314045', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (56, 7, 3, 'first', '2022/2023', 11, 16, 27, 'F', 0, '2026-05-03 00:51:38.320294', '2026-05-03 00:51:38.320294', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (57, 7, 27, 'first', '2022/2023', 12, 19, 31, 'F', 0, '2026-05-03 00:51:38.326548', '2026-05-03 00:51:38.326548', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (58, 7, 4, 'second', '2022/2023', 7, 16, 23, 'F', 0, '2026-05-03 00:51:38.332354', '2026-05-03 00:51:38.332354', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (59, 7, 28, 'second', '2022/2023', 8, 19, 27, 'F', 0, '2026-05-03 00:51:38.342188', '2026-05-03 00:51:38.342188', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (60, 7, 5, 'first', '2023/2024', 9, 16, 25, 'F', 0, '2026-05-03 00:51:38.349351', '2026-05-03 00:51:38.349351', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (61, 7, 29, 'first', '2023/2024', 10, 19, 29, 'F', 0, '2026-05-03 00:51:38.355788', '2026-05-03 00:51:38.355788', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (62, 7, 3, 'first', '2023/2024', 11, 16, 27, 'F', 0, '2026-05-03 00:51:38.362073', '2026-05-03 00:51:38.362073', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (63, 7, 6, 'second', '2023/2024', 12, 19, 31, 'F', 0, '2026-05-03 00:51:38.368012', '2026-05-03 00:51:38.368012', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (64, 7, 30, 'second', '2023/2024', 7, 16, 23, 'F', 0, '2026-05-03 00:51:38.374325', '2026-05-03 00:51:38.374325', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (65, 7, 4, 'second', '2023/2024', 8, 19, 27, 'F', 0, '2026-05-03 00:51:38.380134', '2026-05-03 00:51:38.380134', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (66, 7, 7, 'first', '2024/2025', 9, 16, 25, 'F', 0, '2026-05-03 00:51:38.386303', '2026-05-03 00:51:38.386303', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (67, 7, 31, 'first', '2024/2025', 10, 19, 29, 'F', 0, '2026-05-03 00:51:38.393532', '2026-05-03 00:51:38.393532', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (68, 7, 5, 'first', '2024/2025', 11, 16, 27, 'F', 0, '2026-05-03 00:51:38.400028', '2026-05-03 00:51:38.400028', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (69, 8, 9, 'first', '2022/2023', 30, 47, 77, 'A', 5, '2026-05-03 00:51:38.408843', '2026-05-03 00:51:38.408843', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (70, 8, 25, 'first', '2022/2023', 31, 50, 81, 'A', 5, '2026-05-03 00:51:38.414528', '2026-05-03 00:51:38.414528', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (71, 8, 10, 'second', '2022/2023', 32, 46, 78, 'A', 5, '2026-05-03 00:51:38.514508', '2026-05-03 00:51:38.514508', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (72, 8, 26, 'second', '2022/2023', 33, 49, 82, 'A', 5, '2026-05-03 00:51:38.523041', '2026-05-03 00:51:38.523041', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (73, 8, 11, 'first', '2023/2024', 34, 52, 86, 'A', 5, '2026-05-03 00:51:38.528711', '2026-05-03 00:51:38.528711', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (74, 8, 27, 'first', '2023/2024', 35, 48, 83, 'A', 5, '2026-05-03 00:51:38.535271', '2026-05-03 00:51:38.535271', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (75, 8, 12, 'second', '2023/2024', 30, 51, 81, 'A', 5, '2026-05-03 00:51:38.54215', '2026-05-03 00:51:38.54215', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (76, 8, 28, 'second', '2023/2024', 31, 47, 78, 'A', 5, '2026-05-03 00:51:38.548775', '2026-05-03 00:51:38.548775', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (77, 8, 13, 'first', '2024/2025', 32, 50, 82, 'A', 5, '2026-05-03 00:51:38.555386', '2026-05-03 00:51:38.555386', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (78, 8, 29, 'first', '2024/2025', 33, 46, 79, 'A', 5, '2026-05-03 00:51:38.562428', '2026-05-03 00:51:38.562428', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (79, 9, 9, 'first', '2024/2025', 36, 55, 91, 'A', 5, '2026-05-03 00:51:38.571814', '2026-05-03 00:51:38.571814', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (80, 9, 25, 'first', '2024/2025', 37, 58, 95, 'A', 5, '2026-05-03 00:51:38.579455', '2026-05-03 00:51:38.579455', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (81, 10, 9, 'first', '2023/2024', 24, 38, 62, 'B', 4, '2026-05-03 00:51:38.589313', '2026-05-03 00:51:38.589313', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (82, 10, 25, 'first', '2023/2024', 25, 41, 66, 'B', 4, '2026-05-03 00:51:38.595514', '2026-05-03 00:51:38.595514', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (83, 10, 10, 'second', '2023/2024', 26, 38, 64, 'B', 4, '2026-05-03 00:51:38.601751', '2026-05-03 00:51:38.601751', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (84, 10, 26, 'second', '2023/2024', 27, 41, 68, 'B', 4, '2026-05-03 00:51:38.607467', '2026-05-03 00:51:38.607467', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (85, 10, 11, 'first', '2024/2025', 28, 38, 66, 'B', 4, '2026-05-03 00:51:38.613403', '2026-05-03 00:51:38.613403', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (86, 10, 27, 'first', '2024/2025', 29, 41, 70, 'A', 5, '2026-05-03 00:51:38.618868', '2026-05-03 00:51:38.618868', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (87, 11, 9, 'first', '2021/2022', 30, 47, 77, 'A', 5, '2026-05-03 00:51:38.628041', '2026-05-03 00:51:38.628041', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (88, 11, 25, 'first', '2021/2022', 31, 50, 81, 'A', 5, '2026-05-03 00:51:38.634637', '2026-05-03 00:51:38.634637', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (89, 11, 10, 'second', '2021/2022', 32, 46, 78, 'A', 5, '2026-05-03 00:51:38.641044', '2026-05-03 00:51:38.641044', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (90, 11, 26, 'second', '2021/2022', 33, 49, 82, 'A', 5, '2026-05-03 00:51:38.64656', '2026-05-03 00:51:38.64656', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (91, 11, 11, 'first', '2022/2023', 34, 52, 86, 'A', 5, '2026-05-03 00:51:38.652588', '2026-05-03 00:51:38.652588', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (92, 11, 27, 'first', '2022/2023', 35, 48, 83, 'A', 5, '2026-05-03 00:51:38.659064', '2026-05-03 00:51:38.659064', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (93, 11, 12, 'second', '2022/2023', 30, 51, 81, 'A', 5, '2026-05-03 00:51:38.665238', '2026-05-03 00:51:38.665238', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (94, 11, 28, 'second', '2022/2023', 31, 47, 78, 'A', 5, '2026-05-03 00:51:38.671444', '2026-05-03 00:51:38.671444', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (95, 11, 13, 'first', '2023/2024', 32, 50, 82, 'A', 5, '2026-05-03 00:51:38.677465', '2026-05-03 00:51:38.677465', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (96, 11, 29, 'first', '2023/2024', 33, 46, 79, 'A', 5, '2026-05-03 00:51:38.684019', '2026-05-03 00:51:38.684019', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (97, 11, 14, 'second', '2023/2024', 34, 49, 83, 'A', 5, '2026-05-03 00:51:38.690148', '2026-05-03 00:51:38.690148', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (98, 11, 30, 'second', '2023/2024', 35, 52, 87, 'A', 5, '2026-05-03 00:51:38.695305', '2026-05-03 00:51:38.695305', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (99, 11, 15, 'first', '2024/2025', 30, 48, 78, 'A', 5, '2026-05-03 00:51:38.701104', '2026-05-03 00:51:38.701104', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (100, 11, 31, 'first', '2024/2025', 31, 51, 82, 'A', 5, '2026-05-03 00:51:38.708086', '2026-05-03 00:51:38.708086', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (101, 11, 16, 'second', '2024/2025', 32, 47, 79, 'A', 5, '2026-05-03 00:51:38.713503', '2026-05-03 00:51:38.713503', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (102, 11, 32, 'second', '2024/2025', 33, 50, 83, 'A', 5, '2026-05-03 00:51:38.720606', '2026-05-03 00:51:38.720606', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (103, 12, 9, 'first', '2022/2023', 16, 29, 45, 'D', 2, '2026-05-03 00:51:38.730465', '2026-05-03 00:51:38.730465', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (104, 12, 25, 'first', '2022/2023', 17, 32, 49, 'D', 2, '2026-05-03 00:51:38.736717', '2026-05-03 00:51:38.736717', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (105, 12, 10, 'second', '2022/2023', 18, 29, 47, 'D', 2, '2026-05-03 00:51:38.742442', '2026-05-03 00:51:38.742442', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (106, 12, 26, 'second', '2022/2023', 19, 32, 51, 'C', 3, '2026-05-03 00:51:38.749935', '2026-05-03 00:51:38.749935', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (107, 12, 11, 'first', '2023/2024', 20, 29, 49, 'D', 2, '2026-05-03 00:51:38.757112', '2026-05-03 00:51:38.757112', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (108, 12, 27, 'first', '2023/2024', 21, 32, 53, 'C', 3, '2026-05-03 00:51:38.764788', '2026-05-03 00:51:38.764788', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (109, 12, 12, 'second', '2023/2024', 16, 29, 45, 'D', 2, '2026-05-03 00:51:38.771228', '2026-05-03 00:51:38.771228', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (110, 12, 28, 'second', '2023/2024', 17, 32, 49, 'D', 2, '2026-05-03 00:51:38.77794', '2026-05-03 00:51:38.77794', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (111, 12, 13, 'first', '2024/2025', 18, 29, 47, 'D', 2, '2026-05-03 00:51:38.783964', '2026-05-03 00:51:38.783964', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (112, 12, 29, 'first', '2024/2025', 19, 32, 51, 'C', 3, '2026-05-03 00:51:38.78968', '2026-05-03 00:51:38.78968', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (113, 13, 9, 'first', '2023/2024', 24, 38, 62, 'B', 4, '2026-05-03 00:51:38.798791', '2026-05-03 00:51:38.798791', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (114, 13, 25, 'first', '2023/2024', 25, 41, 66, 'B', 4, '2026-05-03 00:51:38.804902', '2026-05-03 00:51:38.804902', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (115, 13, 10, 'second', '2023/2024', 26, 38, 64, 'B', 4, '2026-05-03 00:51:38.811118', '2026-05-03 00:51:38.811118', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (116, 13, 26, 'second', '2023/2024', 27, 41, 68, 'B', 4, '2026-05-03 00:51:38.817519', '2026-05-03 00:51:38.817519', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (117, 13, 11, 'first', '2024/2025', 28, 38, 66, 'B', 4, '2026-05-03 00:51:38.823335', '2026-05-03 00:51:38.823335', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (118, 13, 27, 'first', '2024/2025', 29, 41, 70, 'A', 5, '2026-05-03 00:51:38.829718', '2026-05-03 00:51:38.829718', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (119, 14, 9, 'first', '2024/2025', 30, 47, 77, 'A', 5, '2026-05-03 00:51:38.838667', '2026-05-03 00:51:38.838667', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (120, 14, 25, 'first', '2024/2025', 31, 50, 81, 'A', 5, '2026-05-03 00:51:38.843964', '2026-05-03 00:51:38.843964', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (121, 15, 17, 'first', '2022/2023', 36, 55, 91, 'A', 5, '2026-05-03 00:51:38.852253', '2026-05-03 00:51:38.852253', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (122, 15, 25, 'first', '2022/2023', 37, 58, 95, 'A', 5, '2026-05-03 00:51:38.858357', '2026-05-03 00:51:38.858357', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (123, 15, 18, 'second', '2022/2023', 38, 54, 92, 'A', 5, '2026-05-03 00:51:38.863629', '2026-05-03 00:51:38.863629', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (124, 15, 26, 'second', '2022/2023', 39, 57, 96, 'A', 5, '2026-05-03 00:51:38.868967', '2026-05-03 00:51:38.868967', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (125, 15, 19, 'first', '2023/2024', 40, 60, 100, 'A', 5, '2026-05-03 00:51:38.874728', '2026-05-03 00:51:38.874728', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (126, 15, 27, 'first', '2023/2024', 36, 56, 92, 'A', 5, '2026-05-03 00:51:38.880559', '2026-05-03 00:51:38.880559', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (127, 15, 20, 'second', '2023/2024', 37, 59, 96, 'A', 5, '2026-05-03 00:51:38.886807', '2026-05-03 00:51:38.886807', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (128, 15, 28, 'second', '2023/2024', 38, 55, 93, 'A', 5, '2026-05-03 00:51:38.892387', '2026-05-03 00:51:38.892387', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (129, 15, 21, 'first', '2024/2025', 39, 58, 97, 'A', 5, '2026-05-03 00:51:38.898245', '2026-05-03 00:51:38.898245', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (130, 15, 29, 'first', '2024/2025', 40, 54, 94, 'A', 5, '2026-05-03 00:51:38.903416', '2026-05-03 00:51:38.903416', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (131, 16, 17, 'first', '2023/2024', 24, 38, 62, 'B', 4, '2026-05-03 00:51:38.916306', '2026-05-03 00:51:38.916306', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (132, 16, 25, 'first', '2023/2024', 25, 41, 66, 'B', 4, '2026-05-03 00:51:38.923556', '2026-05-03 00:51:38.923556', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (133, 16, 18, 'second', '2023/2024', 26, 38, 64, 'B', 4, '2026-05-03 00:51:38.930529', '2026-05-03 00:51:38.930529', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (134, 16, 26, 'second', '2023/2024', 27, 41, 68, 'B', 4, '2026-05-03 00:51:38.937361', '2026-05-03 00:51:38.937361', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (135, 16, 19, 'first', '2024/2025', 28, 38, 66, 'B', 4, '2026-05-03 00:51:38.943612', '2026-05-03 00:51:38.943612', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (136, 16, 27, 'first', '2024/2025', 29, 41, 70, 'A', 5, '2026-05-03 00:51:38.949509', '2026-05-03 00:51:38.949509', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (137, 17, 17, 'first', '2021/2022', 24, 38, 62, 'B', 4, '2026-05-03 00:51:38.95884', '2026-05-03 00:51:38.95884', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (138, 17, 25, 'first', '2021/2022', 25, 41, 66, 'B', 4, '2026-05-03 00:51:38.965123', '2026-05-03 00:51:38.965123', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (139, 17, 18, 'second', '2021/2022', 26, 38, 64, 'B', 4, '2026-05-03 00:51:38.97148', '2026-05-03 00:51:38.97148', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (140, 17, 26, 'second', '2021/2022', 27, 41, 68, 'B', 4, '2026-05-03 00:51:38.977686', '2026-05-03 00:51:38.977686', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (141, 17, 19, 'first', '2022/2023', 28, 38, 66, 'B', 4, '2026-05-03 00:51:38.983712', '2026-05-03 00:51:38.983712', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (142, 17, 27, 'first', '2022/2023', 29, 41, 70, 'A', 5, '2026-05-03 00:51:38.989516', '2026-05-03 00:51:38.989516', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (143, 17, 20, 'second', '2022/2023', 24, 38, 62, 'B', 4, '2026-05-03 00:51:38.995548', '2026-05-03 00:51:38.995548', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (144, 17, 28, 'second', '2022/2023', 25, 41, 66, 'B', 4, '2026-05-03 00:51:39.001149', '2026-05-03 00:51:39.001149', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (145, 17, 21, 'first', '2023/2024', 26, 38, 64, 'B', 4, '2026-05-03 00:51:39.007331', '2026-05-03 00:51:39.007331', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (146, 17, 29, 'first', '2023/2024', 27, 41, 68, 'B', 4, '2026-05-03 00:51:39.013067', '2026-05-03 00:51:39.013067', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (147, 17, 22, 'second', '2023/2024', 28, 38, 66, 'B', 4, '2026-05-03 00:51:39.019461', '2026-05-03 00:51:39.019461', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (148, 17, 30, 'second', '2023/2024', 29, 41, 70, 'A', 5, '2026-05-03 00:51:39.025924', '2026-05-03 00:51:39.025924', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (149, 17, 23, 'first', '2024/2025', 24, 38, 62, 'B', 4, '2026-05-03 00:51:39.031625', '2026-05-03 00:51:39.031625', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (150, 17, 31, 'first', '2024/2025', 25, 41, 66, 'B', 4, '2026-05-03 00:51:39.037384', '2026-05-03 00:51:39.037384', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (151, 17, 24, 'second', '2024/2025', 26, 38, 64, 'B', 4, '2026-05-03 00:51:39.043279', '2026-05-03 00:51:39.043279', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (152, 17, 32, 'second', '2024/2025', 27, 41, 68, 'B', 4, '2026-05-03 00:51:39.048679', '2026-05-03 00:51:39.048679', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (153, 18, 17, 'first', '2024/2025', 16, 29, 45, 'D', 2, '2026-05-03 00:51:39.057492', '2026-05-03 00:51:39.057492', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (154, 18, 25, 'first', '2024/2025', 17, 32, 49, 'D', 2, '2026-05-03 00:51:39.063857', '2026-05-03 00:51:39.063857', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (155, 19, 17, 'first', '2023/2024', 30, 47, 77, 'A', 5, '2026-05-03 00:51:39.072649', '2026-05-03 00:51:39.072649', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (156, 19, 25, 'first', '2023/2024', 31, 50, 81, 'A', 5, '2026-05-03 00:51:39.078111', '2026-05-03 00:51:39.078111', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (157, 19, 18, 'second', '2023/2024', 32, 46, 78, 'A', 5, '2026-05-03 00:51:39.083727', '2026-05-03 00:51:39.083727', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (158, 19, 26, 'second', '2023/2024', 33, 49, 82, 'A', 5, '2026-05-03 00:51:39.089201', '2026-05-03 00:51:39.089201', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (159, 19, 19, 'first', '2024/2025', 34, 52, 86, 'A', 5, '2026-05-03 00:51:39.095474', '2026-05-03 00:51:39.095474', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (160, 19, 27, 'first', '2024/2025', 35, 48, 83, 'A', 5, '2026-05-03 00:51:39.100873', '2026-05-03 00:51:39.100873', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (161, 20, 17, 'first', '2022/2023', 7, 16, 23, 'F', 0, '2026-05-03 00:51:39.109491', '2026-05-03 00:51:39.109491', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (162, 20, 25, 'first', '2022/2023', 8, 19, 27, 'F', 0, '2026-05-03 00:51:39.115023', '2026-05-03 00:51:39.115023', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (163, 20, 18, 'second', '2022/2023', 9, 16, 25, 'F', 0, '2026-05-03 00:51:39.120788', '2026-05-03 00:51:39.120788', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (164, 20, 26, 'second', '2022/2023', 10, 19, 29, 'F', 0, '2026-05-03 00:51:39.126258', '2026-05-03 00:51:39.126258', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (165, 20, 19, 'first', '2023/2024', 11, 16, 27, 'F', 0, '2026-05-03 00:51:39.131863', '2026-05-03 00:51:39.131863', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (166, 20, 27, 'first', '2023/2024', 12, 19, 31, 'F', 0, '2026-05-03 00:51:39.137695', '2026-05-03 00:51:39.137695', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (167, 20, 20, 'second', '2023/2024', 7, 16, 23, 'F', 0, '2026-05-03 00:51:39.143256', '2026-05-03 00:51:39.143256', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (168, 20, 28, 'second', '2023/2024', 8, 19, 27, 'F', 0, '2026-05-03 00:51:39.149519', '2026-05-03 00:51:39.149519', 'locked');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (169, 20, 21, 'first', '2024/2025', 9, 16, 25, 'F', 0, '2026-05-03 00:51:39.154853', '2026-05-03 00:51:39.154853', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (170, 20, 29, 'first', '2024/2025', 10, 19, 29, 'F', 0, '2026-05-03 00:51:39.160091', '2026-05-03 00:51:39.160091', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (171, 20, 19, 'first', '2024/2025', 11, 16, 27, 'F', 0, '2026-05-03 00:51:39.165705', '2026-05-03 00:51:39.165705', 'submitted');
INSERT INTO public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) VALUES (172, 18, 1, 'first', '2024/2025', 25, 55, 80, 'A', 5, '2026-05-03 01:26:51.855878', '2026-05-03 01:32:17.126', 'submitted');


ALTER TABLE public.results ENABLE TRIGGER ALL;

--
-- Data for Name: venues; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.venues DISABLE TRIGGER ALL;

INSERT INTO public.venues (id, name, capacity, location, created_at) VALUES (1, 'Lecture Hall 101', 120, 'Main Academic Block, Ground Floor', '2026-05-03 00:51:39.795731');
INSERT INTO public.venues (id, name, capacity, location, created_at) VALUES (2, 'Lecture Hall 102', 80, 'Main Academic Block, Ground Floor', '2026-05-03 00:51:39.795731');
INSERT INTO public.venues (id, name, capacity, location, created_at) VALUES (3, 'Lecture Hall 201', 100, 'Management Block, First Floor', '2026-05-03 00:51:39.795731');
INSERT INTO public.venues (id, name, capacity, location, created_at) VALUES (4, 'Lecture Hall 202', 60, 'Management Block, First Floor', '2026-05-03 00:51:39.795731');
INSERT INTO public.venues (id, name, capacity, location, created_at) VALUES (5, 'Lecture Hall 301', 80, 'Arts Block, Second Floor', '2026-05-03 00:51:39.795731');
INSERT INTO public.venues (id, name, capacity, location, created_at) VALUES (6, 'Computer Lab 1', 40, 'ICT Centre, Ground Floor', '2026-05-03 00:51:39.795731');
INSERT INTO public.venues (id, name, capacity, location, created_at) VALUES (7, 'Main Auditorium', 400, 'Student Union Building', '2026-05-03 00:51:39.795731');


ALTER TABLE public.venues ENABLE TRIGGER ALL;

--
-- Data for Name: timetables; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.timetables DISABLE TRIGGER ALL;

INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (1, 1, 1, 1, 'Monday', '08:00', '10:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (2, 3, 1, 1, 'Tuesday', '08:00', '10:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (3, 5, 1, 6, 'Wednesday', '08:00', '10:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (4, 7, 1, 6, 'Thursday', '08:00', '10:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (5, 9, 3, 3, 'Monday', '10:00', '12:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (6, 11, 3, 3, 'Tuesday', '10:00', '12:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (7, 13, 3, 3, 'Wednesday', '10:00', '12:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (8, 15, 3, 4, 'Thursday', '10:00', '12:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (9, 17, 5, 5, 'Monday', '12:00', '14:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (10, 19, 5, 5, 'Tuesday', '12:00', '14:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (11, 21, 5, 5, 'Wednesday', '12:00', '14:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (12, 23, 5, 5, 'Thursday', '12:00', '14:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (13, 25, 1, 7, 'Friday', '08:00', '10:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (14, 27, 3, 7, 'Friday', '10:00', '12:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (15, 29, 5, 7, 'Friday', '12:00', '14:00', 4, 7, 1, '2026-05-03 00:51:39.799838');
INSERT INTO public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) VALUES (16, 31, 1, 7, 'Friday', '14:00', '16:00', 4, 7, 1, '2026-05-03 00:51:39.799838');


ALTER TABLE public.timetables ENABLE TRIGGER ALL;

--
-- Data for Name: transcripts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.transcripts DISABLE TRIGGER ALL;

INSERT INTO public.transcripts (id, student_id, generated_by, approved_by, status, reference_number, ip_address, notes, approved_at, finalized_at, created_at, updated_at) VALUES (1, 5, 5, 1, 'official', 'TRN-00100001', '105.112.0.1', 'Official transcript issued for 17th Convocation.', '2024-11-10 00:00:00', '2024-11-11 00:00:00', '2026-05-03 00:51:40.070295', '2026-05-03 00:51:40.070295');
INSERT INTO public.transcripts (id, student_id, generated_by, approved_by, status, reference_number, ip_address, notes, approved_at, finalized_at, created_at, updated_at) VALUES (2, 11, 5, 1, 'approved', 'TRN-00100002', '105.112.0.1', 'Approved for convocation.', '2024-11-10 00:00:00', NULL, '2026-05-03 00:51:40.070295', '2026-05-03 00:51:40.070295');
INSERT INTO public.transcripts (id, student_id, generated_by, approved_by, status, reference_number, ip_address, notes, approved_at, finalized_at, created_at, updated_at) VALUES (3, 1, 5, NULL, 'pending', 'TRN-00100003', '41.58.100.12', 'Student requested transcript for postgraduate application.', NULL, NULL, '2026-05-03 00:51:40.070295', '2026-05-03 00:51:40.070295');
INSERT INTO public.transcripts (id, student_id, generated_by, approved_by, status, reference_number, ip_address, notes, approved_at, finalized_at, created_at, updated_at) VALUES (4, 15, 5, NULL, 'draft', 'TRN-00100004', '41.58.100.12', 'Draft prepared, awaiting department sign-off.', NULL, NULL, '2026-05-03 00:51:40.070295', '2026-05-03 00:51:40.070295');
INSERT INTO public.transcripts (id, student_id, generated_by, approved_by, status, reference_number, ip_address, notes, approved_at, finalized_at, created_at, updated_at) VALUES (5, 18, 2, 2, 'approved', 'MAAUN-TXN-2026-0C18A7C4', '127.0.0.1', NULL, '2026-05-03 01:26:52.344', NULL, '2026-05-03 01:26:52.328967', '2026-05-03 01:26:52.344');
INSERT INTO public.transcripts (id, student_id, generated_by, approved_by, status, reference_number, ip_address, notes, approved_at, finalized_at, created_at, updated_at) VALUES (6, 18, 2, 2, 'official', 'MAAUN-TXN-2026-FEC2DBC0', '127.0.0.1', NULL, '2026-05-03 01:31:01.192', '2026-05-03 01:31:01.192', '2026-05-03 01:31:01.159871', '2026-05-03 01:31:01.192');
INSERT INTO public.transcripts (id, student_id, generated_by, approved_by, status, reference_number, ip_address, notes, approved_at, finalized_at, created_at, updated_at) VALUES (7, 18, 2, 2, 'official', 'MAAUN-TXN-2026-310E9BFF', '127.0.0.1', NULL, '2026-05-03 01:32:06.075', '2026-05-03 01:32:06.075', '2026-05-03 01:32:06.043451', '2026-05-03 01:32:06.075');
INSERT INTO public.transcripts (id, student_id, generated_by, approved_by, status, reference_number, ip_address, notes, approved_at, finalized_at, created_at, updated_at) VALUES (8, 18, 2, 2, 'official', 'MAAUN-TXN-2026-90000B7A', '127.0.0.1', NULL, '2026-05-03 01:32:17.62', '2026-05-03 01:32:17.62', '2026-05-03 01:32:17.587822', '2026-05-03 01:32:17.62');


ALTER TABLE public.transcripts ENABLE TRIGGER ALL;

--
-- Data for Name: welfare_cases; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.welfare_cases DISABLE TRIGGER ALL;

INSERT INTO public.welfare_cases (id, student_id, category, title, description, priority, status, is_confidential, created_at, updated_at) VALUES (2, 1, 'academic_stress', 'Exam Anxiety and Academic Pressure', 'Student experiencing significant anxiety ahead of 300-level examinations. Reports sleep disruption and inability to concentrate.', 'medium', 'resolved', false, '2026-05-03 00:51:40.04981', '2026-05-03 00:51:40.04981');
INSERT INTO public.welfare_cases (id, student_id, category, title, description, priority, status, is_confidential, created_at, updated_at) VALUES (3, 20, 'mental_health', 'Severe Depression and Social Withdrawal', 'Student reported by roommate as showing signs of severe depression, refusing meals and social interaction for multiple days.', 'urgent', 'in_progress', true, '2026-05-03 00:51:40.04981', '2026-05-03 00:51:40.04981');
INSERT INTO public.welfare_cases (id, student_id, category, title, description, priority, status, is_confidential, created_at, updated_at) VALUES (4, 7, 'financial_support', 'Outstanding Fees — Risk of Withdrawal', 'Student is at risk of being barred from examinations due to outstanding tuition fees. Parents overseas and remittance delayed.', 'high', 'submitted', false, '2026-05-03 00:51:40.04981', '2026-05-03 00:51:40.04981');
INSERT INTO public.welfare_cases (id, student_id, category, title, description, priority, status, is_confidential, created_at, updated_at) VALUES (5, 17, 'harassment', 'Alleged Harassment by Coursemate', 'Student reports persistent unwanted contact and intimidation from a fellow student. Requests formal intervention.', 'high', 'assigned', true, '2026-05-03 00:51:40.04981', '2026-05-03 00:51:40.04981');
INSERT INTO public.welfare_cases (id, student_id, category, title, description, priority, status, is_confidential, created_at, updated_at) VALUES (6, 4, 'mental_health', 'Mental Health Support Post-Disciplinary Action', 'Student referred for counselling following disciplinary case. Showing signs of anxiety and regret.', 'medium', 'submitted', false, '2026-05-03 00:51:40.04981', '2026-05-03 00:51:40.04981');
INSERT INTO public.welfare_cases (id, student_id, category, title, description, priority, status, is_confidential, created_at, updated_at) VALUES (1, 12, 'financial_support', 'Financial Hardship — Cannot Afford Tuition', 'Student reports severe financial hardship following father''s job loss. Unable to meet tuition payment deadline. Requests emergency bursary or payment plan.', 'medium', 'in_progress', false, '2026-05-03 00:51:40.04981', '2026-05-03 01:26:52.314');
INSERT INTO public.welfare_cases (id, student_id, category, title, description, priority, status, is_confidential, created_at, updated_at) VALUES (7, 1, 'academic_stress', 'System Auto-Test Case', 'Auto-generated test case — safe to ignore', 'medium', 'in_progress', false, '2026-05-03 01:31:00.702412', '2026-05-03 01:31:01.145');
INSERT INTO public.welfare_cases (id, student_id, category, title, description, priority, status, is_confidential, created_at, updated_at) VALUES (8, 1, 'academic_stress', 'System Auto-Test Case', 'Auto-generated test case — safe to ignore', 'medium', 'in_progress', false, '2026-05-03 01:32:05.54862', '2026-05-03 01:32:06.028');
INSERT INTO public.welfare_cases (id, student_id, category, title, description, priority, status, is_confidential, created_at, updated_at) VALUES (9, 1, 'academic_stress', 'System Auto-Test Case', 'Auto-generated test case — safe to ignore', 'medium', 'in_progress', false, '2026-05-03 01:32:17.070304', '2026-05-03 01:32:17.572');


ALTER TABLE public.welfare_cases ENABLE TRIGGER ALL;

--
-- Data for Name: welfare_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.welfare_assignments DISABLE TRIGGER ALL;

INSERT INTO public.welfare_assignments (id, case_id, assigned_to, assigned_by, assigned_at) VALUES (1, 1, 10, 1, '2026-05-03 00:51:40.053225');
INSERT INTO public.welfare_assignments (id, case_id, assigned_to, assigned_by, assigned_at) VALUES (2, 2, 10, 1, '2026-05-03 00:51:40.053225');
INSERT INTO public.welfare_assignments (id, case_id, assigned_to, assigned_by, assigned_at) VALUES (3, 3, 11, 1, '2026-05-03 00:51:40.053225');
INSERT INTO public.welfare_assignments (id, case_id, assigned_to, assigned_by, assigned_at) VALUES (4, 5, 11, 1, '2026-05-03 00:51:40.053225');
INSERT INTO public.welfare_assignments (id, case_id, assigned_to, assigned_by, assigned_at) VALUES (5, 6, 10, 1, '2026-05-03 00:51:40.053225');
INSERT INTO public.welfare_assignments (id, case_id, assigned_to, assigned_by, assigned_at) VALUES (6, 1, 10, 2, '2026-05-03 01:26:52.265455');
INSERT INTO public.welfare_assignments (id, case_id, assigned_to, assigned_by, assigned_at) VALUES (7, 7, 10, 2, '2026-05-03 01:31:01.100808');
INSERT INTO public.welfare_assignments (id, case_id, assigned_to, assigned_by, assigned_at) VALUES (8, 8, 10, 2, '2026-05-03 01:32:05.989815');
INSERT INTO public.welfare_assignments (id, case_id, assigned_to, assigned_by, assigned_at) VALUES (9, 9, 10, 2, '2026-05-03 01:32:17.529222');


ALTER TABLE public.welfare_assignments ENABLE TRIGGER ALL;

--
-- Data for Name: welfare_notes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.welfare_notes DISABLE TRIGGER ALL;

INSERT INTO public.welfare_notes (id, case_id, author_id, note, is_private, created_at) VALUES (1, 1, 10, 'Initial meeting held on 04 Nov 2024. Student confirmed details. Emergency bursary application submitted to finance office. Awaiting approval.', false, '2026-05-03 00:51:40.057335');
INSERT INTO public.welfare_notes (id, case_id, author_id, note, is_private, created_at) VALUES (2, 1, 10, 'Private: Student also mentioned family tension at home. May need extended emotional support beyond financial assistance.', true, '2026-05-03 00:51:40.057335');
INSERT INTO public.welfare_notes (id, case_id, author_id, note, is_private, created_at) VALUES (3, 2, 10, 'Three sessions completed. Student reports improved sleep and reduced anxiety after implementing time-management strategies. Case resolved.', false, '2026-05-03 00:51:40.057335');
INSERT INTO public.welfare_notes (id, case_id, author_id, note, is_private, created_at) VALUES (4, 3, 11, 'Urgent: Contacted student directly — unresponsive initially. Eventually agreed to meeting. CRIS assessment performed (score 12 — moderate risk). Follow-up daily for next 7 days.', true, '2026-05-03 00:51:40.057335');
INSERT INTO public.welfare_notes (id, case_id, author_id, note, is_private, created_at) VALUES (5, 3, 11, 'Student engaged in first counselling session. Agreed to eat meals in counselling office until stabilized. Referred to university nurse for health assessment.', false, '2026-05-03 00:51:40.057335');
INSERT INTO public.welfare_notes (id, case_id, author_id, note, is_private, created_at) VALUES (6, 5, 11, 'Confidential: Incident may involve a named perpetrator. Student has declined to disclose name at this stage. Will report to Dean of Students if situation escalates.', true, '2026-05-03 00:51:40.057335');
INSERT INTO public.welfare_notes (id, case_id, author_id, note, is_private, created_at) VALUES (7, 1, 2, 'Auto-test note from system runner', false, '2026-05-03 01:26:52.301009');
INSERT INTO public.welfare_notes (id, case_id, author_id, note, is_private, created_at) VALUES (8, 7, 2, 'Auto-test note', false, '2026-05-03 01:31:01.13477');
INSERT INTO public.welfare_notes (id, case_id, author_id, note, is_private, created_at) VALUES (9, 8, 2, 'Auto-test note', false, '2026-05-03 01:32:06.016817');
INSERT INTO public.welfare_notes (id, case_id, author_id, note, is_private, created_at) VALUES (10, 9, 2, 'Auto-test note', false, '2026-05-03 01:32:17.560122');


ALTER TABLE public.welfare_notes ENABLE TRIGGER ALL;

--
-- Name: academic_semesters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.academic_semesters_id_seq', 8, true);


--
-- Name: academic_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.academic_sessions_id_seq', 4, true);


--
-- Name: academic_standings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.academic_standings_id_seq', 155, true);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 69, true);


--
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.announcements_id_seq', 12, true);


--
-- Name: appeal_decisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.appeal_decisions_id_seq', 3, true);


--
-- Name: bed_spaces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bed_spaces_id_seq', 48, true);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.courses_id_seq', 38, true);


--
-- Name: disciplinary_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.disciplinary_actions_id_seq', 8, true);


--
-- Name: disciplinary_appeals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.disciplinary_appeals_id_seq', 4, true);


--
-- Name: disciplinary_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.disciplinary_cases_id_seq', 9, true);


--
-- Name: disciplinary_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.disciplinary_flags_id_seq', 4, true);


--
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.enrollments_id_seq', 174, true);


--
-- Name: fees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.fees_id_seq', 4, true);


--
-- Name: financial_ledger_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.financial_ledger_id_seq', 50, true);


--
-- Name: graduation_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.graduation_applications_id_seq', 3, true);


--
-- Name: graduation_clearances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.graduation_clearances_id_seq', 45, true);


--
-- Name: hostel_allocations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.hostel_allocations_id_seq', 15, true);


--
-- Name: hostel_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.hostel_applications_id_seq', 20, true);


--
-- Name: hostels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.hostels_id_seq', 6, true);


--
-- Name: lecturers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.lecturers_id_seq', 6, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notifications_id_seq', 360, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.payments_id_seq', 52, true);


--
-- Name: receipts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.receipts_id_seq', 50, true);


--
-- Name: results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.results_id_seq', 172, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.rooms_id_seq', 14, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.students_id_seq', 21, true);


--
-- Name: timetables_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.timetables_id_seq', 16, true);


--
-- Name: transcripts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.transcripts_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 38, true);


--
-- Name: venues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.venues_id_seq', 11, true);


--
-- Name: welfare_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.welfare_assignments_id_seq', 9, true);


--
-- Name: welfare_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.welfare_cases_id_seq', 9, true);


--
-- Name: welfare_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.welfare_notes_id_seq', 10, true);


--
-- PostgreSQL database dump complete
--

\unrestrict qkV8WIagUDjyPHYGmnrqltcV0bUUg9OlmExAkx3yvdkfPy8KDpXdtEOpviNRnZ8

