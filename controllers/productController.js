import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModal.js";
import fs, { readFileSync } from "fs";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

import stripePackage from "stripe";

const stripe = stripePackage(
  "sk_test_51NsTZ1SBNKUrGyIeY85MQ8JjVeLZCVMugIcbe744wEFQlWKIE8CNgBz3jZYB1RfPMIV6jsnjG32COspDDczXNkVY00702vx39O"
);

//configure env
dotenv.config();

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case !photo || photo.size > 1000000:
        return res
          .status(400)
          .send({ error: "Photo is required and should be less then 1mb" });
      case !allowedImageTypes.includes(photo.type):
        return res.status(400).send({
          error: "Invalid file format. Only JPEG, PNG, and GIF are allowed.",
        });
    }
    const product = new productModel({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

export const getProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting products",
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category")
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Successfully fetched the product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting product",
    });
  }
};

export const getFilteredProductsController = async (req, res) => {
  try {
    const { checkedCategoriesId, priceRange } = req.body;
    let args = {};
    if (checkedCategoriesId.length > 0) args.category = checkedCategoriesId;
    if (priceRange.length)
      args.price = { $gte: priceRange[0], $lte: priceRange[1] };
    const products = await productModel.find(args).select("-photo");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while filtering products",
    });
  }
};

export const getProductPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting product image",
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.pid);

    if (!deletedProduct) {
      // If the product was not found, return a 404 status code
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting product",
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less then 1mb" });
      case photo && !allowedImageTypes.includes(photo.type):
        return res.status(400).send({
          error: "Invalid file format. Only JPEG, PNG, and GIF are allowed.",
        });
    }
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating product",
    });
  }
};

//get product count
export const getProductCountController = async (req, res) => {
  try {
    const totalProductCount = await productModel
      .find({})
      .estimatedDocumentCount();
    res.status(200).send({
      success: true,
      totalProductCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting product count",
    });
  }
};

//get product list based on page
export const getProductsForPageController = async (req, res) => {
  try {
    const productCountPerPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * productCountPerPage)
      .limit(productCountPerPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting product",
    });
  }
};

//search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const products = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in searching product",
    });
  }
};

export const getRelatedProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting related products",
    });
  }
};

export const getProductsByCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ slug });
    const products = await productModel
      .find({ category })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting products by category",
    });
  }
};

//stripe payment gateway api
export const stripePaymentController = async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100,
    },
    quantity: 1,
  }));
  //we can use card number this(5555555555554444) with any three digit cvv and any future exp date for testing
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  if (session) {
    const order = new orderModel({
      products: products,
      payment: session,
      buyer: req.user._id,
    }).save();
  }
  res.json({ id: session.id });
};

//payment
/*export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((item) => (total += item.price));
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};*/
