
import { z } from "zod";




export const foodFormSchema = z.object({
    name: z.string().min(4, { message: "Name is required and should be of 4 char min" }),
    native: z.string().min(4, { message: "Native is required and should be of 4 char min" }),
    foodType: z.string({ message: "Food Type is required" }),
    cookTime: z.number({ message: 'Cook Time is required' }),
    image: z.union([z.instanceof(File, { message: "Image must be valid file" }), z.string().min(1, { message: "Image URL must be non empty" })]),
    isFeatured: z.boolean().default(false)
})