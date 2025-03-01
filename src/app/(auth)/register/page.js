"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getLocation } from "@/utils/getLocation";
import { getCourses } from "@/utils/getCourses";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    student_name: "",
    mobile_number: "",
    email_id: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
    program: "",
    stream: "",
    course: "",
  });

  const [courseData, setCourseData] = useState({});
  const [streams, setStreams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pincodeError, setPincodeError] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    getCourses().then(setCourseData);
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captchaText = "";
    for (let i = 0; i < 6; i++) {
      captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(captchaText);
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setFormData({ ...formData, pincode });
    setPincodeError("");

    if (pincode.length === 6) {
      const location = await getLocation(pincode);
      if (location.city) {
        setFormData((prev) => ({ ...prev, ...location }));
      } else {
        setPincodeError("Invalid Pincode. Please enter a valid one.");
      }
    }
  };

  const handleProgramChange = (e) => {
    const program = e.target.value;
    setFormData({ ...formData, program, stream: "", course: "" });
    setStreams(Object.keys(courseData[program] || {}));
  };

  const handleStreamChange = (e) => {
    const stream = e.target.value;
    setFormData({ ...formData, stream, course: "" });
    setCourses(courseData[formData.program]?.[stream] || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pincodeError) return;

    if (userCaptcha !== captcha) {
      toast.error("Invalid CAPTCHA. Please try again.");
      generateCaptcha();
      return;
    }
    setCaptchaError("");

    try {
      const { data } = await axios.post("/api/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Student registered successfully. Check email for password.");

      // Reset form after successful submission
      setFormData({
        student_name: "",
        mobile_number: "",
        email_id: "",
        pincode: "",
        city: "",
        state: "",
        country: "",
        program: "",
        stream: "",
        course: "",
      });

      setStreams([]);
      setCourses([]);
      setUserCaptcha("");
      setIsAgreed(false);
      generateCaptcha(); // Refresh CAPTCHA after submission
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Something went wrong";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-5 rounded-md shadow-md space-y-1">

      <h2 className="text-1xl font-semibold text-center">Student Registration</h2>

      <input type="text" placeholder="Student Name  *" required value={formData.student_name} onChange={(e) => setFormData({ ...formData, student_name: e.target.value })} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" />

      <input type="text" placeholder="Mobile Number *" required value={formData.mobile_number} onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" />

      <input type="email" placeholder="Email ID  *" required value={formData.email_id} onChange={(e) => setFormData({ ...formData, email_id: e.target.value })} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" />

      <input type="text" placeholder="Pincode  *" required value={formData.pincode} onChange={handlePincodeChange} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" />
      {pincodeError && <p className="text-red-500 text-sm">{pincodeError}</p>}

      <div className="grid grid-cols-3 gap-2">
        <input type="text" placeholder="City" value={formData.city} readOnly className="w-full p-2 border rounded-md bg-gray-100" />
        <input type="text" placeholder="State" value={formData.state} readOnly className="w-full p-2 border rounded-md bg-gray-100" />
        <input type="text" placeholder="Country" value={formData.country} readOnly className="w-full p-2 border rounded-md bg-gray-100" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select onChange={handleProgramChange} required className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
          <option value="">Select Program  *</option>
          {Object.keys(courseData).map((program) => (
            <option key={program} value={program}>{program}</option>
          ))}
        </select>

        <select onChange={handleStreamChange} required disabled={!streams.length} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 disabled:bg-gray-200">
          <option value="">Select Stream  *</option>
          {streams.map((stream) => (
            <option key={stream} value={stream}>{stream}</option>
          ))}
        </select>
      </div>

      <select onChange={(e) => setFormData({ ...formData, course: e.target.value })} required disabled={!courses.length} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 disabled:bg-gray-200">
        <option value="">Select Course  *</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>{course.name}</option>
        ))}
      </select>

      <div className="flex items-center space-x-2">
        <span className="font-bold text-lg">{captcha}</span>
        <button type="button" onClick={generateCaptcha} className="text-blue-500">↻ Refresh</button>
      </div>
      <input type="text" placeholder="Enter CAPTCHA" required value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" />
      {captchaError && <p className="text-red-500 text-sm">{captchaError}</p>}

      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} />
        <span>I agree to the terms and conditions</span>
      </label>

      <button type="submit" disabled={!isAgreed} className={`w-full p-2 rounded-md transition ${isAgreed ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}>
        Register
      </button>
    </form>
  );
}
