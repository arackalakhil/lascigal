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
    <div className="las_coupon_box_inner">
      <div className="las_coupon_action_row">
        <button
          type="button"
          onClick={handleGenerate}
          className="las_coupon_gen_btn"
        >
          <i className="fas fa-magic" />
          <span>Generate Promo Code</span>
        </button>

        {activeCoupon && activeCoupon !== 'CLAIMED' && (
          <button
            type="button"
            onClick={copyToClipboard}
            className={`las_coupon_copy_btn ${copied ? 'las_copied' : ''}`}
          >
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>
        )}
      </div>

      {activeCoupon && (
        <div className="las_coupon_result">
          {activeCoupon === 'CLAIMED' ? (
            <div className="las_coupon_claimed_notice">
              <i className="fas fa-info-circle" />
              <span>All promotional codes for this session have been claimed. Please contact our reception desk for custom offers.</span>
            </div>
          ) : (
            <div className="las_coupon_ticket">
              <span className="las_coupon_tag_label">YOUR EXCLUSIVE VOUCHER</span>
              <div className="las_coupon_code_display">{activeCoupon}</div>
              <p className="las_coupon_hint">
                Mention this code when inquiring or pasting into the booking form below for privileged event rates.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
