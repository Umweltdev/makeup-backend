import Carousel from "../models/Carousel.js";
import { cloudinaryDeleteImg } from "../utils/cloudinary.js";

export const createCarousel = async (req, res, next) => {
  const newCarousel = new Carousel({
    ...req.body,
    images: req.images,
  });
  try {
        const savedCarousel = await newCarousel.save();
    res.status(200).json(savedCarousel);
  } catch (err) {
    next(err);
  }
};

export const updateCarousel = async (req, res, next) => {
    try {
      let updatedData = req.body;
      // Parse previousImages if provided
      const parsedPreviousImages = req?.body?.previousImages?.map((imageString) =>
        JSON.parse(imageString)
      );
  
      const product = await Carousel.findById(req.params.id);
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
      const updatedCarousel = await Carousel.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );
  
      res.status(200).json(updatedCarousel);
    } catch (err) {
      console.error(err);
      next(err);
    }
};

export const deleteCarousel = async (req, res, next) => {
    try {
      const carouselData = await Carousel.findById(req.params.id);
      const imagesToDelete = carouselData.images;
      for (const image of imagesToDelete) {
        const publicId = image.split("/").pop().split(".")[0];
        await cloudinaryDeleteImg(publicId);
      }
      const carousel = await Carousel.findByIdAndDelete(req.params.id);
      res.status(200).json(`${carousel.title} has been deleted.`);
    } catch (err) {
      next(err);
    }
};

export const getCarousels = async (req, res, next) => {
    try {
      const carousels = await Carousel.find();
      res.status(200).json(carousels);
    } catch (err) {
      next(err);
    }
};

export const getCarouselById = async (req, res, next) => {
    try {
      const { id } = req.params; 
      const carousel = await Carousel.findById(id);
      if (!carousel) {
        return res.status(404).json({ message: "Carousel not found" });
      }
      res.status(200).json(carousel);
    } catch (err) {
      next(err);
    }
};