const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/helper");
const User = require("../models/User");

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
    let user = new User();

    let accountProfile = await account.getAccountByEmail(email);
    console.log(accountProfile);
    if (accountProfile == null) {
      return res.status(422).json({ data: "User not exist" });
    }

    if (accountProfile.role == "user") {
      const userProfile = await user.getUserByEmail(
        accountProfile.accountEmail
      );
      console.log("UserProfile");
      console.log(userProfile);

      const hashedToken = bcrypt.hashSync(userProfile._id.toString(), 10);

      await user.updateVerifyToken(email, hashedToken);

      let data = await sendMail(userProfile.userEmail, hashedToken, "VERIFY");

      return res.status(200).json({ data: data });
    }
  } catch (error) {
    console.log(error);
  }
};
