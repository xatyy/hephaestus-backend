const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        userId: {type: String , required:true},
        products: {type: String, required:true},
        categories: {type: Array, required:true},
        price: {type: Number, required:true},
        hasNic: {type: Boolean,
            default:false,},
        img: {type: String, required:true}, 
    },
    {timestamps: true}
);

module.exports = mongoose.model("Product", ProductSchema);