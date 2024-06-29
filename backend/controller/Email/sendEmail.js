const nodemailer = require('nodemailer');

async function sendEmail(subject, body, recipientEmail) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dhruvravalpricetracker@gmail.com',
                pass: 'ucev vaop oenb mdiu'
            }
        });

        const emailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: recipientEmail,
            subject: subject,
            text: body,
            html: body
        };

        const info = await transporter.sendMail(emailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Optionally handle or log the error further
    }
}

module.exports = sendEmail;
