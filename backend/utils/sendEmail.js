const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "youremail@gmail.com",
    pass: "abdcedfxyz",
  },
});

let sendEmail = (emailTemplate) => {
  transporter.sendMail(emailTemplate, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

module.exports = { sendEmail };
