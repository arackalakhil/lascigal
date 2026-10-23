'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mediaUrl } from '@/lib/media';

export default function SettingsManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
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
      if (!res.ok) throw new Error('Failed to update settings');

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
        disabled={saving || uploadingHero || uploadingAbout}
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
