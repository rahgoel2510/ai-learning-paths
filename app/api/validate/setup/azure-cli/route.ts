import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const version = await runCli('az --version 2>&1 | head -1');
    return NextResponse.json({ success: true, message: `Azure CLI installed: ${version}` });
  } catch {
    return NextResponse.json({ success: false, message: 'Azure CLI not found. Install it: brew install azure-cli (macOS) or visit https://aka.ms/installazurecli' });
  }
}
