import nodemailer from 'nodemailer';
import pdf from 'html-pdf'; // Library to generate PDF

// Setup nodemailer transporter
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

// Function to generate PDF
const generatePDF = (data, callback) => {
    const html = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 100px;
                  
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 700px;
                    margin: 0 auto;
                    background: #fff;
                    border: 1px solid #ddd;
                    
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                table, th, td {
                    border: 1px solid #dddddd;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    color: #555;
                }
                th {
                    background-color: #f2f2f2;
                    color: #333;
                }
                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .footer {
                    text-align: center;
                    padding: 20px 0;
                    color: #888;
                }
                   
            </style>
        </head>
        <body>
            <div class="container">
                <h1>TrustLink Enquiry Form</h1>
                <table>
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>Account Holder Email</td>
                        <td>${data.accountHolderEmail}</td>
                    </tr>
                    <tr>
                        <td>First Name</td>
                        <td>${data.firstName}</td>
                    </tr>
                    <tr>
                        <td>Middle Name</td>
                        <td>${data.middleName}</td>
                    </tr>
                    <tr>
                        <td>Last Name</td>
                        <td>${data.lastName}</td>
                    </tr>
                    <tr>
                        <td>Mobile Number</td>
                        <td>${data.mobileNumber}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>${data.email}</td>
                    </tr>
                    <tr>
                        <td>Message</td>
                        <td>${data.message}</td>
                    </tr>
                </table>
                <div class="footer">
                    Thank you for submitting the form.
                </div>
            </div>
        </body>
        </html>
    `;
    const options = { format: 'Letter' };

    pdf.create(html, options).toBuffer((err, buffer) => {
        if (err) return callback(err);
        callback(null, buffer.toString('base64'));
    });
};

export const sendform = (req, res) => {
    const { firstName, middleName, lastName, mobileNumber, email, message, accountHolderEmail } = req.body;

    generatePDF({ firstName, middleName, lastName, mobileNumber, email, message, accountHolderEmail }, (err, pdfBase64) => {
        if (err) {
            console.error("Error generating PDF:", err);
            return res.status(500).send("Internal Server Error");
        }

        const mailOptions = {
            from: 'ankit.tanwar.professional@gmail.com',
            to: [`ankit.tanwar.professional@gmail.com`, accountHolderEmail], // Send to both your email and account holder email
            subject: 'TrustLink Form Details',
            html: `
                <p>Dear ${firstName},</p>
                <p>Thank you for submitting the TrustLink Enquiry Form. Here are the details you provided:</p>
                <ul>
                    <li><strong>Account Holder Email:</strong> ${accountHolderEmail}</li>
                    <li><strong>First Name:</strong> ${firstName}</li>
                    <li><strong>Middle Name:</strong> ${middleName}</li>
                    <li><strong>Last Name:</strong> ${lastName}</li>
                    <li><strong>Mobile Number:</strong> ${mobileNumber}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Message:</strong> ${message}</li>
                </ul>
                <p>Please find the attached PDF for your reference.</p>
                <p>Best regards,<br>Ankit Singh Tanwar</p>
            `,
            attachments: [
                {
                    filename: 'TrustLinkForm.pdf',
                    content: pdfBase64,
                    encoding: 'base64'
                }
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).send("Internal Server Error");
            }
            console.log("Form data sent to email");
            res.status(200).json({ success: true, message: "Form submitted successfully!" });
        });
    });
};