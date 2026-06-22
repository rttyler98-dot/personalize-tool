import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vivid Ads - AI Video Personalisation",
  description: "Generate 7-second hyper-personalised SaaS video ads using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Enforcing dark mode by default for that "expensive" look, or a very deep custom dark background
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col selection:bg-blue-500/30 selection:text-blue-200`}>
        {/* Ambient Background Glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]" />
        </div>

        <Header />

        {/* Main Content */}
        <div className="flex-1 relative z-10 flex flex-col pt-16">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}
