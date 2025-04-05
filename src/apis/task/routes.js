import express from 'express';
const router = express.Router();
import { create_user_task_middleware, delete_user_task_middleware, update_user_task_middleware,filter_user_task_middleware, sort_user_task_middleware } from './middleware.js';
import { create_user_task, view_user_created_task,view_user_assigned_task,
     delete_user_task, update_user_task, view_all_task, filter_user_task , sort_user_task} from './controller.js';
import { authcheck } from '../auth/middleware.js';

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(authcheck)
router.post("/create",upload.fields([{ name: 'image', maxCount: 1 }]),create_user_task_middleware, create_user_task)
router.get("/view/created",view_user_created_task)
router.get("/view/assigned", view_user_assigned_task)
router.get("/view/all", view_all_task)
router.delete("/delete",delete_user_task_middleware, delete_user_task)
router.patch("/update",upload.fields([{ name: 'image', maxCount: 1 }]),update_user_task_middleware, update_user_task)

router.get("/filter", filter_user_task_middleware, filter_user_task )
router.get("/sort", sort_user_task_middleware, sort_user_task )

export default router