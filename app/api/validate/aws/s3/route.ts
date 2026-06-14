import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName, region } = await request.json();
    await runCli(`aws s3api head-bucket --bucket "${resourceName}" --region ${region}`);
    // Get bucket location
    const locOutput = await runCli(`aws s3api get-bucket-location --bucket "${resourceName}" --output json`);
    const loc = JSON.parse(locOutput);
    return NextResponse.json({
      success: true,
      message: `Bucket "${resourceName}" exists. Region: ${loc.LocationConstraint || 'us-east-1'}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Bucket not found or no access. ${error.message}` });
  }
}
