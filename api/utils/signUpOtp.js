import nodemailer from 'nodemailer';

export const sendOtp = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other email services
    auth: {
     user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_SECRET,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: '"TrustLink" ankit.tanwar.professional@gmail.com',
    to: email,
    subject: 'Welcome to TrustLink',
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      width: 95%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      border-radius: 10px;
    }
    .header {
      background-color: #007bff;
      color: white;
      padding: 10px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      padding: 20px;
      background-color: white;
      border-radius: 0 0 10px 10px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      font-size: 16px;
      color: white;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>We received a Sign Up request</h1>
    </div>
    <div class="content">
      <p>Dear User,</p>
      <p>Thank you for using our service. Your verification code for Sign Up is: </p>
      <h2>${code}</h2>
      <p>Please enter this code on the verification page to proceed.</p>
      <p>Thank you,<br>Ankit Singh Tanwar</p>
    </div>
  </div>
</body>
</html>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Otp sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

