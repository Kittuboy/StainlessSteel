const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  imageUrl: String,
  type: { type: String, required: true },
  rating: { type: Number, default: 0 },
  ratings: [{ userId: String, value: Number }], // add this
  specs: {
    material: String,
    grade: String,
    thickness: String,
    finish: String,
  },
  offer: {
    type: String,
    default: ""
  },


}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
