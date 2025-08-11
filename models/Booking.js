import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
    orderNumber: {
        type: String
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        required: true,
        default: "pending",
        enum: [
        "pending",     
        "paid",       
        "checkedIn",   
        "checkedOut",  
        "cancelled",   
        "noShow",   
        "refunded"    
      ],
    },
    services: [
        {
            serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
            checkIn: {
                type: Date,
            },
            checkOut: {
                type: Date,
            },
            duration: Number,
            tPrice: Number,
        }, 
    ],
    reference: String,
    totalPrice: Number,
    paymentMode: {
        type: String,
    },
     originalBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    additionalItems: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdditionalItem"
    },
    stripeSessionId: {
      type: String,
    },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);