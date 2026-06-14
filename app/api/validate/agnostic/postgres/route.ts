import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const output = await runCli('docker ps --filter "ancestor=postgres:16" --format "{{.Names}} {{.Status}}" 2>/dev/null | head -1');
    if (!output) {
      return NextResponse.json({ success: false, message: 'PostgreSQL container not running. Run "docker compose up -d".' });
    }
    return NextResponse.json({ success: true, message: `PostgreSQL running: ${output}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `PostgreSQL check failed. ${error.message}` });
  }
}
