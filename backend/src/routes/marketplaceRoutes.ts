import { Router } from "express";
import {
  getMarketplaceItems,
  listItemOnMarketplace,
  removeItemFromMarketplace,
  buyMarketplaceItem,
} from "../controllers/marketplaceController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getMarketplaceItems);
router.post("/:itemId/list", authMiddleware, listItemOnMarketplace);
router.post("/:itemId/unlist", authMiddleware, removeItemFromMarketplace);
router.post("/:itemId/buy", authMiddleware, buyMarketplaceItem);

export default router;
