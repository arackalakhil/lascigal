'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MobileNavProps {
  phone1: string;
  phone2: string;
  whatsapp: string;
}

export default function MobileNav({ phone1, phone2, whatsapp }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <>
      <div className="header_mobile">
        <div className="content_wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
          <div
            className="menu_button fas fa-bars"
            onClick={toggle}
            style={{ fontSize: '24px', cursor: 'pointer', color: '#2c2c2c' }}
          ></div>

          <div className="logo">
            <Link href="/" onClick={close}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/laslogo1.png" alt="Lascigal Logo" style={{ height: '70px', width: 'auto' }} />
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <a href={`tel:${phone1}`} style={{ color: '#2c2c2c', fontSize: '18px' }} aria-label="Call phone">
              <i className="fas fa-phone"></i>
            </a>
            <a
              href={`https://wa.me/${whatsapp}?text=We%20are%20looking%20for%20convention%20center`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#25D366', fontSize: '22px' }}
              aria-label="WhatsApp"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        {/* Side wrap Drawer */}
        <div
          className={`side_wrap ${isOpen ? 'open' : ''}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            backgroundColor: '#1b1b1b',
            zIndex: 99999,
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
            padding: '25px',
            boxShadow: isOpen ? '5px 0 25px rgba(0,0,0,0.5)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              className="close"
              onClick={close}
              style={{
                color: '#fff',
                fontSize: '20px',
                textAlign: 'right',
                cursor: 'pointer',
                marginBottom: '20px',
              }}
            >
              ✕ Close
            </div>

            <nav className="menu_main_nav_area">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { name: 'Home', href: '/' },
                  { name: 'About', href: '/aboutus' },
                  { name: 'Gallery', href: '/gallery' },
                  { name: 'Portfolio', href: '/portfolio' },
                  { name: 'Contact Us', href: '/contactus' },
                ].map((item) => (
                  <li key={item.href} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '12px 0' }}>
                    <Link
                      href={item.href}
                      onClick={close}
                      style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', fontWeight: 500 }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="panel_middle" style={{ marginTop: '30px', color: '#fff', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <i className="fas fa-phone" style={{ color: '#c5a880' }}></i>
              <a href={`tel:${phone1}`} style={{ color: '#fff', textDecoration: 'none' }}>
                {phone1}
              </a>
              <span>/</span>
              <a href={`tel:${phone2}`} style={{ color: '#fff', textDecoration: 'none' }}>
                {phone2}
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
              <a
                href={`https://wa.me/${whatsapp}?text=We%20are%20looking%20for%20convention%20center`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Mask overlay */}
        {isOpen && (
          <div
            onClick={close}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 99998,
            }}
          ></div>
        )}
      </div>
    </>
  );
}
