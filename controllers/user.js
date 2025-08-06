import User from "../models/User.js";
import { cloudinaryDeleteImg } from "../utils/cloudinary.js";

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, ...(req.image && { img: req.image }) } },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
    console.log(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    const publicId = user.img.split("/").pop().split(".")[0];
    await cloudinaryDeleteImg(publicId);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find(req.query);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

