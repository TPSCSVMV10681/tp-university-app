"use client";

import { useState, useEffect } from "react";
import RegisterForm from "./(auth)/register/page";
import Image from "next/image";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const images = [
  { src: "https://kanchiuniv.ac.in/wp-content/uploads/2025/02/DSC_4529.jpg", caption: "28th Convocation" },
  { src: "https://kanchiuniv.ac.in/wp-content/uploads/2025/02/DSC_0262-2-scaled.jpg", caption: "Hara Hara Sankara Jaya Jaya Sankara" },
 
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null; // Prevents hydration mismatch

  return (
    <div className="flex flex-col items-center min-h-screen p-3 bg-gray-100">
      {/* Image Slider & Registration Form */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-6/7 gap-5">
        
        {/* Image Slider */}
        <div className="w-full md:w-1/1 flex flex-col items-center">
          <motion.div
            className="relative w-full max-w-6xl h-[250px] md:h-[700px] overflow-hidden rounded-xl shadow-lg"
            animate={{ opacity: [0, 1], scale: [0.9, 1] }}
            transition={{ duration: 1 }}
          >
            <Image
              src={images[currentImage].src}
              alt="Campus"
              width={1000}
              height={800}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs md:text-base">
              {images[currentImage].caption}
            </div>
          </motion.div>
        </div>

        {/* Registration Form */}
        <motion.div
          className="w-full md:w-1/3 p-3 bg-white rounded-xl shadow-xl"
          animate={{ x: [50, 0], opacity: [0, 1] }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-lg md:text-xl font-bold text-blue-500 mb-3 text-center glow-text">
            Admission Open 2025-2026
          </h1>
          <RegisterForm />
        </motion.div>
      </div>

      {/* Courses Offered Accordion */}
      <motion.div
        className="w-full md:w-3/4 mt-8"
        animate={{ x: [-50, 0], opacity: [0, 1] }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-lg md:text-2xl font-bold text-center mb-4">Courses Offered</h2>
        <Accordion.Root type="single" collapsible className="w-full">
          {[
            { id: "engineering", title: "Engineering", content: "B.E, M.E, PhD" },
            { id: "management", title: "Management", content: "BBA, MBA" },
          ].map(({ id, title, content }) => (
            <Accordion.Item key={id} value={id}>
              <Accordion.Header>
                <Accordion.Trigger className="p-3 w-full flex justify-between items-center bg-gray-200 hover:bg-gray-300 rounded-lg text-sm md:text-base">
                  {title} <ChevronDownIcon className="w-4 h-4 md:w-5 md:h-5" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="p-3 bg-white rounded-lg text-sm md:text-base">
                {content}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </motion.div>

      {/* Fees Structure Table */}
      <motion.div
        className="w-full md:w-3/4 mt-8 overflow-x-auto"
        animate={{ x: [-50, 0], opacity: [0, 1] }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-lg md:text-2xl font-bold text-center mb-4">Fees Structure</h2>
        <table className="w-full bg-white rounded-xl shadow-lg">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm md:text-base">
            <tr>
              <th className="p-2 md:p-3">Course</th>
              <th className="p-2 md:p-3">Duration</th>
              <th className="p-2 md:p-3">Fees (INR)</th>
            </tr>
          </thead>
          <tbody className="text-center text-sm md:text-base">
            {[
              { course: "B.Tech", duration: "4 Years", fees: "₹1,50,000/year" },
              { course: "MBA", duration: "2 Years", fees: "₹2,00,000/year" },
            ].map(({ course, duration, fees }, index) => (
              <motion.tr
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-100 hover:bg-gray-200 transition-all"
              >
                <td className="p-2 md:p-3 font-semibold">{course}</td>
                <td className="p-2 md:p-3">{duration}</td>
                <td className="p-2 md:p-3 text-green-600 font-bold">{fees}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
