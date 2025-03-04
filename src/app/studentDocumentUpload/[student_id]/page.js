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

  const [files, setFiles] = useState({
    tenth: null,
    twelfth: null,
    community: null,
    tc: null,
  });

  const [previews, setPreviews] = useState({});
  const [progress, setProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState(null);

  const documentTypes = {
    tenth: "10th_marksheet",
    twelfth: "12th_marksheet",
    community: "community_certificate",
    tc: "tc_certificate",
  };


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

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, PNG, and PDF files are allowed.");
      return;
    }

    if (file.size > 500 * 1024) {
      alert("File size exceeds 500KB limit.");
      return;
    }

    setFiles((prev) => ({ ...prev, [docType]: file }));

    const reader = new FileReader();
    reader.onload = () => {
      setPreviews((prev) => ({ ...prev, [docType]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!student_id) {
      alert("Invalid student ID");
      return;
    }
  
    for (const key in files) {
      if (!files[key]) continue;
  
      const formData = new FormData();
      formData.append("file", files[key]);
      formData.append("documentType", documentTypes[key]);
  
      try {
        const response = await axios.post(`/api/documentUploadSave/${student_id}/`, formData);
  
        if (response.data.success) {
          setUploadStatus((prev) => ({
            ...prev,
            [key]: "Upload successful!",
          }));
          // Navigate to the Document Upload Page
        router.push(`/studentPayment/${student_id}`);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadStatus((prev) => ({
          ...prev,
          [key]: "Upload failed.",
        }));
      }
    }
  };
  

  
  

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
    <h2 className="text-lg font-bold mb-4 text-center">Upload Documents</h2>

    {Object.keys(documentTypes).map((key) => (
      <div key={key} className="mb-4">
        <label className="block font-medium">{documentTypes[key]}</label>
        <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange(e, key)} />

        {previews[key] && (
          <div className="mt-2">
            {files[key]?.type.includes("pdf") ? (
              <embed src={previews[key]} type="application/pdf" width="100%" height="150px" />
            ) : (
              <img src={previews[key]} alt="Preview" className="w-24 h-24 object-cover mt-2" />
            )}
          </div>
        )}

        {progress[key] && (
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${progress[key]}%` }}></div>
          </div>
        )}

        {uploadStatus?.[key] && <p className="text-sm">{uploadStatus[key]}</p>}
      </div>
    ))}

    <button
      onClick={handleSubmit}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
    >
      Submit
    </button>
  </div>
</div>

  
  );
}
