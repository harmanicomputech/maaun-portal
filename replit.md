# MAAUN University Portal

## Overview

Full-stack University Management Portal for Maryam Abacha American University of Nigeria (MAAUN). React + Vite frontend, Express backend, PostgreSQL + Drizzle ORM. Three roles: student, lecturer, admin.

**Design**: Primary color `#0B3CFE`, Poppins font.

**Demo credentials** (password: `maaun2024`):
- Admin: `admin@maaun.edu.ng`
- Student: `aisha.mohammed@student.maaun.edu.ng`
- Lecturer: `ibrahim.musa@maaun.edu.ng`

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui + Wouter routing
- **Charts**: Recharts
- **PDF**: jsPDF + QR code

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `cd lib/db && pnpm run push` — push DB schema changes (dev only)
- Restart workflow: `artifacts/api-server: API Server`

## Artifacts

| Artifact | Path | Description |
|---|---|---|
| `university-portal` | `/` | Main React frontend |
| `api-server` | `/api` | Express backend |

## DB Schema (lib/db/src/schema)

| File | Tables |
|---|---|
| `users.ts` | `users` |
| `students.ts` | `students` |
| `lecturers.ts` | `lecturers` |
| `courses.ts` | `courses` |
| `enrollments.ts` | `enrollments` |
| `results.ts` | `results` |
| `sessions.ts` | `academic_sessions` |
| `fees.ts` | `fees`, `payments` |
| `activity-logs.ts` | `activity_logs` |
| `notifications.ts` | `notifications` |
| `academic-standings.ts` | `academic_standings` |
| `transcripts.ts` | `transcripts` |
| `financial.ts` | `receipts`, `financial_ledger` |
| `timetable.ts` | `venues`, `timetables` |
| `graduation.ts` | `graduation_clearances`, `graduation_applications` |

## Features Completed

### Phase 1–10: Core
- User auth (JWT), role-based access (student/lecturer/admin)
- Student and lecturer profiles
- Course management, enrollments
- Academic sessions
- Fee management and payments (Paystack)
- Notification system
- Activity audit log

### Phase 11–20: Academic
- Result entry (CA + exam → total → grade → grade point)
- Grade locking and approval workflow
- CGPA calculation engine
- Academic standings (Good/Probation/Withdrawal Risk)
- Classification (First Class/2.1/2.2/Third/Pass/Fail)
- Admin academic standing dashboard with Recharts

### Phase 21: Transcript System
- Official transcript generation with reference numbers
- Draft → Pending → Approved → Official workflow
- Lecturer initiates, admin approves
- Public verification endpoint `/verify/transcript/:reference`

### Phase 22: Financial Ledger & Receipts
- `receipts` and `financial_ledger` tables
- Receipt confirmation, reversal, QR code
- Admin finance dashboard with revenue charts
- Public receipt verification `/verify/receipt/:reference`
- jsPDF receipt PDF download

### Phase 23: Timetable & Scheduling
- `venues` and `timetables` tables
- 3-way conflict engine: lecturer / venue / course conflicts
- Student: auto-generated weekly grid from enrollments
- Lecturer: schedule manager with conflict detection
- Admin: 4-tab dashboard (weekly grid / list / conflicts / venues)

### Phase 24: Graduation Clearance
- `graduation_clearances` and `graduation_applications` tables
- Eligibility engine: CGPA ≥ 1.50 + no carryovers + confirmed fees + official transcript
- Student: real-time clearance card + apply button + PDF report
- Admin: evaluate all students, approve/reject applications, admin override (logged)
- Notifications on approval/rejection

## API Routes (artifacts/api-server/src/routes)

| File | Prefix | Notes |
|---|---|---|
| `auth.ts` | `/api/auth` | login, register, me |
| `courses.ts` | `/api/courses` | CRUD |
| `enrollments.ts` | `/api/enrollments` | student enroll/drop |
| `results.ts` | `/api/results` | enter, approve, lock |
| `students.ts` | `/api/students` | profile, list |
| `lecturers.ts` | `/api/lecturers` | profile, list |
| `dashboard.ts` | `/api/dashboard` | role dashboards |
| `sessions.ts` | `/api/sessions` | academic sessions |
| `payments.ts` | `/api/payments` | fees + Paystack |
| `notifications.ts` | `/api/notifications` | CRUD |
| `activity-logs.ts` | `/api/activity-logs` | audit log |
| `academic-standing.ts` | `/api/academic-standing` | CGPA engine |
| `transcripts.ts` | `/api/transcripts` | lifecycle |
| `financial.ts` | `/api/receipts`, `/api/ledger`, `/api/finance` | finance |
| `timetable.ts` | `/api/venues`, `/api/timetables` | scheduling |
| `graduation.ts` | `/api/graduation` | clearance engine |

## Notification Type Constraint

`notificationsTable.type` accepts: `"info" | "success" | "warning" | "payment" | "result" | "enrollment" | "timetable"`
