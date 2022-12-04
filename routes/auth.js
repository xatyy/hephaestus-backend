const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register

router.post("/register", async (req,res)=>{
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_SECRET).toString(),
    });
try{
    const savedUser = await newUser.save()
    res.status(201).json(savedUser);
} catch (err){
    res.status(500).json(err);
}
});

//Login

router.post("/login", async(req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user){ 
        throw "wrong Credentials";
        }
        const hashedPassword = CryptoJS.AES.decrypt(user.password,
            process.env.CRYPTO_SECRET);
        const truePassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if(truePassword !== req.body.password){
            throw "wrong Credentials";
        } 

        const accessToken = jwt.sign({
            id:user._id,
            isAdmin: user.isAdmin,
        },
            process.env.JWT_SECRET,
            {expiresIn:"5d"}
        );


            const {password, ...others} = user._doc;

        res.status(200).json({...others, accessToken});
    }catch(err){
        res.status(401).json(err);
    }
})

module.exports = router;