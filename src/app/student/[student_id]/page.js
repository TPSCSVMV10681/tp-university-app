"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function StudentProfile() {
  const { student_id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    mobile: "",
    alternateMobile: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    address: "",
    physics: "",
    chemistry: "",
    maths: "",
    computer: "",
    percentage: "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
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

    if (student_id) fetchStudent();
  }, [student_id]);

  if (loading) return <p>Loading...</p>;
  if (!student) return <p>Student not found</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    const updatedFormData = { ...formData, [name]: value };
  
    // Extract marks and calculate percentage
    const physics = parseFloat(updatedFormData.physics) || 0;
    const chemistry = parseFloat(updatedFormData.chemistry) || 0;
    const maths = parseFloat(updatedFormData.maths) || 0;
    const computer = parseFloat(updatedFormData.computer) || 0;
  
    const totalMarks = physics + chemistry + maths + computer;
    const percentage = (totalMarks / 400) * 100; // Divide by 400 and multiply by 100
  
    // Update form state with the calculated percentage
    setFormData({ ...updatedFormData, percentage: percentage.toFixed(2) });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-5">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full border-2 border-yellow-400">
        {/* Student Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-indigo-600">Welcome, {student.student_name}!</h2>
          <p className="text-gray-700">
            <span className="font-semibold text-yellow-600">Reg. ID:</span> {student.student_id} <br />
            <span className="text-green-600 font-semibold">Registered on:</span>{" "}
            <span className="text-pink-600 font-bold">{new Date(student.created_at).toLocaleDateString()}</span>
          </p>
        </div>

        {/* Form */}
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Personal Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
   
            <div>
              <label className="block text-gray-700 font-medium">First Name *</label>
              <input type="text" name="firstName" value={student.student_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" readOnly />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email Address *</label>
              <input type="email" name="email" value={student.email_id} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" readOnly />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Mobile Number *</label>
              <input type="text" name="mobile" value={student.mobile_number} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" readOnly />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Alternate Mobile Number</label>
              <input type="text" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Date Of Birth *</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Select</option>
                <option>A+</option>
                <option>B+</option>
                <option>O+</option>
                <option>AB+</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" rows="3"></textarea>
          </div>

          {/* Academic Details */}
          <h2 className="text-lg font-semibold text-blue-600 mt-6">Academic Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Physics</label>
              <input type="text" name="physics" value={formData.physics} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Chemistry</label>
              <input type="text" name="chemistry" value={formData.chemistry} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Maths</label>
              <input type="text" name="maths" value={formData.maths} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Computer</label>
              <input type="text" name="computer" value={formData.computer} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
            <label className="block text-gray-700 font-medium">Percentage</label>
            <input type="text" name="percentage" value={formData.percentage} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>

          </div>
      
          {/* Buttons */}
          <div className="flex justify-between mt-6">
        
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save & Next</button>
          </div>
        </form>
      </div>
    </div>
  );
}
