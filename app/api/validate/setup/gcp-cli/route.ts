import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const version = await runCli('gcloud --version 2>&1 | head -1');
    return NextResponse.json({ success: true, message: `Google Cloud CLI installed: ${version}` });
  } catch {
    return NextResponse.json({ success: false, message: 'gcloud CLI not found. Install from https://cloud.google.com/sdk/docs/install' });
  }
}
