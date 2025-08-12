import Invoice from "../models/Invoice.js";

export const createInvoice = async (req, res, next) => {
  const event = new Invoice({
    ...req.body,
  });

  try {
    const savedEvent = await event.save();
    res.status(200).json(savedEvent);
  } catch (err) {
    next(err);
  }
};

export const getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find(req.query).populate({
      path: "invoiceTo",
      select: "firstName lastName email phone fullAddress",
    });
    res.status(200).json(invoices);
  } catch (err) {
    next(err);
  }
};

export const getInvoice = async (req, res, next) => {
    try {
      const invoice = await Invoice.findById(req.params.id).populate({
        path: "invoiceTo",
        select: "firstName lastName email phone fullAddress",
      });
      res.status(200).json(invoice);
    } catch (err) {
      next(err);
    }
  };


  export const updateInvoice = async (req, res, next) => {
    console.log(req.body)
    try {
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedInvoice);
    } catch (err) {
      next(err);
    }
  };  

  export const deleteInvoice = async (req, res, next) => {
    try {
      await Invoice.findByIdAndDelete(req.params.id);
      res.status(200).json(`Booking has been deleted.`);
    } catch (err) {
      next(err);
    }
  };