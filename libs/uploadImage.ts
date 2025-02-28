import cloudinary from "cloudinary";
import { File } from "formidable";
import { createReadStream } from "fs";

cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
}

export const uploadImage = async (file: File, folder: string): Promise<CloudinaryUploadResult> => {
    if (!file.filepath) {
        throw new Error("No file path provided");
    }

    return new Promise((resolve, reject) => {
        const upload = cloudinary.v2.uploader.upload_stream(
            {
                resource_type: "auto",
                folder: folder,
            },
            (error, result) => {
                if (error) {
                    reject(error.message);
                } else if (result) {
                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    });
                } else {
                    reject("Upload failed with no error");
                }
            }
        );

        // Create a read stream from the file and pipe it to the upload stream
        const fileStream = createReadStream(file.filepath);
        fileStream.pipe(upload);

        // Handle potential read stream errors
        fileStream.on('error', (error) => {
            reject(`File stream error: ${error.message}`);
        });
    });
};

export const deleteImage = async (publicId: string) => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            const result = await cloudinary.v2.uploader.destroy(publicId);
            resolve(result);
        } catch (error) {
            if (error instanceof Error) {
                reject(new Error(error.message));
            }
        }
    });
};