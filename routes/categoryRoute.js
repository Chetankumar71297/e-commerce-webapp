import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  getCategoriesController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";
const router = express.Router();

//routes
//create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  "/update-category/:_id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//get all category
router.get("/get-categories", getCategoriesController);

//get single category
router.get("/get-category/:slug", getCategoryController);

//delete category
router.delete(
  "/delete-category/:_id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
