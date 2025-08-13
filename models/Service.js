import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
   title: {
    type: String,
    required: true,
   },
   description: {
    type: String,
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
    enum: ["Single Services", "Class Services", "Event Services", "others"],
   },
   availability: {
    type: String
   },
   duration: {
    type: String,
   },
   publish: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
        set: (value) => (value === true || value === "published" ? "published" : "draft"),

    },
}, { timestamps: true } )

export default mongoose.model("Service", ServiceSchema)