'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mediaUrl } from '@/lib/media';

export default function HomePageManager({ initialSettings }: { initialSettings: Record<string, string> }) {
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
      // Isolate only home page settings to keep the payload minimal & fast
      const homeSettings = {
        hero_heading: settings.hero_heading || '',
        hero_subheading: settings.hero_subheading || '',
        hero_image: settings.hero_image || '',
        offer_banner_text: settings.offer_banner_text || '',
        about_heading: settings.about_heading || '',
        about_text: settings.about_text || '',
        about_image: settings.about_image || '',
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: homeSettings }),
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
        throw new Error(data?.error || `Failed to save Home Page settings (Status: ${res.status})`);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      {/* Top Banner Status */}
      {saved && (
        <div style={{ padding: '14px 20px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '25px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>✓</span>
          <span>Home Page content successfully updated and published! Changes are immediately live on the website.</span>
        </div>
      )}

      {/* 1. HERO BANNER SECTION */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '25px', border: '1px solid #e5e7eb', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
              🖼 Hero Banner & Main Headings
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#6b7280' }}>
              The very first visual and message visitors see when they land on your website.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            style={{ fontSize: '12.5px', color: '#c5a880', fontWeight: 600, textDecoration: 'none', border: '1px solid #c5a880', padding: '6px 12px', borderRadius: '5px' }}
          >
            ↗ Preview Live
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Hero Subtitle / Tagline</label>
            <input
              type="text"
              value={settings['hero_subheading'] || ''}
              onChange={(e) => handleChange('hero_subheading', e.target.value)}
              placeholder="e.g. Welcome to Lascigal"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Hero Main Headline</label>
            <input
              type="text"
              value={settings['hero_heading'] || ''}
              onChange={(e) => handleChange('hero_heading', e.target.value)}
              placeholder="e.g. Creating Unforgettable Moments for Every Occasion"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Hero Background Image */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
            Hero Banner Background Photo (Stored on Cloudflare R2)
          </label>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '220px', height: '125px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#1f2937', position: 'relative', border: '1px solid #e5e7eb' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(settings['hero_image'] || 'images/gallery/DSC01156.jpg.webp')}
                alt="Hero Banner Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  value={settings['hero_image'] || ''}
                  onChange={(e) => handleChange('hero_image', e.target.value)}
                  placeholder="images/gallery/DSC01156.jpg.webp"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#c5a880',
                    color: '#fff',
                    borderRadius: '6px',
                    fontSize: '13px',
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
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Recommended: High-res landscape image (1920x1080)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GOLD DISCOUNT ANNOUNCEMENT */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '25px', border: '1px solid #e5e7eb', marginBottom: '25px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
          📢 Gold Discount & Offer Banner
        </h3>
        <p style={{ margin: '0 0 15px', fontSize: '13.5px', color: '#6b7280' }}>
          The prominent golden highlight strip displayed right under the hero section.
        </p>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Offer Text / Promotional Hook</label>
          <input
            type="text"
            value={settings['offer_banner_text'] || ''}
            onChange={(e) => handleChange('offer_banner_text', e.target.value)}
            placeholder="e.g. “Exclusive Deal: Reserve your spot today & save big with our limited-time discount!”"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
          />
        </div>
      </div>

      {/* 3. HOMEPAGE ABOUT STORY & ARCHITECTURE */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '25px', border: '1px solid #e5e7eb', marginBottom: '25px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
          🏛 Homepage About Section (Story & Architecture)
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#6b7280' }}>
          The introduction story and architectural showcase image on the front page.
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Section Heading</label>
          <input
            type="text"
            value={settings['about_heading'] || ''}
            onChange={(e) => handleChange('about_heading', e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>About Story Body</label>
          <textarea
            rows={5}
            value={settings['about_text'] || ''}
            onChange={(e) => handleChange('about_text', e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', lineHeight: 1.5 }}
          ></textarea>
        </div>

        {/* About Architecture Image */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
            Architecture Showcase Photo
          </label>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '220px', height: '125px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#e5e7eb', position: 'relative', border: '1px solid #d1d5db' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(settings['about_image'] || 'images/gallery/FRONT_VIEW.jpeg')}
                alt="Architecture Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  value={settings['about_image'] || ''}
                  onChange={(e) => handleChange('about_image', e.target.value)}
                  placeholder="images/gallery/FRONT_VIEW.jpeg"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#c5a880',
                    color: '#fff',
                    borderRadius: '6px',
                    fontSize: '13px',
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

      {/* 4. HOMEPAGE FACILITIES & AMENITIES (World-Class Infrastructure) */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '25px', border: '1px solid #e5e7eb', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Homepage Section
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#111827' }}>
                🏛 Facilities &amp; Amenities (World-Class Infrastructure)
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#6b7280', maxWidth: '640px' }}>
              Add new facility cards, update titles, upload photos to Cloudflare R2, customize icons, change display order, or remove amenities.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href="/admin/facilities"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: '#1e293b',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <span>+ Add &amp; Manage Facilities</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5. SHORTCUTS TO OTHER HOMEPAGE MODULES */}
      <div style={{ backgroundColor: '#f0f4f8', borderRadius: '10px', padding: '20px 25px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
            Featured Events &amp; Services on the Homepage
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Weddings, Receptions, Corporate Summits, Banquets, and Cultural Celebrations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href="/admin/events"
            style={{ padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#334155', textDecoration: 'none' }}
          >
            📅 Edit Event Services
          </Link>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
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
          boxShadow: '0 2px 8px rgba(197, 168, 128, 0.3)',
        }}
      >
        {saving ? 'Publishing Changes...' : 'Save & Publish Home Page Changes'}
      </button>
    </form>
  );
}
