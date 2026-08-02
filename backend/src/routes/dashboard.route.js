import express from "express"
import { verifyJWT } from "../middlewares/auth.js"
import { getDashboardData, getOrderById } from "../controllers/dashboard.controller.js"
const router = express.Router()

router.get("/getDashboardData", getDashboardData)
router.get("/getOrderById/:id", getOrderById)

export default router
