import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const docType = (form.get('docType') as string) || 'other';
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const ext = file.name.split('.').pop();
    const filename = `onboarding/${docType}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const blob = await put(filename, file, { access: 'public' });

    return NextResponse.json({ url: blob.url, label: file.name });
  } catch (err) {
    console.error('Doc upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
