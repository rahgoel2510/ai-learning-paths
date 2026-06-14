import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const output = await runCli('docker ps --filter "ancestor=minio/minio" --format "{{.Names}} {{.Status}}" 2>/dev/null | head -1');
    if (!output) {
      return NextResponse.json({ success: false, message: 'MinIO container not running. Run "docker compose up -d".' });
    }
    return NextResponse.json({ success: true, message: `MinIO running: ${output}. Console at http://localhost:9001` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `MinIO check failed. ${error.message}` });
  }
}
