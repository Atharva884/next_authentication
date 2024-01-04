const User = require("../models/User");

exports.verifyTokenByEmail = async (req, res) => {
  try {
    const { token } = req.body;
    console.log(token);

    let user = new User();
    let data = await user.verifyTokenByEmail(token);

    if (data == "ok") {
      return res.status(200).json({ data: data });
    } else {
      return res.status(200).json({ data: data });
    }
  } catch (error) {
    console.log(error);
  }
};
