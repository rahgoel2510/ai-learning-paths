import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName, region } = await request.json();
    // Verify the results bucket exists
    await runCli(`aws s3api head-bucket --bucket "${resourceName}" --region ${region}`);
    // Verify Athena is accessible
    const output = await runCli(`aws athena list-work-groups --region ${region} --output json`);
    const data = JSON.parse(output);
    const workgroups = data.WorkGroups?.map((w: any) => w.Name) || [];
    return NextResponse.json({
      success: true,
      message: `Athena ready. Results bucket "${resourceName}" exists. Workgroups: ${workgroups.join(', ')}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Athena validation failed. ${error.message}` });
  }
}
