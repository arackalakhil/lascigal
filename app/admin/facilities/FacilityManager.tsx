'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mediaUrl } from '@/lib/media';

interface FacilityData {
  id: string;
  title: string;
  description: string | null;
  image: string;
  icon: string | null;
  order: number;
}

const COMMON_ICONS = [
  { icon: 'fas fa-building-columns', label: 'Auditorium' },
  { icon: 'fas fa-utensils', label: 'Dining' },
  { icon: 'fas fa-square-parking', label: 'Parking' },
  { icon: 'fas fa-snowflake', label: 'Central A/C' },
  { icon: 'fas fa-bed', label: 'Bridal Suite' },
  { icon: 'fas fa-bolt', label: 'Power Backup' },
  { icon: 'fas fa-shield-halved', label: 'Security' },
  { icon: 'fas fa-wifi', label: 'Wi-Fi' },
  { icon: 'fas fa-music', label: 'Acoustics' },
  { icon: 'fas fa-tree', label: 'Scenic Lawn' },
];

export default function FacilityManager({ initialFacilities }: { initialFacilities: FacilityData[] }) {
  const router = useRouter();
  const [facilities, setFacilities] = useState<FacilityData[]>(initialFacilities);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FacilityData>>({});
  const [uploadingEdit, setUploadingEdit] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  // Create State
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploadingNew, setUploadingNew] = useState(false);
  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    image: 'images/INDEX_ITEMS/hall1.jpg',
    icon: 'fas fa-building-columns',
    order: (facilities.length + 1) * 10,
  });

  // Action status message
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // ------------------ CREATE FACILITY ------------------
  const handleCreateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingNew(true);
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

      setNewForm((prev) => ({ ...prev, image: data.path }));
      showStatus('success', 'Photo uploaded to Cloudflare R2 successfully!');
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingNew(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.title.trim()) {
      alert('Please enter a facility title.');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create facility');

      const createdFacility = data.facility;
      setFacilities((prev) => [...prev, createdFacility].sort((a, b) => a.order - b.order));
      setShowAddModal(false);
      setNewForm({
        title: '',
        description: '',
        image: 'images/INDEX_ITEMS/hall1.jpg',
        icon: 'fas fa-building-columns',
        order: (facilities.length + 2) * 10,
      });
      showStatus('success', `"${createdFacility.title}" added to homepage successfully!`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to add facility');
    } finally {
      setCreating(false);
    }
  };

  // ------------------ EDIT FACILITY ------------------
  const startEdit = (f: FacilityData) => {
    setEditingId(f.id);
    setEditForm({ ...f });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingEdit(true);
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
      showStatus('success', 'New photo uploaded to Cloudflare R2!');
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingEdit(false);
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSavingEdit(true);
    try {
      const res = await fetch('/api/facilities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      setFacilities((prev) =>
        prev
          .map((f) => (f.id === editingId ? ({ ...f, ...editForm } as FacilityData) : f))
          .sort((a, b) => a.order - b.order)
      );
      setEditingId(null);
      showStatus('success', 'Facility updated successfully!');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving facility');
    } finally {
      setSavingEdit(false);
    }
  };

  // ------------------ DELETE FACILITY ------------------
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from Homepage Facilities?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/facilities?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete facility');

      setFacilities((prev) => prev.filter((f) => f.id !== id));
      showStatus('success', `Facility "${title}" has been deleted.`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting facility');
    }
  };

  return (
    <div>
      {/* Top Notification Toast */}
      {statusMsg && (
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: statusMsg.type === 'success' ? '#166534' : '#991b1b',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <span>{statusMsg.type === 'success' ? '✓' : '⚠'}</span>
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Control Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          backgroundColor: '#fff',
          padding: '16px 20px',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          marginBottom: '25px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
              Current Venue Highlights:
            </span>
            <span
              style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: 600,
              }}
            >
              {facilities.length} {facilities.length === 1 ? 'Card' : 'Cards'} Active
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Each facility displays in order on the homepage under &quot;World-Class Infrastructure&quot;.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/#facilities"
            target="_blank"
            style={{
              padding: '9px 15px',
              backgroundColor: '#fff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>↗ Live Homepage Preview</span>
          </Link>

          <button
            onClick={() => setShowAddModal((prev) => !prev)}
            style={{
              padding: '10px 18px',
              backgroundColor: showAddModal ? '#334155' : '#c5a880',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(197, 168, 128, 0.3)',
            }}
          >
            <span>{showAddModal ? '✕ Close Form' : '+ Add New Facility & Amenity'}</span>
          </button>
        </div>
      </div>

      {/* NEW FACILITY CREATION FORM */}
      {showAddModal && (
        <form
          onSubmit={handleCreateSubmit}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '2px solid #c5a880',
            padding: '24px',
            marginBottom: '30px',
            boxShadow: '0 4px 16px rgba(197, 168, 128, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '18px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                ✨ Add New Facility / Amenity to Homepage
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#64748b' }}>
                Fill in the details below. Photos are stored securely in Cloudflare R2 and published live immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{ background: 'none', border: 'none', fontSize: '18px', color: '#94a3b8', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Facility Title *
              </label>
              <input
                type="text"
                required
                value={newForm.title}
                onChange={(e) => setNewForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. VIP Bridal & Groom Suites"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Display Order Number
              </label>
              <input
                type="number"
                value={newForm.order}
                onChange={(e) => setNewForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
                placeholder="e.g. 10, 20, 30..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
              <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginTop: '3px' }}>
                Lower numbers appear first on the homepage.
              </span>
            </div>
          </div>

          {/* Icon Selector */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Icon Class (FontAwesome 6)
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={newForm.icon}
                onChange={(e) => setNewForm((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="e.g. fas fa-snowflake"
                style={{ flex: 1, minWidth: '220px', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13.5px' }}
              />
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c5a880',
                  fontSize: '18px',
                }}
              >
                {newForm.icon ? <i className={newForm.icon}></i> : '—'}
              </div>
            </div>

            {/* Quick Icon Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', alignSelf: 'center', marginRight: '4px' }}>Quick Pick:</span>
              {COMMON_ICONS.map((item) => (
                <button
                  key={item.icon}
                  type="button"
                  onClick={() => setNewForm((prev) => ({ ...prev, icon: item.icon }))}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '4px',
                    border: newForm.icon === item.icon ? '1px solid #c5a880' : '1px solid #e2e8f0',
                    backgroundColor: newForm.icon === item.icon ? '#fefce8' : '#f8fafc',
                    color: newForm.icon === item.icon ? '#92400e' : '#475569',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo & R2 Upload */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Facility Photo (Cloudflare R2)
            </label>
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '180px',
                  height: '110px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: '#1f2937',
                  border: '1px solid #e2e8f0',
                  position: 'relative',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(newForm.image)}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={newForm.image}
                    onChange={(e) => setNewForm((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="images/INDEX_ITEMS/hall1.jpg"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                  />
                </div>
                <label
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: uploadingNew ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{uploadingNew ? 'Uploading to R2...' : '↑ Upload Photo from Device'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCreateUpload}
                    disabled={uploadingNew}
                    style={{ display: 'none' }}
                  />
                </label>
                <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '10px' }}>
                  Recommended: Landscape 16:9 or 4:3 photo
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Description &amp; Highlights
            </label>
            <textarea
              rows={3}
              value={newForm.description}
              onChange={(e) => setNewForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="e.g. Spacious climate-controlled dressing suites designed with private washrooms, full-length mirrors, and lounge seating."
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13.5px', lineHeight: 1.5 }}
            ></textarea>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={creating || uploadingNew}
              style={{
                padding: '11px 24px',
                backgroundColor: '#c5a880',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: creating ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 6px rgba(197, 168, 128, 0.3)',
              }}
            >
              {creating ? 'Saving Facility...' : '✓ Create & Add to Homepage'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{
                padding: '11px 18px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* GRID OF EXISTING FACILITIES */}
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
                boxShadow: isEditing ? '0 4px 12px rgba(197, 168, 128, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Image banner with order badge */}
              <div style={{ height: '190px', position: 'relative', backgroundColor: '#0f172a' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(isEditing ? editForm.image || fac.image : fac.image)}
                  alt={fac.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#c5a880',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    letterSpacing: '0.5px',
                    border: '1px solid rgba(197, 168, 128, 0.3)',
                  }}
                >
                  Order: #{fac.order}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {isEditing ? (
                  <div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        Change Photo (Cloudflare R2)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditUpload}
                        disabled={uploadingEdit}
                        style={{ fontSize: '12px' }}
                      />
                      {uploadingEdit && <span style={{ fontSize: '12px', color: '#c5a880', display: 'block', marginTop: '3px' }}>Uploading to R2...</span>}
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        R2 Media Path / Key
                      </label>
                      <input
                        type="text"
                        value={editForm.image || ''}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, image: e.target.value }))}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '12.5px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                          Facility Title
                        </label>
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                          Order
                        </label>
                        <input
                          type="number"
                          value={editForm.order ?? fac.order}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        Icon Class (FontAwesome)
                      </label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={editForm.icon || ''}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, icon: e.target.value }))}
                          placeholder="e.g. fas fa-building-columns"
                          style={{ flex: 1, padding: '7px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '12.5px' }}
                        />
                        {editForm.icon && (
                          <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c5a880', fontSize: '15px' }}>
                            <i className={editForm.icon}></i>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px', lineHeight: 1.4 }}
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={saveEdit}
                        disabled={savingEdit || uploadingEdit}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#c5a880',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        {savingEdit ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#fef3c7',
                          color: '#c5a880',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '15px',
                          flexShrink: 0,
                        }}
                      >
                        {fac.icon ? <i className={fac.icon}></i> : <i className="fas fa-star"></i>}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{fac.title}</h3>
                    </div>

                    <p style={{ color: '#64748b', fontSize: '13.5px', lineHeight: 1.6, margin: '0 0 18px', minHeight: '44px' }}>
                      {fac.description || 'No description provided.'}
                    </p>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        onClick={() => startEdit(fac)}
                        style={{
                          padding: '6px 14px',
                          backgroundColor: '#f8fafc',
                          color: '#334155',
                          border: '1px solid #e2e8f0',
                          borderRadius: '5px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>✎ Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(fac.id, fac.title)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#fff',
                          color: '#ef4444',
                          border: '1px solid #fecaca',
                          borderRadius: '5px',
                          fontSize: '12.5px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>🗑 Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
