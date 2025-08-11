import mongoose from "mongoose";

const cancellationSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  cancellationType: {
    type: String,
    enum: [
      "userCancelled",    
      "makeupCancelled",    
      "noShow",           
      "doubleBooking",     
      "emergency",         
      "other"             
    ],
    required: true
  },
  refundStatus: {
    type: String,
    enum: [
      "pending",          
      "processing",       
      "completed",        
      "failed",           
      "notApplicable"    
    ],
    default: "pending"
  },
  cancellationFee: {
    type: Number,
    required: true
  },
  refundAmount: {
    type: Number,
    required: true
  },
  originalAmount: {
    type: Number,
    required: true
  },
  cancellationDate: {
    type: Date,
    required: true
  },
  services: [{
    title: String,
    //duration: String,
    price: Number,
    refundableAmount: Number
  }],
  refundReference: String,
  notes: String
}, { timestamps: true });

export default mongoose.model("Cancellation", cancellationSchema);