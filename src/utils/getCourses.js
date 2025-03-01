import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const getCourses = async () => {
  let { data, error } = await supabase
    .from("course_view")
    .select("course_id, program_name, mode_type, course_name, branch");

  if (error) throw error;

  // Use reduce accumulator to structure data
  const structuredData = data.reduce((acc, course) => {
    if (!acc[course.program_name]) acc[course.program_name] = {};
    if (!acc[course.program_name][course.mode_type]) acc[course.program_name][course.mode_type] = [];

    acc[course.program_name][course.mode_type].push({
      id: course.course_id,
      name: `${course.course_name} - ${course.branch}`, // Correctly formatted
    });

    return acc;
  }, {});

  return structuredData;
};
