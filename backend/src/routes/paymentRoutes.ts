import { Router } from "express";
import { chargeCard, getSavedCards, handleWebhook } from "../controllers/paymentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/charge", authMiddleware, chargeCard);
router.get("/saved-cards", authMiddleware, getSavedCards);
router.post("/webhook", handleWebhook);

export default router;
