import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function POST(req, { params }) {
  try {
    const { student_id } = params;
    const formData = await req.formData();
    const file = formData.get("file");
    const documentType = formData.get("documentType");

    if (!file || !student_id || !documentType) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size
    if (file.size > 500 * 1024) {
      return NextResponse.json({ error: "File exceeds 500KB limit" }, { status: 400 });
    }

    // Convert file to Blob (fix for Supabase upload issue)
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });

    // Sanitize file name
    const fileName = file.name.replace(/\s+/g, "_").toLowerCase();
    const filePath = `${student_id}/${documentType}/${fileName}`;

    // Delete existing file if it exists
    const { data: existingFile } = await supabase.storage
      .from("student-documents")
      .list(`${student_id}/${documentType}`);

    if (existingFile && existingFile.length > 0) {
      await supabase.storage
        .from("student-documents")
        .remove(existingFile.map((file) => `${student_id}/${documentType}/${file.name}`));
    }

    // Upload new file (overwrite previous file)
    const { data, error } = await supabase.storage
      .from("student-documents")
      .upload(filePath, blob, { contentType: file.type, upsert: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the public URL
    const { data: publicData } = supabase.storage
      .from("student-documents")
      .getPublicUrl(filePath);

    return NextResponse.json({ success: true, url: publicData.publicUrl }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
