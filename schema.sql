--
-- PostgreSQL database dump
--

\restrict UyOJx1CiyzOFyLxlr7DTZov61UeTLxMkNrU6OcvU6YItcr8uwBHQMlr6l9okzyR

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_semesters; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.academic_semesters (
    id integer NOT NULL,
    name text NOT NULL,
    session_id integer NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.academic_semesters OWNER TO neondb_owner;

--
-- Name: academic_semesters_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.academic_semesters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academic_semesters_id_seq OWNER TO neondb_owner;

--
-- Name: academic_semesters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.academic_semesters_id_seq OWNED BY public.academic_semesters.id;


--
-- Name: academic_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.academic_sessions (
    id integer NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.academic_sessions OWNER TO neondb_owner;

--
-- Name: academic_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.academic_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academic_sessions_id_seq OWNER TO neondb_owner;

--
-- Name: academic_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.academic_sessions_id_seq OWNED BY public.academic_sessions.id;


--
-- Name: academic_standings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.academic_standings (
    id integer NOT NULL,
    student_id integer NOT NULL,
    cgpa real NOT NULL,
    classification text NOT NULL,
    status text NOT NULL,
    total_units_attempted integer DEFAULT 0 NOT NULL,
    total_quality_points real DEFAULT 0 NOT NULL,
    generated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.academic_standings OWNER TO neondb_owner;

--
-- Name: academic_standings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.academic_standings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academic_standings_id_seq OWNER TO neondb_owner;

--
-- Name: academic_standings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.academic_standings_id_seq OWNED BY public.academic_standings.id;


--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    user_id integer,
    action text NOT NULL,
    model text NOT NULL,
    model_id integer,
    old_data json,
    new_data json,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.activity_logs OWNER TO neondb_owner;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_id_seq OWNER TO neondb_owner;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: announcements; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    created_by integer NOT NULL,
    target_roles json DEFAULT '[]'::json NOT NULL,
    target_departments json,
    target_levels json,
    is_pinned boolean DEFAULT false NOT NULL,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.announcements OWNER TO neondb_owner;

--
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.announcements_id_seq OWNER TO neondb_owner;

--
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- Name: appeal_decisions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.appeal_decisions (
    id integer NOT NULL,
    appeal_id integer NOT NULL,
    decision text NOT NULL,
    modified_action text,
    remarks text NOT NULL,
    decided_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.appeal_decisions OWNER TO neondb_owner;

--
-- Name: appeal_decisions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.appeal_decisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appeal_decisions_id_seq OWNER TO neondb_owner;

--
-- Name: appeal_decisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.appeal_decisions_id_seq OWNED BY public.appeal_decisions.id;


--
-- Name: bed_spaces; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.bed_spaces (
    id integer NOT NULL,
    room_id integer NOT NULL,
    bed_label text NOT NULL,
    student_id integer,
    status text DEFAULT 'vacant'::text NOT NULL
);


ALTER TABLE public.bed_spaces OWNER TO neondb_owner;

--
-- Name: bed_spaces_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.bed_spaces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bed_spaces_id_seq OWNER TO neondb_owner;

--
-- Name: bed_spaces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.bed_spaces_id_seq OWNED BY public.bed_spaces.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    course_code text NOT NULL,
    title text NOT NULL,
    unit integer NOT NULL,
    department text NOT NULL,
    faculty text NOT NULL,
    level text NOT NULL,
    semester text NOT NULL,
    description text,
    lecturer_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.courses OWNER TO neondb_owner;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO neondb_owner;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: disciplinary_actions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.disciplinary_actions (
    id integer NOT NULL,
    case_id integer NOT NULL,
    action_type text NOT NULL,
    start_date date NOT NULL,
    end_date date,
    remarks text,
    applied_by integer NOT NULL,
    applied_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.disciplinary_actions OWNER TO neondb_owner;

--
-- Name: disciplinary_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.disciplinary_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disciplinary_actions_id_seq OWNER TO neondb_owner;

--
-- Name: disciplinary_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.disciplinary_actions_id_seq OWNED BY public.disciplinary_actions.id;


--
-- Name: disciplinary_appeals; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.disciplinary_appeals (
    id integer NOT NULL,
    case_id integer NOT NULL,
    student_id integer NOT NULL,
    reason text NOT NULL,
    evidence text,
    status text DEFAULT 'submitted'::text NOT NULL,
    reviewed_by integer,
    admin_response text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    resolved_at timestamp without time zone
);


ALTER TABLE public.disciplinary_appeals OWNER TO neondb_owner;

--
-- Name: disciplinary_appeals_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.disciplinary_appeals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disciplinary_appeals_id_seq OWNER TO neondb_owner;

--
-- Name: disciplinary_appeals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.disciplinary_appeals_id_seq OWNED BY public.disciplinary_appeals.id;


--
-- Name: disciplinary_cases; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.disciplinary_cases (
    id integer NOT NULL,
    student_id integer NOT NULL,
    reported_by integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    severity text DEFAULT 'minor'::text NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    resolution_note text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.disciplinary_cases OWNER TO neondb_owner;

--
-- Name: disciplinary_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.disciplinary_cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disciplinary_cases_id_seq OWNER TO neondb_owner;

--
-- Name: disciplinary_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.disciplinary_cases_id_seq OWNED BY public.disciplinary_cases.id;


--
-- Name: disciplinary_flags; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.disciplinary_flags (
    id integer NOT NULL,
    student_id integer NOT NULL,
    flag_type text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    related_case_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.disciplinary_flags OWNER TO neondb_owner;

--
-- Name: disciplinary_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.disciplinary_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disciplinary_flags_id_seq OWNER TO neondb_owner;

--
-- Name: disciplinary_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.disciplinary_flags_id_seq OWNED BY public.disciplinary_flags.id;


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.enrollments (
    id integer NOT NULL,
    student_id integer NOT NULL,
    course_id integer NOT NULL,
    semester text NOT NULL,
    academic_year text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    enrolled_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.enrollments OWNER TO neondb_owner;

--
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollments_id_seq OWNER TO neondb_owner;

--
-- Name: enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.enrollments_id_seq OWNED BY public.enrollments.id;


--
-- Name: fees; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.fees (
    id integer NOT NULL,
    name text NOT NULL,
    amount integer NOT NULL,
    department text,
    level text,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.fees OWNER TO neondb_owner;

--
-- Name: fees_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.fees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fees_id_seq OWNER TO neondb_owner;

--
-- Name: fees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.fees_id_seq OWNED BY public.fees.id;


--
-- Name: financial_ledger; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.financial_ledger (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type text NOT NULL,
    amount integer NOT NULL,
    description text NOT NULL,
    related_payment_id integer,
    related_receipt_id integer,
    balance_after integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.financial_ledger OWNER TO neondb_owner;

--
-- Name: financial_ledger_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.financial_ledger_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financial_ledger_id_seq OWNER TO neondb_owner;

--
-- Name: financial_ledger_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.financial_ledger_id_seq OWNED BY public.financial_ledger.id;


--
-- Name: graduation_applications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.graduation_applications (
    id integer NOT NULL,
    student_id integer NOT NULL,
    session_id integer,
    status text DEFAULT 'applied'::text NOT NULL,
    reviewed_by integer,
    rejection_reason text,
    admin_override boolean DEFAULT false,
    override_reason text,
    reviewed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.graduation_applications OWNER TO neondb_owner;

--
-- Name: graduation_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.graduation_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.graduation_applications_id_seq OWNER TO neondb_owner;

--
-- Name: graduation_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.graduation_applications_id_seq OWNED BY public.graduation_applications.id;


--
-- Name: graduation_clearances; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.graduation_clearances (
    id integer NOT NULL,
    student_id integer NOT NULL,
    cgpa real DEFAULT 0 NOT NULL,
    academic_status text NOT NULL,
    financial_status text NOT NULL,
    admin_status text NOT NULL,
    overall_status text NOT NULL,
    academic_remarks text,
    financial_remarks text,
    admin_remarks text,
    evaluated_at timestamp without time zone DEFAULT now() NOT NULL,
    evaluated_by integer
);


ALTER TABLE public.graduation_clearances OWNER TO neondb_owner;

--
-- Name: graduation_clearances_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.graduation_clearances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.graduation_clearances_id_seq OWNER TO neondb_owner;

--
-- Name: graduation_clearances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.graduation_clearances_id_seq OWNED BY public.graduation_clearances.id;


--
-- Name: hostel_allocations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hostel_allocations (
    id integer NOT NULL,
    student_id integer NOT NULL,
    bed_space_id integer NOT NULL,
    allocated_by integer,
    allocated_at timestamp without time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    notes text
);


ALTER TABLE public.hostel_allocations OWNER TO neondb_owner;

--
-- Name: hostel_allocations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.hostel_allocations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hostel_allocations_id_seq OWNER TO neondb_owner;

--
-- Name: hostel_allocations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.hostel_allocations_id_seq OWNED BY public.hostel_allocations.id;


--
-- Name: hostel_applications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hostel_applications (
    id integer NOT NULL,
    student_id integer NOT NULL,
    session_id integer,
    status text DEFAULT 'applied'::text NOT NULL,
    priority_score real DEFAULT 0,
    preferred_gender text,
    remarks text,
    rejection_reason text,
    reviewed_by integer,
    reviewed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hostel_applications OWNER TO neondb_owner;

--
-- Name: hostel_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.hostel_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hostel_applications_id_seq OWNER TO neondb_owner;

--
-- Name: hostel_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.hostel_applications_id_seq OWNED BY public.hostel_applications.id;


--
-- Name: hostels; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hostels (
    id integer NOT NULL,
    name text NOT NULL,
    gender text DEFAULT 'mixed'::text NOT NULL,
    total_rooms integer DEFAULT 0 NOT NULL,
    location text,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hostels OWNER TO neondb_owner;

--
-- Name: hostels_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.hostels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hostels_id_seq OWNER TO neondb_owner;

--
-- Name: hostels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.hostels_id_seq OWNED BY public.hostels.id;


--
-- Name: lecturers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.lecturers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    staff_id text NOT NULL,
    department text NOT NULL,
    faculty text NOT NULL,
    designation text DEFAULT 'Lecturer I'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lecturers OWNER TO neondb_owner;

--
-- Name: lecturers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.lecturers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lecturers_id_seq OWNER TO neondb_owner;

--
-- Name: lecturers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.lecturers_id_seq OWNED BY public.lecturers.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info'::text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    fee_id integer NOT NULL,
    reference text NOT NULL,
    amount integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    paid_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payments OWNER TO neondb_owner;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO neondb_owner;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: receipts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.receipts (
    id integer NOT NULL,
    payment_id integer NOT NULL,
    user_id integer NOT NULL,
    reference_number text NOT NULL,
    amount integer NOT NULL,
    fee_name text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    issued_by integer,
    issued_at timestamp without time zone,
    reversed_at timestamp without time zone,
    reversal_reason text,
    ip_address text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.receipts OWNER TO neondb_owner;

--
-- Name: receipts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.receipts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.receipts_id_seq OWNER TO neondb_owner;

--
-- Name: receipts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.receipts_id_seq OWNED BY public.receipts.id;


--
-- Name: results; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.results (
    id integer NOT NULL,
    student_id integer NOT NULL,
    course_id integer NOT NULL,
    semester text NOT NULL,
    academic_year text NOT NULL,
    ca_score real,
    exam_score real,
    total_score real,
    grade text,
    grade_point real,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL
);


ALTER TABLE public.results OWNER TO neondb_owner;

--
-- Name: results_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.results_id_seq OWNER TO neondb_owner;

--
-- Name: results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.results_id_seq OWNED BY public.results.id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    hostel_id integer NOT NULL,
    room_number text NOT NULL,
    capacity integer DEFAULT 2 NOT NULL,
    status text DEFAULT 'available'::text NOT NULL,
    floor integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rooms OWNER TO neondb_owner;

--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rooms_id_seq OWNER TO neondb_owner;

--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.students (
    id integer NOT NULL,
    user_id integer NOT NULL,
    matric_number text NOT NULL,
    department text NOT NULL,
    faculty text NOT NULL,
    level text DEFAULT '100'::text NOT NULL,
    cgpa real,
    enrollment_year text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.students OWNER TO neondb_owner;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO neondb_owner;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: timetables; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.timetables (
    id integer NOT NULL,
    course_id integer NOT NULL,
    lecturer_id integer NOT NULL,
    venue_id integer NOT NULL,
    day_of_week text NOT NULL,
    start_time text NOT NULL,
    end_time text NOT NULL,
    session_id integer,
    semester_id integer,
    created_by integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.timetables OWNER TO neondb_owner;

--
-- Name: timetables_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.timetables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.timetables_id_seq OWNER TO neondb_owner;

--
-- Name: timetables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.timetables_id_seq OWNED BY public.timetables.id;


--
-- Name: transcripts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.transcripts (
    id integer NOT NULL,
    student_id integer NOT NULL,
    generated_by integer NOT NULL,
    approved_by integer,
    status text DEFAULT 'draft'::text NOT NULL,
    reference_number text NOT NULL,
    ip_address text,
    notes text,
    approved_at timestamp without time zone,
    finalized_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.transcripts OWNER TO neondb_owner;

--
-- Name: transcripts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.transcripts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transcripts_id_seq OWNER TO neondb_owner;

--
-- Name: transcripts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.transcripts_id_seq OWNED BY public.transcripts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'student'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: venues; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.venues (
    id integer NOT NULL,
    name text NOT NULL,
    capacity integer DEFAULT 50 NOT NULL,
    location text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.venues OWNER TO neondb_owner;

--
-- Name: venues_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.venues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.venues_id_seq OWNER TO neondb_owner;

--
-- Name: venues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.venues_id_seq OWNED BY public.venues.id;


--
-- Name: welfare_assignments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.welfare_assignments (
    id integer NOT NULL,
    case_id integer NOT NULL,
    assigned_to integer NOT NULL,
    assigned_by integer NOT NULL,
    assigned_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.welfare_assignments OWNER TO neondb_owner;

--
-- Name: welfare_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.welfare_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.welfare_assignments_id_seq OWNER TO neondb_owner;

--
-- Name: welfare_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.welfare_assignments_id_seq OWNED BY public.welfare_assignments.id;


--
-- Name: welfare_cases; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.welfare_cases (
    id integer NOT NULL,
    student_id integer NOT NULL,
    category text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    status text DEFAULT 'submitted'::text NOT NULL,
    is_confidential boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.welfare_cases OWNER TO neondb_owner;

--
-- Name: welfare_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.welfare_cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.welfare_cases_id_seq OWNER TO neondb_owner;

--
-- Name: welfare_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.welfare_cases_id_seq OWNED BY public.welfare_cases.id;


--
-- Name: welfare_notes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.welfare_notes (
    id integer NOT NULL,
    case_id integer NOT NULL,
    author_id integer NOT NULL,
    note text NOT NULL,
    is_private boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.welfare_notes OWNER TO neondb_owner;

--
-- Name: welfare_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.welfare_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.welfare_notes_id_seq OWNER TO neondb_owner;

--
-- Name: welfare_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.welfare_notes_id_seq OWNED BY public.welfare_notes.id;


--
-- Name: academic_semesters id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_semesters ALTER COLUMN id SET DEFAULT nextval('public.academic_semesters_id_seq'::regclass);


--
-- Name: academic_sessions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_sessions ALTER COLUMN id SET DEFAULT nextval('public.academic_sessions_id_seq'::regclass);


--
-- Name: academic_standings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_standings ALTER COLUMN id SET DEFAULT nextval('public.academic_standings_id_seq'::regclass);


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- Name: appeal_decisions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.appeal_decisions ALTER COLUMN id SET DEFAULT nextval('public.appeal_decisions_id_seq'::regclass);


--
-- Name: bed_spaces id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bed_spaces ALTER COLUMN id SET DEFAULT nextval('public.bed_spaces_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: disciplinary_actions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_actions ALTER COLUMN id SET DEFAULT nextval('public.disciplinary_actions_id_seq'::regclass);


--
-- Name: disciplinary_appeals id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_appeals ALTER COLUMN id SET DEFAULT nextval('public.disciplinary_appeals_id_seq'::regclass);


--
-- Name: disciplinary_cases id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_cases ALTER COLUMN id SET DEFAULT nextval('public.disciplinary_cases_id_seq'::regclass);


--
-- Name: disciplinary_flags id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_flags ALTER COLUMN id SET DEFAULT nextval('public.disciplinary_flags_id_seq'::regclass);


--
-- Name: enrollments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN id SET DEFAULT nextval('public.enrollments_id_seq'::regclass);


--
-- Name: fees id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.fees ALTER COLUMN id SET DEFAULT nextval('public.fees_id_seq'::regclass);


--
-- Name: financial_ledger id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.financial_ledger ALTER COLUMN id SET DEFAULT nextval('public.financial_ledger_id_seq'::regclass);


--
-- Name: graduation_applications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.graduation_applications ALTER COLUMN id SET DEFAULT nextval('public.graduation_applications_id_seq'::regclass);


--
-- Name: graduation_clearances id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.graduation_clearances ALTER COLUMN id SET DEFAULT nextval('public.graduation_clearances_id_seq'::regclass);


--
-- Name: hostel_allocations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostel_allocations ALTER COLUMN id SET DEFAULT nextval('public.hostel_allocations_id_seq'::regclass);


--
-- Name: hostel_applications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostel_applications ALTER COLUMN id SET DEFAULT nextval('public.hostel_applications_id_seq'::regclass);


--
-- Name: hostels id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostels ALTER COLUMN id SET DEFAULT nextval('public.hostels_id_seq'::regclass);


--
-- Name: lecturers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecturers ALTER COLUMN id SET DEFAULT nextval('public.lecturers_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: receipts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.receipts ALTER COLUMN id SET DEFAULT nextval('public.receipts_id_seq'::regclass);


--
-- Name: results id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.results ALTER COLUMN id SET DEFAULT nextval('public.results_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: timetables id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timetables ALTER COLUMN id SET DEFAULT nextval('public.timetables_id_seq'::regclass);


--
-- Name: transcripts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transcripts ALTER COLUMN id SET DEFAULT nextval('public.transcripts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: venues id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.venues ALTER COLUMN id SET DEFAULT nextval('public.venues_id_seq'::regclass);


--
-- Name: welfare_assignments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_assignments ALTER COLUMN id SET DEFAULT nextval('public.welfare_assignments_id_seq'::regclass);


--
-- Name: welfare_cases id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_cases ALTER COLUMN id SET DEFAULT nextval('public.welfare_cases_id_seq'::regclass);


--
-- Name: welfare_notes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_notes ALTER COLUMN id SET DEFAULT nextval('public.welfare_notes_id_seq'::regclass);


--
-- Name: academic_semesters academic_semesters_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_semesters
    ADD CONSTRAINT academic_semesters_pkey PRIMARY KEY (id);


--
-- Name: academic_sessions academic_sessions_name_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_sessions
    ADD CONSTRAINT academic_sessions_name_unique UNIQUE (name);


--
-- Name: academic_sessions academic_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_sessions
    ADD CONSTRAINT academic_sessions_pkey PRIMARY KEY (id);


--
-- Name: academic_standings academic_standings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_standings
    ADD CONSTRAINT academic_standings_pkey PRIMARY KEY (id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: appeal_decisions appeal_decisions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.appeal_decisions
    ADD CONSTRAINT appeal_decisions_pkey PRIMARY KEY (id);


--
-- Name: bed_spaces bed_spaces_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bed_spaces
    ADD CONSTRAINT bed_spaces_pkey PRIMARY KEY (id);


--
-- Name: courses courses_course_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_course_code_unique UNIQUE (course_code);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: disciplinary_actions disciplinary_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_actions
    ADD CONSTRAINT disciplinary_actions_pkey PRIMARY KEY (id);


--
-- Name: disciplinary_appeals disciplinary_appeals_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_appeals
    ADD CONSTRAINT disciplinary_appeals_pkey PRIMARY KEY (id);


--
-- Name: disciplinary_cases disciplinary_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_cases
    ADD CONSTRAINT disciplinary_cases_pkey PRIMARY KEY (id);


--
-- Name: disciplinary_flags disciplinary_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_flags
    ADD CONSTRAINT disciplinary_flags_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: fees fees_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_pkey PRIMARY KEY (id);


--
-- Name: financial_ledger financial_ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.financial_ledger
    ADD CONSTRAINT financial_ledger_pkey PRIMARY KEY (id);


--
-- Name: graduation_applications graduation_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.graduation_applications
    ADD CONSTRAINT graduation_applications_pkey PRIMARY KEY (id);


--
-- Name: graduation_clearances graduation_clearances_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.graduation_clearances
    ADD CONSTRAINT graduation_clearances_pkey PRIMARY KEY (id);


--
-- Name: hostel_allocations hostel_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostel_allocations
    ADD CONSTRAINT hostel_allocations_pkey PRIMARY KEY (id);


--
-- Name: hostel_applications hostel_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostel_applications
    ADD CONSTRAINT hostel_applications_pkey PRIMARY KEY (id);


--
-- Name: hostels hostels_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostels
    ADD CONSTRAINT hostels_pkey PRIMARY KEY (id);


--
-- Name: lecturers lecturers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecturers
    ADD CONSTRAINT lecturers_pkey PRIMARY KEY (id);


--
-- Name: lecturers lecturers_staff_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecturers
    ADD CONSTRAINT lecturers_staff_id_unique UNIQUE (staff_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payments payments_reference_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_reference_unique UNIQUE (reference);


--
-- Name: receipts receipts_payment_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_payment_id_unique UNIQUE (payment_id);


--
-- Name: receipts receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_pkey PRIMARY KEY (id);


--
-- Name: receipts receipts_reference_number_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_reference_number_unique UNIQUE (reference_number);


--
-- Name: results results_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: students students_matric_number_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_matric_number_unique UNIQUE (matric_number);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: timetables timetables_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timetables
    ADD CONSTRAINT timetables_pkey PRIMARY KEY (id);


--
-- Name: transcripts transcripts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transcripts
    ADD CONSTRAINT transcripts_pkey PRIMARY KEY (id);


--
-- Name: transcripts transcripts_reference_number_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transcripts
    ADD CONSTRAINT transcripts_reference_number_unique UNIQUE (reference_number);


--
-- Name: enrollments unique_enrollment; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT unique_enrollment UNIQUE (student_id, course_id, semester, academic_year);


--
-- Name: results unique_result; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT unique_result UNIQUE (student_id, course_id, semester, academic_year);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (id);


--
-- Name: welfare_assignments welfare_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_assignments
    ADD CONSTRAINT welfare_assignments_pkey PRIMARY KEY (id);


--
-- Name: welfare_cases welfare_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_cases
    ADD CONSTRAINT welfare_cases_pkey PRIMARY KEY (id);


--
-- Name: welfare_notes welfare_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_notes
    ADD CONSTRAINT welfare_notes_pkey PRIMARY KEY (id);


--
-- Name: academic_semesters academic_semesters_session_id_academic_sessions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_semesters
    ADD CONSTRAINT academic_semesters_session_id_academic_sessions_id_fk FOREIGN KEY (session_id) REFERENCES public.academic_sessions(id) ON DELETE CASCADE;


--
-- Name: academic_standings academic_standings_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_standings
    ADD CONSTRAINT academic_standings_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: activity_logs activity_logs_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: announcements announcements_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: appeal_decisions appeal_decisions_appeal_id_disciplinary_appeals_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.appeal_decisions
    ADD CONSTRAINT appeal_decisions_appeal_id_disciplinary_appeals_id_fk FOREIGN KEY (appeal_id) REFERENCES public.disciplinary_appeals(id) ON DELETE CASCADE;


--
-- Name: appeal_decisions appeal_decisions_decided_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.appeal_decisions
    ADD CONSTRAINT appeal_decisions_decided_by_users_id_fk FOREIGN KEY (decided_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: bed_spaces bed_spaces_room_id_rooms_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bed_spaces
    ADD CONSTRAINT bed_spaces_room_id_rooms_id_fk FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: bed_spaces bed_spaces_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bed_spaces
    ADD CONSTRAINT bed_spaces_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE SET NULL;


--
-- Name: courses courses_lecturer_id_lecturers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_lecturer_id_lecturers_id_fk FOREIGN KEY (lecturer_id) REFERENCES public.lecturers(id) ON DELETE SET NULL;


--
-- Name: disciplinary_actions disciplinary_actions_applied_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_actions
    ADD CONSTRAINT disciplinary_actions_applied_by_users_id_fk FOREIGN KEY (applied_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: disciplinary_actions disciplinary_actions_case_id_disciplinary_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_actions
    ADD CONSTRAINT disciplinary_actions_case_id_disciplinary_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.disciplinary_cases(id) ON DELETE CASCADE;


--
-- Name: disciplinary_appeals disciplinary_appeals_case_id_disciplinary_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_appeals
    ADD CONSTRAINT disciplinary_appeals_case_id_disciplinary_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.disciplinary_cases(id) ON DELETE CASCADE;


--
-- Name: disciplinary_appeals disciplinary_appeals_reviewed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_appeals
    ADD CONSTRAINT disciplinary_appeals_reviewed_by_users_id_fk FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: disciplinary_appeals disciplinary_appeals_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_appeals
    ADD CONSTRAINT disciplinary_appeals_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: disciplinary_cases disciplinary_cases_reported_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_cases
    ADD CONSTRAINT disciplinary_cases_reported_by_users_id_fk FOREIGN KEY (reported_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: disciplinary_cases disciplinary_cases_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_cases
    ADD CONSTRAINT disciplinary_cases_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: disciplinary_flags disciplinary_flags_related_case_id_disciplinary_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_flags
    ADD CONSTRAINT disciplinary_flags_related_case_id_disciplinary_cases_id_fk FOREIGN KEY (related_case_id) REFERENCES public.disciplinary_cases(id) ON DELETE SET NULL;


--
-- Name: disciplinary_flags disciplinary_flags_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.disciplinary_flags
    ADD CONSTRAINT disciplinary_flags_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_course_id_courses_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_courses_id_fk FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: financial_ledger financial_ledger_related_payment_id_payments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.financial_ledger
    ADD CONSTRAINT financial_ledger_related_payment_id_payments_id_fk FOREIGN KEY (related_payment_id) REFERENCES public.payments(id) ON DELETE SET NULL;


--
-- Name: financial_ledger financial_ledger_related_receipt_id_receipts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.financial_ledger
    ADD CONSTRAINT financial_ledger_related_receipt_id_receipts_id_fk FOREIGN KEY (related_receipt_id) REFERENCES public.receipts(id) ON DELETE SET NULL;


--
-- Name: financial_ledger financial_ledger_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.financial_ledger
    ADD CONSTRAINT financial_ledger_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: graduation_applications graduation_applications_reviewed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.graduation_applications
    ADD CONSTRAINT graduation_applications_reviewed_by_users_id_fk FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: graduation_applications graduation_applications_session_id_academic_sessions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.graduation_applications
    ADD CONSTRAINT graduation_applications_session_id_academic_sessions_id_fk FOREIGN KEY (session_id) REFERENCES public.academic_sessions(id) ON DELETE SET NULL;


--
-- Name: graduation_applications graduation_applications_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.graduation_applications
    ADD CONSTRAINT graduation_applications_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: graduation_clearances graduation_clearances_evaluated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.graduation_clearances
    ADD CONSTRAINT graduation_clearances_evaluated_by_users_id_fk FOREIGN KEY (evaluated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: graduation_clearances graduation_clearances_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.graduation_clearances
    ADD CONSTRAINT graduation_clearances_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: hostel_allocations hostel_allocations_allocated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostel_allocations
    ADD CONSTRAINT hostel_allocations_allocated_by_users_id_fk FOREIGN KEY (allocated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: hostel_allocations hostel_allocations_bed_space_id_bed_spaces_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostel_allocations
    ADD CONSTRAINT hostel_allocations_bed_space_id_bed_spaces_id_fk FOREIGN KEY (bed_space_id) REFERENCES public.bed_spaces(id) ON DELETE RESTRICT;


--
-- Name: hostel_allocations hostel_allocations_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostel_allocations
    ADD CONSTRAINT hostel_allocations_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: hostel_applications hostel_applications_reviewed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostel_applications
    ADD CONSTRAINT hostel_applications_reviewed_by_users_id_fk FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: hostel_applications hostel_applications_session_id_academic_sessions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostel_applications
    ADD CONSTRAINT hostel_applications_session_id_academic_sessions_id_fk FOREIGN KEY (session_id) REFERENCES public.academic_sessions(id) ON DELETE SET NULL;


--
-- Name: hostel_applications hostel_applications_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hostel_applications
    ADD CONSTRAINT hostel_applications_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: lecturers lecturers_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecturers
    ADD CONSTRAINT lecturers_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_fee_id_fees_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_fee_id_fees_id_fk FOREIGN KEY (fee_id) REFERENCES public.fees(id) ON DELETE CASCADE;


--
-- Name: payments payments_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: receipts receipts_issued_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_issued_by_users_id_fk FOREIGN KEY (issued_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: receipts receipts_payment_id_payments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_payment_id_payments_id_fk FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE CASCADE;


--
-- Name: receipts receipts_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: results results_course_id_courses_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_course_id_courses_id_fk FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: results results_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: rooms rooms_hostel_id_hostels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_hostel_id_hostels_id_fk FOREIGN KEY (hostel_id) REFERENCES public.hostels(id) ON DELETE CASCADE;


--
-- Name: students students_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: timetables timetables_course_id_courses_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timetables
    ADD CONSTRAINT timetables_course_id_courses_id_fk FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: timetables timetables_lecturer_id_lecturers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timetables
    ADD CONSTRAINT timetables_lecturer_id_lecturers_id_fk FOREIGN KEY (lecturer_id) REFERENCES public.lecturers(id) ON DELETE CASCADE;


--
-- Name: timetables timetables_semester_id_academic_semesters_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timetables
    ADD CONSTRAINT timetables_semester_id_academic_semesters_id_fk FOREIGN KEY (semester_id) REFERENCES public.academic_semesters(id) ON DELETE CASCADE;


--
-- Name: timetables timetables_session_id_academic_sessions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timetables
    ADD CONSTRAINT timetables_session_id_academic_sessions_id_fk FOREIGN KEY (session_id) REFERENCES public.academic_sessions(id) ON DELETE CASCADE;


--
-- Name: timetables timetables_venue_id_venues_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timetables
    ADD CONSTRAINT timetables_venue_id_venues_id_fk FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- Name: transcripts transcripts_approved_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transcripts
    ADD CONSTRAINT transcripts_approved_by_users_id_fk FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: transcripts transcripts_generated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transcripts
    ADD CONSTRAINT transcripts_generated_by_users_id_fk FOREIGN KEY (generated_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: transcripts transcripts_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transcripts
    ADD CONSTRAINT transcripts_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: welfare_assignments welfare_assignments_assigned_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_assignments
    ADD CONSTRAINT welfare_assignments_assigned_by_users_id_fk FOREIGN KEY (assigned_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: welfare_assignments welfare_assignments_assigned_to_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_assignments
    ADD CONSTRAINT welfare_assignments_assigned_to_users_id_fk FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: welfare_assignments welfare_assignments_case_id_welfare_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_assignments
    ADD CONSTRAINT welfare_assignments_case_id_welfare_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.welfare_cases(id) ON DELETE CASCADE;


--
-- Name: welfare_cases welfare_cases_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_cases
    ADD CONSTRAINT welfare_cases_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: welfare_notes welfare_notes_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_notes
    ADD CONSTRAINT welfare_notes_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: welfare_notes welfare_notes_case_id_welfare_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.welfare_notes
    ADD CONSTRAINT welfare_notes_case_id_welfare_cases_id_fk FOREIGN KEY (case_id) REFERENCES public.welfare_cases(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict UyOJx1CiyzOFyLxlr7DTZov61UeTLxMkNrU6OcvU6YItcr8uwBHQMlr6l9okzyR

