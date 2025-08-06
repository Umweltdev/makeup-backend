import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const cloudinaryUploadImg = async (fileToUploads, folder) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileToUploads, 
        {
          resource_type: "image",
          folder: folder,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
    });
  } catch (error) {
    throw new Error(error);
  }
};
export const cloudinaryDeleteImg = async (fileToDelete) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        `hotel-romax/${fileToDelete}`,
        {
          resource_type: "image",
          // folder: folder
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            console.log(result);
            // Check if the image was successfully deleted
            if (result.result === "ok") {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        }
      );
    });
  } catch (error) {
    throw new Error(error);
  }
};
