const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { verifyToken, verifyTokenAndAuthority } = require("./verifyToken");

router.put("/:id", verifyTokenAndAuthority, async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.CRYPTO_SECRET
      ).toString();
    }
  
    try {
      console.log(req.user.isAdmin);

      if(req.body.isAdmin && !req.user.isAdmin){
          throw "Not allowed";
      }
      
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);

    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;