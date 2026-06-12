import { Router } from "express";
import {
  getMarketplaceItems,
  listItemOnMarketplace,
  buyMarketplaceItem,
} from "../controllers/marketplaceController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getMarketplaceItems);
router.post("/:itemId/list", authMiddleware, listItemOnMarketplace);
router.post("/:itemId/buy", authMiddleware, buyMarketplaceItem);

export default router;
