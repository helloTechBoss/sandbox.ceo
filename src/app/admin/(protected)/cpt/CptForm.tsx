'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  action: (fd: FormData) => Promise<void>;
  defaults?: {
    nameTc?: string; nameEn?: string; nameSc?: string;
    descTc?: string; descEn?: string; descSc?: string;
    price?: number; videoUrl?: string; thumbnailUrl?: string;
    published?: boolean; featured?: boolean; order?: number;
  };
}

const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', color: '#334155', background: '#F8FAFC', boxSizing: 'border-box', fontFamily: 'inherit' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 };
const hint: React.CSSProperties = { fontSize: '.72rem', color: '#94A3B8', marginTop: 4 };
const card: React.CSSProperties = { background: '#fff', border: '1px solid #E2E8F0', padding: '24px', marginBottom: 20 };
const sectionTitle: React.CSSProperties = { fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid #F1F5F9' };

export default function CptForm({ action, defaults = {} }: Props) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState(defaults.videoUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/cpt-upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      setVideoUrl(url);
    } catch {
      setUploadErr('Upload failed. Check BLOB_READ_WRITE_TOKEN is set.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action}>

      {/* Course name */}
      <div style={card}>
        <div style={sectionTitle}>Course Name</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <label style={lbl}>繁體中文 *</label>
            <input name="nameTc" required defaultValue={defaults.nameTc} style={inp} placeholder="e.g. AML/CFT 合規培訓課程" />
          </div>
          <div>
            <label style={lbl}>English *</label>
            <input name="nameEn" required defaultValue={defaults.nameEn} style={inp} placeholder="e.g. AML/CFT Compliance Training" />
          </div>
          <div>
            <label style={lbl}>简体中文</label>
            <input name="nameSc" defaultValue={defaults.nameSc} style={inp} placeholder="e.g. AML/CFT 合规培训课程" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={card}>
        <div style={sectionTitle}>Course Description</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <label style={lbl}>繁體中文</label>
            <textarea name="descTc" defaultValue={defaults.descTc} rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} placeholder="課程簡介..." />
          </div>
          <div>
            <label style={lbl}>English</label>
            <textarea name="descEn" defaultValue={defaults.descEn} rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} placeholder="Course description..." />
          </div>
          <div>
            <label style={lbl}>简体中文</label>
            <textarea name="nameSc" defaultValue={defaults.descSc} rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} placeholder="课程简介..." />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={card}>
        <div style={sectionTitle}>Pricing</div>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'start' }}>
          <div>
            <label style={lbl}>Price (HKD) *</label>
            <input name="price" type="number" min="0" required defaultValue={defaults.price ?? ''} style={inp} placeholder="e.g. 880" />
            <p style={hint}>Enter in HKD dollars (e.g. 880 = HK$880)</p>
          </div>
        </div>
      </div>

      {/* Video */}
      <div style={card}>
        <div style={sectionTitle}>Course Video</div>
        <div>
          <label style={lbl}>Video URL</label>
          <input
            name="videoUrl"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            style={inp}
            placeholder="https://vimeo.com/... or https://youtu.be/... or Blob URL"
          />
          <p style={hint}>Paste a Vimeo / YouTube URL, or upload a file below.</p>
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={lbl}>Upload Video File</label>
          <input ref={fileRef} type="file" accept="video/*" onChange={handleFileUpload} style={{ fontSize: '.82rem', color: '#334155' }} />
          {uploading && <p style={{ ...hint, color: '#C9A84C', marginTop: 8 }}>⏳ Uploading…</p>}
          {uploadErr && <p style={{ ...hint, color: '#EF4444', marginTop: 8 }}>{uploadErr}</p>}
          {videoUrl && videoUrl.includes('blob.vercel-storage') && (
            <p style={{ ...hint, color: '#065F46', marginTop: 8 }}>✓ Uploaded: {videoUrl.split('/').pop()}</p>
          )}
          <p style={hint}>Requires BLOB_READ_WRITE_TOKEN in Vercel env vars.</p>
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={lbl}>Thumbnail URL (optional)</label>
          <input name="thumbnailUrl" defaultValue={defaults.thumbnailUrl} style={inp} placeholder="https://..." />
          <p style={hint}>Shown as the course cover image in the marketplace.</p>
        </div>
      </div>

      {/* Settings */}
      <div style={card}>
        <div style={sectionTitle}>Settings</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 20, alignItems: 'start' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" name="published" value="1" defaultChecked={defaults.published} style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: '.875rem', fontWeight: 600, color: '#334155' }}>Published (visible on marketplace)</span>
            </label>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" name="featured" value="1" defaultChecked={defaults.featured} style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: '.875rem', fontWeight: 600, color: '#334155' }}>Featured (shown first)</span>
            </label>
          </div>
          <div>
            <label style={lbl}>Display Order</label>
            <input name="order" type="number" defaultValue={defaults.order ?? 0} style={inp} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" style={{ background: '#0F2557', color: '#fff', padding: '12px 28px', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.875rem', border: 'none', cursor: 'pointer' }}>
          Save Course
        </button>
        <button type="button" onClick={() => router.back()} style={{ background: '#F1F5F9', color: '#334155', padding: '12px 20px', fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: '.875rem', border: 'none', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
