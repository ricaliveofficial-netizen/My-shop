import express from "express";
import multer from "multer";
import Product from "../models/product.js";
import path from "path";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "server/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload product route
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;

    const product = new Product({ name, price, image: imagePath });
    await product.save();

    res.json({ success: true, message: "✅ Product uploaded successfully!" });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get all products
router.get("/all", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

export default router;