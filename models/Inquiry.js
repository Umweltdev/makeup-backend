// models/Inquiry.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String, // e.g., 'client' or 'admin'
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const InquirySchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: { type: String, required: true },
    inquiryStatus: {
      type: String,
      enum: ["open", "pending", "resolved", "closed"],
      default: "open",
    },
    messages: [
      {
        sender: { type: String, enum: ["customer", "admin"], required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    responseTemplates: [
      {
        title: String,
        content: String,
      },
    ],
    communicationHistory: [
      {
        action: String,
        notes: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", InquirySchema);