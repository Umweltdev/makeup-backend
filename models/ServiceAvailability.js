import mongoose from "mongoose";

const serviceAvailabilitySchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  }
}, { timestamps: true });

// Index for efficient date range queries
serviceAvailabilitySchema.index({ serviceId: 1, startDate: 1, endDate: 1 });

export default mongoose.model("ServiceAvailability", serviceAvailabilitySchema);