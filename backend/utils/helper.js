const nodemailer = require("nodemailer");

exports.sendMail = async (email, hashedToken, emailType) => {
  let verifyEmailContent = `
        <div>
            <h2>Email Verification</h2>
            <a href="${process.env.DOMAIN}/verifyEmail?token=${hashedToken}" class="button">Verify Email</a>
            <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
            <p>${process.env.DOMAIN}/verifyEmail?token=${hashedToken}</p>
        </div>
    `;

  let forgotPasswordContent = `
        <div>
            <h1>Reset Password<h1>
        </div>
    `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "atharvalolzzz96@gmail.com",
      pass: "htqtpmwgzmrywets",
    },
  });

  let options = {
    from: "atharvalolzzz96@gmail.com",
    to: email,
    subject:
      emailType == "VERIFY" ? "Verify your email to login" : "Reset Password",
    html: emailType == "VERIFY" ? verifyEmailContent : forgotPasswordContent,
  };

  transporter.sendMail(options, (err) => {
    if (err) {
      console.log("Error in sending email", err);
    } else {
      console.log("Sent Mail Successfully");
    }
  });

  return "ok";
};
