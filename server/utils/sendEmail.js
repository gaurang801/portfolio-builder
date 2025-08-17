const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // or 'STARTTLS'
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;