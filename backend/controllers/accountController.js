const Account = require("../models/Account");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/helper");
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.googleSignIn = async (req, res) => {
  try {
    console.log(req.body);

    // Transforming
    req.body.profile = {
      accountFirstName: req.body.profile.given_name,
      accountLastName: req.body.profile.family_name,
      accountEmail: req.body.profile.email,
      accountImage: req.body.profile.picture,
      role: "user",
    };

    let account = new Account(req.body.profile);
    let data = await account.googleSignIn();

    if (data.isTrue == "ok") {
      return res.status(200).json({ data: data });
    } else {
      return res.status(400).json({ message: data });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.signUp = async (req, res) => {
  try {
    console.log(req.body);

    let account = new Account(req.body);
    let data = await account.signUp();

    if (data == "ok") {
      return res.status(200).json({ data: data });
    } else {
      return res.status(200).json({ message: data });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.signIn = async (req, res) => {
  try {
    let account = new Account();
    let accountProfile = await account.signIn(req.body);

    if (accountProfile != null) {
      console.log("Returning");
      return res.status(200).json({ data: accountProfile });
    } else {
      return res.status(400).json({ data: accountProfile });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log("Profile ke andar");
    console.log(req.body);

    let account = new Account();
    let data = await account.updateProfile(req.body);

    if (data == "ok") {
      return res.status(200).json({ data: data });
    } else {
      return res.status(200).json({ message: data });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.sendVerificationLink = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    let account = new Account();

    let accountProfile = await account.getAccountByEmail(email);
    console.log(accountProfile);
    if (accountProfile == null) {
      return res.status(422).json({ data: "User not exist" });
    }

    // if (accountProfile.role == "user") {
    //   const userProfile = await user.getUserByEmail(
    //     accountProfile.accountEmail
    //   );
    //   console.log(userProfile);

    //   // Idea 1
    //   // When user signs in using google provider, store the token in the mongodb and whenever he/she want to signs in using email/password, he will be given an link (with token present) and can reset the password

    //   // Idea 2
    //   // Sent a link with the userId (hashed userId) and if the user clicks on that he can reset his password

    //   // const payload = {
    //   //   user_id: "123456",
    //   //   // other claims...
    //   //   exp: Math.floor(Date.now() / 1000) + 60 * 60, // Set expiration time to 1 hour from now
    //   // };

    //   const encryptedUserId = jwt.sign(
    //     userProfile._id.toJSON(),
    //     process.env.JWT_SECRET
    //   );

    //   // await user.updateVerifyToken(email, hashedToken);

    //   let data = await sendMail(userProfile, encryptedUserId);

    //   return res.status(200).json({ data: data });
    // }

    const encryptedId = jwt.sign(
      { id: accountProfile._id },
      process.env.JWT_SECRET,
      { expiresIn: 2 * 60 }
    );

    // await user.updateVerifyToken(email, hashedToken);

    let data = await sendMail(accountProfile, encryptedId);

    return res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyJWTAndResetPassword = async (req, res) => {
  try {
    console.log(req.body);
    const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);

    console.log("Decoded");
    console.log(decoded);
    console.log(decoded.exp);

    let account = new Account();
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const result = await account.getAccountByIdAndUpdatePassword(
      decoded,
      hashedPassword
    );

    return res.status(200).json({ data: result });
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      console.log("Expiration error");
      console.log(error);
      return res.status(400).json({ data: "Token has been expired" });
    } else {
      console.log(error);
      return res.status(400).json({ data: "Something went wrong" });
    }
  }
};
