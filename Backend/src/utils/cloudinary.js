import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv"
dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload a file to Cloudinary and then delete it locally
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log('No file path provided');
            return null;
        }

        // Upload file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        console.log('File uploaded to Cloudinary successfully');

        // Delete the local file after upload
        fs.unlinkSync(localFilePath);

        return uploadResult;
    } catch (error) {
        // Handle errors and log them
        console.error('Failed to upload file to Cloudinary. Error:', error);
        
        // Optionally handle deletion if upload fails
        fs.unlinkSync(localFilePath);

        return null;
    }
};

export default uploadOnCloudinary;
