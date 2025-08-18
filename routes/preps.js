import express from "express";
import {
  createPrep,
  updatePrep,
  deletePrep,
  getPrep,
  getPreps,
} from "../controllers/prep.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Preps
 *   description: Preparation management
 */

/**
 * @swagger
 * /preps:
 *   post:
 *     summary: Create a new preparation
 *     tags: [Preps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prep'
 *     responses:
 *       200:
 *         description: Preparation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prep'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyAdmin, createPrep);

/**
 * @swagger
 * /preps/{id}:
 *   put:
 *     summary: Update a preparation
 *     tags: [Preps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Preparation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prep'
 *     responses:
 *       200:
 *         description: Preparation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prep'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Preparation not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", verifyAdmin, updatePrep);

/**
 * @swagger
 * /preps/{id}:
 *   delete:
 *     summary: Delete a preparation
 *     tags: [Preps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Preparation ID
 *     responses:
 *       200:
 *         description: Preparation deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Preparation not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", verifyAdmin, deletePrep);

/**
 * @swagger
 * /preps/{id}:
 *   get:
 *     summary: Get a preparation by ID
 *     tags: [Preps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Preparation ID
 *     responses:
 *       200:
 *         description: Preparation data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prep'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Preparation not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", verifyAdmin, getPrep);

/**
 * @swagger
 * /preps:
 *   get:
 *     summary: Get all preparations (with optional query parameters)
 *     tags: [Preps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customer
 *         schema:
 *           type: string
 *         description: Filter by customer ID
 *       - in: query
 *         name: booking
 *         schema:
 *           type: string
 *         description: Filter by booking ID
 *     responses:
 *       200:
 *         description: List of preparations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prep'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       500:
 *         description: Internal server error
 */
router.get("/", verifyAdmin, getPreps);

/**
 * @swagger
 * components:
 *   schemas:
 *     Prep:
 *       type: object
 *       required:
 *         - customer
 *         - booking
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the preparation
 *         customer:
 *           type: string
 *           description: ID of the customer (User)
 *         booking:
 *           type: string
 *           description: ID of the booking
 *         notes:
 *           type: string
 *           description: Additional preparation notes
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