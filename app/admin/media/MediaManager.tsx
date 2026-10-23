'use client';

import { useState } from 'react';
import JSZip from 'jszip';

export default function MediaManager() {
  // Single upload state
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [singleFolder, setSingleFolder] = useState('uploads');
  const [uploadingSingle, setUploadingSingle] = useState(false);
  const [singleResult, setSingleResult] = useState<{ path: string; url: string } | null>(null);

  // ZIP / Batch upload state
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [zipFolder, setZipFolder] = useState('frames');
  const [extracting, setExtracting] = useState(false);
  const [uploadingBatch, setUploadingBatch] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [batchResults, setBatchResults] = useState<string[]>([]);
  const [zipError, setZipError] = useState<string | null>(null);

  // 1. Single Image Upload
  const handleSingleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleFile) return;

    setUploadingSingle(true);
    setSingleResult(null);

    try {
      const formData = new FormData();
      formData.append('file', singleFile);
      formData.append('folder', singleFolder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload to R2 failed');

      setSingleResult({ path: data.path, url: data.url });
      setSingleFile(null);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingSingle(false);
    }
  };

  // 2. Browser-Extract Flow for ZIP / Numbered Frames
  const handleZipUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipFile) return;

    setExtracting(true);
    setUploadingBatch(false);
    setZipError(null);
    setProgress(null);
    setBatchResults([]);

    try {
      // Step A: Extract ZIP in browser
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(zipFile);
      const fileEntries: { name: string; blob: Blob; type: string }[] = [];

      for (const [filename, fileObj] of Object.entries(unzipped.files)) {
        if (fileObj.dir || filename.startsWith('__MACOSX') || filename.includes('.DS_Store')) {
          continue;
        }

        const ext = filename.split('.').pop()?.toLowerCase();
        let mime = 'application/octet-stream';
        if (ext === 'webp') mime = 'image/webp';
        else if (ext === 'jpg' || ext === 'jpeg') mime = 'image/jpeg';
        else if (ext === 'png') mime = 'image/png';

        const blob = await fileObj.async('blob');
        fileEntries.push({ name: filename, blob, type: mime });
      }

      if (fileEntries.length === 0) {
        throw new Error('No valid images found in the ZIP file.');
      }

      setExtracting(false);
      setUploadingBatch(true);
      setProgress({ current: 0, total: fileEntries.length });

      // Step B: Get presigned PUT URLs in batch from /api/upload-frames/sign
      const signRes = await fetch('/api/upload-frames/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder: zipFolder,
          files: fileEntries.map((f) => ({ name: f.name, type: f.type })),
        }),
      });

      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData.error || 'Failed to generate upload signatures');

      // Step C: Upload each file directly from browser to Cloudflare R2
      const uploadedKeys: string[] = [];
      for (let i = 0; i < fileEntries.length; i++) {
        const item = fileEntries[i];
        const signed = signData.signedUrls.find((s: any) => s.filename === item.name);
        if (!signed) continue;

        const putRes = await fetch(signed.url, {
          method: 'PUT',
          headers: {
            'Content-Type': item.type,
            'Cache-Control': 'max-age=31536000, immutable',
          },
          body: item.blob,
        });

        if (!putRes.ok) {
          throw new Error(`Failed to upload ${item.name} to R2 directly (HTTP ${putRes.status}).`);
        }

        uploadedKeys.push(signed.key);
        setProgress({ current: i + 1, total: fileEntries.length });
      }

      setBatchResults(uploadedKeys);
      setZipFile(null);
    } catch (err: any) {
      console.error(err);
      setZipError(err.message || 'ZIP upload process failed');
    } finally {
      setExtracting(false);
      setUploadingBatch(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* 1. Single Image Upload */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          padding: '25px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 10px' }}>Single File Upload to R2</h2>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 20px' }}>
          Uploads directly to Cloudflare R2 with immutable 1-year cache headers.
        </p>

        <form onSubmit={handleSingleUpload} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>Target Folder</label>
            <input
              type="text"
              value={singleFolder}
              onChange={(e) => setSingleFolder(e.target.value)}
              placeholder="e.g. uploads, gallery, stills"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>Select Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSingleFile(e.target.files?.[0] || null)}
              required
              style={{ width: '100%', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              disabled={uploadingSingle}
              style={{
                width: '100%',
                padding: '11px',
                backgroundColor: '#c5a880',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: uploadingSingle ? 'not-allowed' : 'pointer',
              }}
            >
              {uploadingSingle ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>

        {singleResult && (
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '6px',
            }}
          >
            <div style={{ color: '#166534', fontWeight: 600, marginBottom: '6px' }}>✓ Upload Successful!</div>
            <div style={{ fontSize: '13px', color: '#374151', marginBottom: '4px' }}>
              <strong>DB Relative Path:</strong> <code>{singleResult.path}</code>
            </div>
            <div style={{ fontSize: '13px', color: '#374151', wordBreak: 'break-all' }}>
              <strong>Public R2 URL:</strong>{' '}
              <a href={singleResult.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>
                {singleResult.url}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 2. Large ZIP / Numbered Frames Browser-Extract Flow */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          padding: '25px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Browser-Extract ZIP Upload</h2>
          <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
            Serverless Safe (Bypasses 4.5 MB limit)
          </span>
        </div>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 20px' }}>
          Unpacks ZIP files right in your browser using JSZip, requests signed PUT URLs, and uploads directly from your browser to Cloudflare R2.
        </p>

        {zipError && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '15px' }}>
            {zipError}
          </div>
        )}

        <form onSubmit={handleZipUpload} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>Destination Folder</label>
            <input
              type="text"
              value={zipFolder}
              onChange={(e) => setZipFolder(e.target.value)}
              placeholder="e.g. frames-intro or stills"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>Choose ZIP Archive</label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setZipFile(e.target.files?.[0] || null)}
              required
              style={{ width: '100%', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              disabled={extracting || uploadingBatch}
              style={{
                width: '100%',
                padding: '11px',
                backgroundColor: '#1f2937',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: extracting || uploadingBatch ? 'not-allowed' : 'pointer',
              }}
            >
              {extracting ? 'Unpacking ZIP in browser...' : uploadingBatch ? 'Uploading to R2...' : 'Extract & Upload ZIP'}
            </button>
          </div>
        </form>

        {progress && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginBottom: '6px' }}>
              <span>Upload Progress:</span>
              <span>
                {progress.current} of {progress.total} files ({Math.round((progress.current / progress.total) * 100)}%)
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                  height: '100%',
                  backgroundColor: '#c5a880',
                  transition: 'width 0.2s ease',
                }}
              ></div>
            </div>
          </div>
        )}

        {batchResults.length > 0 && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
            <div style={{ color: '#166534', fontWeight: 600, marginBottom: '6px' }}>
              ✓ Successfully extracted & uploaded {batchResults.length} files to Cloudflare R2!
            </div>
            <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '12px', color: '#4b5563', fontFamily: 'monospace' }}>
              {batchResults.slice(0, 10).map((key, i) => (
                <div key={i}>{key}</div>
              ))}
              {batchResults.length > 10 && <div>...and {batchResults.length - 10} more files</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
