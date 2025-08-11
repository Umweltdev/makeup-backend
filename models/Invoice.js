import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: String,
    createDate: Date,
    dueDate: Date,
    invoiceFrom: {
      name: String,
      phoneNumber: String,
    },
    invoiceTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        title: String,
        description: String,
        quantity: Number,
        price: Number,
        total: Number,
        images: Array,
        checkIn: Date,
        checkOut: Date,
      },
    ],
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "overdue", "draft"],
    },
    totalAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
