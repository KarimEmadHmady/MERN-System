// 🛠️ استيراد الحزم الأساسية
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// 🛠️ استيراد الملفات الخاصة بالمشروع
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

// 🛠️ تحميل متغيرات البيئة
dotenv.config();
const port = process.env.PORT || 5001;

// 🛠️ الاتصال بقاعدة البيانات
connectDB();

// 🏗️ إنشاء التطبيق
const app = express();

// ✅ تفعيل `trust proxy` لدعم جلب IP من `x-forwarded-for` عند الاستضافة
app.set("trust proxy", true);

app.use(
  cors({
    origin: "http://localhost:5173", // عدّلها حسب نطاق الفرونت
    credentials: true, // ✅ مهم جدًا للسماح بتمرير الجلسات
  })
);

// 🛠️ ميدل وير لتحليل بيانات الطلبات
app.use(express.json());
app.use(cookieParser());

// 🏗️ تسجيل الـ Routes الخاصة بالتطبيق
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/sessions", sessionRoutes);

// 🏦 إعداد PayPal
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// 🖼️ إعداد مجلد رفع الملفات
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// 🛠️ إدارة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// 🚀 تشغيل السيرفر
app.listen(port, () => console.log(`🚀 Server running on port: ${port}`));
