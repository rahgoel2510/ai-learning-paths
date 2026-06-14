import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  const { resourceName } = await request.json();
  const cmd = `az storage account show --name "${resourceName}" --output json`;

  try {
    const output = await runCli(cmd);
    const account = JSON.parse(output);
    if (!account.isHnsEnabled) {
      return NextResponse.json({ success: false, message: `Storage account "${resourceName}" exists but Hierarchical Namespace (ADLS Gen2) is NOT enabled.\n\nDebug CLI: ${cmd}` });
    }
    return NextResponse.json({
      success: true,
      message: `ADLS Gen2 "${resourceName}" verified. Region: ${account.location}, HNS: enabled`,
      details: { cmd },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Storage account not found: ${error.message}\n\nDebug CLI: ${cmd}` });
  }
}
