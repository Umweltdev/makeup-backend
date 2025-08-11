import express from "express";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import Invoice from "../models/Invoice.js";
import BookingCancellation from "../models/BookingCancellation.js";
import ServiceAvailability from "../models/ServiceAvailability.js";
import AdditionalItem from "../models/AdditionalItem.js";
import {
  generateRandomNumber,
  generateRandomString,
} from "../utils/helpers.js";
import cors from "cors";
import { config } from "dotenv";
import Stripe from "stripe";

config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper function to check service availability
const checkServiceAvailability = async (serviceId, checkIn, checkOut) => {
  const conflictingBooking = await ServiceAvailability.findOne({
    serviceId,
    $or: [
      {
        startDate: { $lt: checkOut },
        endDate: { $gt: checkIn },
      },
      {
        startDate: { $lte: checkIn },
        endDate: { $gte: checkIn },
      },
      {
        startDate: { $lte: checkOut },
        endDate: { $gte: checkOut },
      },
    ],
  });
  return !conflictingBooking;
};

async function initializeStripeCheckout(amount, customer, metadata) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Make-up Reservation",
            description: `Booking Order Number: ${metadata?.orderNumber || ''} - Make-up Booking`,          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    customer_email: customer.email,
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}`,
    cancel_url: `${process.env.FRONTEND_URL}`,
    metadata: metadata,
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
}

const createBookingInvoice = async (bookingId) => {
  try {
    // Get fully populated booking
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "services.serviceId",
        populate: {
          path: "service",
          select: "title description images price",
        },
      })
      .populate("customer")

    if (!booking) {
      throw new Error("Booking not found");
    }
    const invoiceItems = [
      // Service items
      ...booking.services.map((service) => ({
        title: service.title,
        description: service.description,
        images: service.images,
        categories: service.categories,
        //price: service.price,
        total: service.tPrice,
        checkIn: service.checkIn,
        checkOut: service.checkOut,
        
      })),
      // Additional items if they exist
      ...(booking.additionalItems
        ? booking.additionalItems.items.map((item) => ({
            title: item.name,
            quantity: item.quantity,
            price: item.amount,
            total: item.amount,
          }))
        : []),
    ];

    const invoice = new Invoice({
      invoiceFrom: {
        name: "Make-up Company",
        fullAddress: "201 John Street",
        phoneNumber: "12345596",
      },
      invoiceTo: booking.customer._id,
      createDate: new Date(),
      dueDate: new Date(),
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      items: invoiceItems,
      totalAmount: booking.totalPrice,
      status: "paid",
    });

    return await invoice.save();
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const handlePaymentSuccess = async (booking) => {
  try {
    // Populate necessary relations
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: "services.serviceId",
        populate: { path: "service" },
      })
      .populate("customer");

    // Update booking status
    populatedBooking.status = "paid";
    await populatedBooking.save();

    // Create availability records
    await Promise.all(
      populatedBooking.services.map((service) =>
        new ServiceAvailability({
          serviceId: service._id,
          startDate: new Date(service.checkIn.setHours(14, 0, 0, 0)),
          endDate: service.checkOut,
          bookingId: populatedBooking._id,
        }).save()
      )
    );

    // Create invoice
    await createBookingInvoice(booking._id);
  } catch (error) {
    console.error("Error handling payment success:", error);
    throw error;
  }
};

export const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { services, customer, paymentMode, additionalItems, ...other } =
      req.body;

    let query = {};
    if (customer.email) query.email = customer.email;
    if (customer.phoneNumber) query.phone = customer.phoneNumber;

    let user = await User.findOne(query).session(session);

    if (!user) {
      user = new User({
        firstName: customer.name.split(" ")[0],
        lastName: customer.name.split(" ").slice(1).join(" ") || "",
        email: customer.email,
        phone: customer.phoneNumber,
        //fullAddress: customer.fullAddress,
        //identificationNumber: customer.identificationNumber,
      });
      await user.save({ session });
    }

    // Validate services and check availability
    const serviceDocuments = await Service.find({
      _id: { $in: services.map((service) => service.serviceId) },
    })
      .populate("categories")
      .session(session);

    if (serviceDocuments.length !== services.length) {
      await session.abortTransaction();
      return res.status(404).json({ error: "One or more sevices not found" });
    }

    // Check availability for each service
    const unavailableServices = [];
    const availableServices = [];

    for (const service of services) {
      const serviceDoc = serviceDocuments.find((r) => r._id.equals(service.serviceId));
      const checkIn = new Date(service.checkIn);
      const checkOut = new Date(service.checkOut);

      checkIn.setHours(14, 0, 0, 0);
      checkOut.setHours(12, 0, 0, 0);

      const isAvailable = await checkServiceAvailability(
        service.serviceId,
        checkIn,
        checkOut
      );

      if (!isAvailable || !serviceDoc.isAvailable) {
        unavailableServices.push(serviceDoc);
      } else {
        availableServices.push({
          ...service,
          checkIn,
          checkOut,
        });
      }
    }

    if (availableServices.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "None of the requested services are available for the selected dates",
        unavailableServices: unavailableServices.map((service) => service.categories),
      });
    }

    // Calculate booking details
    const bookingDetails = availableServices.map((service) => {
      const serviceDoc = serviceDocuments.find((r) => r._id.equals(service.serviceId));
      /**const durationInDays = Math.ceil(
        (service.checkOut - service.checkIn) / (1000 * 60 * 60 * 24)
      );**/
      const totalPrice = 1 * serviceDoc.price;

      return {
        serviceId: service.serviceId,
        checkIn: service.checkIn,
        checkOut: service.checkOut,
        tPrice: totalPrice,
        //durationOfStay: durationInDays,
      };
    });

    // Calculate totals
    let totalAdditionalAmount = 0;
    const servicesTotal = bookingDetails.reduce(
      (sum, service) => sum + service.tPrice,
      0
    );

    if (additionalItems && additionalItems.length > 0) {
      totalAdditionalAmount = additionalItems.reduce(
        (sum, item) => sum + item.amount,
        0
      );
    }

    const totalPrice = servicesTotal + totalAdditionalAmount;
    const orderNumber = `#${generateRandomNumber()}`;

    // Handle payment initialization
    let stripePayment = null;
    let reference = req.body?.reference ?? null;
    let stripeSessionId = null;

    if (paymentMode === "stripe") {
      try {
        stripePayment = await initializeStripeCheckout(totalPrice, customer, {
          orderNumber,
        });
        stripeSessionId = stripePayment.sessionId;
      } catch (error) {
        await session.abortTransaction();
        console.log(error);
        return res
          .status(400)
          .json({ error: "Stripe payment initialization failed" });
      }
    }

    const newBooking = new Booking({
      ...other,
      orderNumber,
      customer: user._id,
      services: bookingDetails,
      totalPrice,
      reference,
      paymentMode,
      stripeSessionId,
      status: paymentMode === "cash" ? "paid" : "pending",
    });

    const savedBooking = await newBooking.save({ session });

    // Create additional items if present
    if (additionalItems && additionalItems.length > 0) {
      const additionalItemsDoc = new AdditionalItem({
        items: additionalItems,
        totalAmount: totalAdditionalAmount,
        customer: user._id,
        booking: savedBooking._id,
      });
      await additionalItemsDoc.save({ session });

      // Update booking with reference to additional items
      savedBooking.additionalItems = additionalItemsDoc._id;
      await savedBooking.save({ session });
    }

    // For cash payment, create availability records
    if (paymentMode === "cash") {
      await Promise.all(
        bookingDetails.map((service) =>
          new ServiceAvailability({
            serviceId: service.serviceId,
            startDate: service.checkIn,
            endDate: service.checkOut,
            bookingId: savedBooking._id,
          }).save({ session })
        )
      );
    }

    // Commit transaction first
    await session.commitTransaction();
    session.endSession();

    // Create invoice after transaction is committed (only for cash payments)
    if (paymentMode === "cash") {
      await createBookingInvoice(savedBooking._id);
    }

    const response = {
      bookings: savedBooking,
      totalPrice,
      unavailableServices: unavailableServices.map((service) => service.categories),
    };

    if (stripePayment) {
      response.stripeUrl = stripePayment.url;
      response.stripeSessionId = stripePayment.sessionId;
    }

    res.status(200).json(response);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const checkoutBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId).populate("services.serviceId");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "checkedOut") {
      return res.status(400).json({ error: "Booking is already checked out" });
    }

    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ error: "Cannot check out a cancelled booking" });
    }

    // Update booking status
    booking.status = "checkedOut";
    await booking.save();

    // Remove availability records
    await ServiceAvailability.deleteMany({ bookingId });
    const checkoutTime = new Date();
    // Update service cleaning status
    await Promise.all(
      booking.services.map(async (service) => {
        await Service.findByIdAndUpdate(service.serviceId, {
          isClean: false,
          lastCheckoutTime: checkoutTime,
        });
      })
    );

    res.status(200).json({
      message: "Checkout successful",
      bookingId,
    });
  } catch (err) {
    next(err);
  }
};

// update checkin checkout date on client side for earlier checkout and later checkout
export const updateBooking = async (req, res, next) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json(`Booking has been deleted.`);
  } catch (err) {
    next(err);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "services.serviceId",
        populate: {
          path: "service",
        },
      })
      .populate({
        path: "customer",
        select: "firstName lastName email phone fullAddress",
      });
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "services.serviceId",
        
        populate: {
          path: "service",
        },
      })
      .populate({
        path: "customer",
        select: "firstName lastName email phone fullAddress",
      });
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ customer: userId })
      .populate({
        path: "services.serviceId",
        populate: {
          path: "service",
        },
      })
      .populate({
        path: "customer",
        select: "firstName lastName email phone fullAddress",
      });
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};