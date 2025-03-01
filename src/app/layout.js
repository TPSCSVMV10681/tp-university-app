import { ToastContainer } from "react-toastify";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/app/(auth)/login/AuthContext"; // ✅ Named Import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SCSVMV Admission",
  description: "Powered by IT TEAM SCSVMV",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider> {/* ✅ Wrap the entire app inside AuthProvider */}
          <Navbar />
          {children}
          <ToastContainer position="top-right" autoClose={5000} />
        </AuthProvider>
      </body>
    </html>
  );
}
