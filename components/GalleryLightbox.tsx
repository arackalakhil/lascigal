'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { mediaUrl } from '@/lib/media';

interface GalleryItemData {
  id: string;
  title: string | null;
  altText: string | null;
  category: string;
  image: string;
}

export default function GalleryLightbox({ items }: { items: GalleryItemData[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setCurrentIndex(null);
  };

  const showNext = () => {
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex + 1) % filteredItems.length);
    }
  };

  const showPrev = () => {
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredItems.length]);

  return (
    <div>
      {/* Category Filter Pills */}
      {categories.length > 2 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: '25px',
                border: '1px solid #c5a880',
                backgroundColor: selectedCategory === cat ? '#c5a880' : 'transparent',
                color: selectedCategory === cat ? '#fff' : '#444',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Cobbles Grid */}
      <div className="cobbles-gallery">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            className="cobbles-item"
            onClick={() => openLightbox(idx)}
            role="button"
            tabIndex={0}
            aria-label={item.title || item.altText || 'Gallery Image'}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(item.image)}
              alt={item.altText || item.title || 'Lascigal Gallery'}
              loading="lazy"
            />
            {item.title && (
              <div className="cobbles-caption">
                <strong>{item.title}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {currentIndex !== null && filteredItems[currentIndex] && (
        <div className="lightbox" onClick={closeLightbox}>
          <button
            className="lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close Lightbox"
          >
            &times;
          </button>

          <button
            className="lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous Image"
          >
            &#10094;
          </button>

          <div className="lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(filteredItems[currentIndex].image)}
              alt={filteredItems[currentIndex].altText || filteredItems[currentIndex].title || ''}
            />
          </div>

          <button
            className="lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next Image"
          >
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
}
