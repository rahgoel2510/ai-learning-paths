import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName } = await request.json();
    const output = await runCli(`gcloud pubsub topics describe ${resourceName} --format="value(name)" 2>&1`);
    return NextResponse.json({ success: true, message: `Pub/Sub topic "${resourceName}" exists. ${output.trim()}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Topic not found. ${error.message}` });
  }
}
