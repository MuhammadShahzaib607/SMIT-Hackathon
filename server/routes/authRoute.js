import express from "express"
import { getUser, login, signup, updateUser } from "../controllers/auth.js"
import { verifyToken } from "../utils/verifyToken.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/getUser/:id", getUser)
router.put("/updateUser", verifyToken, updateUser)

export default router