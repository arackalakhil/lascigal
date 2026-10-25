'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mediaUrl } from '@/lib/media';

export default function BrandPageManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'branding');

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload to R2 failed');

      setSettings((prev) => ({ ...prev, site_logo: data.path }));
      setSaved(false);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFavicon(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'branding');

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload to R2 failed');

      setSettings((prev) => ({ ...prev, site_favicon: data.path }));
      setSaved(false);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const brandSettings = {
        site_logo: settings.site_logo || '',
        site_favicon: settings.site_favicon || '',
        site_title: settings.site_title || '',
        site_description: settings.site_description || '',
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: brandSettings }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // Response was not JSON
      }

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Your admin session has expired. Please refresh the page and log in again.');
        }
        throw new Error(data?.error || `Failed to update brand settings (Status: ${res.status})`);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      {saved && (
        <div style={{ padding: '14px 20px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '25px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>✓</span>
          <span>Brand Identity & SEO settings saved! Header, footer, and browser tabs are now updated.</span>
        </div>
      )}

      {/* 1. LOGO & FAVICON CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '25px', marginBottom: '30px' }}>
        
        {/* Main Website Logo */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#111827' }}>
              Primary Website Logo
            </h3>
            <span style={{ fontSize: '11px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '3px 8px', borderRadius: '4px' }}>
              Desktop, Mobile & Footer
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 15px' }}>
            The official logo rendered in the top desktop navigation bar, mobile drawer, and footer.
          </p>

          {/* Dark background preview canvas for contrast */}
          <div
            style={{
              width: '100%',
              height: '130px',
              borderRadius: '8px',
              backgroundColor: '#1f2937',
              backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)',
              backgroundSize: '12px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              padding: '12px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(settings['site_logo'] || 'images/laslogo1.png')}
              alt="Brand Logo Preview"
              style={{ maxHeight: '105px', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', color: '#4b5563', marginBottom: '5px' }}>R2 Media Path</label>
            <input
              type="text"
              value={settings['site_logo'] || ''}
              onChange={(e) => handleChange('site_logo', e.target.value)}
              placeholder="images/laslogo1.png"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <label
              style={{
                padding: '9px 18px',
                backgroundColor: '#c5a880',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: uploadingLogo ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{uploadingLogo ? 'Uploading to R2...' : '↑ Upload New Logo'}</span>
              <input
                type="file"
                accept="image/png,image/webp,image/svg+xml,image/jpeg"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                style={{ display: 'none' }}
              />
            </label>
            <span style={{ fontSize: '11.5px', color: '#6b7280' }}>Transparent PNG or WebP recommended</span>
          </div>
        </div>

        {/* Browser Favicon */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#111827' }}>
              Browser Tab Favicon & Bookmark Icon
            </h3>
            <span style={{ fontSize: '11px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '3px 8px', borderRadius: '4px' }}>
              Tabs & Bookmarks
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 15px' }}>
            The tiny icon displayed in browser tabs next to your site title and on mobile bookmarks.
          </p>

          {/* Browser tab mockup preview */}
          <div
            style={{
              width: '100%',
              height: '130px',
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '16px',
              padding: '12px',
            }}
          >
            <div
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '6px 6px 0 0',
                border: '1px solid #334155',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                maxWidth: '260px',
                width: '100%',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(settings['site_favicon'] || 'images/favicons.png')}
                alt="Favicon Preview"
                style={{ width: '22px', height: '22px', objectFit: 'contain' }}
              />
              <span style={{ color: '#e2e8f0', fontSize: '12.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {settings['site_title'] || 'Lascigal Convention Centre'}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', color: '#4b5563', marginBottom: '5px' }}>R2 Media Path</label>
            <input
              type="text"
              value={settings['site_favicon'] || ''}
              onChange={(e) => handleChange('site_favicon', e.target.value)}
              placeholder="images/favicons.png"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <label
              style={{
                padding: '9px 18px',
                backgroundColor: '#c5a880',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: uploadingFavicon ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{uploadingFavicon ? 'Uploading to R2...' : '↑ Upload New Favicon'}</span>
              <input
                type="file"
                accept="image/png,image/x-icon,image/svg+xml,image/webp"
                onChange={handleFaviconUpload}
                disabled={uploadingFavicon}
                style={{ display: 'none' }}
              />
            </label>
            <span style={{ fontSize: '11.5px', color: '#6b7280' }}>Square PNG or ICO (32x32 to 128x128)</span>
          </div>
        </div>
      </div>

      {/* 2. SEO TITLE & META DESCRIPTION */}
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
          🔍 Global SEO Title & Meta Description
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#6b7280' }}>
          How your website appears in Google search results and browser title bars.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Site Title (Browser Tab & Search Title)
            </label>
            <input
              type="text"
              value={settings['site_title'] || ''}
              onChange={(e) => handleChange('site_title', e.target.value)}
              placeholder="e.g. Lascigal Convention Centre | Kalampoor, Muvattupuzha"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Meta Description (Google Snippet)
            </label>
            <textarea
              rows={3}
              value={settings['site_description'] || ''}
              onChange={(e) => handleChange('site_description', e.target.value)}
              placeholder="e.g. Lascigal Convention Centre offers spacious air-conditioned halls..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', lineHeight: 1.5 }}
            ></textarea>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={saving || uploadingLogo || uploadingFavicon}
        style={{
          padding: '14px 40px',
          backgroundColor: '#c5a880',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 8px rgba(197, 168, 128, 0.3)',
        }}
      >
        {saving ? 'Publishing Changes...' : 'Save & Publish Brand Identity'}
      </button>
    </form>
  );
}
