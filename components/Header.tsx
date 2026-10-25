'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mediaUrl } from '@/lib/media';

interface HeaderProps {
  phone1?: string;
  phone2?: string;
  whatsapp?: string;
  mapsUrl?: string;
  logo?: string;
}

export default function Header({
  phone1 = '7306107515',
  phone2 = '9745897834',
  whatsapp = '917306107515',
  mapsUrl = 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8',
  logo = 'images/laslogo1.png',
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/aboutus' },
    { name: 'Facilities', href: '/#facilities' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact Us', href: '/contactus' },
  ];

  return (
    <>
      {/* 1. TOP UTILITY BAR (Desktop & Tablet) */}
      <div className="las_top_utility_bar">
        <div className="las_container las_utility_inner">
          <div className="las_utility_left">
            <span className="las_utility_item">
              <i className="fas fa-phone"></i>
              <a href={`tel:${phone1}`}>{phone1}</a>
              <span className="las_sep">/</span>
              <a href={`tel:${phone2}`}>{phone2}</a>
            </span>
            <span className="las_utility_item las_hide_sm">
              <i className="fa-solid fa-location-dot" style={{ color: '#c5a880' }}></i>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                Kalampoor, Muvattupuzha
              </a>
            </span>
          </div>

          <div className="las_utility_right">
            <a
              href={`https://wa.me/${whatsapp}?text=Hello%20Lascigal%20Convention%20Centre,%20I%20would%20like%20to%20inquire%20about%20booking%20the%20venue.`}
              target="_blank"
              rel="noopener noreferrer"
              className="las_utility_whatsapp"
            >
              <i className="fab fa-whatsapp"></i>
              <span>WhatsApp Us</span>
            </a>
            <Link href="/admin" className="las_utility_admin_pill">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN STICKY NAVIGATION BAR */}
      <header className={`las_navbar_wrap ${scrolled ? 'las_navbar_scrolled' : ''}`}>
        <div className="las_container las_navbar_inner">
          {/* Brand Logo */}
          <Link href="/" className="las_brand_logo" aria-label="Lascigal Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(logo)}
              alt="Lascigal Convention Centre Logo"
              className="las_logo_img"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="las_desktop_nav" aria-label="Main Navigation">
            <ul className="las_nav_list">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name} className="las_nav_item">
                    <Link
                      href={link.href}
                      className={`las_nav_link ${isActive ? 'las_nav_active' : ''}`}
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="las_nav_actions">
            <Link href="/contactus" className="las_btn_book_cta">
              <span>Book Venue</span>
              <i className="fas fa-calendar-check"></i>
            </Link>

            {/* Mobile Action Icons */}
            <a
              href={`tel:${phone1}`}
              className="las_mobile_action_btn"
              aria-label="Call Lascigal"
            >
              <i className="fas fa-phone"></i>
            </a>

            <a
              href={`https://wa.me/${whatsapp}?text=Hello%20Lascigal%20Convention%20Centre`}
              target="_blank"
              rel="noopener noreferrer"
              className="las_mobile_action_btn las_mobile_whatsapp"
              aria-label="WhatsApp Chat"
            >
              <i className="fab fa-whatsapp"></i>
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="las_hamburger_btn"
              aria-label="Open Navigation Menu"
            >
              <span className="las_bar"></span>
              <span className="las_bar"></span>
              <span className="las_bar"></span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. MOBILE SLIDING DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="las_mobile_drawer_backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="las_mobile_drawer_content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Header */}
            <div className="las_drawer_header">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="las_drawer_logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mediaUrl(logo)} alt="Lascigal Logo" style={{ height: '50px', width: 'auto' }} />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="las_drawer_close_btn"
                aria-label="Close Navigation"
              >
                ✕
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="las_drawer_nav">
              <ul>
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={pathname === link.href ? 'active' : ''}
                    >
                      <span>{link.name}</span>
                      <i className="fas fa-chevron-right"></i>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Drawer Bottom Actions */}
            <div className="las_drawer_footer">
              <Link
                href="/contactus"
                onClick={() => setMobileMenuOpen(false)}
                className="las_drawer_cta"
              >
                Book Your Event Now
              </Link>

              <div className="las_drawer_contact_box">
                <div className="las_drawer_contact_row">
                  <i className="fas fa-phone" style={{ color: '#c5a880' }}></i>
                  <a href={`tel:${phone1}`}>{phone1}</a>
                  <span>/</span>
                  <a href={`tel:${phone2}`}>{phone2}</a>
                </div>

                <div className="las_drawer_contact_row">
                  <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
                  <a
                    href={`https://wa.me/${whatsapp}?text=We%20are%20looking%20for%20convention%20center`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat on WhatsApp
                  </a>
                </div>

                <div className="las_drawer_contact_row">
                  <i className="fa-solid fa-location-dot" style={{ color: '#c5a880' }}></i>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    Kalampoor, Muvattupuzha
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
      </>
  );
}
