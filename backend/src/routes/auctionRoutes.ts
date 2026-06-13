import { Router } from "express";
import {
  getAuctions,
  getAuctionById,
  createAuction,
  placeBid,
} from "../controllers/auctionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getAuctions);
router.get("/:id", getAuctionById);
router.post("/", authMiddleware, createAuction);
router.post("/:id/bid", authMiddleware, placeBid);

export default router;
