import Prep from "../models/Prep.js";

export const createPrep = async (req, res, next) => {
  const newPrep = new Prep({
    ...req.body,
  });
  try {
    const savedPrep = await newPrep.save();
    res.status(200).json(savedPrep);
  } catch (err) {
    next(err);
  }
};

export const getPreps = async (req, res, next) => {
  try {
    const preps = await Prep.find(req.query);
    res.status(200).json(preps);
  } catch (err) {
    next(err);
  }
};

export const getPrep = async (req, res, next) => {
  try {
    const prep = await Prep.findById(req.params.id);
    res.status(200).json(prep);
  } catch (err) {
    next(err);
  }
};

export const updatePrep = async (req, res, next) => {
  try {
    const updatedPrep = await Prep.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // updates only the fields passed in req.body
      { new: true } // returns the updated document
    );

    if (!updatedPrep) {
      return res.status(404).json({ message: "Prep not found" });
    }

    res.status(200).json(updatedPrep);
  } catch (err) {
    next(err);
  }
};

export const deletePrep = async (req, res, next) => {
  try {
    const deletedPrep = await Prep.findByIdAndDelete(req.params.id);

    if (!deletedPrep) {
      return res.status(404).json({ message: "Prep not found" });
    }

    res.status(200).json({ message: "Prep deleted successfully" });
  } catch (err) {
    next(err);
  }
};