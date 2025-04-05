import express from 'express';
const router = express.Router();
import {
    register_middleware, login_middleware
} from "./middleware.js"
import {
    register, login
} from "./controller.js"


router.post("/register", register_middleware, register)
router.post("/login", login_middleware, login)
export default router