'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AdminNav({ sessionUser }: { sessionUser: string }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') return null;

  const navLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Events / Portfolio', href: '/admin/events' },
    { name: 'Facilities', href: '/admin/facilities' },
    { name: 'Gallery', href: '/admin/gallery' },
    { name: 'Booking Inbox', href: '/admin/inbox' },
    { name: 'Site Settings & Banners', href: '/admin/settings' },
    { name: 'Media Uploads', href: '/admin/media' },
  ];

  return (
    <header
      style={{
        backgroundColor: '#1b1b1b',
        color: '#fff',
        borderBottom: '1px solid #333',
        padding: '0 25px',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '65px',
          flexWrap: 'wrap',
          gap: '15px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/laslogo1.png" alt="Logo" style={{ height: '40px', width: 'auto' }} />
            <span style={{ fontWeight: 600, fontSize: '17px', letterSpacing: '0.5px' }}>Lascigal Admin</span>
          </Link>

          <nav style={{ display: 'flex', gap: '8px', marginLeft: '10px', flexWrap: 'wrap' }}>
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: active ? '#fff' : '#aaa',
                    backgroundColor: active ? '#333' : 'transparent',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              color: '#c5a880',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              padding: '6px 12px',
              border: '1px solid rgba(197, 168, 128, 0.4)',
              borderRadius: '4px',
            }}
          >
            ↗ Public Site
          </Link>

          <span style={{ fontSize: '13px', color: '#888' }}>{sessionUser}</span>

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            style={{
              backgroundColor: '#dc2626',
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
