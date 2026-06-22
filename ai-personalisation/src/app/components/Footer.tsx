import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-16 bg-black relative z-10 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Vivid Ads</span>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
            Automated 7-second hyper-personalised SaaS video ads at scale.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Product</h3>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} Vivid Ads Inc. All rights reserved.</p>
        <div className="flex gap-6 mt-6 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
