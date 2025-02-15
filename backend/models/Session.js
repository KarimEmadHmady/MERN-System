import mongoose from "mongoose";

const sessionSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    ip: String,
    username: { type: String, required: true }, // إضافة اسم المستخدم
    email: { type: String, required: true }, // إضافة البريد الإلكتروني
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    userImage: { type: String }, // رابط أو بيانات Base64 للصورة
    loginTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Session = mongoose.model("Session", sessionSchema);
export default Session;
