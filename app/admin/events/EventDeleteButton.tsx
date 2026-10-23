'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EventDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        padding: '6px 12px',
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: 'none',
        borderRadius: '4px',
        fontSize: '13px',
        fontWeight: 500,
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? '...' : 'Delete'}
    </button>
  );
}
