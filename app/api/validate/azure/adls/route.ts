import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName } = await request.json();
    const output = await runCli(`az storage account show --name "${resourceName}" --output json`);
    const account = JSON.parse(output);
    const isHns = account.isHnsEnabled;
    if (!isHns) {
      return NextResponse.json({ success: false, message: `Storage account "${resourceName}" exists but Hierarchical Namespace (ADLS Gen2) is NOT enabled.` });
    }
    return NextResponse.json({
      success: true,
      message: `ADLS Gen2 "${resourceName}" verified. Region: ${account.location}, HNS: enabled, Kind: ${account.kind}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Storage account not found. ${error.message}` });
  }
}
