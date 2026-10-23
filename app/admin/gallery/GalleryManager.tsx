'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mediaUrl } from '@/lib/media';

interface GalleryItemData {
  id: string;
  title: string | null;
  altText: string | null;
  category: string;
  image: string;
  order: number;
}

export default function GalleryManager({ initialItems }: { initialItems: GalleryItemData[] }) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItemData[]>(initialItems);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState('General');
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      // 1. Upload to R2 via /api/upload
      const form = new FormData();
      form.append('file', selectedFile);
      form.append('folder', 'gallery');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload to R2 failed');

      // 2. Add to GalleryItem table
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          altText,
          category,
          image: uploadData.path,
          order: items.length + 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save gallery item');

      setItems((prev) => [...prev, data.item]);
      setSelectedFile(null);
      setTitle('');
      setAltText('');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error uploading photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this photo from gallery?')) return;

    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting photo');
    }
  };

  const filtered = filterCategory === 'All' ? items : items.filter((i) => i.category === filterCategory);

  return (
    <div>
      {/* Upload Box */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: '25px',
          border: '1px solid #e5e7eb',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 15px' }}>Upload New Photo to Cloudflare R2</h2>
        <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>Choose Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              required
              style={{ width: '100%', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Hall, Dining, Stage, Exterior"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>Caption / Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Banquet Dining Hall"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>Alt Text</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Lascigal Dining View"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              disabled={uploading}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#c5a880',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: uploading ? 'not-allowed' : 'pointer',
              }}
            >
              {uploading ? 'Uploading to R2...' : '+ Upload Photo'}
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #d1d5db',
              backgroundColor: filterCategory === c ? '#c5a880' : '#fff',
              color: filterCategory === c ? '#fff' : '#374151',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid of Images */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ height: '170px', position: 'relative', backgroundColor: '#f3f4f6' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(item.image)}
                alt={item.altText || item.title || ''}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
            <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#4b5563',
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {item.category}
                </span>
                <p style={{ margin: '8px 0 0', fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                  {item.title || item.altText || 'Untitled'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9ca3af', wordBreak: 'break-all' }}>
                  {item.image}
                </p>
              </div>

              <div style={{ marginTop: '12px', textAlign: 'right' }}>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
