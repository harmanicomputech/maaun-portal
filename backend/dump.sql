--
-- PostgreSQL database dump
--

\restrict 3vywHiyw8S0LbDp22nLbw45aWoDUWEdH77gPJIyUt7aFMzOTyMxeHZ6YYxCNt4X

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
-- Data for Name: academic_semesters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.academic_semesters (id, name, session_id, is_active, created_at) FROM stdin;
1	First Semester	1	f	2026-05-03 00:51:37.784825
2	Second Semester	1	f	2026-05-03 00:51:37.784825
3	First Semester	2	f	2026-05-03 00:51:37.784825
4	Second Semester	2	f	2026-05-03 00:51:37.784825
5	First Semester	3	f	2026-05-03 00:51:37.784825
6	Second Semester	3	f	2026-05-03 00:51:37.784825
7	First Semester	4	t	2026-05-03 00:51:37.784825
8	Second Semester	4	f	2026-05-03 00:51:37.784825
\.


--
-- Data for Name: academic_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.academic_sessions (id, name, is_active, created_at) FROM stdin;
1	2021/2022	f	2026-05-03 00:51:37.775554
2	2022/2023	f	2026-05-03 00:51:37.775554
3	2023/2024	f	2026-05-03 00:51:37.775554
4	2024/2025	t	2026-05-03 00:51:37.775554
\.


--
-- Data for Name: academic_standings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.academic_standings (id, student_id, cgpa, classification, status, total_units_attempted, total_quality_points, generated_at) FROM stdin;
1	1	3.82	Second Class Upper	good	20	76.4	2026-05-03 00:51:40.074808
2	2	4.76	First Class	good	20	95.2	2026-05-03 00:51:40.074808
3	3	4.1	First Class	good	20	82	2026-05-03 00:51:40.074808
4	4	2.14	Third Class	probation	20	42.8	2026-05-03 00:51:40.074808
5	5	4.76	First Class	good	20	95.2	2026-05-03 00:51:40.074808
6	6	3.12	Second Class Lower	good	20	62.4	2026-05-03 00:51:40.074808
7	7	1.18	Pass	probation	20	23.6	2026-05-03 00:51:40.074808
8	8	3.71	Second Class Upper	good	20	74.2	2026-05-03 00:51:40.074808
9	9	4.9	First Class	good	20	98	2026-05-03 00:51:40.074808
10	10	3.14	Second Class Lower	good	20	62.8	2026-05-03 00:51:40.074808
11	11	3.62	Second Class Upper	good	20	72.4	2026-05-03 00:51:40.074808
12	12	2.21	Third Class	probation	20	44.2	2026-05-03 00:51:40.074808
13	13	3.08	Second Class Lower	good	20	61.6	2026-05-03 00:51:40.074808
14	14	4.05	First Class	good	20	81	2026-05-03 00:51:40.074808
15	15	4.61	First Class	good	20	92.2	2026-05-03 00:51:40.074808
16	16	3.09	Second Class Lower	good	20	61.8	2026-05-03 00:51:40.074808
17	17	2.84	Second Class Lower	good	20	56.8	2026-05-03 00:51:40.074808
18	18	2.01	Third Class	probation	20	40.2	2026-05-03 00:51:40.074808
19	19	3.88	Second Class Upper	good	20	77.6	2026-05-03 00:51:40.074808
20	20	1.02	Pass	probation	20	20.4	2026-05-03 00:51:40.074808
21	1	5	Insufficient Credits	good	20	100	2026-05-03 01:26:51.50201
22	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:26:52.012515
23	20	0	Insufficient Credits	withdrawal_risk	20	0	2026-05-03 01:26:52.012728
24	1	5	Insufficient Credits	good	20	100	2026-05-03 01:26:52.012862
25	9	0	Insufficient Credits	probation	0	0	2026-05-03 01:26:52.013516
26	5	5	First Class Honours	good	38	190	2026-05-03 01:26:52.013304
27	4	1.9	Insufficient Credits	probation	20	38	2026-05-03 01:26:52.014028
28	10	4	Insufficient Credits	good	10	40	2026-05-03 01:26:52.014012
29	11	5	First Class Honours	good	38	190	2026-05-03 01:26:52.014028
30	7	0	Fail	withdrawal_risk	36	0	2026-05-03 01:26:52.014446
31	8	5	Insufficient Credits	good	20	100	2026-05-03 01:26:52.014577
32	3	0	Insufficient Credits	probation	0	0	2026-05-03 01:26:52.015613
33	19	5	Insufficient Credits	good	10	50	2026-05-03 01:26:52.018842
34	2	5	Insufficient Credits	good	10	50	2026-05-03 01:26:52.018975
35	13	4	Insufficient Credits	good	10	40	2026-05-03 01:26:52.019013
36	14	0	Insufficient Credits	probation	0	0	2026-05-03 01:26:52.019084
37	15	5	Insufficient Credits	good	20	100	2026-05-03 01:26:52.019141
38	17	4.11	Second Class Honours (Upper Division)	good	38	156	2026-05-03 01:26:52.019358
39	6	4	Insufficient Credits	good	10	40	2026-05-03 01:26:52.019393
40	16	4	Insufficient Credits	good	10	40	2026-05-03 01:26:52.019504
41	12	2.2	Insufficient Credits	good	20	44	2026-05-03 01:26:52.019478
42	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:26:52.338572
43	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:26:52.35645
44	1	5	Insufficient Credits	good	20	100	2026-05-03 01:31:00.60358
45	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:31:00.826655
46	20	0	Insufficient Credits	withdrawal_risk	20	0	2026-05-03 01:31:00.827334
47	19	5	Insufficient Credits	good	10	50	2026-05-03 01:31:00.827481
48	8	5	Insufficient Credits	good	20	100	2026-05-03 01:31:00.82766
49	9	0	Insufficient Credits	probation	0	0	2026-05-03 01:31:00.827933
50	10	4	Insufficient Credits	good	10	40	2026-05-03 01:31:00.828406
51	11	5	First Class Honours	good	38	190	2026-05-03 01:31:00.828465
52	4	1.9	Insufficient Credits	probation	20	38	2026-05-03 01:31:00.828977
53	2	5	Insufficient Credits	good	10	50	2026-05-03 01:31:00.829285
54	5	5	First Class Honours	good	38	190	2026-05-03 01:31:00.830366
55	3	0	Insufficient Credits	probation	0	0	2026-05-03 01:31:00.831191
56	1	5	Insufficient Credits	good	20	100	2026-05-03 01:31:00.833103
57	6	4	Insufficient Credits	good	10	40	2026-05-03 01:31:00.833331
58	12	2.2	Insufficient Credits	good	20	44	2026-05-03 01:31:00.833492
59	13	4	Insufficient Credits	good	10	40	2026-05-03 01:31:00.833567
60	14	0	Insufficient Credits	probation	0	0	2026-05-03 01:31:00.833687
61	15	5	Insufficient Credits	good	20	100	2026-05-03 01:31:00.833835
62	17	4.11	Second Class Honours (Upper Division)	good	38	156	2026-05-03 01:31:00.834072
63	16	4	Insufficient Credits	good	10	40	2026-05-03 01:31:00.83406
64	7	0	Fail	withdrawal_risk	36	0	2026-05-03 01:31:00.835808
65	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:31:01.169925
66	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:31:01.202936
67	1	5	Insufficient Credits	good	20	100	2026-05-03 01:32:05.474264
68	19	5	Insufficient Credits	good	10	50	2026-05-03 01:32:05.677003
70	9	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:05.677487
69	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:05.677237
71	5	5	First Class Honours	good	38	190	2026-05-03 01:32:05.677727
72	7	0	Fail	withdrawal_risk	36	0	2026-05-03 01:32:05.678224
74	1	5	Insufficient Credits	good	20	100	2026-05-03 01:32:05.678612
73	2	5	Insufficient Credits	good	10	50	2026-05-03 01:32:05.67853
75	8	5	Insufficient Credits	good	20	100	2026-05-03 01:32:05.678804
76	20	0	Insufficient Credits	withdrawal_risk	20	0	2026-05-03 01:32:05.679063
77	3	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:05.679425
78	11	5	First Class Honours	good	38	190	2026-05-03 01:32:05.680069
79	12	2.2	Insufficient Credits	good	20	44	2026-05-03 01:32:05.690773
80	13	4	Insufficient Credits	good	10	40	2026-05-03 01:32:05.69089
81	16	4	Insufficient Credits	good	10	40	2026-05-03 01:32:05.691168
82	15	5	Insufficient Credits	good	20	100	2026-05-03 01:32:05.691191
83	14	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:05.691468
84	17	4.11	Second Class Honours (Upper Division)	good	38	156	2026-05-03 01:32:05.69149
85	4	1.9	Insufficient Credits	probation	20	38	2026-05-03 01:32:05.691656
86	6	4	Insufficient Credits	good	10	40	2026-05-03 01:32:05.692083
87	10	4	Insufficient Credits	good	10	40	2026-05-03 01:32:05.693188
88	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:06.052825
89	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:06.090444
90	1	5	Insufficient Credits	good	20	100	2026-05-03 01:32:16.991933
91	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:17.187695
92	20	0	Insufficient Credits	withdrawal_risk	20	0	2026-05-03 01:32:17.18814
93	9	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:17.188434
94	1	5	Insufficient Credits	good	20	100	2026-05-03 01:32:17.188679
95	3	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:17.189247
96	2	5	Insufficient Credits	good	10	50	2026-05-03 01:32:17.18927
97	7	0	Fail	withdrawal_risk	36	0	2026-05-03 01:32:17.189508
105	14	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:17.193751
106	15	5	Insufficient Credits	good	20	100	2026-05-03 01:32:17.193898
107	16	4	Insufficient Credits	good	10	40	2026-05-03 01:32:17.194013
98	5	5	First Class Honours	good	38	190	2026-05-03 01:32:17.189961
99	4	1.9	Insufficient Credits	probation	20	38	2026-05-03 01:32:17.1901
100	19	5	Insufficient Credits	good	10	50	2026-05-03 01:32:17.190357
104	13	4	Insufficient Credits	good	10	40	2026-05-03 01:32:17.193671
108	17	4.11	Second Class Honours (Upper Division)	good	38	156	2026-05-03 01:32:17.194052
110	10	4	Insufficient Credits	good	10	40	2026-05-03 01:32:17.194429
111	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:17.598654
112	18	0	Insufficient Credits	probation	0	0	2026-05-03 01:32:17.629387
101	8	5	Insufficient Credits	good	20	100	2026-05-03 01:32:17.191305
102	11	5	First Class Honours	good	38	190	2026-05-03 01:32:17.19347
103	12	2.2	Insufficient Credits	good	20	44	2026-05-03 01:32:17.193639
109	6	4	Insufficient Credits	good	10	40	2026-05-03 01:32:17.194138
113	1	5	Insufficient Credits	good	20	100	2026-05-03 02:53:05.179184
146	1	5	Insufficient Credits	good	20	100	2026-05-03 03:00:03.030304
147	1	5	Insufficient Credits	good	20	100	2026-05-03 03:02:00.799873
148	1	5	Insufficient Credits	good	20	100	2026-05-03 03:02:07.612024
149	1	5	Insufficient Credits	good	20	100	2026-05-03 03:06:49.909508
150	1	5	Insufficient Credits	good	20	100	2026-05-03 03:07:27.628907
151	1	5	Insufficient Credits	good	20	100	2026-05-03 03:07:27.673126
152	1	5	Insufficient Credits	good	20	100	2026-05-03 03:15:49.86519
153	1	5	Insufficient Credits	good	20	100	2026-05-03 03:15:49.955893
154	1	5	Insufficient Credits	good	20	100	2026-05-03 03:20:01.433281
155	1	5	Insufficient Credits	good	20	100	2026-05-03 03:22:51.840732
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activity_logs (id, user_id, action, model, model_id, old_data, new_data, created_at) FROM stdin;
1	12	create_result	result	172	\N	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:26:51.855Z"}	2026-05-03 01:26:51.859691
2	12	submit_result	result	172	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:26:51.855Z"}	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:26:51.950Z"}	2026-05-03 01:26:51.955061
3	2	ANNOUNCEMENT_CREATED	announcements	9	\N	{"title":"System Auto-Test Announcement","targetRoles":["student","lecturer"],"ip":"127.0.0.1"}	2026-05-03 01:26:52.054939
4	2	ANNOUNCEMENT_DELETED	announcements	9	\N	{"title":"Auto-Test Announcement (Updated)","ip":"127.0.0.1"}	2026-05-03 01:26:52.070729
5	2	DISCIPLINARY_CASE_CREATED	disciplinary_cases	6	\N	{"title":"Auto-Test Case — Safe to Ignore","severity":"minor","studentId":18,"ip":"127.0.0.1"}	2026-05-03 01:26:52.206494
6	2	DISCIPLINARY_STATUS_CHANGED	disciplinary_cases	6	\N	{"from":"open","to":"under_review","ip":"127.0.0.1"}	2026-05-03 01:26:52.22357
7	2	DISCIPLINARY_STATUS_CHANGED	disciplinary_cases	6	\N	{"from":"under_review","to":"resolved","ip":"127.0.0.1"}	2026-05-03 01:26:52.240634
8	2	WELFARE_CASE_ASSIGNED	welfare_assignments	6	\N	{"caseId":1,"ip":"127.0.0.1"}	2026-05-03 01:26:52.280102
9	2	WELFARE_STATUS_CHANGED	welfare_cases	1	\N	{"from":"assigned","to":"in_progress","ip":"127.0.0.1"}	2026-05-03 01:26:52.293854
10	2	WELFARE_NOTE_ADDED	welfare_notes	7	\N	{"caseId":1,"isPrivate":false,"ip":"127.0.0.1"}	2026-05-03 01:26:52.307734
11	2	WELFARE_PRIORITY_CHANGED	welfare_cases	1	\N	{"priority":"medium","ip":"127.0.0.1"}	2026-05-03 01:26:52.317581
12	2	TRANSCRIPT_GENERATED	transcript	5	\N	{"ref":"MAAUN-TXN-2026-0C18A7C4","role":"admin","ip":"127.0.0.1"}	2026-05-03 01:26:52.332393
13	2	TRANSCRIPT_APPROVED	transcript	5	\N	{"status":"approved","ip":"127.0.0.1"}	2026-05-03 01:26:52.348098
14	18	WELFARE_CASE_SUBMITTED	welfare_cases	7	\N	{"category":"academic_stress","priority":"low","ip":"127.0.0.1"}	2026-05-03 01:31:00.712607
15	12	update_result	result	172	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:26:51.950Z"}	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:31:00.748Z"}	2026-05-03 01:31:00.751895
16	12	submit_result	result	172	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:31:00.748Z"}	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:31:00.758Z"}	2026-05-03 01:31:00.761316
17	2	ANNOUNCEMENT_CREATED	announcements	10	\N	{"title":"System Auto-Test Announcement","targetRoles":["student","lecturer"],"ip":"127.0.0.1"}	2026-05-03 01:31:00.870193
18	2	ANNOUNCEMENT_DELETED	announcements	10	\N	{"title":"Auto-Test (Updated)","ip":"127.0.0.1"}	2026-05-03 01:31:00.884938
19	2	DISCIPLINARY_CASE_CREATED	disciplinary_cases	7	\N	{"title":"Auto-Test Case — Safe to Ignore","severity":"minor","studentId":18,"ip":"127.0.0.1"}	2026-05-03 01:31:01.023052
20	2	DISCIPLINARY_STATUS_CHANGED	disciplinary_cases	7	\N	{"from":"open","to":"under_review","ip":"127.0.0.1"}	2026-05-03 01:31:01.042858
21	2	DISCIPLINARY_ACTION_APPLIED	disciplinary_actions	6	\N	{"caseId":7,"actionType":"warning","ip":"127.0.0.1"}	2026-05-03 01:31:01.056132
22	2	DISCIPLINARY_STATUS_CHANGED	disciplinary_cases	7	\N	{"from":"under_review","to":"resolved","ip":"127.0.0.1"}	2026-05-03 01:31:01.072745
23	2	WELFARE_CASE_ASSIGNED	welfare_assignments	7	\N	{"caseId":7,"ip":"127.0.0.1"}	2026-05-03 01:31:01.11454
24	2	WELFARE_STATUS_CHANGED	welfare_cases	7	\N	{"from":"assigned","to":"in_progress","ip":"127.0.0.1"}	2026-05-03 01:31:01.127752
25	2	WELFARE_NOTE_ADDED	welfare_notes	8	\N	{"caseId":7,"isPrivate":false,"ip":"127.0.0.1"}	2026-05-03 01:31:01.140701
26	2	WELFARE_PRIORITY_CHANGED	welfare_cases	7	\N	{"priority":"medium","ip":"127.0.0.1"}	2026-05-03 01:31:01.148813
27	2	TRANSCRIPT_GENERATED	transcript	6	\N	{"ref":"MAAUN-TXN-2026-FEC2DBC0","role":"admin","ip":"127.0.0.1"}	2026-05-03 01:31:01.162846
28	2	TRANSCRIPT_PENDING	transcript	6	\N	{"status":"pending","ip":"127.0.0.1"}	2026-05-03 01:31:01.178821
29	2	TRANSCRIPT_APPROVED	transcript	6	\N	{"status":"approved","ip":"127.0.0.1"}	2026-05-03 01:31:01.187172
30	2	TRANSCRIPT_OFFICIAL	transcript	6	\N	{"status":"official","ip":"127.0.0.1"}	2026-05-03 01:31:01.196495
31	18	WELFARE_CASE_SUBMITTED	welfare_cases	8	\N	{"category":"academic_stress","priority":"low","ip":"127.0.0.1"}	2026-05-03 01:32:05.559323
32	12	update_result	result	172	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:31:00.758Z"}	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:05.595Z"}	2026-05-03 01:32:05.599363
33	12	submit_result	result	172	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:05.595Z"}	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:05.605Z"}	2026-05-03 01:32:05.608764
34	2	ANNOUNCEMENT_CREATED	announcements	11	\N	{"title":"System Auto-Test Announcement","targetRoles":["student","lecturer"],"ip":"127.0.0.1"}	2026-05-03 01:32:05.728055
35	2	ANNOUNCEMENT_DELETED	announcements	11	\N	{"title":"Auto-Test (Updated)","ip":"127.0.0.1"}	2026-05-03 01:32:05.741938
36	2	DISCIPLINARY_CASE_CREATED	disciplinary_cases	8	\N	{"title":"Auto-Test Case — Safe to Ignore","severity":"minor","studentId":1,"ip":"127.0.0.1"}	2026-05-03 01:32:05.872684
37	2	DISCIPLINARY_STATUS_CHANGED	disciplinary_cases	8	\N	{"from":"open","to":"under_review","ip":"127.0.0.1"}	2026-05-03 01:32:05.890819
38	2	DISCIPLINARY_ACTION_APPLIED	disciplinary_actions	7	\N	{"caseId":8,"actionType":"warning","ip":"127.0.0.1"}	2026-05-03 01:32:05.905146
39	18	APPEAL_SUBMITTED	disciplinary_appeals	3	\N	{"caseId":8,"ip":"127.0.0.1"}	2026-05-03 01:32:05.924286
40	2	APPEAL_REVIEW_STARTED	disciplinary_appeals	3	\N	{"caseId":8,"ip":"127.0.0.1"}	2026-05-03 01:32:05.945766
41	2	DISCIPLINARY_STATUS_CHANGED	disciplinary_cases	8	\N	{"from":"under_review","to":"resolved","ip":"127.0.0.1"}	2026-05-03 01:32:05.95921
42	2	WELFARE_CASE_ASSIGNED	welfare_assignments	8	\N	{"caseId":8,"ip":"127.0.0.1"}	2026-05-03 01:32:06.000797
43	2	WELFARE_STATUS_CHANGED	welfare_cases	8	\N	{"from":"assigned","to":"in_progress","ip":"127.0.0.1"}	2026-05-03 01:32:06.011078
44	2	WELFARE_NOTE_ADDED	welfare_notes	9	\N	{"caseId":8,"isPrivate":false,"ip":"127.0.0.1"}	2026-05-03 01:32:06.022933
45	2	WELFARE_PRIORITY_CHANGED	welfare_cases	8	\N	{"priority":"medium","ip":"127.0.0.1"}	2026-05-03 01:32:06.032523
46	2	TRANSCRIPT_GENERATED	transcript	7	\N	{"ref":"MAAUN-TXN-2026-310E9BFF","role":"admin","ip":"127.0.0.1"}	2026-05-03 01:32:06.046611
47	2	TRANSCRIPT_PENDING	transcript	7	\N	{"status":"pending","ip":"127.0.0.1"}	2026-05-03 01:32:06.062018
48	2	TRANSCRIPT_APPROVED	transcript	7	\N	{"status":"approved","ip":"127.0.0.1"}	2026-05-03 01:32:06.070095
49	2	TRANSCRIPT_OFFICIAL	transcript	7	\N	{"status":"official","ip":"127.0.0.1"}	2026-05-03 01:32:06.083259
50	18	WELFARE_CASE_SUBMITTED	welfare_cases	9	\N	{"category":"academic_stress","priority":"low","ip":"127.0.0.1"}	2026-05-03 01:32:17.081797
51	12	update_result	result	172	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:05.605Z"}	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:17.116Z"}	2026-05-03 01:32:17.120269
52	12	submit_result	result	172	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"draft","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:17.116Z"}	{"id":172,"studentId":18,"courseId":1,"semester":"first","academicYear":"2024/2025","caScore":25,"examScore":55,"totalScore":80,"grade":"A","gradePoint":5,"status":"submitted","createdAt":"2026-05-03T01:26:51.855Z","updatedAt":"2026-05-03T01:32:17.126Z"}	2026-05-03 01:32:17.129257
53	2	ANNOUNCEMENT_CREATED	announcements	12	\N	{"title":"System Auto-Test Announcement","targetRoles":["student","lecturer"],"ip":"127.0.0.1"}	2026-05-03 01:32:17.240207
54	2	ANNOUNCEMENT_DELETED	announcements	12	\N	{"title":"Auto-Test (Updated)","ip":"127.0.0.1"}	2026-05-03 01:32:17.253516
55	2	DISCIPLINARY_CASE_CREATED	disciplinary_cases	9	\N	{"title":"Auto-Test Case — Safe to Ignore","severity":"minor","studentId":1,"ip":"127.0.0.1"}	2026-05-03 01:32:17.394781
56	2	DISCIPLINARY_STATUS_CHANGED	disciplinary_cases	9	\N	{"from":"open","to":"under_review","ip":"127.0.0.1"}	2026-05-03 01:32:17.413297
57	2	DISCIPLINARY_ACTION_APPLIED	disciplinary_actions	8	\N	{"caseId":9,"actionType":"warning","ip":"127.0.0.1"}	2026-05-03 01:32:17.427423
58	18	APPEAL_SUBMITTED	disciplinary_appeals	4	\N	{"caseId":9,"ip":"127.0.0.1"}	2026-05-03 01:32:17.445384
59	2	APPEAL_REVIEW_STARTED	disciplinary_appeals	4	\N	{"caseId":9,"ip":"127.0.0.1"}	2026-05-03 01:32:17.466027
60	2	APPEAL_DECISION_MADE	appeal_decisions	3	\N	{"appealId":4,"caseId":9,"decision":"dismiss","ip":"127.0.0.1"}	2026-05-03 01:32:17.491405
61	2	DISCIPLINARY_STATUS_CHANGED	disciplinary_cases	9	\N	{"from":"dismissed","to":"resolved","ip":"127.0.0.1"}	2026-05-03 01:32:17.50397
62	2	WELFARE_CASE_ASSIGNED	welfare_assignments	9	\N	{"caseId":9,"ip":"127.0.0.1"}	2026-05-03 01:32:17.541894
63	2	WELFARE_STATUS_CHANGED	welfare_cases	9	\N	{"from":"assigned","to":"in_progress","ip":"127.0.0.1"}	2026-05-03 01:32:17.553939
64	2	WELFARE_NOTE_ADDED	welfare_notes	10	\N	{"caseId":9,"isPrivate":false,"ip":"127.0.0.1"}	2026-05-03 01:32:17.567067
65	2	WELFARE_PRIORITY_CHANGED	welfare_cases	9	\N	{"priority":"medium","ip":"127.0.0.1"}	2026-05-03 01:32:17.575643
66	2	TRANSCRIPT_GENERATED	transcript	8	\N	{"ref":"MAAUN-TXN-2026-90000B7A","role":"admin","ip":"127.0.0.1"}	2026-05-03 01:32:17.590597
67	2	TRANSCRIPT_PENDING	transcript	8	\N	{"status":"pending","ip":"127.0.0.1"}	2026-05-03 01:32:17.607129
68	2	TRANSCRIPT_APPROVED	transcript	8	\N	{"status":"approved","ip":"127.0.0.1"}	2026-05-03 01:32:17.61505
69	2	TRANSCRIPT_OFFICIAL	transcript	8	\N	{"status":"official","ip":"127.0.0.1"}	2026-05-03 01:32:17.623051
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.announcements (id, title, content, created_by, target_roles, target_departments, target_levels, is_pinned, expires_at, created_at, updated_at) FROM stdin;
1	2nd Semester Course Registration — Deadline Notice	All students are reminded that 2nd semester course registration closes on January 20, 2025. Students who fail to register before the deadline will be unable to attend lectures or sit exams. Log in to the Student Portal > My Enrollments to complete registration. Clearance of outstanding fees is required before registration can proceed.	1	["student","lecturer"]	\N	\N	t	2025-01-20 00:00:00	2026-05-03 00:51:40.144941	2026-05-03 00:51:40.144941
2	Second Semester Tuition Fee Payment Deadline	The deadline for payment of 2024/2025 Second Semester school fees is February 1, 2025. Students with outstanding balances will be barred from examination halls. Payment can be made through the Paystack portal on the Student Portal. For queries, contact the Bursary office at bursary@maaun.edu.ng.	1	["student"]	\N	\N	t	\N	2026-05-03 00:51:40.144941	2026-05-03 00:51:40.144941
3	17th Convocation Ceremony — July 12, 2025	The 17th Convocation Ceremony for graduating students of the 2020/2021 and 2021/2022 academic sessions is scheduled for Saturday, July 12, 2025, at the MAAUN Main Auditorium. Eligible graduates must collect academic gowns from the Registry (Block B, Room 14) between June 30 and July 8, 2025. Attendance is compulsory. Four (4) guest seats are allocated per graduate.	1	["student","admin","registrar","dean"]	\N	\N	t	\N	2026-05-03 00:51:40.144941	2026-05-03 00:51:40.144941
4	Library Extended Hours — Examination Period	The university library will operate extended hours from Monday to Saturday (7:00 AM – 10:00 PM) throughout the examination period (January 27 – February 20, 2025). Students are advised to bring valid student ID cards. Group study rooms must be booked 24 hours in advance via the library portal.	1	["student"]	\N	\N	f	\N	2026-05-03 00:51:40.144941	2026-05-03 00:51:40.144941
5	Monthly Staff Senate Meeting — January 2025	The January 2025 Staff Senate meeting is scheduled for Wednesday, January 8, 2025 at 2:00 PM in the Senate Chamber, Main Administration Block. All academic staff are required to attend. Items for discussion include examination timetable approval, research grant applications, and 2025/2026 session planning.	1	["lecturer","admin","hod","dean","registrar"]	\N	\N	f	\N	2026-05-03 00:51:40.144941	2026-05-03 00:51:40.144941
6	New Course Offerings — 2nd Semester 2024/2025	The following new elective courses are available for registration in the 2024/2025 Second Semester: CSC Dept — Cloud Computing (CSC410); BA Dept — Digital Marketing (BUS410); MC Dept — Social Media Analytics (MCM410). These courses are open to all 400L students. Enrolment is first-come-first-served with a cap of 30 students each.	5	["student","hod","lecturer"]	\N	\N	f	\N	2026-05-03 00:51:40.144941	2026-05-03 00:51:40.144941
7	MAAUN Merit Scholarship Applications Open	Applications for the 2025/2026 MAAUN Merit Scholarship are now open. Eligible students must have a minimum CGPA of 3.50, no outstanding disciplinary record, and at least 3 semesters remaining. The scholarship covers 50% of tuition for one academic year. Submit applications with supporting documents to the Registry by March 15, 2025.	1	["student"]	\N	\N	f	\N	2026-05-03 00:51:40.144941	2026-05-03 00:51:40.144941
8	IT Week 2025 — Innovation, Code & Career Fair	MAAUN IT Week 2025 runs from February 17–21, 2025. Events include a 24-hour Hackathon, Developer Career Fair with 15+ top tech companies, AI/ML Workshop by Google Developer Group, and a CS Project Exhibition. All students and staff are welcome. Registration is free at itweek.maaun.edu.ng. First prize for hackathon: ₦500,000 + internship placement.	1	["student","lecturer","admin","hod","dean"]	\N	\N	f	\N	2026-05-03 00:51:40.144941	2026-05-03 00:51:40.144941
\.


--
-- Data for Name: appeal_decisions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.appeal_decisions (id, appeal_id, decision, modified_action, remarks, decided_by, created_at) FROM stdin;
1	1	modify	Suspension reduced to 2 weeks. Hostel block retained. Academic restriction lifted after suspension.	Evidence of unintentional misconduct is credible. Sanction modified proportionately.	1	2026-05-03 00:51:40.044891
2	2	dismiss	\N	CCTV footage is conclusive. Physical assault causing injury warrants expulsion per Section 14(b) of the Student Conduct Policy. No grounds for modification.	1	2026-05-03 00:51:40.044891
3	4	dismiss	\N	Auto-test decision	2	2026-05-03 01:32:17.473622
\.


--
-- Data for Name: bed_spaces; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bed_spaces (id, room_id, bed_label, student_id, status) FROM stdin;
8	2	D	\N	vacant
9	3	A	\N	vacant
10	3	B	\N	vacant
11	3	C	\N	vacant
12	3	D	\N	vacant
13	4	A	\N	vacant
14	4	B	\N	vacant
15	4	C	\N	vacant
16	4	D	\N	vacant
17	5	A	\N	vacant
18	5	B	\N	vacant
19	5	C	\N	vacant
20	5	D	\N	vacant
29	8	A	\N	vacant
30	8	B	\N	vacant
31	8	C	\N	vacant
32	8	D	\N	vacant
33	9	A	\N	vacant
34	9	B	\N	vacant
35	9	C	\N	vacant
36	9	D	\N	vacant
37	10	A	\N	vacant
38	10	B	\N	vacant
39	10	C	\N	vacant
40	10	D	\N	vacant
1	1	A	2	occupied
2	1	B	6	occupied
3	1	C	8	occupied
4	1	D	10	occupied
5	2	A	14	occupied
6	2	B	16	occupied
7	2	C	18	occupied
21	6	A	1	occupied
22	6	B	3	occupied
23	6	C	5	occupied
24	6	D	9	occupied
25	7	A	11	occupied
26	7	B	13	occupied
27	7	C	15	occupied
28	7	D	19	occupied
41	11	A	\N	vacant
42	11	B	\N	vacant
43	12	A	\N	vacant
44	12	B	\N	vacant
45	13	A	\N	vacant
46	13	B	\N	vacant
47	14	A	\N	vacant
48	14	B	\N	vacant
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.courses (id, course_code, title, unit, department, faculty, level, semester, description, lecturer_id, created_at, updated_at) FROM stdin;
1	CSC101	Programming Fundamentals	3	Computer Science	Science and Technology	100	first	\N	1	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
2	CSC102	Introduction to Databases	3	Computer Science	Science and Technology	100	second	\N	2	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
3	CSC201	Data Structures & Algorithms	3	Computer Science	Science and Technology	200	first	\N	1	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
4	CSC202	Computer Architecture	3	Computer Science	Science and Technology	200	second	\N	2	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
5	CSC301	Software Engineering	3	Computer Science	Science and Technology	300	first	\N	1	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
6	CSC302	Operating Systems	3	Computer Science	Science and Technology	300	second	\N	2	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
7	CSC401	Artificial Intelligence	3	Computer Science	Science and Technology	400	first	\N	1	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
8	CSC402	Final Year Project (CS)	6	Computer Science	Science and Technology	400	second	\N	1	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
9	BUS101	Principles of Management	3	Business Administration	Management Sciences	100	first	\N	3	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
10	BUS102	Introduction to Accounting	3	Business Administration	Management Sciences	100	second	\N	4	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
11	BUS201	Organisational Behaviour	3	Business Administration	Management Sciences	200	first	\N	3	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
12	BUS202	Business Finance	3	Business Administration	Management Sciences	200	second	\N	4	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
13	BUS301	Strategic Management	3	Business Administration	Management Sciences	300	first	\N	3	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
14	BUS302	Business Law	3	Business Administration	Management Sciences	300	second	\N	4	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
15	BUS401	Business Policy	3	Business Administration	Management Sciences	400	first	\N	3	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
16	BUS402	Final Year Project (BA)	6	Business Administration	Management Sciences	400	second	\N	3	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
17	MCM101	Intro to Mass Communication	3	Mass Communication	Arts and Social Sciences	100	first	\N	5	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
18	MCM102	Media Writing	3	Mass Communication	Arts and Social Sciences	100	second	\N	6	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
19	MCM201	Broadcast Journalism	3	Mass Communication	Arts and Social Sciences	200	first	\N	5	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
20	MCM202	Media Ethics	3	Mass Communication	Arts and Social Sciences	200	second	\N	6	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
21	MCM301	Digital Media Production	3	Mass Communication	Arts and Social Sciences	300	first	\N	5	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
22	MCM302	Public Relations	3	Mass Communication	Arts and Social Sciences	300	second	\N	6	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
23	MCM401	Media Research Methods	3	Mass Communication	Arts and Social Sciences	400	first	\N	5	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
24	MCM402	Final Year Project (MC)	6	Mass Communication	Arts and Social Sciences	400	second	\N	5	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
25	GST101	Use of English I	2	General Studies	General Studies	100	first	\N	1	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
26	GST102	Nigerian History & Culture	2	General Studies	General Studies	100	second	\N	2	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
27	GST201	Philosophy & Logic	2	General Studies	General Studies	200	first	\N	3	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
28	GST202	Leadership & Ethics	2	General Studies	General Studies	200	second	\N	4	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
29	GST301	Research Skills	2	General Studies	General Studies	300	first	\N	5	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
30	GST302	Innovation & Society	2	General Studies	General Studies	300	second	\N	6	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
31	GST401	Community Development	2	General Studies	General Studies	400	first	\N	1	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
32	GST402	Sustainable Development	2	General Studies	General Studies	400	second	\N	2	2026-05-03 00:51:37.918535	2026-05-03 00:51:37.918535
35	X	X	1	X	X	100	first	\N	\N	2026-05-03 01:26:52.567544	2026-05-03 01:26:52.567544
\.


--
-- Data for Name: disciplinary_actions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.disciplinary_actions (id, case_id, action_type, start_date, end_date, remarks, applied_by, applied_at) FROM stdin;
1	1	suspension	2026-04-19	2026-05-17	Two-week suspension from all academic activities and hostel access. To be reviewed after suspension period.	1	2026-05-03 00:51:40.032682
2	2	expulsion	2026-04-19	\N	Student expelled from MAAUN effective immediately. All academic records frozen pending final processing.	1	2026-05-03 00:51:40.032682
3	3	warning	2026-05-03	\N	Official written warning issued. Further violations will result in escalated action.	2	2026-05-03 00:51:40.032682
4	4	restriction	2026-05-03	2026-05-17	Student restricted to front-row seating and must surrender phone to invigilator at start of each lecture.	2	2026-05-03 00:51:40.032682
5	5	warning	2026-05-03	\N	Counselling session attended. Attendance contract signed. Academic advisor assigned.	1	2026-05-03 00:51:40.032682
6	7	warning	2026-05-03	\N	Auto-test sanction	2	2026-05-03 01:31:01.048698
7	8	warning	2026-05-03	\N	Auto-test sanction	2	2026-05-03 01:32:05.89811
8	9	warning	2026-05-03	\N	Auto-test sanction	2	2026-05-03 01:32:17.420552
\.


--
-- Data for Name: disciplinary_appeals; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.disciplinary_appeals (id, case_id, student_id, reason, evidence, status, reviewed_by, admin_response, created_at, resolved_at) FROM stdin;
1	1	4	I strongly contest the allegation of examination malpractice. The notes found were pre-existing margin notes in my textbook which I inadvertently brought into the exam hall. I had no intention of using them to cheat and deeply regret the misunderstanding.	My textbook with annotations predating the exam, character references from two lecturers.	accepted	1	After reviewing the evidence, the committee acknowledges mitigating circumstances. Suspension reduced from 4 weeks to 2 weeks. Hostel block remains.	2024-11-05 00:00:00	2024-11-12 00:00:00
2	2	20	I accept responsibility for my actions but plead for leniency considering my family circumstances. This was an isolated incident triggered by extreme personal stress and I have since undergone counselling.	Counselling session certificates, medical report, family financial hardship letter.	rejected	1	The severity of the physical assault and clear CCTV evidence leaves no basis for reversal. The University Senate's decision to expel stands. The student may reapply for admission after a minimum of 2 years.	2024-11-08 00:00:00	2024-11-20 00:00:00
3	8	1	Auto-test appeal — requesting review of this system-generated case.	No evidence — system test only	under_review	2	\N	2026-05-03 01:32:05.913665	\N
4	9	1	Auto-test appeal — requesting review of this system-generated case.	No evidence — system test only	accepted	2	System test — no action required	2026-05-03 01:32:17.435253	2026-05-03 01:32:17.48
\.


--
-- Data for Name: disciplinary_cases; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.disciplinary_cases (id, student_id, reported_by, title, description, severity, status, resolution_note, created_at, updated_at) FROM stdin;
1	4	2	Examination Malpractice — Unauthorized Material	Student was found with unauthorized notes during the CSC301 mid-semester examination. Invigilator confiscated the material and reported immediately.	major	resolved	Case reviewed by Dean. Suspension applied.	2026-05-03 00:51:40.028688	2026-05-03 00:51:40.028688
2	20	1	Physical Assault on Fellow Student	Student physically assaulted a fellow student outside the library on 2nd October 2024 resulting in injuries requiring medical attention. CCTV evidence confirmed.	critical	resolved	University Senate upheld expulsion recommendation after appeal review.	2026-05-03 00:51:40.028688	2026-05-03 00:51:40.028688
3	14	2	Persistent Lateness to Lectures	Student has been consistently late to 60% of lectures in BUS101 over four weeks. Lecturer filed formal complaint after verbal warnings failed.	minor	resolved	Warning issued and acknowledged by student.	2026-05-03 00:51:40.028688	2026-05-03 00:51:40.028688
4	18	2	Disruptive Behaviour in Lecture Hall	Student repeatedly disrupted MCM101 lectures by talking loudly, using mobile phone, and ignoring instructor's warnings.	moderate	under_review	\N	2026-05-03 00:51:40.028688	2026-05-03 00:51:40.028688
5	12	2	Habitual Absenteeism	Student has exceeded the allowed 30% absenteeism threshold in BUS301. Attendance records show 65% absence across October–November 2024.	minor	resolved	Student counselled and issued attendance warning.	2026-05-03 00:51:40.028688	2026-05-03 00:51:40.028688
6	18	2	Auto-Test Case — Safe to Ignore	Created by system test runner to verify endpoint functionality.	minor	resolved	Auto-test resolved	2026-05-03 01:26:52.200097	2026-05-03 01:26:52.234
7	18	2	Auto-Test Case — Safe to Ignore	Created by system test runner to verify endpoint functionality.	minor	resolved	Auto-test resolved	2026-05-03 01:31:01.01682	2026-05-03 01:31:01.065
8	1	2	Auto-Test Case — Safe to Ignore	Created by system test runner to verify endpoint functionality.	minor	resolved	Auto-test resolved	2026-05-03 01:32:05.866854	2026-05-03 01:32:05.952
9	1	2	Auto-Test Case — Safe to Ignore	Created by system test runner to verify endpoint functionality.	minor	resolved	Auto-test resolved	2026-05-03 01:32:17.388055	2026-05-03 01:32:17.496
\.


--
-- Data for Name: disciplinary_flags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.disciplinary_flags (id, student_id, flag_type, active, related_case_id, created_at) FROM stdin;
1	4	hostel_block	t	1	2026-05-03 00:51:40.036209
2	20	graduation_block	t	2	2026-05-03 00:51:40.036209
3	20	hostel_block	t	2	2026-05-03 00:51:40.036209
4	20	academic_hold	t	2	2026-05-03 00:51:40.036209
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.enrollments (id, student_id, course_id, semester, academic_year, status, enrolled_at) FROM stdin;
1	1	1	first	2022/2023	completed	2026-05-03 00:51:37.926023
2	1	25	first	2022/2023	completed	2026-05-03 00:51:37.934916
3	1	2	second	2022/2023	completed	2026-05-03 00:51:37.942333
4	1	26	second	2022/2023	completed	2026-05-03 00:51:37.950078
5	1	3	first	2023/2024	completed	2026-05-03 00:51:37.957998
6	1	27	first	2023/2024	completed	2026-05-03 00:51:37.964669
7	1	4	second	2023/2024	completed	2026-05-03 00:51:37.971852
8	1	28	second	2023/2024	completed	2026-05-03 00:51:37.978839
9	1	5	first	2024/2025	active	2026-05-03 00:51:37.986199
10	1	29	first	2024/2025	active	2026-05-03 00:51:37.993773
11	2	1	first	2023/2024	completed	2026-05-03 00:51:38.004689
12	2	25	first	2023/2024	completed	2026-05-03 00:51:38.014729
13	2	2	second	2023/2024	completed	2026-05-03 00:51:38.021788
14	2	26	second	2023/2024	completed	2026-05-03 00:51:38.029802
15	2	3	first	2024/2025	active	2026-05-03 00:51:38.037228
16	2	27	first	2024/2025	active	2026-05-03 00:51:38.044952
17	3	1	first	2024/2025	active	2026-05-03 00:51:38.055651
18	3	25	first	2024/2025	active	2026-05-03 00:51:38.062312
19	4	1	first	2022/2023	completed	2026-05-03 00:51:38.072981
20	4	25	first	2022/2023	completed	2026-05-03 00:51:38.079202
21	4	2	second	2022/2023	completed	2026-05-03 00:51:38.085187
22	4	26	second	2022/2023	completed	2026-05-03 00:51:38.091574
23	4	3	first	2023/2024	completed	2026-05-03 00:51:38.098259
24	4	27	first	2023/2024	completed	2026-05-03 00:51:38.105027
25	4	4	second	2023/2024	completed	2026-05-03 00:51:38.112068
26	4	28	second	2023/2024	completed	2026-05-03 00:51:38.118076
27	4	5	first	2024/2025	active	2026-05-03 00:51:38.123777
28	4	29	first	2024/2025	active	2026-05-03 00:51:38.129753
29	4	3	first	2024/2025	active	2026-05-03 00:51:38.136612
30	5	1	first	2021/2022	completed	2026-05-03 00:51:38.146
31	5	25	first	2021/2022	completed	2026-05-03 00:51:38.152193
32	5	2	second	2021/2022	completed	2026-05-03 00:51:38.15798
33	5	26	second	2021/2022	completed	2026-05-03 00:51:38.16414
34	5	3	first	2022/2023	completed	2026-05-03 00:51:38.170641
35	5	27	first	2022/2023	completed	2026-05-03 00:51:38.177464
36	5	4	second	2022/2023	completed	2026-05-03 00:51:38.184105
37	5	28	second	2022/2023	completed	2026-05-03 00:51:38.190761
38	5	5	first	2023/2024	completed	2026-05-03 00:51:38.197104
39	5	29	first	2023/2024	completed	2026-05-03 00:51:38.20426
40	5	6	second	2023/2024	completed	2026-05-03 00:51:38.210001
41	5	30	second	2023/2024	completed	2026-05-03 00:51:38.215718
42	5	7	first	2024/2025	active	2026-05-03 00:51:38.221813
43	5	31	first	2024/2025	active	2026-05-03 00:51:38.227679
44	5	8	second	2024/2025	completed	2026-05-03 00:51:38.233686
45	5	32	second	2024/2025	completed	2026-05-03 00:51:38.239817
46	6	1	first	2023/2024	completed	2026-05-03 00:51:38.250433
47	6	25	first	2023/2024	completed	2026-05-03 00:51:38.257581
48	6	2	second	2023/2024	completed	2026-05-03 00:51:38.264035
49	6	26	second	2023/2024	completed	2026-05-03 00:51:38.270477
50	6	3	first	2024/2025	active	2026-05-03 00:51:38.276754
51	6	27	first	2024/2025	active	2026-05-03 00:51:38.28358
52	7	1	first	2021/2022	completed	2026-05-03 00:51:38.292649
53	7	25	first	2021/2022	completed	2026-05-03 00:51:38.299502
54	7	2	second	2021/2022	completed	2026-05-03 00:51:38.305412
55	7	26	second	2021/2022	completed	2026-05-03 00:51:38.311573
56	7	3	first	2022/2023	completed	2026-05-03 00:51:38.317246
57	7	27	first	2022/2023	completed	2026-05-03 00:51:38.323619
58	7	4	second	2022/2023	completed	2026-05-03 00:51:38.329722
59	7	28	second	2022/2023	completed	2026-05-03 00:51:38.339369
60	7	5	first	2023/2024	completed	2026-05-03 00:51:38.346577
61	7	29	first	2023/2024	completed	2026-05-03 00:51:38.352774
62	7	3	first	2023/2024	completed	2026-05-03 00:51:38.359079
63	7	6	second	2023/2024	completed	2026-05-03 00:51:38.365429
64	7	30	second	2023/2024	completed	2026-05-03 00:51:38.371597
65	7	4	second	2023/2024	completed	2026-05-03 00:51:38.377659
66	7	7	first	2024/2025	active	2026-05-03 00:51:38.383453
67	7	31	first	2024/2025	active	2026-05-03 00:51:38.389649
68	7	5	first	2024/2025	active	2026-05-03 00:51:38.397488
69	8	9	first	2022/2023	completed	2026-05-03 00:51:38.405706
70	8	25	first	2022/2023	completed	2026-05-03 00:51:38.411534
71	8	10	second	2022/2023	completed	2026-05-03 00:51:38.417215
72	8	26	second	2022/2023	completed	2026-05-03 00:51:38.519422
73	8	11	first	2023/2024	completed	2026-05-03 00:51:38.526227
74	8	27	first	2023/2024	completed	2026-05-03 00:51:38.532017
75	8	12	second	2023/2024	completed	2026-05-03 00:51:38.538712
76	8	28	second	2023/2024	completed	2026-05-03 00:51:38.545005
77	8	13	first	2024/2025	active	2026-05-03 00:51:38.551846
78	8	29	first	2024/2025	active	2026-05-03 00:51:38.558733
79	9	9	first	2024/2025	active	2026-05-03 00:51:38.569246
80	9	25	first	2024/2025	active	2026-05-03 00:51:38.575572
81	10	9	first	2023/2024	completed	2026-05-03 00:51:38.585772
82	10	25	first	2023/2024	completed	2026-05-03 00:51:38.592542
83	10	10	second	2023/2024	completed	2026-05-03 00:51:38.59867
84	10	26	second	2023/2024	completed	2026-05-03 00:51:38.604403
85	10	11	first	2024/2025	active	2026-05-03 00:51:38.610399
86	10	27	first	2024/2025	active	2026-05-03 00:51:38.61584
87	11	9	first	2021/2022	completed	2026-05-03 00:51:38.625116
88	11	25	first	2021/2022	completed	2026-05-03 00:51:38.630965
89	11	10	second	2021/2022	completed	2026-05-03 00:51:38.638176
90	11	26	second	2021/2022	completed	2026-05-03 00:51:38.64432
91	11	11	first	2022/2023	completed	2026-05-03 00:51:38.649523
92	11	27	first	2022/2023	completed	2026-05-03 00:51:38.656098
93	11	12	second	2022/2023	completed	2026-05-03 00:51:38.662105
94	11	28	second	2022/2023	completed	2026-05-03 00:51:38.668111
95	11	13	first	2023/2024	completed	2026-05-03 00:51:38.674726
96	11	29	first	2023/2024	completed	2026-05-03 00:51:38.681431
97	11	14	second	2023/2024	completed	2026-05-03 00:51:38.687114
98	11	30	second	2023/2024	completed	2026-05-03 00:51:38.692941
99	11	15	first	2024/2025	active	2026-05-03 00:51:38.698636
100	11	31	first	2024/2025	active	2026-05-03 00:51:38.704844
101	11	16	second	2024/2025	completed	2026-05-03 00:51:38.711209
102	11	32	second	2024/2025	completed	2026-05-03 00:51:38.71763
103	12	9	first	2022/2023	completed	2026-05-03 00:51:38.727442
104	12	25	first	2022/2023	completed	2026-05-03 00:51:38.733395
105	12	10	second	2022/2023	completed	2026-05-03 00:51:38.739005
106	12	26	second	2022/2023	completed	2026-05-03 00:51:38.746682
107	12	11	first	2023/2024	completed	2026-05-03 00:51:38.753021
108	12	27	first	2023/2024	completed	2026-05-03 00:51:38.761108
109	12	12	second	2023/2024	completed	2026-05-03 00:51:38.767575
110	12	28	second	2023/2024	completed	2026-05-03 00:51:38.773745
111	12	13	first	2024/2025	active	2026-05-03 00:51:38.780556
112	12	29	first	2024/2025	active	2026-05-03 00:51:38.786573
113	13	9	first	2023/2024	completed	2026-05-03 00:51:38.795627
114	13	25	first	2023/2024	completed	2026-05-03 00:51:38.801753
115	13	10	second	2023/2024	completed	2026-05-03 00:51:38.808192
116	13	26	second	2023/2024	completed	2026-05-03 00:51:38.814753
117	13	11	first	2024/2025	active	2026-05-03 00:51:38.820703
118	13	27	first	2024/2025	active	2026-05-03 00:51:38.827104
119	14	9	first	2024/2025	active	2026-05-03 00:51:38.835829
120	14	25	first	2024/2025	active	2026-05-03 00:51:38.841023
121	15	17	first	2022/2023	completed	2026-05-03 00:51:38.849641
122	15	25	first	2022/2023	completed	2026-05-03 00:51:38.85527
123	15	18	second	2022/2023	completed	2026-05-03 00:51:38.860742
124	15	26	second	2022/2023	completed	2026-05-03 00:51:38.866136
125	15	19	first	2023/2024	completed	2026-05-03 00:51:38.871846
126	15	27	first	2023/2024	completed	2026-05-03 00:51:38.877557
127	15	20	second	2023/2024	completed	2026-05-03 00:51:38.883535
128	15	28	second	2023/2024	completed	2026-05-03 00:51:38.889212
129	15	21	first	2024/2025	active	2026-05-03 00:51:38.894868
130	15	29	first	2024/2025	active	2026-05-03 00:51:38.900596
131	16	17	first	2023/2024	completed	2026-05-03 00:51:38.913269
132	16	25	first	2023/2024	completed	2026-05-03 00:51:38.919718
133	16	18	second	2023/2024	completed	2026-05-03 00:51:38.927238
134	16	26	second	2023/2024	completed	2026-05-03 00:51:38.934102
135	16	19	first	2024/2025	active	2026-05-03 00:51:38.940764
136	16	27	first	2024/2025	active	2026-05-03 00:51:38.947001
137	17	17	first	2021/2022	completed	2026-05-03 00:51:38.955891
138	17	25	first	2021/2022	completed	2026-05-03 00:51:38.961499
139	17	18	second	2021/2022	completed	2026-05-03 00:51:38.967969
140	17	26	second	2021/2022	completed	2026-05-03 00:51:38.974284
141	17	19	first	2022/2023	completed	2026-05-03 00:51:38.980642
142	17	27	first	2022/2023	completed	2026-05-03 00:51:38.986383
143	17	20	second	2022/2023	completed	2026-05-03 00:51:38.992064
144	17	28	second	2022/2023	completed	2026-05-03 00:51:38.997991
145	17	21	first	2023/2024	completed	2026-05-03 00:51:39.004016
146	17	29	first	2023/2024	completed	2026-05-03 00:51:39.010141
147	17	22	second	2023/2024	completed	2026-05-03 00:51:39.016004
148	17	30	second	2023/2024	completed	2026-05-03 00:51:39.021951
149	17	23	first	2024/2025	active	2026-05-03 00:51:39.028624
150	17	31	first	2024/2025	active	2026-05-03 00:51:39.034338
151	17	24	second	2024/2025	completed	2026-05-03 00:51:39.040251
152	17	32	second	2024/2025	completed	2026-05-03 00:51:39.045806
153	18	17	first	2024/2025	active	2026-05-03 00:51:39.054929
154	18	25	first	2024/2025	active	2026-05-03 00:51:39.06093
155	19	17	first	2023/2024	completed	2026-05-03 00:51:39.069462
156	19	25	first	2023/2024	completed	2026-05-03 00:51:39.075175
157	19	18	second	2023/2024	completed	2026-05-03 00:51:39.080594
158	19	26	second	2023/2024	completed	2026-05-03 00:51:39.086078
159	19	19	first	2024/2025	active	2026-05-03 00:51:39.092059
160	19	27	first	2024/2025	active	2026-05-03 00:51:39.097907
161	20	17	first	2022/2023	completed	2026-05-03 00:51:39.106973
162	20	25	first	2022/2023	completed	2026-05-03 00:51:39.112644
163	20	18	second	2022/2023	completed	2026-05-03 00:51:39.118084
164	20	26	second	2022/2023	completed	2026-05-03 00:51:39.123726
165	20	19	first	2023/2024	completed	2026-05-03 00:51:39.12925
166	20	27	first	2023/2024	completed	2026-05-03 00:51:39.134906
167	20	20	second	2023/2024	completed	2026-05-03 00:51:39.141062
168	20	28	second	2023/2024	completed	2026-05-03 00:51:39.146148
169	20	21	first	2024/2025	active	2026-05-03 00:51:39.152507
170	20	29	first	2024/2025	active	2026-05-03 00:51:39.157811
171	20	19	first	2024/2025	active	2026-05-03 00:51:39.163204
\.


--
-- Data for Name: fees; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.fees (id, name, amount, department, level, description, created_at) FROM stdin;
1	Tuition Fee 2024/2025	200000	\N	\N	Annual tuition fee	2026-05-03 00:51:39.172461
2	Registration Fee 2024/2025	10000	\N	\N	Course registration fee	2026-05-03 00:51:39.172461
3	Library Levy 2024/2025	5000	\N	\N	Library access levy	2026-05-03 00:51:39.172461
4	Hostel Fee 2024/2025	50000	\N	\N	Hostel accommodation fee	2026-05-03 00:51:39.172461
\.


--
-- Data for Name: financial_ledger; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.financial_ledger (id, user_id, type, amount, description, related_payment_id, related_receipt_id, balance_after, created_at) FROM stdin;
1	18	credit	200000	Payment for Tuition Fee 2024/2025	1	1	200000	2026-05-03 00:51:39.18423
4	19	credit	200000	Payment for Tuition Fee 2024/2025	4	4	200000	2026-05-03 00:51:39.2208
7	20	credit	200000	Payment for Tuition Fee 2024/2025	7	7	200000	2026-05-03 00:51:39.249815
10	21	credit	10000	Payment for Registration Fee 2024/2025	10	10	10000	2026-05-03 00:51:39.278934
11	22	credit	200000	Payment for Tuition Fee 2024/2025	12	11	200000	2026-05-03 00:51:39.290343
14	23	credit	200000	Payment for Tuition Fee 2024/2025	15	14	200000	2026-05-03 00:51:39.399115
17	25	credit	200000	Payment for Tuition Fee 2024/2025	18	17	200000	2026-05-03 00:51:39.427114
20	26	credit	200000	Payment for Tuition Fee 2024/2025	21	20	200000	2026-05-03 00:51:39.459115
23	27	credit	200000	Payment for Tuition Fee 2024/2025	24	23	200000	2026-05-03 00:51:39.492648
26	28	credit	200000	Payment for Tuition Fee 2024/2025	27	26	200000	2026-05-03 00:51:39.526815
29	29	credit	10000	Payment for Registration Fee 2024/2025	30	29	10000	2026-05-03 00:51:39.560822
30	30	credit	200000	Payment for Tuition Fee 2024/2025	32	30	200000	2026-05-03 00:51:39.573699
33	31	credit	200000	Payment for Tuition Fee 2024/2025	35	33	200000	2026-05-03 00:51:39.605906
36	32	credit	200000	Payment for Tuition Fee 2024/2025	38	36	200000	2026-05-03 00:51:39.637765
39	33	credit	200000	Payment for Tuition Fee 2024/2025	41	39	200000	2026-05-03 00:51:39.667626
42	34	credit	10000	Payment for Registration Fee 2024/2025	44	42	10000	2026-05-03 00:51:39.699562
43	35	credit	200000	Payment for Tuition Fee 2024/2025	46	43	200000	2026-05-03 00:51:39.71593
46	36	credit	200000	Payment for Tuition Fee 2024/2025	49	46	200000	2026-05-03 00:51:39.752703
2	18	credit	10000	Payment for Registration Fee 2024/2025	2	2	210000	2026-05-03 00:51:39.196048
3	18	credit	5000	Payment for Library Levy 2024/2025	3	3	215000	2026-05-03 00:51:39.210814
5	19	credit	10000	Payment for Registration Fee 2024/2025	5	5	210000	2026-05-03 00:51:39.231365
6	19	credit	5000	Payment for Library Levy 2024/2025	6	6	215000	2026-05-03 00:51:39.240355
8	20	credit	10000	Payment for Registration Fee 2024/2025	8	8	210000	2026-05-03 00:51:39.259902
9	20	credit	5000	Payment for Library Levy 2024/2025	9	9	215000	2026-05-03 00:51:39.270094
49	21	credit	5000	Payment for Library Levy 2024/2025	52	49	15000	2026-05-03 00:51:39.791302
50	21	debit	5000	Reversal: Library Levy 2024/2025 — duplicate payment	52	49	10000	2026-05-03 00:51:39.791302
12	22	credit	10000	Payment for Registration Fee 2024/2025	13	12	210000	2026-05-03 00:51:39.300024
13	22	credit	5000	Payment for Library Levy 2024/2025	14	13	215000	2026-05-03 00:51:39.389448
15	23	credit	10000	Payment for Registration Fee 2024/2025	16	15	210000	2026-05-03 00:51:39.407647
16	23	credit	5000	Payment for Library Levy 2024/2025	17	16	215000	2026-05-03 00:51:39.417252
18	25	credit	10000	Payment for Registration Fee 2024/2025	19	18	210000	2026-05-03 00:51:39.437725
19	25	credit	5000	Payment for Library Levy 2024/2025	20	19	215000	2026-05-03 00:51:39.448506
21	26	credit	10000	Payment for Registration Fee 2024/2025	22	21	210000	2026-05-03 00:51:39.469895
22	26	credit	5000	Payment for Library Levy 2024/2025	23	22	215000	2026-05-03 00:51:39.481402
24	27	credit	10000	Payment for Registration Fee 2024/2025	25	24	210000	2026-05-03 00:51:39.505936
25	27	credit	5000	Payment for Library Levy 2024/2025	26	25	215000	2026-05-03 00:51:39.517033
27	28	credit	10000	Payment for Registration Fee 2024/2025	28	27	210000	2026-05-03 00:51:39.536363
28	28	credit	5000	Payment for Library Levy 2024/2025	29	28	215000	2026-05-03 00:51:39.548791
31	30	credit	10000	Payment for Registration Fee 2024/2025	33	31	210000	2026-05-03 00:51:39.58456
32	30	credit	5000	Payment for Library Levy 2024/2025	34	32	215000	2026-05-03 00:51:39.595329
34	31	credit	10000	Payment for Registration Fee 2024/2025	36	34	210000	2026-05-03 00:51:39.616265
35	31	credit	5000	Payment for Library Levy 2024/2025	37	35	215000	2026-05-03 00:51:39.626587
37	32	credit	10000	Payment for Registration Fee 2024/2025	39	37	210000	2026-05-03 00:51:39.647949
38	32	credit	5000	Payment for Library Levy 2024/2025	40	38	215000	2026-05-03 00:51:39.657807
40	33	credit	10000	Payment for Registration Fee 2024/2025	42	40	210000	2026-05-03 00:51:39.677888
41	33	credit	5000	Payment for Library Levy 2024/2025	43	41	215000	2026-05-03 00:51:39.688776
44	35	credit	10000	Payment for Registration Fee 2024/2025	47	44	210000	2026-05-03 00:51:39.727545
45	35	credit	5000	Payment for Library Levy 2024/2025	48	45	215000	2026-05-03 00:51:39.73955
47	36	credit	10000	Payment for Registration Fee 2024/2025	50	47	210000	2026-05-03 00:51:39.770558
48	36	credit	5000	Payment for Library Levy 2024/2025	51	48	215000	2026-05-03 00:51:39.780658
\.


--
-- Data for Name: graduation_applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.graduation_applications (id, student_id, session_id, status, reviewed_by, rejection_reason, admin_override, override_reason, reviewed_at, created_at) FROM stdin;
1	5	4	approved	1	\N	f	\N	2024-11-01 00:00:00	2026-05-03 00:51:40.065679
2	11	4	approved	1	\N	f	\N	2024-11-01 00:00:00	2026-05-03 00:51:40.065679
3	17	4	rejected	1	Outstanding tuition fees of ₦190,000 must be cleared before graduation can be approved.	f	\N	2024-11-05 00:00:00	2026-05-03 00:51:40.065679
\.


--
-- Data for Name: graduation_clearances; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.graduation_clearances (id, student_id, cgpa, academic_status, financial_status, admin_status, overall_status, academic_remarks, financial_remarks, admin_remarks, evaluated_at, evaluated_by) FROM stdin;
1	5	4.76	passed	cleared	cleared	eligible	All required courses passed. CGPA: 4.76. First Class.	All fees cleared.	Records complete.	2026-05-03 00:51:40.061424	5
2	11	3.62	passed	cleared	cleared	eligible	All required courses passed. CGPA: 3.62. Second Class Upper.	All fees cleared.	Records complete.	2026-05-03 00:51:40.061424	5
3	17	2.84	passed	blocked	pending	not_eligible	Academic requirements met. CGPA: 2.84.	Outstanding tuition balance of ₦190,000. Must be cleared before graduation.	Pending financial clearance.	2026-05-03 00:51:40.061424	5
4	7	1.18	failed	blocked	pending	not_eligible	Active carryovers in CSC201, CSC202, CSC301. CGPA: 1.18 below minimum 1.50 threshold.	No tuition payment recorded.	Academic hold prevents graduation processing.	2026-05-03 00:51:40.061424	5
12	18	0	failed	cleared	cleared	not_eligible	CGPA 0.00 is below minimum pass of 1.50	3 confirmed payment(s) — Total: ₦215,000	Official transcript issued (Ref: MAAUN-TXN-2026-FEC2DBC0)	2026-05-03 01:32:17.304613	2
13	1	5	passed	cleared	pending	not_eligible	CGPA 5.00 — Insufficient Credits — No carryovers	3 confirmed payment(s) — Total: ₦215,000	No official transcript issued — pending registrar approval	2026-05-03 02:53:25.702411	18
\.


--
-- Data for Name: hostel_allocations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hostel_allocations (id, student_id, bed_space_id, allocated_by, allocated_at, status, notes) FROM stdin;
1	2	1	1	2026-05-03 00:51:39.861222	active	\N
2	6	2	1	2026-05-03 00:51:39.876098	active	\N
3	8	3	1	2026-05-03 00:51:39.887171	active	\N
4	10	4	1	2026-05-03 00:51:39.897415	active	\N
5	14	5	1	2026-05-03 00:51:39.909965	active	\N
6	16	6	1	2026-05-03 00:51:39.918319	active	\N
7	18	7	1	2026-05-03 00:51:39.927768	active	\N
8	1	21	1	2026-05-03 00:51:39.940925	active	\N
9	3	22	1	2026-05-03 00:51:39.954047	active	\N
10	5	23	1	2026-05-03 00:51:39.964146	active	\N
11	9	24	1	2026-05-03 00:51:39.977012	active	\N
12	11	25	1	2026-05-03 00:51:39.987848	active	\N
13	13	26	1	2026-05-03 00:51:40.002008	active	\N
14	15	27	1	2026-05-03 00:51:40.011008	active	\N
15	19	28	1	2026-05-03 00:51:40.022471	active	\N
\.


--
-- Data for Name: hostel_applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hostel_applications (id, student_id, session_id, status, priority_score, preferred_gender, remarks, rejection_reason, reviewed_by, reviewed_at, created_at) FROM stdin;
1	2	4	allocated	75	male	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.857313
2	4	4	rejected	30	male	\N	Active disciplinary block prevents hostel allocation.	1	2024-08-20 00:00:00	2026-05-03 00:51:39.869605
3	6	4	allocated	75	male	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.87257
4	8	4	allocated	75	male	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.88359
5	10	4	allocated	75	male	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.893604
6	12	4	rejected	30	male	\N	Outstanding tuition fees must be cleared before allocation.	1	2024-08-20 00:00:00	2026-05-03 00:51:39.903962
7	14	4	allocated	75	male	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.906955
8	16	4	allocated	75	male	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.915713
9	18	4	allocated	75	male	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.924623
10	20	4	rejected	30	male	\N	Graduation block and poor academic standing disqualify applicant.	1	2024-08-20 00:00:00	2026-05-03 00:51:39.93497
11	1	4	allocated	70	female	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.937854
12	3	4	allocated	70	female	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.946568
13	5	4	allocated	70	female	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.961019
14	7	4	rejected	25	female	\N	Outstanding tuition fees and active academic carryovers prevent allocation.	1	2024-08-20 00:00:00	2026-05-03 00:51:39.970572
15	9	4	allocated	70	female	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.973375
16	11	4	allocated	70	female	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.984941
17	13	4	allocated	70	female	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:39.994306
18	15	4	allocated	70	female	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:40.008138
19	17	4	rejected	25	female	\N	Partial fee payment — full tuition clearance required for hostel allocation.	1	2024-08-20 00:00:00	2026-05-03 00:51:40.017141
20	19	4	allocated	70	female	\N	\N	1	2024-08-20 00:00:00	2026-05-03 00:51:40.01999
\.


--
-- Data for Name: hostels; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hostels (id, name, gender, total_rooms, location, description, is_active, created_at) FROM stdin;
1	Al-Amin Hall	male	10	North Campus	Male students hostel, single and double occupancy rooms.	t	2026-05-03 00:51:39.805972
2	Khadija Hall	female	10	South Campus	Female students hostel, modern facilities with 24h security.	t	2026-05-03 00:51:39.805972
3	Auto-Test Hostel	mixed	1	Test Block	\N	t	2026-05-03 01:26:52.153385
4	Auto-Test Hostel	mixed	1	Test Block	\N	t	2026-05-03 01:31:00.974667
5	Auto-Test Hostel	mixed	1	Test Block	\N	t	2026-05-03 01:32:05.822872
6	Auto-Test Hostel	mixed	1	Test Block	\N	t	2026-05-03 01:32:17.338958
\.


--
-- Data for Name: lecturers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.lecturers (id, user_id, staff_id, department, faculty, designation, created_at, updated_at) FROM stdin;
1	12	MAAUN/LEC/001	Computer Science	Science and Technology	Professor	2026-05-03 00:51:37.909126	2026-05-03 00:51:37.909126
2	13	MAAUN/LEC/002	Computer Science	Science and Technology	Senior Lecturer	2026-05-03 00:51:37.909126	2026-05-03 00:51:37.909126
3	14	MAAUN/LEC/003	Business Administration	Management Sciences	Professor	2026-05-03 00:51:37.909126	2026-05-03 00:51:37.909126
4	15	MAAUN/LEC/004	Business Administration	Management Sciences	Lecturer I	2026-05-03 00:51:37.909126	2026-05-03 00:51:37.909126
5	16	MAAUN/LEC/005	Mass Communication	Arts and Social Sciences	Senior Lecturer	2026-05-03 00:51:37.909126	2026-05-03 00:51:37.909126
6	17	MAAUN/LEC/006	Mass Communication	Arts and Social Sciences	Lecturer I	2026-05-03 00:51:37.909126	2026-05-03 00:51:37.909126
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, user_id, title, message, type, is_read, created_at) FROM stdin;
3	19	Course Registration Open	2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.	enrollment	f	2026-05-03 00:51:40.141309
4	19	Results Published	Your 2024/2025 First Semester results are now available. Log in to view your performance.	result	t	2026-05-03 00:51:40.141309
5	20	Course Registration Open	2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.	enrollment	f	2026-05-03 00:51:40.141309
6	20	Results Published	Your 2024/2025 First Semester results are now available. Log in to view your performance.	result	t	2026-05-03 00:51:40.141309
7	21	Course Registration Open	2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.	enrollment	f	2026-05-03 00:51:40.141309
8	21	Results Published	Your 2024/2025 First Semester results are now available. Log in to view your performance.	result	t	2026-05-03 00:51:40.141309
9	22	Course Registration Open	2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.	enrollment	f	2026-05-03 00:51:40.141309
10	22	Results Published	Your 2024/2025 First Semester results are now available. Log in to view your performance.	result	t	2026-05-03 00:51:40.141309
11	23	Course Registration Open	2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.	enrollment	f	2026-05-03 00:51:40.141309
12	23	Results Published	Your 2024/2025 First Semester results are now available. Log in to view your performance.	result	t	2026-05-03 00:51:40.141309
13	24	Course Registration Open	2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.	enrollment	f	2026-05-03 00:51:40.141309
14	24	Results Published	Your 2024/2025 First Semester results are now available. Log in to view your performance.	result	t	2026-05-03 00:51:40.141309
15	25	Course Registration Open	2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.	enrollment	f	2026-05-03 00:51:40.141309
16	25	Results Published	Your 2024/2025 First Semester results are now available. Log in to view your performance.	result	t	2026-05-03 00:51:40.141309
17	26	Course Registration Open	2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.	enrollment	f	2026-05-03 00:51:40.141309
18	26	Results Published	Your 2024/2025 First Semester results are now available. Log in to view your performance.	result	t	2026-05-03 00:51:40.141309
19	27	Course Registration Open	2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.	enrollment	f	2026-05-03 00:51:40.141309
20	27	Results Published	Your 2024/2025 First Semester results are now available. Log in to view your performance.	result	t	2026-05-03 00:51:40.141309
22	2	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
23	3	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
24	4	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
25	5	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
26	6	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
27	7	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
28	8	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
29	9	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
30	10	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
31	11	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
32	12	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
33	13	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
34	14	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
35	15	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
36	16	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
37	17	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
39	19	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
40	20	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
41	21	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
42	22	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
43	23	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
44	24	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
45	25	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
46	26	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
47	27	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
48	28	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
49	29	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
50	30	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
51	31	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
52	32	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
53	33	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
54	34	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
55	35	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
56	36	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
57	37	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:26:52.086981
58	35	Disciplinary Case Opened	A disciplinary case has been opened against your record: "Auto-Test Case — Safe to Ignore". Please check your student portal.	warning	f	2026-05-03 01:26:52.202917
59	35	Disciplinary Case Update	Your disciplinary case is now under review.	warning	f	2026-05-03 01:26:52.221405
60	35	Disciplinary Case Update	Your disciplinary case has been resolved.	success	f	2026-05-03 01:26:52.237956
21	1	Auto-Test Notification	System test broadcast — safe to ignore	info	t	2026-05-03 01:26:52.086981
61	10	Welfare Case Assigned to You	A welfare case has been assigned to you for review. Please log in to the counsellor portal to review.	info	f	2026-05-03 01:26:52.272398
62	29	Welfare Case Assigned	Your welfare case has been assigned to a counsellor. They will reach out to you shortly.	info	f	2026-05-03 01:26:52.275888
63	29	Welfare Case Update	Your welfare case is now in progress. A counsellor is actively working on your case.	info	f	2026-05-03 01:26:52.290852
64	29	Response on Your Welfare Case	A counsellor has added a response to your welfare case. Log in to view the update.	info	f	2026-05-03 01:26:52.30473
66	2	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
67	3	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
68	4	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
69	5	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
70	6	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
71	7	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
72	8	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
73	9	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
74	10	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
75	11	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
76	12	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
77	13	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
78	14	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
79	15	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
80	16	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
81	17	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
83	19	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
84	20	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
85	21	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
86	22	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
87	23	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
88	24	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
89	25	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
90	26	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
91	27	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
92	28	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
93	29	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
94	30	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
95	31	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
96	32	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
97	33	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
98	34	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
99	35	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
100	36	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
101	37	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:26:52.466778
102	2	New Welfare Request Submitted	A new welfare case has been submitted. Please review and assign in the welfare panel.	warning	f	2026-05-03 01:31:00.706452
103	3	New Welfare Request Submitted	A new welfare case has been submitted. Please review and assign in the welfare panel.	warning	f	2026-05-03 01:31:00.709985
105	2	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
106	3	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
107	4	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
108	5	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
109	6	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
110	7	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
111	8	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
112	9	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
113	10	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
114	11	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
115	12	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
116	13	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
117	14	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
118	15	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
119	16	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
120	17	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
65	1	Test Notification Delivery	Verifying notification delivery pipeline	info	t	2026-05-03 01:26:52.466778
104	1	Auto-Test Notification	System test broadcast — safe to ignore	info	t	2026-05-03 01:31:00.903676
122	19	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
123	20	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
124	21	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
125	22	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
126	23	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
127	24	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
128	25	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
129	26	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
130	27	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
131	28	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
132	29	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
133	30	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
134	31	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
135	32	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
136	33	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
137	34	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
138	35	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
139	36	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
140	37	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:31:00.903676
141	35	Disciplinary Case Opened	A disciplinary case has been opened against your record: "Auto-Test Case — Safe to Ignore". Please check your student portal.	warning	f	2026-05-03 01:31:01.020235
142	35	Disciplinary Case Update	Your disciplinary case is now under review.	warning	f	2026-05-03 01:31:01.035199
143	35	Disciplinary Sanction Applied	A formal warning has been issued against your record for case: "Auto-Test Case — Safe to Ignore".	warning	f	2026-05-03 01:31:01.053322
144	35	Disciplinary Case Update	Your disciplinary case has been resolved.	success	f	2026-05-03 01:31:01.069384
145	10	Welfare Case Assigned to You	A welfare case has been assigned to you for review. Please log in to the counsellor portal to review.	info	f	2026-05-03 01:31:01.107469
1	18	Course Registration Open	2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.	enrollment	t	2026-05-03 00:51:40.141309
2	18	Results Published	Your 2024/2025 First Semester results are now available. Log in to view your performance.	result	t	2026-05-03 00:51:40.141309
38	18	Auto-Test Notification	System test broadcast — safe to ignore	info	t	2026-05-03 01:26:52.086981
150	2	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
151	3	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
152	4	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
153	5	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
154	6	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
155	7	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
156	8	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
157	9	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
158	10	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
159	11	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
160	12	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
161	13	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
162	14	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
163	15	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
164	16	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
165	17	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
167	19	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
168	20	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
169	21	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
170	22	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
171	23	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
172	24	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
173	25	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
174	26	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
175	27	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
149	1	Test Notification Delivery	Verifying notification delivery pipeline	info	t	2026-05-03 01:31:01.221008
82	18	Test Notification Delivery	Verifying notification delivery pipeline	info	t	2026-05-03 01:26:52.466778
176	28	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
177	29	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
178	30	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
179	31	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
180	32	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
181	33	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
182	34	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
183	35	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
184	36	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
185	37	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:31:01.221008
186	2	New Welfare Request Submitted	A new welfare case has been submitted. Please review and assign in the welfare panel.	warning	f	2026-05-03 01:32:05.55343
187	3	New Welfare Request Submitted	A new welfare case has been submitted. Please review and assign in the welfare panel.	warning	f	2026-05-03 01:32:05.556095
189	2	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
190	3	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
191	4	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
192	5	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
193	6	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
194	7	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
195	8	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
196	9	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
197	10	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
198	11	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
199	12	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
200	13	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
201	14	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
202	15	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
203	16	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
204	17	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
206	19	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
207	20	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
208	21	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
209	22	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
210	23	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
211	24	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
212	25	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
213	26	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
214	27	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
215	28	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
216	29	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
217	30	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
218	31	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
219	32	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
220	33	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
221	34	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
222	35	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
223	36	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
224	37	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:05.758427
228	2	Disciplinary Appeal Submitted	A student has submitted an appeal for Case #8. Please review in the disciplinary panel.	warning	f	2026-05-03 01:32:05.917911
229	3	Disciplinary Appeal Submitted	A student has submitted an appeal for Case #8. Please review in the disciplinary panel.	warning	f	2026-05-03 01:32:05.921564
232	10	Welfare Case Assigned to You	A welfare case has been assigned to you for review. Please log in to the counsellor portal to review.	info	f	2026-05-03 01:32:05.995483
121	18	Auto-Test Notification	System test broadcast — safe to ignore	info	t	2026-05-03 01:31:00.903676
146	18	Welfare Case Assigned	Your welfare case has been assigned to a counsellor. They will reach out to you shortly.	info	t	2026-05-03 01:31:01.111738
147	18	Welfare Case Update	Your welfare case is now in progress. A counsellor is actively working on your case.	info	t	2026-05-03 01:31:01.124625
188	1	Auto-Test Notification	System test broadcast — safe to ignore	info	t	2026-05-03 01:32:05.758427
237	2	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
238	3	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
239	4	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
240	5	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
241	6	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
242	7	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
243	8	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
244	9	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
245	10	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
246	11	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
247	12	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
248	13	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
249	14	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
250	15	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
251	16	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
252	17	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
254	19	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
255	20	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
256	21	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
257	22	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
258	23	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
259	24	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
260	25	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
261	26	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
262	27	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
263	28	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
264	29	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
265	30	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
266	31	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
267	32	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
268	33	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
269	34	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
270	35	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
271	36	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
272	37	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:06.115669
273	2	New Welfare Request Submitted	A new welfare case has been submitted. Please review and assign in the welfare panel.	warning	f	2026-05-03 01:32:17.073684
274	3	New Welfare Request Submitted	A new welfare case has been submitted. Please review and assign in the welfare panel.	warning	f	2026-05-03 01:32:17.076517
276	2	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
277	3	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
278	4	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
279	5	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
280	6	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
281	7	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
282	8	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
283	9	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
284	10	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
285	11	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
286	12	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
287	13	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
236	1	Test Notification Delivery	Verifying notification delivery pipeline	info	t	2026-05-03 01:32:06.115669
275	1	Auto-Test Notification	System test broadcast — safe to ignore	info	t	2026-05-03 01:32:17.270702
288	14	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
289	15	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
290	16	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
291	17	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
293	19	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
294	20	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
295	21	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
296	22	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
297	23	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
298	24	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
299	25	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
300	26	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
301	27	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
302	28	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
303	29	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
304	30	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
305	31	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
306	32	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
307	33	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
308	34	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
309	35	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
310	36	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
311	37	Auto-Test Notification	System test broadcast — safe to ignore	info	f	2026-05-03 01:32:17.270702
315	2	Disciplinary Appeal Submitted	A student has submitted an appeal for Case #9. Please review in the disciplinary panel.	warning	f	2026-05-03 01:32:17.439518
316	3	Disciplinary Appeal Submitted	A student has submitted an appeal for Case #9. Please review in the disciplinary panel.	warning	f	2026-05-03 01:32:17.442014
320	10	Welfare Case Assigned to You	A welfare case has been assigned to you for review. Please log in to the counsellor portal to review.	info	f	2026-05-03 01:32:17.535231
148	18	Response on Your Welfare Case	A counsellor has added a response to your welfare case. Log in to view the update.	info	t	2026-05-03 01:31:01.138371
166	18	Test Notification Delivery	Verifying notification delivery pipeline	info	t	2026-05-03 01:31:01.221008
205	18	Auto-Test Notification	System test broadcast — safe to ignore	info	t	2026-05-03 01:32:05.758427
225	18	Disciplinary Case Opened	A disciplinary case has been opened against your record: "Auto-Test Case — Safe to Ignore". Please check your student portal.	warning	t	2026-05-03 01:32:05.869867
226	18	Disciplinary Case Update	Your disciplinary case is now under review.	warning	t	2026-05-03 01:32:05.88739
227	18	Disciplinary Sanction Applied	A formal warning has been issued against your record for case: "Auto-Test Case — Safe to Ignore".	warning	t	2026-05-03 01:32:05.901781
230	18	Appeal Under Review	Your appeal for Case #8 is now being reviewed by the administration.	info	t	2026-05-03 01:32:05.943064
231	18	Disciplinary Case Update	Your disciplinary case has been resolved.	success	t	2026-05-03 01:32:05.95651
233	18	Welfare Case Assigned	Your welfare case has been assigned to a counsellor. They will reach out to you shortly.	info	t	2026-05-03 01:32:05.998654
234	18	Welfare Case Update	Your welfare case is now in progress. A counsellor is actively working on your case.	info	t	2026-05-03 01:32:06.00895
235	18	Response on Your Welfare Case	A counsellor has added a response to your welfare case. Log in to view the update.	info	t	2026-05-03 01:32:06.02013
253	18	Test Notification Delivery	Verifying notification delivery pipeline	info	t	2026-05-03 01:32:06.115669
292	18	Auto-Test Notification	System test broadcast — safe to ignore	info	t	2026-05-03 01:32:17.270702
312	18	Disciplinary Case Opened	A disciplinary case has been opened against your record: "Auto-Test Case — Safe to Ignore". Please check your student portal.	warning	t	2026-05-03 01:32:17.391786
313	18	Disciplinary Case Update	Your disciplinary case is now under review.	warning	t	2026-05-03 01:32:17.409389
314	18	Disciplinary Sanction Applied	A formal warning has been issued against your record for case: "Auto-Test Case — Safe to Ignore".	warning	t	2026-05-03 01:32:17.424704
317	18	Appeal Under Review	Your appeal for Case #9 is now being reviewed by the administration.	info	t	2026-05-03 01:32:17.46332
318	18	Appeal Decision: Accepted	Your appeal for Case #9 has been accepted. The case has been dismissed and all restrictions lifted.	success	t	2026-05-03 01:32:17.48407
319	18	Disciplinary Case Update	Your disciplinary case has been resolved.	success	t	2026-05-03 01:32:17.500725
321	18	Welfare Case Assigned	Your welfare case has been assigned to a counsellor. They will reach out to you shortly.	info	t	2026-05-03 01:32:17.538305
322	18	Welfare Case Update	Your welfare case is now in progress. A counsellor is actively working on your case.	info	t	2026-05-03 01:32:17.551038
323	18	Response on Your Welfare Case	A counsellor has added a response to your welfare case. Log in to view the update.	info	t	2026-05-03 01:32:17.564394
325	2	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
326	3	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
327	4	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
328	5	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
329	6	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
330	7	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
331	8	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
332	9	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
333	10	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
334	11	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
335	12	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
336	13	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
337	14	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
338	15	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
339	16	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
340	17	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
341	18	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
342	19	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
343	20	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
344	21	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
345	22	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
346	23	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
347	24	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
348	25	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
349	26	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
350	27	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
351	28	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
352	29	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
353	30	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
354	31	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
355	32	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
356	33	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
357	34	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
358	35	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
359	36	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
360	37	Test Notification Delivery	Verifying notification delivery pipeline	info	f	2026-05-03 01:32:17.651739
324	1	Test Notification Delivery	Verifying notification delivery pipeline	info	t	2026-05-03 01:32:17.651739
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payments (id, user_id, fee_id, reference, amount, status, paid_at, created_at) FROM stdin;
1	18	1	PAY-00000101	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.1769
2	18	2	PAY-00000201	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.188945
3	18	3	PAY-00000301	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.204321
4	19	1	PAY-00000402	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.214073
5	19	2	PAY-00000502	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.224534
6	19	3	PAY-00000602	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.234485
7	20	1	PAY-00000703	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.243681
8	20	2	PAY-00000803	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.253363
9	20	3	PAY-00000903	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.263813
10	21	2	PAY-00001004	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.273015
11	21	1	PAY-00006104	200000	failed	\N	2026-05-03 00:51:39.281971
12	22	1	PAY-00001205	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.284473
13	22	2	PAY-00001305	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.293661
14	22	3	PAY-00001405	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.30245
15	23	1	PAY-00001506	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.393114
16	23	2	PAY-00001606	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.40197
17	23	3	PAY-00001706	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.411173
18	25	1	PAY-00001808	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.420111
19	25	2	PAY-00001908	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.430499
20	25	3	PAY-00002008	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.440877
21	26	1	PAY-00002109	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.451965
22	26	2	PAY-00002209	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.462777
23	26	3	PAY-00002309	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.474048
24	27	1	PAY-00002410	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.484822
25	27	2	PAY-00002510	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.497104
26	27	3	PAY-00002610	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.509774
27	28	1	PAY-00002711	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.520437
28	28	2	PAY-00002811	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.529648
29	28	3	PAY-00002911	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.541008
30	29	2	PAY-00003012	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.551777
31	29	1	PAY-00008112	200000	failed	\N	2026-05-03 00:51:39.563807
32	30	1	PAY-00003213	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.566633
33	30	2	PAY-00003313	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.577425
34	30	3	PAY-00003413	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.587735
35	31	1	PAY-00003514	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.598978
36	31	2	PAY-00003614	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.608858
37	31	3	PAY-00003714	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.619979
38	32	1	PAY-00003815	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.629871
39	32	2	PAY-00003915	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.641328
40	32	3	PAY-00004015	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.650976
41	33	1	PAY-00004116	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.660996
42	33	2	PAY-00004216	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.670734
43	33	3	PAY-00004316	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.68146
44	34	2	PAY-00004417	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.691718
45	34	1	PAY-00009517	200000	failed	\N	2026-05-03 00:51:39.703476
46	35	1	PAY-00004618	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.707381
47	35	2	PAY-00004718	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.720019
48	35	3	PAY-00004818	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.730582
49	36	1	PAY-00004919	200000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.743611
50	36	2	PAY-00005019	10000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.759478
51	36	3	PAY-00005119	5000	success	2024-08-15 00:00:00	2026-05-03 00:51:39.773998
52	21	3	PAY-00099901	5000	success	2024-09-01 00:00:00	2026-05-03 00:51:39.783988
\.


--
-- Data for Name: receipts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.receipts (id, payment_id, user_id, reference_number, amount, fee_name, status, issued_by, issued_at, reversed_at, reversal_reason, ip_address, created_at) FROM stdin;
1	1	18	RCP-00000101	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.180525
2	2	18	RCP-00000201	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.193216
3	3	18	RCP-00000301	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.20697
4	4	19	RCP-00000402	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.217723
5	5	19	RCP-00000502	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.227654
6	6	19	RCP-00000602	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.237687
7	7	20	RCP-00000703	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.246836
8	8	20	RCP-00000803	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.257049
9	9	20	RCP-00000903	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.266412
10	10	21	RCP-00001004	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.276101
11	12	22	RCP-00001105	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.287589
12	13	22	RCP-00001205	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.296483
13	14	22	RCP-00001305	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.385868
14	15	23	RCP-00001406	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.396011
15	16	23	RCP-00001506	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.405132
16	17	23	RCP-00001606	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.413898
17	18	25	RCP-00001708	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.423569
18	19	25	RCP-00001808	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.433373
19	20	25	RCP-00001908	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.444939
20	21	26	RCP-00002009	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.455102
21	22	26	RCP-00002109	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.466411
22	23	26	RCP-00002209	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.476875
23	24	27	RCP-00002310	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.488882
24	25	27	RCP-00002410	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.500898
25	26	27	RCP-00002510	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.514098
26	27	28	RCP-00002611	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.523317
27	28	28	RCP-00002711	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.533427
28	29	28	RCP-00002811	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.545417
29	30	29	RCP-00002912	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.556714
30	32	30	RCP-00003013	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.570544
31	33	30	RCP-00003113	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.580887
32	34	30	RCP-00003213	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.591726
33	35	31	RCP-00003314	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.60242
34	36	31	RCP-00003414	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.612786
35	37	31	RCP-00003514	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.623065
36	38	32	RCP-00003615	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.633766
37	39	32	RCP-00003715	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.644186
38	40	32	RCP-00003815	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.654665
39	41	33	RCP-00003916	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.663917
40	42	33	RCP-00004016	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.674876
41	43	33	RCP-00004116	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.684789
42	44	34	RCP-00004217	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.695153
43	46	35	RCP-00004318	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.7119
44	47	35	RCP-00004418	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.723696
45	48	35	RCP-00004518	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.735279
46	49	36	RCP-00004619	200000	Tuition Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.747568
47	50	36	RCP-00004719	10000	Registration Fee 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.766952
48	51	36	RCP-00004819	5000	Library Levy 2024/2025	confirmed	6	2024-08-15 00:00:00	\N	\N	41.58.100.12	2026-05-03 00:51:39.777029
49	52	21	RCP-00099901	5000	Library Levy 2024/2025	reversed	6	2024-09-01 00:00:00	2024-09-10 00:00:00	Duplicate payment — student paid twice. Refund issued.	41.58.100.12	2026-05-03 00:51:39.787791
\.


--
-- Data for Name: results; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.results (id, student_id, course_id, semester, academic_year, ca_score, exam_score, total_score, grade, grade_point, created_at, updated_at, status) FROM stdin;
1	1	1	first	2022/2023	30	47	77	A	5	2026-05-03 00:51:37.930225	2026-05-03 00:51:37.930225	locked
2	1	25	first	2022/2023	31	50	81	A	5	2026-05-03 00:51:37.938905	2026-05-03 00:51:37.938905	locked
3	1	2	second	2022/2023	32	46	78	A	5	2026-05-03 00:51:37.946377	2026-05-03 00:51:37.946377	locked
4	1	26	second	2022/2023	33	49	82	A	5	2026-05-03 00:51:37.95365	2026-05-03 00:51:37.95365	locked
5	1	3	first	2023/2024	34	52	86	A	5	2026-05-03 00:51:37.9609	2026-05-03 00:51:37.9609	locked
6	1	27	first	2023/2024	35	48	83	A	5	2026-05-03 00:51:37.968019	2026-05-03 00:51:37.968019	locked
7	1	4	second	2023/2024	30	51	81	A	5	2026-05-03 00:51:37.974985	2026-05-03 00:51:37.974985	locked
8	1	28	second	2023/2024	31	47	78	A	5	2026-05-03 00:51:37.982113	2026-05-03 00:51:37.982113	locked
9	1	5	first	2024/2025	32	50	82	A	5	2026-05-03 00:51:37.989856	2026-05-03 00:51:37.989856	submitted
10	1	29	first	2024/2025	33	46	79	A	5	2026-05-03 00:51:37.996837	2026-05-03 00:51:37.996837	submitted
11	2	1	first	2023/2024	36	55	91	A	5	2026-05-03 00:51:38.011514	2026-05-03 00:51:38.011514	locked
12	2	25	first	2023/2024	37	58	95	A	5	2026-05-03 00:51:38.018784	2026-05-03 00:51:38.018784	locked
13	2	2	second	2023/2024	38	54	92	A	5	2026-05-03 00:51:38.025895	2026-05-03 00:51:38.025895	locked
14	2	26	second	2023/2024	39	57	96	A	5	2026-05-03 00:51:38.032892	2026-05-03 00:51:38.032892	locked
15	2	3	first	2024/2025	40	60	100	A	5	2026-05-03 00:51:38.040949	2026-05-03 00:51:38.040949	submitted
16	2	27	first	2024/2025	36	56	92	A	5	2026-05-03 00:51:38.049004	2026-05-03 00:51:38.049004	submitted
17	3	1	first	2024/2025	30	47	77	A	5	2026-05-03 00:51:38.058844	2026-05-03 00:51:38.058844	submitted
18	3	25	first	2024/2025	31	50	81	A	5	2026-05-03 00:51:38.065905	2026-05-03 00:51:38.065905	submitted
19	4	1	first	2022/2023	16	29	45	D	2	2026-05-03 00:51:38.076628	2026-05-03 00:51:38.076628	locked
20	4	25	first	2022/2023	17	32	49	D	2	2026-05-03 00:51:38.082454	2026-05-03 00:51:38.082454	locked
21	4	2	second	2022/2023	18	29	47	D	2	2026-05-03 00:51:38.088913	2026-05-03 00:51:38.088913	locked
22	4	26	second	2022/2023	19	32	51	C	3	2026-05-03 00:51:38.095053	2026-05-03 00:51:38.095053	locked
23	4	3	first	2023/2024	11	16	27	F	0	2026-05-03 00:51:38.101951	2026-05-03 00:51:38.101951	locked
24	4	27	first	2023/2024	21	32	53	C	3	2026-05-03 00:51:38.108999	2026-05-03 00:51:38.108999	locked
25	4	4	second	2023/2024	16	29	45	D	2	2026-05-03 00:51:38.115085	2026-05-03 00:51:38.115085	locked
26	4	28	second	2023/2024	17	32	49	D	2	2026-05-03 00:51:38.121185	2026-05-03 00:51:38.121185	locked
27	4	5	first	2024/2025	18	29	47	D	2	2026-05-03 00:51:38.127022	2026-05-03 00:51:38.127022	submitted
28	4	29	first	2024/2025	19	32	51	C	3	2026-05-03 00:51:38.134003	2026-05-03 00:51:38.134003	submitted
29	4	3	first	2024/2025	28	38	66	B	4	2026-05-03 00:51:38.139719	2026-05-03 00:51:38.139719	submitted
30	5	1	first	2021/2022	36	55	91	A	5	2026-05-03 00:51:38.148561	2026-05-03 00:51:38.148561	locked
31	5	25	first	2021/2022	37	58	95	A	5	2026-05-03 00:51:38.154774	2026-05-03 00:51:38.154774	locked
32	5	2	second	2021/2022	38	54	92	A	5	2026-05-03 00:51:38.160677	2026-05-03 00:51:38.160677	locked
33	5	26	second	2021/2022	39	57	96	A	5	2026-05-03 00:51:38.167173	2026-05-03 00:51:38.167173	locked
34	5	3	first	2022/2023	40	60	100	A	5	2026-05-03 00:51:38.173802	2026-05-03 00:51:38.173802	locked
35	5	27	first	2022/2023	36	56	92	A	5	2026-05-03 00:51:38.181027	2026-05-03 00:51:38.181027	locked
36	5	4	second	2022/2023	37	59	96	A	5	2026-05-03 00:51:38.186916	2026-05-03 00:51:38.186916	locked
37	5	28	second	2022/2023	38	55	93	A	5	2026-05-03 00:51:38.193786	2026-05-03 00:51:38.193786	locked
38	5	5	first	2023/2024	39	58	97	A	5	2026-05-03 00:51:38.200523	2026-05-03 00:51:38.200523	locked
39	5	29	first	2023/2024	40	54	94	A	5	2026-05-03 00:51:38.20687	2026-05-03 00:51:38.20687	locked
40	5	6	second	2023/2024	36	57	93	A	5	2026-05-03 00:51:38.212664	2026-05-03 00:51:38.212664	locked
41	5	30	second	2023/2024	37	60	97	A	5	2026-05-03 00:51:38.218499	2026-05-03 00:51:38.218499	locked
42	5	7	first	2024/2025	38	56	94	A	5	2026-05-03 00:51:38.224703	2026-05-03 00:51:38.224703	submitted
43	5	31	first	2024/2025	39	59	98	A	5	2026-05-03 00:51:38.230351	2026-05-03 00:51:38.230351	submitted
44	5	8	second	2024/2025	40	55	95	A	5	2026-05-03 00:51:38.236524	2026-05-03 00:51:38.236524	locked
45	5	32	second	2024/2025	36	58	94	A	5	2026-05-03 00:51:38.242746	2026-05-03 00:51:38.242746	locked
46	6	1	first	2023/2024	24	38	62	B	4	2026-05-03 00:51:38.254287	2026-05-03 00:51:38.254287	locked
47	6	25	first	2023/2024	25	41	66	B	4	2026-05-03 00:51:38.260929	2026-05-03 00:51:38.260929	locked
48	6	2	second	2023/2024	26	38	64	B	4	2026-05-03 00:51:38.267415	2026-05-03 00:51:38.267415	locked
49	6	26	second	2023/2024	27	41	68	B	4	2026-05-03 00:51:38.273881	2026-05-03 00:51:38.273881	locked
50	6	3	first	2024/2025	28	38	66	B	4	2026-05-03 00:51:38.280663	2026-05-03 00:51:38.280663	submitted
51	6	27	first	2024/2025	29	41	70	A	5	2026-05-03 00:51:38.286776	2026-05-03 00:51:38.286776	submitted
52	7	1	first	2021/2022	7	16	23	F	0	2026-05-03 00:51:38.296402	2026-05-03 00:51:38.296402	locked
53	7	25	first	2021/2022	8	19	27	F	0	2026-05-03 00:51:38.3023	2026-05-03 00:51:38.3023	locked
54	7	2	second	2021/2022	9	16	25	F	0	2026-05-03 00:51:38.308533	2026-05-03 00:51:38.308533	locked
55	7	26	second	2021/2022	10	19	29	F	0	2026-05-03 00:51:38.314045	2026-05-03 00:51:38.314045	locked
56	7	3	first	2022/2023	11	16	27	F	0	2026-05-03 00:51:38.320294	2026-05-03 00:51:38.320294	locked
57	7	27	first	2022/2023	12	19	31	F	0	2026-05-03 00:51:38.326548	2026-05-03 00:51:38.326548	locked
58	7	4	second	2022/2023	7	16	23	F	0	2026-05-03 00:51:38.332354	2026-05-03 00:51:38.332354	locked
59	7	28	second	2022/2023	8	19	27	F	0	2026-05-03 00:51:38.342188	2026-05-03 00:51:38.342188	locked
60	7	5	first	2023/2024	9	16	25	F	0	2026-05-03 00:51:38.349351	2026-05-03 00:51:38.349351	locked
61	7	29	first	2023/2024	10	19	29	F	0	2026-05-03 00:51:38.355788	2026-05-03 00:51:38.355788	locked
62	7	3	first	2023/2024	11	16	27	F	0	2026-05-03 00:51:38.362073	2026-05-03 00:51:38.362073	locked
63	7	6	second	2023/2024	12	19	31	F	0	2026-05-03 00:51:38.368012	2026-05-03 00:51:38.368012	locked
64	7	30	second	2023/2024	7	16	23	F	0	2026-05-03 00:51:38.374325	2026-05-03 00:51:38.374325	locked
65	7	4	second	2023/2024	8	19	27	F	0	2026-05-03 00:51:38.380134	2026-05-03 00:51:38.380134	locked
66	7	7	first	2024/2025	9	16	25	F	0	2026-05-03 00:51:38.386303	2026-05-03 00:51:38.386303	submitted
67	7	31	first	2024/2025	10	19	29	F	0	2026-05-03 00:51:38.393532	2026-05-03 00:51:38.393532	submitted
68	7	5	first	2024/2025	11	16	27	F	0	2026-05-03 00:51:38.400028	2026-05-03 00:51:38.400028	submitted
69	8	9	first	2022/2023	30	47	77	A	5	2026-05-03 00:51:38.408843	2026-05-03 00:51:38.408843	locked
70	8	25	first	2022/2023	31	50	81	A	5	2026-05-03 00:51:38.414528	2026-05-03 00:51:38.414528	locked
71	8	10	second	2022/2023	32	46	78	A	5	2026-05-03 00:51:38.514508	2026-05-03 00:51:38.514508	locked
72	8	26	second	2022/2023	33	49	82	A	5	2026-05-03 00:51:38.523041	2026-05-03 00:51:38.523041	locked
73	8	11	first	2023/2024	34	52	86	A	5	2026-05-03 00:51:38.528711	2026-05-03 00:51:38.528711	locked
74	8	27	first	2023/2024	35	48	83	A	5	2026-05-03 00:51:38.535271	2026-05-03 00:51:38.535271	locked
75	8	12	second	2023/2024	30	51	81	A	5	2026-05-03 00:51:38.54215	2026-05-03 00:51:38.54215	locked
76	8	28	second	2023/2024	31	47	78	A	5	2026-05-03 00:51:38.548775	2026-05-03 00:51:38.548775	locked
77	8	13	first	2024/2025	32	50	82	A	5	2026-05-03 00:51:38.555386	2026-05-03 00:51:38.555386	submitted
78	8	29	first	2024/2025	33	46	79	A	5	2026-05-03 00:51:38.562428	2026-05-03 00:51:38.562428	submitted
79	9	9	first	2024/2025	36	55	91	A	5	2026-05-03 00:51:38.571814	2026-05-03 00:51:38.571814	submitted
80	9	25	first	2024/2025	37	58	95	A	5	2026-05-03 00:51:38.579455	2026-05-03 00:51:38.579455	submitted
81	10	9	first	2023/2024	24	38	62	B	4	2026-05-03 00:51:38.589313	2026-05-03 00:51:38.589313	locked
82	10	25	first	2023/2024	25	41	66	B	4	2026-05-03 00:51:38.595514	2026-05-03 00:51:38.595514	locked
83	10	10	second	2023/2024	26	38	64	B	4	2026-05-03 00:51:38.601751	2026-05-03 00:51:38.601751	locked
84	10	26	second	2023/2024	27	41	68	B	4	2026-05-03 00:51:38.607467	2026-05-03 00:51:38.607467	locked
85	10	11	first	2024/2025	28	38	66	B	4	2026-05-03 00:51:38.613403	2026-05-03 00:51:38.613403	submitted
86	10	27	first	2024/2025	29	41	70	A	5	2026-05-03 00:51:38.618868	2026-05-03 00:51:38.618868	submitted
87	11	9	first	2021/2022	30	47	77	A	5	2026-05-03 00:51:38.628041	2026-05-03 00:51:38.628041	locked
88	11	25	first	2021/2022	31	50	81	A	5	2026-05-03 00:51:38.634637	2026-05-03 00:51:38.634637	locked
89	11	10	second	2021/2022	32	46	78	A	5	2026-05-03 00:51:38.641044	2026-05-03 00:51:38.641044	locked
90	11	26	second	2021/2022	33	49	82	A	5	2026-05-03 00:51:38.64656	2026-05-03 00:51:38.64656	locked
91	11	11	first	2022/2023	34	52	86	A	5	2026-05-03 00:51:38.652588	2026-05-03 00:51:38.652588	locked
92	11	27	first	2022/2023	35	48	83	A	5	2026-05-03 00:51:38.659064	2026-05-03 00:51:38.659064	locked
93	11	12	second	2022/2023	30	51	81	A	5	2026-05-03 00:51:38.665238	2026-05-03 00:51:38.665238	locked
94	11	28	second	2022/2023	31	47	78	A	5	2026-05-03 00:51:38.671444	2026-05-03 00:51:38.671444	locked
95	11	13	first	2023/2024	32	50	82	A	5	2026-05-03 00:51:38.677465	2026-05-03 00:51:38.677465	locked
96	11	29	first	2023/2024	33	46	79	A	5	2026-05-03 00:51:38.684019	2026-05-03 00:51:38.684019	locked
97	11	14	second	2023/2024	34	49	83	A	5	2026-05-03 00:51:38.690148	2026-05-03 00:51:38.690148	locked
98	11	30	second	2023/2024	35	52	87	A	5	2026-05-03 00:51:38.695305	2026-05-03 00:51:38.695305	locked
99	11	15	first	2024/2025	30	48	78	A	5	2026-05-03 00:51:38.701104	2026-05-03 00:51:38.701104	submitted
100	11	31	first	2024/2025	31	51	82	A	5	2026-05-03 00:51:38.708086	2026-05-03 00:51:38.708086	submitted
101	11	16	second	2024/2025	32	47	79	A	5	2026-05-03 00:51:38.713503	2026-05-03 00:51:38.713503	locked
102	11	32	second	2024/2025	33	50	83	A	5	2026-05-03 00:51:38.720606	2026-05-03 00:51:38.720606	locked
103	12	9	first	2022/2023	16	29	45	D	2	2026-05-03 00:51:38.730465	2026-05-03 00:51:38.730465	locked
104	12	25	first	2022/2023	17	32	49	D	2	2026-05-03 00:51:38.736717	2026-05-03 00:51:38.736717	locked
105	12	10	second	2022/2023	18	29	47	D	2	2026-05-03 00:51:38.742442	2026-05-03 00:51:38.742442	locked
106	12	26	second	2022/2023	19	32	51	C	3	2026-05-03 00:51:38.749935	2026-05-03 00:51:38.749935	locked
107	12	11	first	2023/2024	20	29	49	D	2	2026-05-03 00:51:38.757112	2026-05-03 00:51:38.757112	locked
108	12	27	first	2023/2024	21	32	53	C	3	2026-05-03 00:51:38.764788	2026-05-03 00:51:38.764788	locked
109	12	12	second	2023/2024	16	29	45	D	2	2026-05-03 00:51:38.771228	2026-05-03 00:51:38.771228	locked
110	12	28	second	2023/2024	17	32	49	D	2	2026-05-03 00:51:38.77794	2026-05-03 00:51:38.77794	locked
111	12	13	first	2024/2025	18	29	47	D	2	2026-05-03 00:51:38.783964	2026-05-03 00:51:38.783964	submitted
112	12	29	first	2024/2025	19	32	51	C	3	2026-05-03 00:51:38.78968	2026-05-03 00:51:38.78968	submitted
113	13	9	first	2023/2024	24	38	62	B	4	2026-05-03 00:51:38.798791	2026-05-03 00:51:38.798791	locked
114	13	25	first	2023/2024	25	41	66	B	4	2026-05-03 00:51:38.804902	2026-05-03 00:51:38.804902	locked
115	13	10	second	2023/2024	26	38	64	B	4	2026-05-03 00:51:38.811118	2026-05-03 00:51:38.811118	locked
116	13	26	second	2023/2024	27	41	68	B	4	2026-05-03 00:51:38.817519	2026-05-03 00:51:38.817519	locked
117	13	11	first	2024/2025	28	38	66	B	4	2026-05-03 00:51:38.823335	2026-05-03 00:51:38.823335	submitted
118	13	27	first	2024/2025	29	41	70	A	5	2026-05-03 00:51:38.829718	2026-05-03 00:51:38.829718	submitted
119	14	9	first	2024/2025	30	47	77	A	5	2026-05-03 00:51:38.838667	2026-05-03 00:51:38.838667	submitted
120	14	25	first	2024/2025	31	50	81	A	5	2026-05-03 00:51:38.843964	2026-05-03 00:51:38.843964	submitted
121	15	17	first	2022/2023	36	55	91	A	5	2026-05-03 00:51:38.852253	2026-05-03 00:51:38.852253	locked
122	15	25	first	2022/2023	37	58	95	A	5	2026-05-03 00:51:38.858357	2026-05-03 00:51:38.858357	locked
123	15	18	second	2022/2023	38	54	92	A	5	2026-05-03 00:51:38.863629	2026-05-03 00:51:38.863629	locked
124	15	26	second	2022/2023	39	57	96	A	5	2026-05-03 00:51:38.868967	2026-05-03 00:51:38.868967	locked
125	15	19	first	2023/2024	40	60	100	A	5	2026-05-03 00:51:38.874728	2026-05-03 00:51:38.874728	locked
126	15	27	first	2023/2024	36	56	92	A	5	2026-05-03 00:51:38.880559	2026-05-03 00:51:38.880559	locked
127	15	20	second	2023/2024	37	59	96	A	5	2026-05-03 00:51:38.886807	2026-05-03 00:51:38.886807	locked
128	15	28	second	2023/2024	38	55	93	A	5	2026-05-03 00:51:38.892387	2026-05-03 00:51:38.892387	locked
129	15	21	first	2024/2025	39	58	97	A	5	2026-05-03 00:51:38.898245	2026-05-03 00:51:38.898245	submitted
130	15	29	first	2024/2025	40	54	94	A	5	2026-05-03 00:51:38.903416	2026-05-03 00:51:38.903416	submitted
131	16	17	first	2023/2024	24	38	62	B	4	2026-05-03 00:51:38.916306	2026-05-03 00:51:38.916306	locked
132	16	25	first	2023/2024	25	41	66	B	4	2026-05-03 00:51:38.923556	2026-05-03 00:51:38.923556	locked
133	16	18	second	2023/2024	26	38	64	B	4	2026-05-03 00:51:38.930529	2026-05-03 00:51:38.930529	locked
134	16	26	second	2023/2024	27	41	68	B	4	2026-05-03 00:51:38.937361	2026-05-03 00:51:38.937361	locked
135	16	19	first	2024/2025	28	38	66	B	4	2026-05-03 00:51:38.943612	2026-05-03 00:51:38.943612	submitted
136	16	27	first	2024/2025	29	41	70	A	5	2026-05-03 00:51:38.949509	2026-05-03 00:51:38.949509	submitted
137	17	17	first	2021/2022	24	38	62	B	4	2026-05-03 00:51:38.95884	2026-05-03 00:51:38.95884	locked
138	17	25	first	2021/2022	25	41	66	B	4	2026-05-03 00:51:38.965123	2026-05-03 00:51:38.965123	locked
139	17	18	second	2021/2022	26	38	64	B	4	2026-05-03 00:51:38.97148	2026-05-03 00:51:38.97148	locked
140	17	26	second	2021/2022	27	41	68	B	4	2026-05-03 00:51:38.977686	2026-05-03 00:51:38.977686	locked
141	17	19	first	2022/2023	28	38	66	B	4	2026-05-03 00:51:38.983712	2026-05-03 00:51:38.983712	locked
142	17	27	first	2022/2023	29	41	70	A	5	2026-05-03 00:51:38.989516	2026-05-03 00:51:38.989516	locked
143	17	20	second	2022/2023	24	38	62	B	4	2026-05-03 00:51:38.995548	2026-05-03 00:51:38.995548	locked
144	17	28	second	2022/2023	25	41	66	B	4	2026-05-03 00:51:39.001149	2026-05-03 00:51:39.001149	locked
145	17	21	first	2023/2024	26	38	64	B	4	2026-05-03 00:51:39.007331	2026-05-03 00:51:39.007331	locked
146	17	29	first	2023/2024	27	41	68	B	4	2026-05-03 00:51:39.013067	2026-05-03 00:51:39.013067	locked
147	17	22	second	2023/2024	28	38	66	B	4	2026-05-03 00:51:39.019461	2026-05-03 00:51:39.019461	locked
148	17	30	second	2023/2024	29	41	70	A	5	2026-05-03 00:51:39.025924	2026-05-03 00:51:39.025924	locked
149	17	23	first	2024/2025	24	38	62	B	4	2026-05-03 00:51:39.031625	2026-05-03 00:51:39.031625	submitted
150	17	31	first	2024/2025	25	41	66	B	4	2026-05-03 00:51:39.037384	2026-05-03 00:51:39.037384	submitted
151	17	24	second	2024/2025	26	38	64	B	4	2026-05-03 00:51:39.043279	2026-05-03 00:51:39.043279	locked
152	17	32	second	2024/2025	27	41	68	B	4	2026-05-03 00:51:39.048679	2026-05-03 00:51:39.048679	locked
153	18	17	first	2024/2025	16	29	45	D	2	2026-05-03 00:51:39.057492	2026-05-03 00:51:39.057492	submitted
154	18	25	first	2024/2025	17	32	49	D	2	2026-05-03 00:51:39.063857	2026-05-03 00:51:39.063857	submitted
155	19	17	first	2023/2024	30	47	77	A	5	2026-05-03 00:51:39.072649	2026-05-03 00:51:39.072649	locked
156	19	25	first	2023/2024	31	50	81	A	5	2026-05-03 00:51:39.078111	2026-05-03 00:51:39.078111	locked
157	19	18	second	2023/2024	32	46	78	A	5	2026-05-03 00:51:39.083727	2026-05-03 00:51:39.083727	locked
158	19	26	second	2023/2024	33	49	82	A	5	2026-05-03 00:51:39.089201	2026-05-03 00:51:39.089201	locked
159	19	19	first	2024/2025	34	52	86	A	5	2026-05-03 00:51:39.095474	2026-05-03 00:51:39.095474	submitted
160	19	27	first	2024/2025	35	48	83	A	5	2026-05-03 00:51:39.100873	2026-05-03 00:51:39.100873	submitted
161	20	17	first	2022/2023	7	16	23	F	0	2026-05-03 00:51:39.109491	2026-05-03 00:51:39.109491	locked
162	20	25	first	2022/2023	8	19	27	F	0	2026-05-03 00:51:39.115023	2026-05-03 00:51:39.115023	locked
163	20	18	second	2022/2023	9	16	25	F	0	2026-05-03 00:51:39.120788	2026-05-03 00:51:39.120788	locked
164	20	26	second	2022/2023	10	19	29	F	0	2026-05-03 00:51:39.126258	2026-05-03 00:51:39.126258	locked
165	20	19	first	2023/2024	11	16	27	F	0	2026-05-03 00:51:39.131863	2026-05-03 00:51:39.131863	locked
166	20	27	first	2023/2024	12	19	31	F	0	2026-05-03 00:51:39.137695	2026-05-03 00:51:39.137695	locked
167	20	20	second	2023/2024	7	16	23	F	0	2026-05-03 00:51:39.143256	2026-05-03 00:51:39.143256	locked
168	20	28	second	2023/2024	8	19	27	F	0	2026-05-03 00:51:39.149519	2026-05-03 00:51:39.149519	locked
169	20	21	first	2024/2025	9	16	25	F	0	2026-05-03 00:51:39.154853	2026-05-03 00:51:39.154853	submitted
170	20	29	first	2024/2025	10	19	29	F	0	2026-05-03 00:51:39.160091	2026-05-03 00:51:39.160091	submitted
171	20	19	first	2024/2025	11	16	27	F	0	2026-05-03 00:51:39.165705	2026-05-03 00:51:39.165705	submitted
172	18	1	first	2024/2025	25	55	80	A	5	2026-05-03 01:26:51.855878	2026-05-03 01:32:17.126	submitted
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.rooms (id, hostel_id, room_number, capacity, status, floor, created_at) FROM stdin;
1	1	A101	4	available	1	2026-05-03 00:51:39.810631
2	1	A102	4	available	1	2026-05-03 00:51:39.810631
3	1	A103	4	available	1	2026-05-03 00:51:39.810631
4	1	A104	4	available	2	2026-05-03 00:51:39.810631
5	1	A105	4	available	2	2026-05-03 00:51:39.810631
6	2	B101	4	available	1	2026-05-03 00:51:39.81568
7	2	B102	4	available	1	2026-05-03 00:51:39.81568
8	2	B103	4	available	1	2026-05-03 00:51:39.81568
9	2	B104	4	available	2	2026-05-03 00:51:39.81568
10	2	B105	4	available	2	2026-05-03 00:51:39.81568
11	3	T01	2	available	1	2026-05-03 01:26:52.158649
12	4	T01	2	available	1	2026-05-03 01:31:00.980995
13	5	T01	2	available	1	2026-05-03 01:32:05.827328
14	6	T01	2	available	1	2026-05-03 01:32:17.345026
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.students (id, user_id, matric_number, department, faculty, level, cgpa, enrollment_year, created_at, updated_at) FROM stdin;
18	35	MAAUN/MC/24/018	Mass Communication	Arts and Social Sciences	100	2.01	2024	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
19	36	MAAUN/MC/23/019	Mass Communication	Arts and Social Sciences	200	3.88	2023	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
20	37	MAAUN/MC/22/020	Mass Communication	Arts and Social Sciences	300	1.02	2022	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
21	38	MAAUN/2026/CSC/6070	Computer Science	Science and Technology	100	\N	2026	2026-05-03 01:55:41.795917	2026-05-03 01:55:41.795917
1	18	MAAUN/CS/22/001	Computer Science	Science and Technology	300	3.82	2022	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
2	19	MAAUN/CS/23/002	Computer Science	Science and Technology	200	4.76	2023	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
3	20	MAAUN/CS/24/003	Computer Science	Science and Technology	100	4.1	2024	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
4	21	MAAUN/CS/22/004	Computer Science	Science and Technology	300	2.14	2022	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
5	22	MAAUN/CS/21/005	Computer Science	Science and Technology	400	4.76	2021	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
6	23	MAAUN/CS/23/006	Computer Science	Science and Technology	200	3.12	2023	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
7	24	MAAUN/CS/21/007	Computer Science	Science and Technology	400	1.18	2021	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
8	25	MAAUN/BA/22/008	Business Administration	Management Sciences	300	3.71	2022	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
9	26	MAAUN/BA/24/009	Business Administration	Management Sciences	100	4.9	2024	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
10	27	MAAUN/BA/23/010	Business Administration	Management Sciences	200	3.14	2023	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
11	28	MAAUN/BA/21/011	Business Administration	Management Sciences	400	3.62	2021	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
12	29	MAAUN/BA/22/012	Business Administration	Management Sciences	300	2.21	2022	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
13	30	MAAUN/BA/23/013	Business Administration	Management Sciences	200	3.08	2023	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
14	31	MAAUN/BA/24/014	Business Administration	Management Sciences	100	4.05	2024	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
15	32	MAAUN/MC/22/015	Mass Communication	Arts and Social Sciences	300	4.61	2022	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
16	33	MAAUN/MC/23/016	Mass Communication	Arts and Social Sciences	200	3.09	2023	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
17	34	MAAUN/MC/21/017	Mass Communication	Arts and Social Sciences	400	2.84	2021	2026-05-03 00:51:37.903027	2026-05-03 00:51:37.903027
\.


--
-- Data for Name: timetables; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.timetables (id, course_id, lecturer_id, venue_id, day_of_week, start_time, end_time, session_id, semester_id, created_by, created_at) FROM stdin;
1	1	1	1	Monday	08:00	10:00	4	7	1	2026-05-03 00:51:39.799838
2	3	1	1	Tuesday	08:00	10:00	4	7	1	2026-05-03 00:51:39.799838
3	5	1	6	Wednesday	08:00	10:00	4	7	1	2026-05-03 00:51:39.799838
4	7	1	6	Thursday	08:00	10:00	4	7	1	2026-05-03 00:51:39.799838
5	9	3	3	Monday	10:00	12:00	4	7	1	2026-05-03 00:51:39.799838
6	11	3	3	Tuesday	10:00	12:00	4	7	1	2026-05-03 00:51:39.799838
7	13	3	3	Wednesday	10:00	12:00	4	7	1	2026-05-03 00:51:39.799838
8	15	3	4	Thursday	10:00	12:00	4	7	1	2026-05-03 00:51:39.799838
9	17	5	5	Monday	12:00	14:00	4	7	1	2026-05-03 00:51:39.799838
10	19	5	5	Tuesday	12:00	14:00	4	7	1	2026-05-03 00:51:39.799838
11	21	5	5	Wednesday	12:00	14:00	4	7	1	2026-05-03 00:51:39.799838
12	23	5	5	Thursday	12:00	14:00	4	7	1	2026-05-03 00:51:39.799838
13	25	1	7	Friday	08:00	10:00	4	7	1	2026-05-03 00:51:39.799838
14	27	3	7	Friday	10:00	12:00	4	7	1	2026-05-03 00:51:39.799838
15	29	5	7	Friday	12:00	14:00	4	7	1	2026-05-03 00:51:39.799838
16	31	1	7	Friday	14:00	16:00	4	7	1	2026-05-03 00:51:39.799838
\.


--
-- Data for Name: transcripts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.transcripts (id, student_id, generated_by, approved_by, status, reference_number, ip_address, notes, approved_at, finalized_at, created_at, updated_at) FROM stdin;
1	5	5	1	official	TRN-00100001	105.112.0.1	Official transcript issued for 17th Convocation.	2024-11-10 00:00:00	2024-11-11 00:00:00	2026-05-03 00:51:40.070295	2026-05-03 00:51:40.070295
2	11	5	1	approved	TRN-00100002	105.112.0.1	Approved for convocation.	2024-11-10 00:00:00	\N	2026-05-03 00:51:40.070295	2026-05-03 00:51:40.070295
3	1	5	\N	pending	TRN-00100003	41.58.100.12	Student requested transcript for postgraduate application.	\N	\N	2026-05-03 00:51:40.070295	2026-05-03 00:51:40.070295
4	15	5	\N	draft	TRN-00100004	41.58.100.12	Draft prepared, awaiting department sign-off.	\N	\N	2026-05-03 00:51:40.070295	2026-05-03 00:51:40.070295
5	18	2	2	approved	MAAUN-TXN-2026-0C18A7C4	127.0.0.1	\N	2026-05-03 01:26:52.344	\N	2026-05-03 01:26:52.328967	2026-05-03 01:26:52.344
6	18	2	2	official	MAAUN-TXN-2026-FEC2DBC0	127.0.0.1	\N	2026-05-03 01:31:01.192	2026-05-03 01:31:01.192	2026-05-03 01:31:01.159871	2026-05-03 01:31:01.192
7	18	2	2	official	MAAUN-TXN-2026-310E9BFF	127.0.0.1	\N	2026-05-03 01:32:06.075	2026-05-03 01:32:06.075	2026-05-03 01:32:06.043451	2026-05-03 01:32:06.075
8	18	2	2	official	MAAUN-TXN-2026-90000B7A	127.0.0.1	\N	2026-05-03 01:32:17.62	2026-05-03 01:32:17.62	2026-05-03 01:32:17.587822	2026-05-03 01:32:17.62
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, name, email, password_hash, role, created_at, updated_at) FROM stdin;
1	Dr. Aminu Kano	admin@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	super_admin	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
2	Prof. Halima Ibrahim	halima.ibrahim@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	admin	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
3	Dr. Hadiza Musa	hadiza.musa@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	admin	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
4	Prof. Abubakar Shehu	abubakar.shehu@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	dean	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
5	Mr. Samuel Okafor	samuel.okafor@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	registrar	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
6	Mrs. Fatima Bello	fatima.bello@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	bursar	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
7	Prof. Ahmad Usman	ahmad.usman@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	hod	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
8	Dr. Kemi Adesanya	kemi.adesanya@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	hod	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
9	Prof. Garba Idris	garba.idris@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	hod	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
10	Miss Amina Danladi	amina.danladi@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	counsellor	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
11	Mr. Chukwudi Eze	chukwudi.eze@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	counsellor	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
12	Prof. Ibrahim Musa	ibrahim.musa@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	lecturer	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
13	Dr. Fatima Al-Rashid	fatima.rashid@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	lecturer	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
14	Prof. Sule Adamu	sule.adamu@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	lecturer	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
15	Dr. Chioma Obi	chioma.obi@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	lecturer	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
16	Mr. Emeka Nwosu	emeka.nwosu@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	lecturer	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
17	Mrs. Ngozi Adeyemi	ngozi.adeyemi@maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	lecturer	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
18	Aisha Mohammed	aisha.mohammed@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
19	Usman Bello	usman.bello@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
20	Fatima Abdullahi	fatima.abdullahi@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
21	Kabiru Hassan	kabiru.hassan@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
22	Maryam Sani	maryam.sani@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
23	Chukwuemeka Obi	chukwuemeka.obi@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
24	Amina Yusuf	amina.yusuf@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
25	Ibrahim Lawal	ibrahim.lawal@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
26	Zainab Aliyu	zainab.aliyu@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
27	Mustapha Garba	mustapha.garba@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
28	Blessing Okonkwo	blessing.okonkwo@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
29	Yakubu Danladi	yakubu.danladi@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
30	Ramatu Shehu	ramatu.shehu@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
31	Emmanuel Eze	emmanuel.eze@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
32	Hauwa Ismail	hauwa.ismail@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
33	Tunde Adebayo	tunde.adebayo@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
34	Grace Nwosu	grace.nwosu@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
35	Mohammed Bashir	mohammed.bashir@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
36	Ngozi Okafor	ngozi.okafor@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
37	Abdullahi Musa	abdullahi.musa@student.maaun.edu.ng	$2b$10$npeHkbQRdrLhMPlpz2eIae.Q9VwaKM0ssAzeAA5iutmTRv/zVfAPq	student	2026-05-03 00:51:37.89548	2026-05-03 00:51:37.89548
38	Victor Harmani	harmanicodes@gmail.com	$2b$10$5ZNyXNTBdjdFECAAtooEVOwguMhTxdMlU6QfnbwGYsz/1lKO6U4Pu	student	2026-05-03 01:55:41.500229	2026-05-03 01:55:41.500229
\.


--
-- Data for Name: venues; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.venues (id, name, capacity, location, created_at) FROM stdin;
1	Lecture Hall 101	120	Main Academic Block, Ground Floor	2026-05-03 00:51:39.795731
2	Lecture Hall 102	80	Main Academic Block, Ground Floor	2026-05-03 00:51:39.795731
3	Lecture Hall 201	100	Management Block, First Floor	2026-05-03 00:51:39.795731
4	Lecture Hall 202	60	Management Block, First Floor	2026-05-03 00:51:39.795731
5	Lecture Hall 301	80	Arts Block, Second Floor	2026-05-03 00:51:39.795731
6	Computer Lab 1	40	ICT Centre, Ground Floor	2026-05-03 00:51:39.795731
7	Main Auditorium	400	Student Union Building	2026-05-03 00:51:39.795731
\.


--
-- Data for Name: welfare_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.welfare_assignments (id, case_id, assigned_to, assigned_by, assigned_at) FROM stdin;
1	1	10	1	2026-05-03 00:51:40.053225
2	2	10	1	2026-05-03 00:51:40.053225
3	3	11	1	2026-05-03 00:51:40.053225
4	5	11	1	2026-05-03 00:51:40.053225
5	6	10	1	2026-05-03 00:51:40.053225
6	1	10	2	2026-05-03 01:26:52.265455
7	7	10	2	2026-05-03 01:31:01.100808
8	8	10	2	2026-05-03 01:32:05.989815
9	9	10	2	2026-05-03 01:32:17.529222
\.


--
-- Data for Name: welfare_cases; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.welfare_cases (id, student_id, category, title, description, priority, status, is_confidential, created_at, updated_at) FROM stdin;
2	1	academic_stress	Exam Anxiety and Academic Pressure	Student experiencing significant anxiety ahead of 300-level examinations. Reports sleep disruption and inability to concentrate.	medium	resolved	f	2026-05-03 00:51:40.04981	2026-05-03 00:51:40.04981
3	20	mental_health	Severe Depression and Social Withdrawal	Student reported by roommate as showing signs of severe depression, refusing meals and social interaction for multiple days.	urgent	in_progress	t	2026-05-03 00:51:40.04981	2026-05-03 00:51:40.04981
4	7	financial_support	Outstanding Fees — Risk of Withdrawal	Student is at risk of being barred from examinations due to outstanding tuition fees. Parents overseas and remittance delayed.	high	submitted	f	2026-05-03 00:51:40.04981	2026-05-03 00:51:40.04981
5	17	harassment	Alleged Harassment by Coursemate	Student reports persistent unwanted contact and intimidation from a fellow student. Requests formal intervention.	high	assigned	t	2026-05-03 00:51:40.04981	2026-05-03 00:51:40.04981
6	4	mental_health	Mental Health Support Post-Disciplinary Action	Student referred for counselling following disciplinary case. Showing signs of anxiety and regret.	medium	submitted	f	2026-05-03 00:51:40.04981	2026-05-03 00:51:40.04981
1	12	financial_support	Financial Hardship — Cannot Afford Tuition	Student reports severe financial hardship following father's job loss. Unable to meet tuition payment deadline. Requests emergency bursary or payment plan.	medium	in_progress	f	2026-05-03 00:51:40.04981	2026-05-03 01:26:52.314
7	1	academic_stress	System Auto-Test Case	Auto-generated test case — safe to ignore	medium	in_progress	f	2026-05-03 01:31:00.702412	2026-05-03 01:31:01.145
8	1	academic_stress	System Auto-Test Case	Auto-generated test case — safe to ignore	medium	in_progress	f	2026-05-03 01:32:05.54862	2026-05-03 01:32:06.028
9	1	academic_stress	System Auto-Test Case	Auto-generated test case — safe to ignore	medium	in_progress	f	2026-05-03 01:32:17.070304	2026-05-03 01:32:17.572
\.


--
-- Data for Name: welfare_notes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.welfare_notes (id, case_id, author_id, note, is_private, created_at) FROM stdin;
1	1	10	Initial meeting held on 04 Nov 2024. Student confirmed details. Emergency bursary application submitted to finance office. Awaiting approval.	f	2026-05-03 00:51:40.057335
2	1	10	Private: Student also mentioned family tension at home. May need extended emotional support beyond financial assistance.	t	2026-05-03 00:51:40.057335
3	2	10	Three sessions completed. Student reports improved sleep and reduced anxiety after implementing time-management strategies. Case resolved.	f	2026-05-03 00:51:40.057335
4	3	11	Urgent: Contacted student directly — unresponsive initially. Eventually agreed to meeting. CRIS assessment performed (score 12 — moderate risk). Follow-up daily for next 7 days.	t	2026-05-03 00:51:40.057335
5	3	11	Student engaged in first counselling session. Agreed to eat meals in counselling office until stabilized. Referred to university nurse for health assessment.	f	2026-05-03 00:51:40.057335
6	5	11	Confidential: Incident may involve a named perpetrator. Student has declined to disclose name at this stage. Will report to Dean of Students if situation escalates.	t	2026-05-03 00:51:40.057335
7	1	2	Auto-test note from system runner	f	2026-05-03 01:26:52.301009
8	7	2	Auto-test note	f	2026-05-03 01:31:01.13477
9	8	2	Auto-test note	f	2026-05-03 01:32:06.016817
10	9	2	Auto-test note	f	2026-05-03 01:32:17.560122
\.


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

\unrestrict 3vywHiyw8S0LbDp22nLbw45aWoDUWEdH77gPJIyUt7aFMzOTyMxeHZ6YYxCNt4X

