// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Category Controllers
const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/Category");

// Import Middlewares
const { auth, isAdmin } = require("../middlewares/auth");

// Routes for Category operations

// Category can Only be Created by Admin
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

module.exports = router;
