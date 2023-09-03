import slugify from "slugify";
import categoryModal from "../models/categoryModal.js";
import userModal from "../models/userModal.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModal.findOne({ name });
    if (existingCategory) {
      return res
        .status(200)
        .send({ success: true, message: "Category already exists" });
    }
    const category = await new categoryModal({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in category",
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { _id } = req.params;
    const category = await categoryModal.findByIdAndUpdate(
      _id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

//get all categories
export const getCategoriesController = async (req, res) => {
  try {
    const categoriesList = await categoryModal.find({});
    res.status(200).send({
      success: true,
      message: "All categories list",
      categoriesList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

//get single category
export const getCategoryController = async (req, res) => {
  try {
    const category = await categoryModal.findOne({ slug: req.params.slug });
    res.status(500).send({
      success: true,
      message: "Got category successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting category",
    });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { _id } = req.params;
    await categoryModal.findByIdAndDelete(_id);
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};
