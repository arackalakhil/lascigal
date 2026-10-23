'use client';

import { useState } from 'react';

const INITIAL_COUPONS = [
  'SAVE10OFF',
  'WELCOME15',
  'FLOWER20',
  'JOY25',
  'LOVE30',
  'DECOR35',
  'EVENT40',
  'GIFT45',
  'HAPPY50',
  'STYLE55',
];

export default function CouponGenerator() {
  const [coupons, setCoupons] = useState<string[]>(INITIAL_COUPONS);
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (coupons.length === 0) {
      setActiveCoupon('CLAIMED');
      return;
    }
    const randomIndex = Math.floor(Math.random() * coupons.length);
    const chosen = coupons[randomIndex];
    setCoupons((prev) => prev.filter((_, idx) => idx !== randomIndex));
    setActiveCoupon(chosen);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (activeCoupon && activeCoupon !== 'CLAIMED') {
      navigator.clipboard.writeText(activeCoupon);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="coupon-generator-box">
      <div className="mc4wp-form-fields" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={handleGenerate}
          className="emailer_submit"
          style={{
            cursor: 'pointer',
            border: '2px solid #fff',
            padding: '10px 24px',
            backgroundColor: '#c5a880',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          }}
        >
          Get Coupon
        </button>

        {activeCoupon && activeCoupon !== 'CLAIMED' && (
          <button
            type="button"
            onClick={copyToClipboard}
            style={{
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '10px 16px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#fff',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        )}
      </div>

      <div className="coupon-response" style={{ color: '#fff', marginTop: '14px', fontSize: '18px' }}>
        {activeCoupon === 'CLAIMED' ? (
          <p style={{ margin: 0, color: '#ffb3b3' }}>❌ Sorry, all promotional coupons have been claimed!</p>
        ) : activeCoupon ? (
          <p style={{ margin: 0 }}>
            🎉 Your Coupon Code: <strong style={{ letterSpacing: '1.5px', textDecoration: 'underline' }}>{activeCoupon}</strong>
          </p>
        ) : null}
      </div>
    </div>
  );
}
