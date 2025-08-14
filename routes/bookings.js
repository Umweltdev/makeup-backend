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

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         orderNumber:
 *           type: string
 *         customer:
 *           type: string
 *           description: Reference to User ID
 *         services:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               serviceId:
 *                 type: string
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *               tPrice:
 *                 type: number
 *         status:
 *           type: string
 *           enum: ["pending", "paid", "checkedIn", "checkedOut", "cancelled", "noShow", "refunded"]
 *         totalPrice:
 *           type: number
 *         paymentMode:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     BookingInput:
 *       type: object
 *       required:
 *         - customer
 *         - services
 *       properties:
 *         customer:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phoneNumber:
 *               type: string
 *         services:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               serviceId:
 *                 type: string
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *         paymentMode:
 *           type: string
 *           enum: ["cash", "stripe"]
 * 
 *     BookingStatus:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: ["pending", "paid", "checkedIn", "checkedOut", "cancelled"]
 *         count:
 *           type: number
 */

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Service not found
 */
router.post("/", createBooking);

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Get all bookings (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 */
router.get("/", getBookings);

/**
 * @swagger
 * /api/booking/user/{userId}:
 *   get:
 *     summary: Get bookings for a specific user
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       404:
 *         description: User not found
 */
router.get("/user/:userId", getUserBookings);

/**
 * @swagger
 * /api/booking/{id}:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Booking not found
 */
router.put("/:id", updateBooking);

/**
 * @swagger
 * /api/booking/{id}:
 *   delete:
 *     summary: Delete a booking (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       404:
 *         description: Booking not found
 */
router.delete("/:id", verifyAdmin, deleteBooking);

/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 */
router.get("/:id", getBooking);

/**
 * @swagger
 * /api/booking/getByStatus:
 *   get:
 *     summary: Get booking counts by status
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Booking status counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingStatus'
 */
router.get("/getByStatus", getByBookingStatus);

/**
 * @swagger
 * /api/booking/cancelBooking/{bookingId}:
 *   put:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID to cancel
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Cannot cancel booking (invalid status)
 *       404:
 *         description: Booking not found
 */
router.put("/cancelBooking/:bookingId", cancelBooking);

/**
 * @swagger
 * /api/booking/checkout/{id}:
 *   put:
 *     summary: Checkout a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID to checkout
 *     responses:
 *       200:
 *         description: Booking checked out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Cannot checkout booking (invalid status)
 *       404:
 *         description: Booking not found
 */
router.put("/checkout/:id", checkoutBooking);

export default router;