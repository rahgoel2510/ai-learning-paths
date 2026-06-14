import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName, region } = await request.json();
    const output = await runCli(`aws firehose describe-delivery-stream --delivery-stream-name "${resourceName}" --region ${region} --output json`);
    const data = JSON.parse(output);
    const stream = data.DeliveryStreamDescription;
    if (stream.DeliveryStreamStatus !== 'ACTIVE') {
      return NextResponse.json({ success: false, message: `Firehose status: ${stream.DeliveryStreamStatus}. Wait for ACTIVE.` });
    }
    const dest = stream.Destinations?.[0];
    const s3Dest = dest?.ExtendedS3DestinationDescription || dest?.S3DestinationDescription;
    return NextResponse.json({
      success: true,
      message: `Firehose "${resourceName}" is ACTIVE. Destination: ${s3Dest?.BucketARN || 'configured'}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Firehose not found. ${error.message}` });
  }
}
