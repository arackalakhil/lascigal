'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mediaUrl } from '@/lib/media';

export default function SettingsManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
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

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'banners');

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload to R2 failed');

      setSettings((prev) => ({ ...prev, hero_image: data.path }));
      setSaved(false);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleAboutUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAbout(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'banners');

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload to R2 failed');

      setSettings((prev) => ({ ...prev, about_image: data.path }));
      setSaved(false);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingAbout(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
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
        throw new Error(data?.error || `Failed to update settings (Status: ${res.status})`);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '30px', border: '1px solid #e5e7eb' }}>
      {saved && (
        <div style={{ padding: '14px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '25px', fontWeight: 500 }}>
          ✓ All changes saved and published! Public pages are instantly updated.
        </div>
      )}

      {/* 0. BRAND IDENTITY: LOGO & FAVICON */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '2px solid #c5a880', paddingBottom: '8px', marginBottom: '20px', color: '#1f2937' }}>
        👑 Brand Identity (Logo, Favicon & Site Title)
      </h3>

      <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px', marginBottom: '35px', border: '1px solid #f0f0f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '25px' }}>
          
          {/* Main Website Logo */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                Primary Website Logo
              </label>
              <span style={{ fontSize: '11px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '3px 8px', borderRadius: '4px' }}>
                Header & Footer
              </span>
            </div>

            {/* Dark background preview card so white/gold logos are visible */}
            <div
              style={{
                width: '100%',
                height: '110px',
                borderRadius: '6px',
                backgroundColor: '#1f2937',
                backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)',
                backgroundSize: '12px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px',
                padding: '10px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(settings['site_logo'] || 'images/laslogo1.png')}
                alt="Brand Logo Preview"
                style={{ maxHeight: '90px', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '4px' }}>R2 Relative Path</label>
              <input
                type="text"
                value={settings['site_logo'] || ''}
                onChange={(e) => handleChange('site_logo', e.target.value)}
                placeholder="images/laslogo1.png"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <label
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#c5a880',
                  color: '#fff',
                  borderRadius: '5px',
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
              <span style={{ fontSize: '11px', color: '#6b7280' }}>Transparent PNG/WebP recommended</span>
            </div>
          </div>

          {/* Browser Favicon */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                Browser Favicon & App Icon
              </label>
              <span style={{ fontSize: '11px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '3px 8px', borderRadius: '4px' }}>
                Browser Tabs & Bookmarks
              </span>
            </div>

            {/* Browser tab mockup preview */}
            <div
              style={{
                width: '100%',
                height: '110px',
                borderRadius: '6px',
                backgroundColor: '#0f172a',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '15px',
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
                  maxWidth: '240px',
                  width: '100%',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(settings['site_favicon'] || 'images/favicons.png')}
                  alt="Favicon Preview"
                  style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                />
                <span style={{ color: '#e2e8f0', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {settings['site_title'] || 'Lascigal Convention Centre'}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '4px' }}>R2 Relative Path</label>
              <input
                type="text"
                value={settings['site_favicon'] || ''}
                onChange={(e) => handleChange('site_favicon', e.target.value)}
                placeholder="images/favicons.png"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <label
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#c5a880',
                  color: '#fff',
                  borderRadius: '5px',
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
              <span style={{ fontSize: '11px', color: '#6b7280' }}>Square PNG or ICO (32x32 to 128x128)</span>
            </div>
          </div>
        </div>

        {/* Global SEO Title & Description */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Site Title (Browser Tab & SEO)</label>
            <input
              type="text"
              value={settings['site_title'] || ''}
              onChange={(e) => handleChange('site_title', e.target.value)}
              placeholder="e.g. Lascigal Convention Centre | Kalampoor, Muvattupuzha"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Site Meta Description (Google Search Result)</label>
            <input
              type="text"
              value={settings['site_description'] || ''}
              onChange={(e) => handleChange('site_description', e.target.value)}
              placeholder="e.g. Lascigal Convention Centre offers spacious halls..."
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>
        </div>
      </div>

      {/* 1. HOMEPAGE HERO BANNER */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '2px solid #c5a880', paddingBottom: '8px', marginBottom: '20px', color: '#1f2937' }}>
        🖼 Homepage Hero Banner & Main Headings
      </h3>

      <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Hero Subheading / Tagline</label>
            <input
              type="text"
              value={settings['hero_subheading'] || ''}
              onChange={(e) => handleChange('hero_subheading', e.target.value)}
              placeholder="e.g. Welcome to Lascigal"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Hero Main Heading</label>
            <input
              type="text"
              value={settings['hero_heading'] || ''}
              onChange={(e) => handleChange('hero_heading', e.target.value)}
              placeholder="e.g. Creating Unforgettable Moments for Every Occasion"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>
        </div>

        {/* Hero Image & Upload */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
            Hero Banner Background Photo
          </label>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '180px', height: '110px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#e5e7eb' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(settings['hero_image'] || 'images/gallery/DSC01156.jpg.webp')}
                alt="Hero Banner Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={settings['hero_image'] || ''}
                onChange={(e) => handleChange('hero_image', e.target.value)}
                placeholder="images/gallery/DSC01156.jpg.webp"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', marginBottom: '8px' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label
                  style={{
                    padding: '6px 14px',
                    backgroundColor: '#c5a880',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: uploadingHero ? 'not-allowed' : 'pointer',
                    display: 'inline-block',
                  }}
                >
                  {uploadingHero ? 'Uploading to R2...' : '↑ Upload New Banner Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroUpload}
                    disabled={uploadingHero}
                    style={{ display: 'none' }}
                  />
                </label>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Uploads directly to Cloudflare R2 bucket</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ANNOUNCEMENT & DISCOUNT OFFER */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '2px solid #c5a880', paddingBottom: '8px', marginBottom: '20px', color: '#1f2937' }}>
        📢 Announcement & Discount Banner
      </h3>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Gold Discount Banner Text</label>
        <input
          type="text"
          value={settings['offer_banner_text'] || ''}
          onChange={(e) => handleChange('offer_banner_text', e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
      </div>

      {/* 3. ABOUT SECTION ON HOMEPAGE */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '2px solid #c5a880', paddingBottom: '8px', marginBottom: '20px', color: '#1f2937' }}>
        🏛 About Section (Homepage & Story)
      </h3>

      <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>About Section Heading</label>
          <input
            type="text"
            value={settings['about_heading'] || ''}
            onChange={(e) => handleChange('about_heading', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>About Section Body Text</label>
          <textarea
            rows={4}
            value={settings['about_text'] || ''}
            onChange={(e) => handleChange('about_text', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          ></textarea>
        </div>

        {/* About Photo */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
            About Section Architecture Photo
          </label>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '180px', height: '110px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#e5e7eb' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(settings['about_image'] || 'images/gallery/FRONT_VIEW.jpeg')}
                alt="About Architecture Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={settings['about_image'] || ''}
                onChange={(e) => handleChange('about_image', e.target.value)}
                placeholder="images/gallery/FRONT_VIEW.jpeg"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', marginBottom: '8px' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label
                  style={{
                    padding: '6px 14px',
                    backgroundColor: '#c5a880',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: uploadingAbout ? 'not-allowed' : 'pointer',
                    display: 'inline-block',
                  }}
                >
                  {uploadingAbout ? 'Uploading to R2...' : '↑ Upload New Architecture Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAboutUpload}
                    disabled={uploadingAbout}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DIRECTOR'S WORD (ABOUT PAGE) */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '2px solid #c5a880', paddingBottom: '8px', marginBottom: '20px', color: '#1f2937' }}>
        💼 Director&apos;s Word & Showcase Video (About Page)
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Director Section Title</label>
        <input
          type="text"
          value={settings['director_title'] || ''}
          onChange={(e) => handleChange('director_title', e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Director Message (Full Paragraphs)</label>
        <textarea
          rows={6}
          value={settings['director_message'] || ''}
          onChange={(e) => handleChange('director_message', e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        ></textarea>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>YouTube Embed URL</label>
        <input
          type="text"
          value={settings['director_video_url'] || ''}
          onChange={(e) => handleChange('director_video_url', e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
      </div>

      {/* 5. CONTACT & PHONES */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '2px solid #c5a880', paddingBottom: '8px', marginBottom: '20px', color: '#1f2937' }}>
        📞 Contact Details & Booking Channels
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Primary Phone (Call & Header)</label>
          <input
            type="text"
            value={settings['phone_primary'] || ''}
            onChange={(e) => handleChange('phone_primary', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Secondary Phone</label>
          <input
            type="text"
            value={settings['phone_secondary'] || ''}
            onChange={(e) => handleChange('phone_secondary', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>WhatsApp (Include country code e.g. 91...)</label>
          <input
            type="text"
            value={settings['whatsapp_number'] || ''}
            onChange={(e) => handleChange('whatsapp_number', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
          <input
            type="email"
            value={settings['email_address'] || ''}
            onChange={(e) => handleChange('email_address', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>
      </div>

      {/* 6. LOCATION & MAPS */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '2px solid #c5a880', paddingBottom: '8px', marginBottom: '20px', color: '#1f2937' }}>
        📍 Location & Address
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Address</label>
          <input
            type="text"
            value={settings['address_line1'] || ''}
            onChange={(e) => handleChange('address_line1', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Pincode</label>
          <input
            type="text"
            value={settings['address_pincode'] || ''}
            onChange={(e) => handleChange('address_pincode', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Google Maps Link (Tap to locate)</label>
          <input
            type="text"
            value={settings['google_maps_url'] || ''}
            onChange={(e) => handleChange('google_maps_url', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Google Maps Embed Iframe URL</label>
          <input
            type="text"
            value={settings['google_maps_embed'] || ''}
            onChange={(e) => handleChange('google_maps_embed', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || uploadingHero || uploadingAbout || uploadingLogo || uploadingFavicon}
        style={{
          padding: '14px 40px',
          backgroundColor: '#c5a880',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
        }}
      >
        {saving ? 'Publishing Changes...' : 'Save & Publish All Site Changes'}
      </button>
    </form>
  );
}
