const nodemailer = require('nodemailer');

async function sendEmail(subject, message, recipientEmail) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dhruvravalpricetracker@gmail.com',
                pass: 'ucev vaop oenb mdiu'
            }
        });

        // Construct email body with signature
        const body = `Dear User,\n\n${message}\n\nThanks,\nDhruv Raval\nTeam of AssistFinder`;

        const emailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: recipientEmail,
            subject: subject,
            text: body,
            html: `<p>Dear User,</p><p>${message}</p><p>Thanks,<br>Dhruv Raval<br>Team of AssistFinder</p>`
        };

        const info = await transporter.sendMail(emailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Optionally handle or log the error further
    }
}

module.exports = sendEmail;
