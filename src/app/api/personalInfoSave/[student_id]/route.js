import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function POST(req, { params }) {
  try {
    const body = await req.json(); // Parse request body
    const { student_id } = params; // Extract student_id from the dynamic route

    if (!student_id) {
      return NextResponse.json({ error: "Missing student ID in URL" }, { status: 400 });
    }

    const { 
      alternateMobile, dob, gender, bloodGroup, address, 
      physics, chemistry, maths, computer, percentage 
    } = body;

    // Validate required fields
    if (!dob || !gender || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use upsert to insert or update in one query
    const { data, error } = await supabase
      .from("students_personal_information")
      .upsert([
        {
          student_id,
          alternateMobile,
          dob,
          gender,
          bloodGroup,
          address,
          physics,
          chemistry,
          maths,
          computer,
          percentage,
        },
      ], { onConflict: ["student_id"] }); // Ensures update if student_id exists

    if (error) throw error;

    return NextResponse.json({ message: "Student personal info saved/updated successfully!", data }, { status: 200 });

  } catch (err) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
