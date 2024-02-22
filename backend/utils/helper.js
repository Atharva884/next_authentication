const nodemailer = require("nodemailer");

exports.sendMail = async (account, hashedId) => {
  // let verifyEmailContent = `
  //       <div>
  //           <h2>Email Verification</h2>
  //           <a href="${process.env.DOMAIN}/verifyEmail?token=${hashedToken}" class="button">Verify Email</a>
  //           <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
  //           <p>${process.env.DOMAIN}/verifyEmail?token=${hashedToken}</p>
  //       </div>
  //   `;

  let forgotPasswordContent = `
      <div class="container">
          <p>Dear ${account.accountFirstName} ${account.accountLastName},</p>
          <p>We noticed that you requested to reset your password for your  account. No need to worry; we're here to help you regain access to your account.</p>
          <p>To reset your password, please follow the link below:</p>
          <p><a href="${process.env.DOMAIN}/resetPassword?token=${hashedId}">Reset Password</a></p>
          <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
          <p>${process.env.DOMAIN}/resetPassword?token=${hashedId}</p>
          <p>If you didn't request to reset your password, you can ignore this email - your account is still secure.</p>
          <p>For security reasons, this link will expire in 10 minutes, so make sure to use it promptly.</p>
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
    to: account.accountEmail,
    subject: "Reset Your Password",
    html: forgotPasswordContent,
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
