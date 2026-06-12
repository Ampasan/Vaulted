import { Router } from "express";
import {
  getItems,
  getMyCollection,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  addPriceHistory,
} from "../controllers/itemController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getItems);
router.get("/my/collection", authMiddleware, getMyCollection);
router.get("/:id", getItemById);
router.post("/", authMiddleware, createItem);
router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, deleteItem);
router.post("/:id/price-history", authMiddleware, addPriceHistory);

export default router;
