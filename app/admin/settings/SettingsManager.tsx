'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
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
        <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '20px' }}>
          ✓ Settings saved successfully! Public pages are updated.
        </div>
      )}

      <h3 style={{ fontSize: '17px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        📞 Contact Information
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Primary Phone</label>
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
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>WhatsApp (Include Country Code)</label>
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

      <h3 style={{ fontSize: '17px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        📍 Location & Address
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Address Line</label>
          <input
            type="text"
            value={settings['address_line1'] || ''}
            onChange={(e) => handleChange('address_line1', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Pincode / Postal Code</label>
          <input
            type="text"
            value={settings['address_pincode'] || ''}
            onChange={(e) => handleChange('address_pincode', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Google Maps Link (for Tap to locate)</label>
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

      <h3 style={{ fontSize: '17px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        📢 Announcements & Homepage Offer
      </h3>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Discount Banner Announcement</label>
        <input
          type="text"
          value={settings['offer_banner_text'] || ''}
          onChange={(e) => handleChange('offer_banner_text', e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
      </div>

      <h3 style={{ fontSize: '17px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        💼 Director&apos;s Message (About Page)
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Director Section Heading</label>
        <input
          type="text"
          value={settings['director_title'] || ''}
          onChange={(e) => handleChange('director_title', e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Director Message Body</label>
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

      <button
        type="submit"
        disabled={saving}
        style={{
          padding: '12px 32px',
          backgroundColor: '#c5a880',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '15px',
          fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
        }}
      >
        {saving ? 'Saving Changes...' : 'Save All Settings'}
      </button>
    </form>
  );
}
