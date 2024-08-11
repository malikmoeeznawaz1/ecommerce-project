const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const { disconnect } = require('mongoose');

router.get('/', (req, res) => {
    let error = req.flash("error");
    res.render('index', {error, loggedin: false});
});

router.get("/shop", isLoggedIn, async (req, res) => {
    const products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", {products, success});
});

router.get("/cart", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email}).populate("cart");

    res.render("cart", {user});
}); 

router.get("/addtocart/:productid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email})
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Product added to cart");
    res.redirect("/shop");
});

router.get("/logout", isLoggedIn, (req, res) => {
    res.render("shop");
});

module.exports = router;