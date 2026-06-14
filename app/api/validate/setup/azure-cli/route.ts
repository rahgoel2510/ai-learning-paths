import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const version = await runCli('az version --output json');
    const parsed = JSON.parse(version);
    return NextResponse.json({ success: true, message: `Azure CLI installed: ${parsed['azure-cli']}` });
  } catch {
    try {
      // Fallback: simpler check
      const v = await runCli('az --version');
      const firstLine = v.split('\n')[0];
      return NextResponse.json({ success: true, message: `Azure CLI installed: ${firstLine}` });
    } catch {
      return NextResponse.json({ success: false, message: 'Azure CLI not found. Install from https://aka.ms/installazurecli' });
    }
  }
}
