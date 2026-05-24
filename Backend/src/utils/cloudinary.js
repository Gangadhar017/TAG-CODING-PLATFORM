import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import path from 'path'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // If Cloudinary is not configured, fall back to local file serving from public/temp
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.warn("⚠️ Cloudinary credentials not set. Falling back to local public directory serving.");
            const filename = path.basename(localFilePath);
            return {
                url: `/temp/${filename}`
            };
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // Clean up local temp file after upload
        try { fs.unlinkSync(localFilePath); } catch (_) {}
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        // Clean up temp file on error
        try { if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath); } catch (_) {}
        return null;
    }
}

export { uploadOnCloudinary };