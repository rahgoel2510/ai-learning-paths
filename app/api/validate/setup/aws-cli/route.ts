import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const version = await runCli('aws --version');
    return NextResponse.json({ success: true, message: `AWS CLI installed: ${version.split('\n')[0]}` });
  } catch {
    return NextResponse.json({ success: false, message: 'AWS CLI not found. Install from https://aws.amazon.com/cli/' });
  }
}
