const nodemailer = require("nodemailer");

const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
const NODEMAILER_SENHA = process.env.NODEMAILER_SENHA;
const NODEMAILER_SERVICE = process.env.NODEMAILER_SERVICE;

if (!NODEMAILER_EMAIL || !NODEMAILER_SENHA || !NODEMAILER_SERVICE)
    throw "Nodemailer bad configuration";

const SendHtmlEmail = (receiver, subject, htmlMessage) => {
    return new Promise((resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                service: NODEMAILER_SERVICE,
                auth: {
                    user: NODEMAILER_EMAIL,
                    pass: NODEMAILER_SENHA,
                },
            });

            const mailOptions = {
                from: NODEMAILER_EMAIL,
                to: receiver,
                subject: subject,
                html: htmlMessage,
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) reject(err);
                resolve();
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = SendHtmlEmail;
