import express from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import {
    createBooking,
    cancelBooking,
    deleteBooking,
    getBookings,
    getUserBookings,
    getBooking,
    getByBookingStatus,
    updateBooking,
    checkoutBooking,
} from "../controllers/booking.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/user/:userId", getUserBookings);
router.put("/:id", updateBooking); 
router.delete("/:id", verifyAdmin,deleteBooking);
router.get("/:id", getBooking);
router.get("/getByStatus", getByBookingStatus);
router.put("/cancelBooking/:bookingId", cancelBooking);
router.put("/checkout/:id", checkoutBooking);

export default router;
