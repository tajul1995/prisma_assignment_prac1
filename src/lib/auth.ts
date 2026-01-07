import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "tajulislam199595@gmail.com",
    pass: "dkre hspg wmio btat",
  },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins:[process.env.APP_URL!],
    user:{
        additionalFields:{
            role:{
                type:"string",
                defaultValue:"USER",
                required:false
            },
            phone:{
                type:"string",
                required:false
            },
            status:{
                type:"string",
                defaultValue:"ACTIVE",
                required:false
            }
        }
    },
    emailAndPassword: { 
    enabled: true, 
    autoSignIn:false,
    requireEmailVerification:true
  },
    emailVerification: {
        sendOnSignUp:true,
        autoSignInAfterVerification:true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
        const verificationUrl=`${process.env.APP_URL}/email-verify?token=${token}`
       const info = await transporter.sendMail({
    from: '"prisma database" <prismablog.ph@gamil.com>',
    to: "tajulislam199595@gmail.com",
    subject: "verify your email",
    
    html:`<tr> <td style="padding:24px 32px; text-align:center; background:#111827; border-radius:8px 8px 0 0;"> <h1 style="margin:0; color:#ffffff; font-size:24px;">Verify Your Email</h1> </td> </tr> <!-- Content --> <tr> <td style="padding:32px;"> <p style="margin:0 0 16px; font-size:16px; color:#374151;"> Hi ${user.name}, </p> <p style="margin:0 0 24px; font-size:16px; color:#374151; line-height:1.6;"> Thanks for signing up! Please confirm your email address by clicking the button below. </p> <!-- Button --> <table cellpadding="0" cellspacing="0" role="presentation" align="center" style="margin:24px auto;"> <tr> <td align="center"> <a href="{{VERIFICATION_URL}}" style="display:inline-block; padding:14px 28px; background:#2563eb; color:#ffffff; text-decoration:none; font-size:16px; font-weight:bold; border-radius:6px;"> Verify Email </a> </td> </tr> </table> <p style="margin:24px 0 0; font-size:14px; color:#6b7280; line-height:1.6;"> If the button doesn’t work, copy and paste this link into your browser: </p> <p style="margin:8px 0 0; word-break:break-all;"> <a href="{{VERIFICATION_URL}}" style="color:#2563eb; font-size:14px;"> {{VERIFICATION_URL}} </a> </p> <p style="margin:32px 0 0; font-size:14px; color:#6b7280;"> This link will expire in 24 hours. If you didn’t create an account, you can safely ignore this email. </p> </td> </tr> <!-- Footer --> <tr> <td style="padding:20px 32px; text-align:center; background:#f9fafb; border-radius:0 0 8px 8px;"> <p style="margin:0; font-size:12px; color:#9ca3af;"> © 2026 Your Company. All rights reserved. </p> </td> </tr> </table> </td> </tr>`
  });

//   console.log("Message sent:", info.messageId);
    },
  },
});