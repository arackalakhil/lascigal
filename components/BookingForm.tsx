'use client';

import { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    event_date: '',
    event_type: '',
    time: '',
    coupon: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Validation
    const { username, email, phone, event_date, event_type, time } = formData;
    if (!username.trim() || !email.trim() || !phone.trim() || !event_date || !event_type.trim() || !time.trim()) {
      setStatus({ type: 'error', message: '⚠️ Please fill in all required fields (Name, Email, Phone, Date, Event Type, Time).' });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setStatus({ type: 'error', message: '⚠️ Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      setStatus({
        type: 'success',
        message: '✅ Booking submitted successfully! Our team will contact you shortly.',
      });
      setFormData({
        username: '',
        email: '',
        phone: '',
        event_date: '',
        event_type: '',
        time: '',
        coupon: '',
        message: '',
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || '⚠️ Something went wrong. Please try again or call us directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="las_booking_form">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '20px',
          textAlign: 'left',
          marginBottom: '20px',
        }}
      >
        {/* Name */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Full Name *
          </label>
          <input
            id="sc_form_username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your Name"
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14.5px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Email Address *
          </label>
          <input
            id="sc_form_email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14.5px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Phone Number *
          </label>
          <input
            id="sc_form_phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone / Mobile Number"
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14.5px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="sc_form_date" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Event Date *
          </label>
          <input
            id="sc_form_date"
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14.5px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Event Type */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Event Type *
          </label>
          <input
            id="sc_form_event"
            type="text"
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            placeholder="Wedding, Conference, Birthday..."
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14.5px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Event Time */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Event Timing *
          </label>
          <input
            id="sc_form_time"
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="e.g. 10:00 AM - 4:00 PM"
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14.5px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Coupon Code */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Promo / Coupon Code (Optional)
          </label>
          <input
            id="sc_form_coupon"
            type="text"
            name="coupon"
            value={formData.coupon}
            onChange={handleChange}
            placeholder="Enter coupon code if you have one"
            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14.5px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Message */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Special Notes or Additional Inquiries
          </label>
          <textarea
            id="sc_form_message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about expected guest count, stage preferences, or catering questions..."
            rows={4}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14.5px', lineHeight: 1.5, boxSizing: 'border-box' }}
          ></textarea>
        </div>
      </div>

      {status && (
        <div
          style={{
            margin: '20px auto',
            padding: '14px 20px',
            borderRadius: '6px',
            backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: status.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            fontSize: '15px',
            fontWeight: 500,
            maxWidth: '650px',
          }}
        >
          {status.message}
        </div>
      )}

      {/* Submit Button */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            padding: '14px 44px',
            fontSize: '16px',
            fontWeight: 700,
            backgroundColor: '#c5a880',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            boxShadow: '0 4px 15px rgba(197, 168, 128, 0.4)',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Submitting Reservation...' : 'Submit Booking Inquiry'}
        </button>
      </div>
    </form>
  );
}
