import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName } = await request.json();
    await runCli(`bq show --dataset ${resourceName} 2>&1`);
    return NextResponse.json({ success: true, message: `BigQuery dataset "${resourceName}" exists.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Dataset not found. ${error.message}` });
  }
}
