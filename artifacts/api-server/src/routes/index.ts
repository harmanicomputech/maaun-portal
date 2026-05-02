import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import coursesRouter from "./courses";
import enrollmentsRouter from "./enrollments";
import resultsRouter from "./results";
import studentsRouter from "./students";
import lecturersRouter from "./lecturers";
import dashboardRouter from "./dashboard";
import sessionsRouter from "./sessions";
import paymentsRouter from "./payments";
import notificationsRouter from "./notifications";
import activityLogsRouter from "./activity-logs";
import academicStandingRouter from "./academic-standing";
import transcriptsRouter from "./transcripts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(coursesRouter);
router.use(enrollmentsRouter);
router.use(resultsRouter);
router.use(studentsRouter);
router.use(lecturersRouter);
router.use(dashboardRouter);
router.use(sessionsRouter);
router.use(paymentsRouter);
router.use(notificationsRouter);
router.use(activityLogsRouter);
router.use(academicStandingRouter);
router.use(transcriptsRouter);

export default router;
