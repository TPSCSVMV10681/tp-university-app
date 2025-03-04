"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function StudentDocuments() {
  const params = useParams();
  const router = useRouter();

  const student_id = params.student_id; // Extract student_id properly

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    const fetchStudent = async () => {
      if (!student_id) return;

      try {
        const response = await fetch(`/api/student/${student_id}`);
        const data = await response.json();
        if (response.ok) {
          setStudent(data);
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
      setLoading(false);
    };

    fetchStudent();
  }, [student_id]);

  if (loading) return <p>Loading...</p>;
  if (!student) return <p>Student not found</p>;

  
  

  
  

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-5">
  {/* Student Header */}
  <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full border-2 border-yellow-400 text-center mt-10">
    <h2 className="text-xl font-semibold text-indigo-600">Welcome, {student.student_name}!</h2>
    <p className="text-gray-700">
      <span className="font-semibold text-yellow-600">Reg. ID:</span> {student.student_id} <br />
      <span className="text-green-600 font-semibold">Registered on:</span>{" "}
      <span className="text-pink-600 font-bold">{new Date(student.created_at).toLocaleDateString()}</span>
    </p>
  </div>

  {/* Upload Documents Form */}
  <div className="max-w-lg w-full p-6 border rounded-lg shadow-lg bg-white mt-6">
    <h2 className="text-lg font-bold mb-4 text-center">Registration Verification</h2>

    

    <button
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
    >
      Click here to go payment page
    </button>
  </div>
</div>

  
  );
}
