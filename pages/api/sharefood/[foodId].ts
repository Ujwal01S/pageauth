import { uploadImage } from "@/libs/uploadImage";
import { Food } from "@/model/food";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

import Cors from 'cors'

// Initialize the CORS middleware
const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: ['https://next-page-r9ehp6mg9-ujwal-suwals-projects.vercel.app', 'https://next-page-peach.vercel.app'],
    credentials: true,
})

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        return handlePut(req, res);
    } else if (req.method === "GET") {
        const foodId = req.query.foodId;
        const food = await Food.findById(foodId);
        return res.status(200).json(food);
    } else if (req.method === "DELETE") {
        return handleDelete(req, res);
    }

    return res.status(405).json({ error: "Method not allowed" });
}


async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const foodId = req.query.foodId;
    console.log("HERE");
    try {
        await Food.findByIdAndDelete(foodId)
        res.status(200).json({ message: "Successfully deleted" })
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete",
            message: "Failed to delete"
        })
    }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
    const foodId = req.query.foodId;

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        try {
            if (err) {
                return res.status(500).json({ error: "Error parsing form" });
            }

            // Convert form fields
            const formattedFields: Record<string, string | number | boolean | undefined> = {};
            Object.keys(fields).forEach((key) => {
                let value: string | string[] | undefined = fields[key];

                if (Array.isArray(value)) {
                    value = value[0];
                }

                let formattedValue: string | number | boolean | undefined = value;
                if (typeof value === "string") {
                    if (!isNaN(Number(value)) && value.trim() !== "") {
                        formattedValue = Number(value);
                    } else if (value === "true" || value === "false") {
                        formattedValue = value === "true";
                    }
                }

                formattedFields[key] = formattedValue;
            });

            // Handle image - could be a file or a string URL
            let imageUrl = formattedFields.image;

            const imageFile = files.image?.[0];
            if (imageFile) {
                // If a new file is uploaded, process it
                const uploadResult = await uploadImage(imageFile, "Meal");
                imageUrl = uploadResult.secure_url as string;
            }

            const finalData = {
                ...formattedFields,
                image: imageUrl,
            };

            // Remove image and publicId from fields if they were passed as form fields
            // to avoid duplicate entries
            delete finalData.image;

            // Add them back with the final values
            finalData.image = imageUrl;

            await Food.findByIdAndUpdate(foodId, finalData);

            res.status(200).json({
                message: "Success",
                finalData
            });

        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).json({
                error: "Error processing request",
                details: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });
}