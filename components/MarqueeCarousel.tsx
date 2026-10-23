'use client';

import Link from 'next/link';
import { mediaUrl } from '@/lib/media';

interface MarqueeItem {
  id: string;
  slug: string;
  title: string;
  heroImage: string;
  summary?: string | null;
}

export default function MarqueeCarousel({ items }: { items: MarqueeItem[] }) {
  // We duplicate items to create a seamless infinite loop
  const displayItems = [...items, ...items];

  return (
    <div className="easter-carousel-section">
      <div className="easter-carousel-wrapper">
        <div className="easter-carousel-track">
          {displayItems.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={`/events/${item.slug}`}
              className="easter-card"
            >
              <div className="easter-card-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(item.heroImage)}
                  alt={item.title}
                  loading="lazy"
                />
              </div>
              <h3>{item.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
