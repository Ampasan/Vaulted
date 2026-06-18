import { Router } from "express";
import { register, login, googleLogin, getMe, updateProfile } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateProfile);

export default router;
