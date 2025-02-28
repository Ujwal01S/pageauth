import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    native: {
        required: true,
        type: String
    },
    foodType: {
        required: true,
        type: String
    },
    cookTime: {
        required: true,
        type: Number
    },
    image: {
        required: true,
        type: String
    },
    publicId: {
        type: String
    },
    isFeatured: {
        required: true,
        type: Boolean
    }
});

export const Food = mongoose.models?.Food || mongoose.model("Food", foodSchema)