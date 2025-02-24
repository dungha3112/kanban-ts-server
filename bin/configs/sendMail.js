"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailOTP = exports.sendMailToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const sendMailToken = (to, url, text) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
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
            subject: "Kanban App",
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
    }
    catch (error) {
        console.log(`=> Error send mail: ${error}`);
    }
};
exports.sendMailToken = sendMailToken;
const sendMailOTP = (to, otp) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
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
            subject: "Kanban App",
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
    }
    catch (error) {
        console.log(`=> Error send mail: ${error}`);
    }
};
exports.sendMailOTP = sendMailOTP;
