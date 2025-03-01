import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { email_id, password } = await req.json(); // ✅ Correct way to parse request body

    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from("students_registration")
      .select("student_id, email_id, password, role_id")
      .eq("email_id", email_id)
      .single();

    if (error || !user) {
      return new Response(JSON.stringify({ message: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.student_id, email_id: user.email_id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(JSON.stringify({ token, role_id: user.role_id, student_id: user.student_id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
