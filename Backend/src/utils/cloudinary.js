import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import path from 'path'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if (!localFilePath) return null;

        // Fallback to local serving if Cloudinary is not configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.log("Cloudinary credentials not set. Falling back to local static serving.");
            const port = process.env.PORT || 8000;
            const backendUrl = `http://localhost:${port}`;
            return {
                url: `${backendUrl}/temp/${path.basename(localFilePath)}`
            };
        }

        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        });
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed, falling back to local static serving:", error);
        // Fallback to local static serving if upload failed
        try {
            if (fs.existsSync(localFilePath)) {
                const port = process.env.PORT || 8000;
                const backendUrl = `http://localhost:${port}`;
                return {
                    url: `${backendUrl}/temp/${path.basename(localFilePath)}`
                };
            }
        } catch (fallbackError) {
            console.error("Local fallback also failed:", fallbackError);
        }
        return null;
    }
}

export {uploadOnCloudinary};