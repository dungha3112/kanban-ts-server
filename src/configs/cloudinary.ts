import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dunghaqn",
  api_key: "548656977314931",
  api_secret: "LEyDa1ec2-WAZkBI-aJ1TvVYP4E",
});

const cloudinaryUploadImage = async (fileToUploads: any) => {
  return await cloudinary.uploader.upload(fileToUploads).then((result) => {
    return {
      url: result.secure_url,
      // asset_id: result.asset_id,
      public_id: result.public_id,
    };
  });
};
const cloudinaryDeleteImg = async (fileToDelete: any) => {
  return await cloudinary.uploader.destroy(fileToDelete);
};

export { cloudinaryUploadImage, cloudinaryDeleteImg };
