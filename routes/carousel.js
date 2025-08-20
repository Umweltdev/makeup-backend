import express from "express";
import {
  createCarousel,
  updateCarousel,
  getCarousels,
  getCarouselById,
} from "../controllers/carousel.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import { Multer, uploadImages } from "../middlewares/uploadFile.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carousels
 *   description: Carousel management
 */

/**
 * @swagger
 * /carousels:
 *   post:
 *     summary: Create a new carousel
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: images
 *         type: file
 *         description: The images to upload (multiple allowed)
 *       - in: formData
 *         name: title
 *         type: string
 *         description: Title of the carousel
 *       - in: formData
 *         name: isActive
 *         type: boolean
 *         description: Whether the carousel is active
 *       - in: formData
 *         name: altText
 *         type: string
 *         description: Alternative text for the images
 *     responses:
 *       200:
 *         description: Carousel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carousel'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       500:
 *         description: Internal server error
 */
router.post("/", Multer.array("images"), uploadImages, verifyAdmin, createCarousel);

/**
 * @swagger
 * /carousels/{id}:
 *   put:
 *     summary: Update a carousel
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Carousel ID
 *       - in: formData
 *         name: images
 *         type: file
 *         description: New images to add (multiple allowed)
 *       - in: formData
 *         name: previousImages
 *         type: string
 *         description: JSON string of images to keep (others will be deleted)
 *       - in: formData
 *         name: title
 *         type: string
 *         description: Updated title of the carousel
 *       - in: formData
 *         name: isActive
 *         type: boolean
 *         description: Updated active status
 *       - in: formData
 *         name: altText
 *         type: string
 *         description: Updated alternative text for the images
 *     responses:
 *       200:
 *         description: Carousel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carousel'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Carousel not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", Multer.array("images"), uploadImages, verifyAdmin, updateCarousel);

/**
 * @swagger
 * /carousels:
 *   get:
 *     summary: Get all carousels
 *     tags: [Carousels]
 *     responses:
 *       200:
 *         description: List of carousels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Carousel'
 *       500:
 *         description: Internal server error
 */
router.get("/", getCarousels);

/**
 * @swagger
 * /carousels/{id}:
 *   get:
 *     summary: Get a carousel by ID
 *     tags: [Carousels]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Carousel ID
 *     responses:
 *       200:
 *         description: Carousel data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carousel'
 *       404:
 *         description: Carousel not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getCarouselById);

/**
 * @swagger
 * components:
 *   schemas:
 *     Carousel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the carousel
 *         title:
 *           type: string
 *           description: Title of the carousel
 *         isActive:
 *           type: boolean
 *           description: Whether the carousel is active
 *           default: true
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         altText:
 *           type: string
 *           description: Alternative text for the images
 *           default: ""
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated last update timestamp
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;