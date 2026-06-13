import { Router } from "express";
import {
  getTransactions,
  getTransactionById,
} from "../controllers/transactionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getTransactions);
router.get("/:id", authMiddleware, getTransactionById);

export default router;
