import { Router } from "express";
import { chargeCard, getSavedCards, handleWebhook, createVirtualAccount } from "../controllers/paymentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/charge", authMiddleware, chargeCard);
router.post("/create-va", authMiddleware, createVirtualAccount);
router.get("/saved-cards", authMiddleware, getSavedCards);
router.post("/webhook", handleWebhook);

export default router;
