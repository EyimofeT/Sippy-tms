import express from 'express';
const router = express.Router();
import { view_user,view_all_user, view_leaderboard } from './controller.js';
import { authcheck } from '../auth/middleware.js';


router.use(authcheck)
router.get("/view", view_user)

router.get("/view/all", view_all_user)

router.get("/leaderboard", view_leaderboard)
export default router