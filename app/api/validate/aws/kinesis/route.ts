import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName, region } = await request.json();
    const output = await runCli(`aws kinesis describe-stream-summary --stream-name "${resourceName}" --region ${region} --output json`);
    const data = JSON.parse(output);
    const summary = data.StreamDescriptionSummary;
    if (summary.StreamStatus !== 'ACTIVE') {
      return NextResponse.json({ success: false, message: `Stream status: ${summary.StreamStatus}. Wait for ACTIVE.` });
    }
    return NextResponse.json({
      success: true,
      message: `Stream "${resourceName}" is ACTIVE. Mode: ${summary.StreamModeDetails?.StreamMode || 'PROVISIONED'}, Shards: ${summary.OpenShardCount}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Kinesis stream not found. ${error.message}` });
  }
}
