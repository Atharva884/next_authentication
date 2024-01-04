const adminsCollection = require("../db").db().collection("admins");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");

let Admin = function (data) {
  this.data = data;
  this.errors = [];
};

Admin.prototype.cleanUp = function () {
  this.data = {
    adminFirstName: this.data.accountFirstName,
    adminLastName: this.data.accountLastName,
    adminEmail: this.data.accountEmail,
    adminPassword: this.data.accountPassword,
    createdDate: new Date(),
  };
};

Admin.prototype.signUp = async function () {
  console.log("this.data Adminn");
  console.log(this.data);
  this.cleanUp();
  if (!this.errors.length) {
    let data = await adminsCollection.insertOne(this.data);

    if (data.acknowledged) {
      return "ok";
    }
  }
};

// Account.prototype.updateProfile = async function (profile) {
//   let name = profile.name.split(" ");
//   let firstName = name[0];
//   let lastName = name[1];
//   let data = await accountsCollection.findOneAndUpdate(
//     { accountEmail: profile.email },
//     {
//       $set: {
//         accountFirstName: firstName,
//         accountLastName: lastName,
//       },
//     }
//   );

//   if (data.ok) {
//     return "ok";
//   }
// };

module.exports = Admin;
