const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creating Product Schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  quantity: {
    type: Number,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});
module.exports = Product = mongoose.model("product", ProductSchema);
