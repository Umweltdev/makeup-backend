import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema({
   title: {
    type: String,
    required: true,
   },
   price: {
    type: Number,
    required: true,
   },
   images: {
    type: Array,
   },
   description: {
    type: String,
   },
   categories: {
    type: String,
    enum: ["Single Services", "Class Services", "Event Services"],
   },
   availability: {
    type: String
   },
   publish: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
        set: (value) => (value === true || value === "published" ? "published" : "draft"),

    },
}, { timestamps: true } )

export default mongoose.model("Service", ServiceSchema)