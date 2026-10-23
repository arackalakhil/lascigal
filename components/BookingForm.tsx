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
    <form onSubmit={handleSubmit} className="google-sheets-form" data-formtype="form_1">
      <div className="sc_form_info columns_wrap">
        {/* Name */}
        <div className="sc_form_item sc_form_field label_over column-1_2">
          <input
            id="sc_form_username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Name *"
            required
          />
        </div>

        {/* Email */}
        <div className="sc_form_item sc_form_field label_over column-1_2">
          <input
            id="sc_form_email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail *"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="sc_form_item sc_form_field label_over column-1_2">
          <input
            id="sc_form_phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number *"
            required
          />
        </div>

        {/* Event Date */}
        <div className="sc_form_item sc_form_field label_over column-1_2">
          <label htmlFor="sc_form_date" style={{ display: 'block', fontSize: '13px', marginBottom: '4px', textAlign: 'left' }}>
            Event Date *
          </label>
          <input
            id="sc_form_date"
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Event Type */}
        <div className="sc_form_item sc_form_field label_over column-1_2">
          <input
            id="sc_form_event"
            type="text"
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            placeholder="Event Type (Wedding, Birthday, Conference...)"
            required
          />
        </div>

        {/* Event Time */}
        <div className="sc_form_item sc_form_field label_over column-1_2">
          <input
            id="sc_form_time"
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="Event Time (e.g. 10:00 AM - 4:00 PM)"
            required
          />
        </div>

        {/* Coupon Code */}
        <div className="sc_form_item sc_form_field label_over column-1_2">
          <input
            id="sc_form_coupon"
            type="text"
            name="coupon"
            value={formData.coupon}
            onChange={handleChange}
            placeholder="Coupon Code (Optional)"
          />
        </div>

        {/* Message */}
        <div className="sc_form_item sc_form_message column-1_1">
          <textarea
            id="sc_form_message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Additional requirements or special notes..."
            rows={4}
          ></textarea>
        </div>
      </div>

      {status && (
        <div
          style={{
            margin: '20px auto',
            padding: '12px 20px',
            borderRadius: '6px',
            backgroundColor: status.type === 'success' ? '#e6f4ea' : '#fce8e6',
            color: status.type === 'success' ? '#137333' : '#c5221f',
            border: `1px solid ${status.type === 'success' ? '#ceead6' : '#fad2cf'}`,
            fontSize: '15px',
            maxWidth: '600px',
          }}
        >
          {status.message}
        </div>
      )}

      {/* Submit Button */}
      <div className="sc_form_item sc_form_button" style={{ marginTop: '20px' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            padding: '12px 36px',
            fontSize: '16px',
          }}
        >
          {loading ? 'Submitting Reservation...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}
