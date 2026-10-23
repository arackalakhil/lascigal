'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookingData {
  id: string;
  username: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  time: string;
  coupon: string | null;
  message: string | null;
  status: string;
  createdAt: string | Date;
}

export default function InboxManager({ initialBookings }: { initialBookings: BookingData[] }) {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingData[]>(initialBookings);
  const [filter, setFilter] = useState('ALL');

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Status update failed');

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm('Delete this booking record?')) return;

    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      setBookings((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting booking');
    }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['ALL', 'NEW', 'CONTACTED', 'ARCHIVED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid #d1d5db',
              backgroundColor: filter === f ? '#c5a880' : '#fff',
              color: filter === f ? '#fff' : '#374151',
              fontWeight: 500,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {f} ({f === 'ALL' ? bookings.length : bookings.filter((b) => b.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '40px', textAlign: 'center', borderRadius: '10px', color: '#888' }}>
          No booking submissions found for this status.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filtered.map((b) => (
            <div
              key={b.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              <div style={{ flex: '1 1 350px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{b.username}</h3>
                  <span
                    style={{
                      backgroundColor: b.status === 'NEW' ? '#dcfce7' : b.status === 'CONTACTED' ? '#dbeafe' : '#f3f4f6',
                      color: b.status === 'NEW' ? '#166534' : b.status === 'CONTACTED' ? '#1e40af' : '#4b5563',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {b.status}
                  </span>
                  {b.coupon && (
                    <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                      Coupon: {b.coupon}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', color: '#555', fontSize: '14px', marginBottom: '12px' }}>
                  <div>
                    <strong>Event:</strong> {b.eventType}
                  </div>
                  <div>
                    <strong>Date:</strong> {b.eventDate}
                  </div>
                  <div>
                    <strong>Time:</strong> {b.time}
                  </div>
                </div>

                {b.message && (
                  <p style={{ margin: 0, padding: '10px 14px', backgroundColor: '#f9fafb', borderRadius: '6px', fontSize: '14px', color: '#374151' }}>
                    &ldquo;{b.message}&rdquo;
                  </p>
                )}

                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '10px' }}>
                  Received: {new Date(b.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`tel:${b.phone}`}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#2563eb',
                      color: '#fff',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    📞 Call {b.phone}
                  </a>

                  <a
                    href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(b.username)},%20thank%20you%20for%20reaching%20out%20to%20Lascigal%20Convention%20Center!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#25D366',
                      color: '#fff',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    💬 WhatsApp
                  </a>

                  <a
                    href={`mailto:${b.email}`}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    ✉ Email
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', color: '#6b7280' }}>Mark as:</label>
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px' }}
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>

                  <button
                    onClick={() => deleteBooking(b.id)}
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
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
      )}
    </div>
  );
}
