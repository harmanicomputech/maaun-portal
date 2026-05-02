import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import coursesRouter from "./courses";
import enrollmentsRouter from "./enrollments";
import resultsRouter from "./results";
import studentsRouter from "./students";
import lecturersRouter from "./lecturers";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(coursesRouter);
router.use(enrollmentsRouter);
router.use(resultsRouter);
router.use(studentsRouter);
router.use(lecturersRouter);
router.use(dashboardRouter);

export default router;
