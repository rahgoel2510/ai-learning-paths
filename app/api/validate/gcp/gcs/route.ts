import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName } = await request.json();
    const output = await runCli(`gsutil ls -b gs://${resourceName}/ 2>&1`);
    return NextResponse.json({ success: true, message: `GCS bucket "gs://${resourceName}/" exists. ${output.trim()}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Bucket not found. ${error.message}` });
  }
}
