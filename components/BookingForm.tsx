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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const { username, email, phone, event_date, event_type, time } = formData;
    if (!username.trim() || !email.trim() || !phone.trim() || !event_date || !event_type.trim() || !time.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
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
      if (!res.ok) throw new Error(data.error || 'Failed to submit booking');

      setStatus({
        type: 'success',
        message: 'Booking submitted successfully! Our team will contact you shortly.',
      });
      setFormData({
        username: '', email: '', phone: '', event_date: '',
        event_type: '', time: '', coupon: '', message: '',
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Something went wrong. Please try again or call us directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="las_booking_form">
      <div className="las_form_grid">
        {/* Name */}
        <div className="las_form_group">
          <label className="las_form_label">Full Name <span className="las_required">*</span></label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your full name"
            required
            className="las_form_input"
          />
        </div>

        {/* Email */}
        <div className="las_form_group">
          <label className="las_form_label">Email Address <span className="las_required">*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            className="las_form_input"
          />
        </div>

        {/* Phone */}
        <div className="las_form_group">
          <label className="las_form_label">Phone Number <span className="las_required">*</span></label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone / Mobile number"
            required
            className="las_form_input"
          />
        </div>

        {/* Event Date */}
        <div className="las_form_group">
          <label className="las_form_label">Event Date <span className="las_required">*</span></label>
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
            className="las_form_input"
          />
        </div>

        {/* Event Type */}
        <div className="las_form_group">
          <label className="las_form_label">Event Type <span className="las_required">*</span></label>
          <select
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            required
            className="las_form_input"
          >
            <option value="">Select event type...</option>
            <option value="Wedding">Wedding</option>
            <option value="Reception">Reception</option>
            <option value="Engagement">Engagement / Betrothal</option>
            <option value="Birthday">Birthday Celebration</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Corporate">Corporate Conference</option>
            <option value="Exhibition">Exhibition / Trade Fair</option>
            <option value="Cultural">Cultural / Religious Event</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Event Time */}
        <div className="las_form_group">
          <label className="las_form_label">Event Timing <span className="las_required">*</span></label>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="e.g. 10:00 AM - 4:00 PM"
            required
            className="las_form_input"
          />
        </div>

        {/* Coupon */}
        <div className="las_form_group las_form_full">
          <label className="las_form_label">Promo / Coupon Code <span className="las_optional">(Optional)</span></label>
          <input
            type="text"
            name="coupon"
            value={formData.coupon}
            onChange={handleChange}
            placeholder="Enter coupon code if you have one"
            className="las_form_input"
          />
        </div>

        {/* Message */}
        <div className="las_form_group las_form_full">
          <label className="las_form_label">Special Notes <span className="las_optional">(Optional)</span></label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Guest count, stage preferences, catering needs..."
            rows={4}
            className="las_form_input las_form_textarea"
          />
        </div>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`las_form_status ${status.type === 'success' ? 'las_form_success' : 'las_form_error'}`}>
          {status.type === 'success' ? '✓ ' : '⚠ '}
          {status.message}
        </div>
      )}

      {/* Submit */}
      <div className="las_form_submit_row">
        <button
          type="submit"
          disabled={loading}
          className="las_form_submit_btn"
        >
          {loading ? (
            <>
              <span className="las_spinner" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Booking Inquiry</span>
              <i className="fas fa-paper-plane" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
