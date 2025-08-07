import Service from "../models/Service.js";
import { createError } from "../utils/error.js";
import { cloudinaryDeleteImg } from "../utils/cloudinary.js";

export const createService = async (req, res, next) => {
  const newService = new Service({
    ...req.body,
    images: req.images,
  });
  try {
        const savedService = await newService.save();
    res.status(200).json(savedService);
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
    try {
      let updatedData = req.body;
      // Parse previousImages if provided
      const parsedPreviousImages = req?.body?.previousImages?.map((imageString) =>
        JSON.parse(imageString)
      );
  
      const product = await Service.findById(req.params.id);
      const existingImages = product?.images || [];
  
      // Handle image deletion if previousImages is provided
      if (parsedPreviousImages) {
        const removedImages = existingImages.filter(
          (existingImage) =>
            !parsedPreviousImages.some(
              (previousImage) => previousImage === existingImage
            )
        );
  
        // Delete removed images from cloud storage
        for (const removedImage of removedImages) {
          const publicId = removedImage.split("/").pop().split(".")[0];
          await cloudinaryDeleteImg(publicId);
        }
  
        // Update the images array to exclude removed images
        updatedData.images = existingImages.filter(
          (existingImage) =>
            !removedImages.some((removedImage) => removedImage === existingImage)
        );
      } else {
        updatedData.images = existingImages; // Keep existing images if no removal is requested
      }
  
      // If there are new images uploaded, add them to the images array
      if (req.images && Array.isArray(req.images)) {
        updatedData.images = [...req.images, ...updatedData.images];
      }
      delete updatedData.previousImages;
      const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );
  
      res.status(200).json(updatedService);
    } catch (err) {
      console.error(err);
      next(err);
    }
};

export const deleteService = async (req, res, next) => {
    try {
      const serviceData = await Service.findById(req.params.id);
      const imagesToDelete = serviceData.images;
      for (const image of imagesToDelete) {
        const publicId = image.split("/").pop().split(".")[0];
        await cloudinaryDeleteImg(publicId);
      }
      const service = await Service.findByIdAndDelete(req.params.id);
      res.status(200).json(`${service.title} has been deleted.`);
    } catch (err) {
      next(err);
    }
};

export const getServices = async (req, res, next) => {
    try {
      const services = await Service.find();
      res.status(200).json(services);
    } catch (err) {
      next(err);
    }
};

export const getServiceById = async (req, res, next) => {
    try {
      const { id } = req.params; 
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.status(200).json(service);
    } catch (err) {
      next(err);
    }
};