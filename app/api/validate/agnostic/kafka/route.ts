import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const output = await runCli('docker ps --filter "ancestor=bitnami/kafka" --format "{{.Names}} {{.Status}}" 2>/dev/null | head -1');
    if (!output) {
      return NextResponse.json({ success: false, message: 'Kafka container not running. Run "docker compose up -d" in your project folder.' });
    }
    return NextResponse.json({ success: true, message: `Kafka running: ${output}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Kafka check failed. ${error.message}` });
  }
}
