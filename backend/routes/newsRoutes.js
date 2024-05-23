const router = require("express").Router();
const { Subscriber } = require("../models/Subscriber");
const nodemailer = require("nodemailer");
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).send("Subscribed successfully!");
  } catch (error) {
    res.status(500).send("Failed to subscribe");
  }
});

router.delete("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;
    await Subscriber.findOneAndDelete({ email });
    res.status(200).send("Unsubscribed successfully!");
  } catch (error) {
    res.status(500).send("Failed to unsubscribe");
  }
});

router.post("/sendNewsletter", async (req, res) => {
  try {
    const { subject, content } = req.body;
    const subscribers = await Subscriber.find();

    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailTemplate = (subscriberEmail, subject, content) => `
      <html>
        <head>
          <title>${subject}</title>
        </head>
        <body>
          <h1>${subject}</h1>
          <p>${content}</p>
          <p>This is a newsletter from our website.</p>
          <p>If you no longer wish to receive these emails, you can unsubscribe <a href="http://localhost:3000/news/unsubscribe?email=${subscriberEmail}">here</a>.</p>
        </body>
      </html>
    `;

    for (const subscriber of subscribers) {
      await transporter.sendMail({
        from: process.env.SMTP_USERNAME,
        to: subscriber.email,
        subject: subject,
        html: emailTemplate(subscriber.email, subject, content),
      });
    }

    res.status(200).send("Newsletter sent successfully!");
  } catch (error) {
    console.error("Failed to send newsletter:", error);
    res.status(500).send("Failed to send newsletter");
  }
});

module.exports = router;
