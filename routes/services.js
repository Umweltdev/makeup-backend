import express from "express";
import {
  createService,
  updateService,
  getServices,
  getServiceById,
  deleteService
} from "../controllers/service.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import { Multer, uploadImages } from "../middlewares/uploadFile.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Makeup service management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the service
 *         title:
 *           type: string
 *           description: Title of the service
 *         description:
 *           type: string
 *           description: Detailed description of the service
 *         price:
 *           type: number
 *           description: Price of the service
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of category IDs
 *         isAvailable:
 *           type: boolean
 *           description: Availability status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 65a8c8e9b6f88e3a2c7d4f3a
 *         title: "Bridal Makeup"
 *         description: "Full bridal makeup package"
 *         price: 200
 *         duration: 120
 *         images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *         categories: ["65a8c8e9b6f88e3a2c7d4f3b"]
 *         isAvailable: true
 *         createdAt: "2024-01-18T12:34:56.789Z"
 *         updatedAt: "2024-01-18T12:34:56.789Z"
 *     ServiceInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         duration:
 *           type: number
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *         isAvailable:
 *           type: boolean
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ServiceInput'
 *           encoding:
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 */
router.post("/", Multer.array("images"), uploadImages, verifyAdmin, createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ServiceInput'
 *           encoding:
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       404:
 *         description: Service not found
 */
router.put("/:id", Multer.array("images"), uploadImages, verifyAdmin, updateService);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of all services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get("/", getServices);
/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID to delete
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service deleted successfully"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (admin access required)
 *       404:
 *         description: Service not found
 */
router.delete("/:id", verifyAdmin, deleteService);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 */
router.get("/:id", getServiceById);

export default router;