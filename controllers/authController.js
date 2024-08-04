const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");

module.exports.registerUser = async function (req, res) {
  try {
    let { email, password, fullname } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).send(err.message);
        } else {
          const userCreated = await userModel.create({
            fullname,
            email,
            password: hash,
          });

          let token = generateToken(userCreated);
          res.cookie("token", token);
          res.send("user created successfully!");
        }
      });
    }
    else {
      res.status(400).send("User already exists!");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;
    
    let user = await userModel.findOne({email});

    if(!user) return res.status(400).send("email or password is not correct!");

    bcrypt.compare(password, user.password, (err, result)=>{
        if(result){
            let token = generateToken(user);
            res.cookie("token", token);
            res.send("login successful!");
        }
        else{
            return res.status(400).send("email or password is not correct!");
        }
    })
}

