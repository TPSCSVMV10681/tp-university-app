import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(req, { params }) {
  const { student_id } = params;

  // Fetch student details from Supabase
  const { data, error } = await supabase
    .from("students_registration")
    .select("*")
    .eq("student_id", student_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}
