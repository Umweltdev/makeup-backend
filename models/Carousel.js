import mongoose from "mongoose";
const CarouselSchema = mongoose.Schema({
    title: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    images: {
        type: Array,
    },
    altText: {
        type: String,
        default: "",
    },
}, { timestamps: true })

export default mongoose.model("Carousel", CarouselSchema);