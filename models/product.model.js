const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema({
    imgUrl: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    userId: {
        type: String
    }
})

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;
