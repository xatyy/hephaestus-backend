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
        if(req.body.isAdmin.length != 0){
            if(req.user.isAdmin && req.body){
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    }
}
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;