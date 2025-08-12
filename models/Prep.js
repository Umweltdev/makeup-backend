import mongoose from "mongoose";

const prepSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    notes: {
        type: String,
    }
}, { timestamps: true });

export default mongoose.model("Prep", prepSchema)