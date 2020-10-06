const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

//Product Model
const Product = require("../../models/Product");

//@route GET api/products
//@desc getting all products
router.get("/", (req, res) => {
  Product.find()
    .sort({ date: -1 })
    .then((products) => res.json(products));
});

//@route POST api/products
//@desc creating a product
router.post("/", auth, (req, res) => {
  const { name, description, quantity, user_id } = req.body;

  if (
    !name ||
    name === "" ||
    !description ||
    description === "" ||
    !quantity ||
    quantity === "" ||
    !user_id ||
    user_id === ""
  ) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const newProduct = new Product({
    name: name.toString(),
    description: description.toString(),
    quantity: parseInt(quantity),
    user_id: user_id.toString(),
  });

  newProduct.save().then((product) => res.json(product));
});

//@route DELETE api/products
//@desc deleting a product
router.delete("/:id", auth, (req, res) => {
  Product.findById(req.params.id)
    .then((product) => product.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false, error: err }));
});

//@route UPDATE api/products
//@desc updating a product
router.put("/:id", auth, (req, res) => {
  const { name, description, quantity, user_id } = req.body;

  if (
    !name ||
    name === "" ||
    !description ||
    description === "" ||
    !quantity ||
    quantity === "" ||
    !user_id ||
    user_id === ""
  ) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  Product.findById(req.params.id).then((product) =>
    product
      .updateOne({
        name: name.toString(),
        description: description.toString(),
        quantity: parseInt(quantity),
        user_id: user_id.toString(),
      })
      .then(() => res.json({ success: true }))
      .catch((err) => res.status(404).json({ success: false, error: err }))
  );
});

module.exports = router;
