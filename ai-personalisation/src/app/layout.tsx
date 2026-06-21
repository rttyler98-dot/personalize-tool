import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 min-h-screen flex flex-col`}>
        {/* Header / Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
              </div>
              <span className="font-bold text-xl tracking-tight">Vivid Ads</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Use Cases</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">API</a>
            </nav>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm font-medium hidden sm:block hover:text-neutral-600 dark:hover:text-neutral-300">Sign in</a>
              <a href="#" className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold px-4 py-2 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
                Get Started
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12 bg-white dark:bg-neutral-900 mt-auto">
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                </div>
                <span className="font-bold text-lg tracking-tight">Vivid Ads</span>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Automated 7-second hyper-personalised SaaS video ads at scale.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Integrations</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">API Reference</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
            <p>© {new Date().getFullYear()} Vivid Ads Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Twitter</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white">GitHub</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white">LinkedIn</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
