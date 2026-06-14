import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const version = await runCli('docker --version');
    return NextResponse.json({ success: true, message: `Docker installed: ${version}` });
  } catch {
    return NextResponse.json({ success: false, message: 'Docker not found. Install from https://docker.com/products/docker-desktop/' });
  }
}
