"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/(auth)/login/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  // Conditionally render navigation links
  const navLinks = [
    { name: "Home", href: "/" },
    !user && { name: "Login", href: "/login" }, // Hide login when user is logged in
    !user && { name: "Employee Login", href: "/employeeLogin" }, // Hide emplogin when user is logged in
    
  ].filter(Boolean); // Remove null values

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* Logo + Heading */}
        <div className="flex items-center space-x-3">
          <Image
            src="https://kanchiuniv.ac.in/wp-content/uploads/2020/09/logo_bl.png"
            alt="University Logo"
            width={70}
            height={30}
            className="rounded-full"
          />
          <motion.h1
            className="text-lg md:text-2xl font-bold text-white uppercase hidden sm:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              textShadow: `0 0 8px rgba(255, 255, 255, 0.8), 
                          0 0 16px rgba(255, 255, 255, 0.6), 
                          0 0 24px rgba(255, 255, 255, 0.4), 
                          2px 2px 6px rgba(0, 0, 0, 0.3)`
            }}
          >
            Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya
          </motion.h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-gray-300 transition ${
                pathname === link.href ? "border-b-2 border-white" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Show Logout button if user is logged in */}
          {user && (
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu (Full-screen) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed top-0 left-0 w-full h-full bg-blue-700 flex flex-col items-center justify-center space-y-6 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 text-xl text-white hover:text-gray-300 transition ${
                  pathname === link.href ? "border-b-2 border-white" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Show Logout button if user is logged in */}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false); // Close menu after logout
                }}
                className="bg-red-500 px-6 py-2 rounded hover:bg-red-600 transition text-xl"
              >
                Logout
              </button>
            )}

            {/* Close Button */}
            <button
              className="absolute top-5 right-5 text-white"
              onClick={() => setIsOpen(false)}
            >
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
