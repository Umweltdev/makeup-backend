import Inquiry from "../models/Inquiry.js";

/**
 * @desc Create new inquiry
 */
export const createInquiry = async (req, res) => {
  try {
    // If req.user doesn't have _id but has id, use that
    const userId = req.user._id || req.user.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const inquiry = new Inquiry({
      ...req.body,
      customer: userId,
    });
    
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
/**
 * @desc Get all inquiries (optionally filter by status)
 */
export const getInquiries = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== "admin") {
      filter.customer = req.user._id;
    }
    const { status } = req.query;
    if (status) filter.inquiryStatus = status;

    const inquiries = await Inquiry.find(filter)
      .populate("customer", "name email") // optional: show customer info
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get single inquiry by ID
 */
export const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Add chat message to inquiry
 */
export const addMessageToInquiry = async (req, res) => {
  try {
    const { sender, message } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    inquiry.messages.push({ sender, message });
    await inquiry.save();

    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Update inquiry status
 */
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { inquiryStatus: status },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Log a communication history entry
 */
export const addCommunicationLog = async (req, res) => {
  try {
    const { action, notes } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    inquiry.communicationHistory.push({ action, notes });
    await inquiry.save();

    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Delete inquiry
 */
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
