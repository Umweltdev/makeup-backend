import express from "express";
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  addMessageToInquiry,
  updateInquiryStatus,
  addCommunicationLog,
  deleteInquiry,
} from "../controllers/inquiry.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inquiries
 *   description: Customer inquiry management system
 */

/**
 * @swagger
 * /inquiries:
 *   post:
 *     summary: Create a new inquiry
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InquiryInput'
 *     responses:
 *       201:
 *         description: Inquiry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inquiry'
 *       400:
 *         description: Bad request - invalid input data
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, createInquiry);

/**
 * @swagger
 * /inquiries:
 *   get:
 *     summary: Get all inquiries (filterable by status)
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, pending, resolved, closed]
 *         description: Filter inquiries by status
 *     responses:
 *       200:
 *         description: List of inquiries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inquiry'
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get("/", verifyToken, getInquiries);

/**
 * @swagger
 * /inquiries/{id}:
 *   get:
 *     summary: Get a specific inquiry by ID
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Inquiry ID
 *     responses:
 *       200:
 *         description: Inquiry details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inquiry'
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: Inquiry not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", verifyToken, getInquiryById);

/**
 * @swagger
 * /inquiries/{id}/messages:
 *   post:
 *     summary: Add a message to an inquiry
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Inquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageInput'
 *     responses:
 *       200:
 *         description: Message added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inquiry'
 *       400:
 *         description: Bad request - invalid input data
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: Inquiry not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/messages", verifyToken, addMessageToInquiry);

/**
 * @swagger
 * /inquiries/{id}/status:
 *   put:
 *     summary: Update inquiry status (Admin only)
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Inquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, pending, resolved, closed]
 *                 description: New status of the inquiry
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inquiry'
 *       400:
 *         description: Bad request - invalid status
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Inquiry not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id/status", verifyAdmin, updateInquiryStatus);

/**
 * @swagger
 * /inquiries/{id}/communications:
 *   post:
 *     summary: Add a communication log entry
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Inquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommunicationLogInput'
 *     responses:
 *       200:
 *         description: Communication log added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inquiry'
 *       400:
 *         description: Bad request - invalid input data
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: Inquiry not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/communications", verifyToken, addCommunicationLog);

/**
 * @swagger
 * /inquiries/{id}:
 *   delete:
 *     summary: Delete an inquiry (Admin only)
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Inquiry ID
 *     responses:
 *       200:
 *         description: Inquiry deleted successfully
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Inquiry not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", verifyAdmin, deleteInquiry);

/**
 * @swagger
 * components:
 *   schemas:
 *     Inquiry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated inquiry ID
 *         customer:
 *           type: string
 *           description: ID of the customer who created the inquiry
 *         subject:
 *           type: string
 *           description: Subject of the inquiry
 *         inquiryStatus:
 *           type: string
 *           enum: [open, pending, resolved, closed]
 *           default: open
 *           description: Current status of the inquiry
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *           description: Array of messages in the inquiry
 *         responseTemplates:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ResponseTemplate'
 *           description: Response templates associated with the inquiry
 *         communicationHistory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CommunicationLog'
 *           description: History of communication actions
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 * 
 *     InquiryInput:
 *       type: object
 *       required:
 *         - subject
 *       properties:
 *         subject:
 *           type: string
 *           description: Subject of the inquiry
 *           example: "Issue with my recent order"
 *         inquiryStatus:
 *           type: string
 *           enum: [open, pending, resolved, closed]
 *           default: open
 *           description: Initial status of the inquiry
 * 
 *     Message:
 *       type: object
 *       properties:
 *         sender:
 *           type: string
 *           enum: [customer, admin]
 *           description: Who sent the message
 *         message:
 *           type: string
 *           description: The message content
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the message was sent
 * 
 *     MessageInput:
 *       type: object
 *       required:
 *         - sender
 *         - message
 *       properties:
 *         sender:
 *           type: string
 *           enum: [customer, admin]
 *           description: Who is sending the message
 *           example: "customer"
 *         message:
 *           type: string
 *           description: The message content
 *           example: "I need help with my order"
 * 
 *     CommunicationLog:
 *       type: object
 *       properties:
 *         action:
 *           type: string
 *           description: The action performed
 *         notes:
 *           type: string
 *           description: Additional notes about the action
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the action was logged
 * 
 *     CommunicationLogInput:
 *       type: object
 *       required:
 *         - action
 *       properties:
 *         action:
 *           type: string
 *           description: The action performed
 *           example: "Called customer"
 *         notes:
 *           type: string
 *           description: Additional notes about the action
 *           example: "Left voicemail, will follow up tomorrow"
 * 
 *     ResponseTemplate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the response template
 *         content:
 *           type: string
 *           description: Content of the response template
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;