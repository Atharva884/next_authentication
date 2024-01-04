const router = require("express").Router();
const accountController = require("./controllers/accountController");
const userController = require("./controllers/userController");
const { validateAccountSignUp } = require("./middleware/middleware");

// Google Sign In
router.post("/account/googleSignIn", accountController.googleSignIn);

// Sign Up
router.post("/account/signUp", validateAccountSignUp, accountController.signUp);

// Sign In
router.post("/account/signIn", accountController.signIn);

// Sign In Verification
router.post("/sendVerificationLink", accountController.sendVerificationLink);

// Verify Email By token
router.post("/verifyTokenByEmail", userController.verifyTokenByEmail);

// Profile Updation
router.post("/account/updateProfile", accountController.updateProfile);

module.exports = router;
