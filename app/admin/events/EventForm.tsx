'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EventData {
  id?: string;
  title: string;
  slug: string;
  categoryName: string;
  heroImage: string;
  summary: string;
  description: string;
  features: string[];
  galleryImages: string[];
  order: number;
}

export default function EventForm({ initialData }: { initialData?: EventData }) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState<EventData>({
    id: initialData?.id || '',
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    categoryName: initialData?.categoryName || "Life's Celebrations",
    heroImage: initialData?.heroImage || 'images/gallery/portfolio/wed1.jpeg',
    summary: initialData?.summary || '',
    description: initialData?.description || '',
    features: initialData?.features || [],
    galleryImages: initialData?.galleryImages || [],
    order: initialData?.order || 0,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Auto-generate slug if creating new
    if (!isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, title, slug }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, newGalleryImage.trim()],
      }));
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = '/api/events';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save event');

      router.push('/admin/events');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error saving event');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '30px', border: '1px solid #e5e7eb' }}>
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>Event Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            required
            placeholder="e.g. Weddings & Receptions"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>URL Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            required
            placeholder="e.g. weddings-receptions"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>Category *</label>
          <select
            value={formData.categoryName}
            onChange={(e) => setFormData((prev) => ({ ...prev, categoryName: e.target.value }))}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          >
            <option value="Life's Celebrations">Life&apos;s Celebrations</option>
            <option value="Conferences & Conventions">Conferences & Conventions</option>
            <option value="Special Events">Special Events</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>Hero Image Path (R2 Relative) *</label>
          <input
            type="text"
            value={formData.heroImage}
            onChange={(e) => setFormData((prev) => ({ ...prev, heroImage: e.target.value }))}
            required
            placeholder="images/gallery/portfolio/wed1.jpeg"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>Short Summary</label>
        <input
          type="text"
          value={formData.summary}
          onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
          placeholder="Brief highlight displayed on preview cards"
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>Full Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={5}
          placeholder="Comprehensive details on venue offerings, capacity, sound, and stage arrangements"
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        ></textarea>
      </div>

      {/* Repeatable Highlights / Features */}
      <div style={{ marginBottom: '25px', backgroundColor: '#f9fafb', padding: '18px', borderRadius: '8px' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
          Event Highlights & Key Inclusions
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="e.g. Air-conditioned bridal lounge"
            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <button
            type="button"
            onClick={addFeature}
            style={{ padding: '8px 16px', backgroundColor: '#374151', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Add
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {formData.features.map((f, i) => (
            <span
              key={i}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #d1d5db',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {f}
              <button
                type="button"
                onClick={() => removeFeature(i)}
                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Repeatable Gallery Image Paths */}
      <div style={{ marginBottom: '30px', backgroundColor: '#f9fafb', padding: '18px', borderRadius: '8px' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
          Related Gallery Photo Paths
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            value={newGalleryImage}
            onChange={(e) => setNewGalleryImage(e.target.value)}
            placeholder="images/gallery/wed.png"
            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <button
            type="button"
            onClick={addGalleryImage}
            style={{ padding: '8px 16px', backgroundColor: '#374151', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Add Image
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {formData.galleryImages.map((img, i) => (
            <span
              key={i}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #d1d5db',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {img}
              <button
                type="button"
                onClick={() => removeGalleryImage(i)}
                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#c5a880',
            color: '#fff',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Saving Event...' : isEditing ? 'Save Changes' : 'Publish Event'}
        </button>

        <Link
          href="/admin/events"
          style={{
            padding: '12px 20px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
