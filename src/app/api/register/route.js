import { supabase } from "@/utils/supabase";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Generate a random password
const generateRandomPassword = (length = 10) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// Send password via email
const sendEmail = async (email, password) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Account Password",
    text: `Your account has been created. Your password: ${password}`,
  };

  await transporter.sendMail(mailOptions);
};

// API Handler
export async function POST(req) {
  try {
    const body = await req.json();
    const { student_name, mobile_number, email_id, pincode, course } = body;

    // Generate and hash the password
    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into Supabase
    const { data, error } = await supabase.from("students_registration").insert([
      { student_name, mobile_number, email_id, pincode, course, password: hashedPassword },
    ]);

    if (error) throw error;

    // Send password email
    await sendEmail(email_id, password);

    return NextResponse.json({ message: "Student registered successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
