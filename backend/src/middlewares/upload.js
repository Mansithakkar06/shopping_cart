import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniquePrefix + '-' + file.originalname);
    }
});

export const upload = multer({ storage: storage });

export const handleFileUpload = async (req, res, next) => {
    if (req.file) {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (cloudName && apiKey && apiSecret) {
            cloudinary.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret
            });

            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "shopping_cart"
                });
                // Delete local temporary file so production server watchers do not restart
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                req.file.path = result.secure_url;
            } catch (error) {
                console.error("Cloudinary upload failed, using local file:", error);
                req.file.path = req.file.path.replace(/\\/g, "/");
            }
        } else {
            req.file.path = req.file.path.replace(/\\/g, "/");
        }
    }
    next();
};
