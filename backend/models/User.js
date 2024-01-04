const usersCollection = require("../db").db().collection("users");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  this.data = {
    userFirstName: this.data.accountFirstName,
    userLastName: this.data.accountLastName,
    userEmail: this.data.accountEmail,
    userPassword: this.data.accountPassword,
    userImage: this.data.accountImage,
    isEmailVerified: false,
    verifyToken: null,
    verifyTokenExpiry: new Date(this.data.verifyTokenExpiry),
    createdDate: new Date(),
  };
};

User.prototype.signUp = async function () {
  console.log("this.data Userrr");
  console.log(this.data);
  this.cleanUp();
  if (!this.errors.length) {
    let data = await usersCollection.insertOne(this.data);

    if (data.acknowledged) {
      return "ok";
    }
  }
};

User.prototype.updateUser = async function (profile) {
  let name = profile.name.split(" ");
  let firstName = name[0];
  let lastName = name[1];
  let data = await usersCollection.findOneAndUpdate(
    { userEmail: profile.email },
    {
      $set: {
        userFirstName: firstName,
        userLastName: lastName,
      },
    }
  );

  if (data.ok) {
    return "ok";
  }
};

User.prototype.updateVerifyToken = async function (userEmail, token) {
  let data = await usersCollection.findOneAndUpdate(
    { userEmail: userEmail },
    {
      $set: {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 1000 * 60 * 60 * 24,
      },
    }
  );
};

User.prototype.verifyTokenByEmail = async function (token) {
  let user = await usersCollection.findOne({
    verifyToken: token,
    verifyTokenExpiry: { $gt: Date.now() },
  });

  const isTokenValid = bcrypt.compareSync(user._id.toString(), token);
  console.log(isTokenValid);

  if (!user || !isTokenValid) {
    return "Invalid token";
  }

  let data = await usersCollection.findOneAndUpdate(
    { verifyToken: token },
    {
      $set: {
        isEmailVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    }
  );

  return user;
};

User.prototype.getUserByEmail = async function (userEmail) {
  let data = await usersCollection.findOne({ userEmail: userEmail });

  if (data != null) {
    return data;
  }
};

User.prototype.updateUserProfile = async function (profile) {
  let data = await usersCollection.findOneAndUpdate(
    {
      userEmail: profile.accountEmail,
    },
    {
      $set: {
        userImage: profile.accountImage,
      },
    }
  );

  if (data.ok) {
    return "ok";
  }
};

module.exports = User;
