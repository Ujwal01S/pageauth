import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { User } from "@/model/userModel";
import { uploadImage } from "@/libs/uploadImage";
import formidable from "formidable";
import db from "@/libs/mongo";

import Cors from 'cors'

// Initialize the CORS middleware
const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: ['https://pageauth-p4uh46yoa-ujwal-suwals-projects.vercel.app/', 'https://pageauth.vercel.app/'],
    credentials: true,
})

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await db();

    if (req.method === "POST") {
        const form = formidable({ multiples: false });

        form.parse(req, async (err, fields, files) => {
            try {
                if (err) {
                    return res.status(500).json({ error: "Error parsing form" });
                }

                // Get form fields
                const name = fields.name?.[0];
                const email = fields.email?.[0];
                const password = fields.password?.[0];
                const role = fields.role?.[0];
                const image = files.image?.[0];

                // Validate required fields
                if (!name || !email || !password || !image) {
                    return res.status(400).json({ message: "Missing required fields" });
                }

                // Handle image upload
                const uploadResult = await uploadImage(image, "Auth");
                const imageUrl = uploadResult.secure_url;

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 5);

                const registerData = {
                    name,
                    email,
                    image: imageUrl,
                    password: hashedPassword,
                    role: role || ""
                };

                console.log({ registerData });

                // Create user
                await User.create(registerData);

                res.status(201).json({
                    message: "User Registered Successfully",
                    success: true,
                    data: {
                        name: registerData.name,
                        email: registerData.email,
                        image: registerData.image,
                        role: registerData.role
                    }
                });

            } catch (error) {
                console.error("Registration error:", error);
                res.status(500).json({
                    error: "Error processing request",
                    details: error instanceof Error ? error.message : "Unknown error"
                });
            }
        });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}