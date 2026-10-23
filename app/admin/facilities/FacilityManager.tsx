'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mediaUrl } from '@/lib/media';

interface FacilityData {
  id: string;
  title: string;
  description: string | null;
  image: string;
  icon: string | null;
  order: number;
}

export default function FacilityManager({ initialFacilities }: { initialFacilities: FacilityData[] }) {
  const router = useRouter();
  const [facilities, setFacilities] = useState<FacilityData[]>(initialFacilities);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FacilityData>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const startEdit = (f: FacilityData) => {
    setEditingId(f.id);
    setEditForm({ ...f });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'facilities');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload photo to R2');

      setEditForm((prev) => ({ ...prev, image: data.path }));
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const res = await fetch('/api/facilities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      setFacilities((prev) =>
        prev.map((f) => (f.id === editingId ? { ...f, ...editForm } as FacilityData : f))
      );
      setEditingId(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving facility');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
      {facilities.map((fac) => {
        const isEditing = editingId === fac.id;
        return (
          <div
            key={fac.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              border: isEditing ? '2px solid #c5a880' : '1px solid #e5e7eb',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ height: '180px', position: 'relative', backgroundColor: '#f3f4f6' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(isEditing ? editForm.image : fac.image)}
                alt={fac.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {isEditing ? (
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Change Photo (Upload to Cloudflare R2)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ fontSize: '12px' }}
                    />
                    {uploading && <span style={{ fontSize: '12px', color: '#c5a880', display: 'block' }}>Uploading to R2...</span>}
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Facility Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Icon Class
                    </label>
                    <input
                      type="text"
                      value={editForm.icon || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g. fas fa-building-columns"
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={saveEdit}
                      disabled={saving || uploading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#c5a880',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    {fac.icon && <i className={fac.icon} style={{ color: '#c5a880' }}></i>}
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{fac.title}</h3>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '13.5px', lineHeight: 1.5, margin: '0 0 15px' }}>
                    {fac.description}
                  </p>

                  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px', textAlign: 'right' }}>
                    <button
                      onClick={() => startEdit(fac)}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      ✎ Edit Details & Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
