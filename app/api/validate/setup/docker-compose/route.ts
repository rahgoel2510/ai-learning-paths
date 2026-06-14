import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const version = await runCli('docker compose version 2>/dev/null || docker-compose --version 2>/dev/null');
    return NextResponse.json({ success: true, message: `Docker Compose available: ${version}` });
  } catch {
    return NextResponse.json({ success: false, message: 'Docker Compose not found. It comes with Docker Desktop, or install separately.' });
  }
}
