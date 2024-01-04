const accountsCollection = require("../db").db().collection("accounts");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const User = require("./User");
const Admin = require("./Admin");

let Account = function (data) {
  this.data = data;
  this.errors = [];
};

Account.prototype.cleanUp = function () {
  this.data = {
    accountFirstName: this.data.accountFirstName,
    accountLastName: this.data.accountLastName,
    accountEmail: this.data.accountEmail,
    accountPassword: this.data.accountPassword,
    accountImage: this.data.accountImage,
    role: this.data.role,
    createdDate: new Date(),
  };
};

Account.prototype.googleSignIn = async function () {
  this.cleanUp();
  if (!this.errors.length) {
    let isAccountExist = await accountsCollection.findOne({
      accountEmail: this.data.accountEmail,
    });

    console.log("this.data");
    console.log(this.data);
    console.log("isAccountExist");
    console.log(isAccountExist);
    if (isAccountExist !== null) {
      // Update image
      await accountsCollection.findOneAndUpdate(
        {
          accountEmail: this.data.accountEmail,
        },
        {
          $set: {
            accountImage: this.data.accountImage,
          },
        }
      );

      let user = new User();
      await user.updateUserProfile(this.data);

      return {
        isTrue: "ok",
        updatedUserData: isAccountExist,
      };
    } else {
      let data = await accountsCollection.insertOne(this.data);
      if (data.acknowledged) {
        let user = new User(this.data);
        let data = await user.signUp();

        if (data == "ok") {
          return {
            isTrue: "ok",
          };
        }
      } else {
        return "fail";
      }
    }
  }
};

Account.prototype.signUp = async function () {
  console.log("this.data");
  console.log(this.data);
  this.cleanUp();
  if (!this.errors.length) {
    let isAccountExist = await accountsCollection.findOne({
      accountEmail: this.data.accountEmail,
    });

    console.log(isAccountExist);
    if (isAccountExist !== null) {
      return "Email already exist.";
    } else {
      let salt = bcrypt.genSaltSync(10);
      this.data.accountPassword = bcrypt.hashSync(
        this.data.accountPassword,
        salt
      );
      console.log(this.data.accountPassword);
      let data = await accountsCollection.insertOne(this.data);

      if (data.acknowledged) {
        if (this.data.role == "user") {
          let user = new User(this.data);
          let data = await user.signUp();
          if (data == "ok") {
            return "ok";
          }
        } else if (this.data.role == "admin") {
          let admin = new Admin(this.data);
          let data = await admin.signUp();
          if (data == "ok") {
            return "ok";
          }
        }
      }
    }
  }
};

Account.prototype.signIn = async function (profile) {
  console.log(profile);
  console.log("Profike");
  let isProfileExists = await accountsCollection.findOne({
    accountEmail: profile.email,
  });

  if (!isProfileExists) {
    return "Invalid Credentials";
  }
  console.log(isProfileExists);

  let isPasswordCorrect = await bcrypt.compare(
    profile.password,
    isProfileExists.accountPassword
  );

  if (!isPasswordCorrect) {
    return "Invalid Credentials";
  }

  return isProfileExists;
};

Account.prototype.updateProfile = async function (profile) {
  let name = profile.name.split(" ");
  let firstName = name[0];
  let lastName = name[1];
  let data = await accountsCollection.findOneAndUpdate(
    { accountEmail: profile.email },
    {
      $set: {
        accountFirstName: firstName,
        accountLastName: lastName,
      },
    }
  );

  if (data.ok) {
    let user = new User();
    let data = await user.updateUser(profile);
    if (data == "ok") {
      return "ok";
    }
  }
};

Account.prototype.getAccountByEmail = async function (email) {
  let data = await accountsCollection.findOne({ accountEmail: email });

  if (data != null) {
    return data;
  }

  return null;
};

module.exports = Account;
