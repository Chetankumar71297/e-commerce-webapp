import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getFilteredProductsController,
  getProductController,
  getProductCountController,
  getProductPhotoController,
  getProductsByCategoryController,
  getProductsController,
  getProductsForPageController,
  getRelatedProductsController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
//create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get all products
router.get("/get-products", getProductsController);

//get single product
router.get("/get-product/:slug", getProductController);

//get photo
router.get("/product-photo/:pid", getProductPhotoController);

//delete product
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

//get products by filter
router.post("/get-filtered-products", getFilteredProductsController);

//get product count
router.get("/get-product-count", getProductCountController);

//get product list based on page
router.get("/products-for-page/:page", getProductsForPageController);

//search product
router.get("/search/:keyword", searchProductController);

//get similar products
router.get("/related-products/:pid/:cid", getRelatedProductsController);

//get product by category
router.get("/get-category-products/:slug", getProductsByCategoryController);

export default router;
