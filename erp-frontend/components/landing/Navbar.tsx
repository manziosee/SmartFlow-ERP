'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className={`font-bold text-xl tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              SmartFlow<span className="text-cyan-400"> ERP</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                  isScrolled ? 'text-slate-600' : 'text-white/80'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
            >
              Start Free Trial
            </Link>
          </div>

          <button
            className={`md:hidden p-2 rounded-lg ${isScrolled ? 'text-slate-700' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 pb-1 flex flex-col gap-2">
              <Link href="/login" className="text-center px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg">
                Sign In
              </Link>
              <Link href="/register" className="text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
