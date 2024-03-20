import { OAuth2Client } from "google-auth-library";
// import nodemailer from "nodemailer";
const nodemailer = require("nodemailer");

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const CLIENT_ID = process.env.MAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN;
const SENDER_MAIL = process.env.SENDER_EMAIL_ADDRESS;

// export const sendMailToken = async (to: string, url: string, text: string) => {
//   const oAuth2Client = new OAuth2Client(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     OAUTH_PLAYGROUND
//   );
//   oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//   try {
//     const access_token = await oAuth2Client.getAccessToken();
//     const myAccessToken = access_token?.token;

//     const transport = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: SENDER_MAIL,
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: myAccessToken,
//       },
//     });

//     const mailOption = {
//       from: SENDER_MAIL,
//       to: to,
//       subject: "Kanban App",
//       html: `
//         <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
//         <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the @@DungHaQn@@.</h2>
//         <p>Congratulations! You're almost set to start using Kanban App.
//             Just click the button below to validate your email address.
//         </p>

//         <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
//           ${text}
//         </a>
//         <p>Verification token is valid for 10 minutes.</p>

//         <p>If the button doesn't work for any reason, you can also click on the link below:</p>

//         <div>${url}</div>
//         </div>
//       `,
//     };

//     const result = await transport.sendMail(mailOption);
//     return result;
//   } catch (error) {
//     console.log(`Error send mail: ${error}`);
//   }
// };
export const sendMailToken = (to: string, url: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.EMAIL_APP_ADDRESS}`,
        pass: `${process.env.EMAIL_APP_PASSWORD}`,
      },
    });

    const mailOption = {
      from: `${process.env.EMAIL_APP_ADDRESS}`,
      to: to,
      subject: "Booking App",
      html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the @@DungHaQn@@.</h2>
        <p>
          ${text}
        </p>
        
        a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
        ${text}
      </a>
      <p>Verification token is valid for 10 minutes.</p>
  
      <p>If the button doesn't work for any reason, you can also click on the link below:</p>
  
      <div>${url}</div>
    
        </div>
      `,
    };
    const result = transporter.sendMail(mailOption);
    return result;
  } catch (error) {
    console.log(`=> Error send mail: ${error}`);
  }
};

// export const sendMailOTP = async (to: string, otp: string) => {
//   const oAuth2Client = new OAuth2Client(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     OAUTH_PLAYGROUND
//   );
//   oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//   try {
//     const access_token = await oAuth2Client.getAccessToken();
//     const myAccessToken = access_token?.token;

//     const transport = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: SENDER_MAIL,
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: myAccessToken,
//       },
//     });

//     const mailOption = {
//       from: SENDER_MAIL,
//       to: to,
//       subject: "Kanban App",
//       html: `
//         <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
//         <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the @@DungHaQn@@.</h2>
//         <p>
//           Congratulations! You're almost set to start using Kanban App.
//         </p>

//         <p>
//           Your code OTP:
//           <span style="font-size:14px; font-weight: bold;">
//             ${otp}
//           </span>
//         </p>
//         <p>OTP code is valid for 10 minutes.</p>

//         </div>
//       `,
//     };

//     const result = await transport.sendMail(mailOption);
//     return result;
//   } catch (error) {
//     console.log(`Error send mail: ${error}`);
//   }
// };
export const sendMailOTP = (to: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.EMAIL_APP_ADDRESS}`,
        pass: `${process.env.EMAIL_APP_PASSWORD}`,
      },
    });

    const mailOption = {
      from: `${process.env.EMAIL_APP_ADDRESS}`,
      to: to,
      subject: "Music App",
      html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Music App</h2>
        <p>
          Congratulations! You're almost set to start using Kanban App.
        </p>
        
        <p>
          Your code OTP: 
          <span style="font-size:14px; font-weight: bold;">
            ${otp}
          </span>
        </p>
        <p>OTP code is valid for 10 minutes.</p>
    
        </div>
      `,
    };
    const result = transporter.sendMail(mailOption);
    return result;
  } catch (error) {
    console.log(`=> Error send mail: ${error}`);
  }
};
