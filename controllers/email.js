const nodemailer = require("nodemailer");

exports.sendEmail = (req, res) => {
  if (req.body.name === "") {
    res.json({ status: "error", message: "Please enter your Name" });
    return;
  }

  if (req.body.email === "") {
    res.json({ status: "error", message: "Please enter your Email" });
    return;
  }

  if (req.body.message === "") {
    res.json({ status: "error", message: "Please enter a Message" });
    return;
  }

  let subject = "From Website";
  if (req.body.subject !== "") {
    subject = req.body.subject;
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SEND_FROM_EMAIL,
      pass: process.env.SEND_FROM_EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.SITE_OWNER + "<" + process.env.SEND_FROM_EMAIL + ">",
    to: process.env.EMAIL,
    replyTo: req.body.email,
    subject: subject,
    text: req.body.name + "\n" + req.body.message
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      // console.log(error);
      res.json({ message: "error" });
    } else {
      // console.log("Message sent: " + info.response);
      res.json({ message: "success" });
    }
  });
};
