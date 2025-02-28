import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { uploadImage } from "@/libs/uploadImage";
import { Food } from "@/model/food";
import db from "@/libs/mongo";

import Cors from 'cors'


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
  await db();
  if (req.method === "POST") {
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

        const image = files.image?.[0];

        // Handle image upload if image exists
        let imageUrl;
        let publicId;
        if (image) {
          const uploadResult = await uploadImage(image, "Meal");
          imageUrl = uploadResult.secure_url;
          publicId = uploadResult.public_id
        }

        const finalData = {
          ...formattedFields,
          image: imageUrl,
          publicId

        }

        await Food.create(finalData)

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
  } else {
    const allFoods = await Food.find({})

    res.status(200).json(allFoods)
  }
}