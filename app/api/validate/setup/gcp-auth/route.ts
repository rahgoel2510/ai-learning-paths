import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const project = await runCli('gcloud config get-value project 2>/dev/null');
    const account = await runCli('gcloud config get-value account 2>/dev/null');
    if (!project || project === '(unset)') {
      return NextResponse.json({ success: false, message: 'No project set. Run "gcloud init" or "gcloud config set project YOUR_PROJECT_ID"' });
    }
    return NextResponse.json({ success: true, message: `Authenticated! Account: ${account}, Project: ${project}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `GCP auth failed. Run "gcloud auth login". ${error.message}` });
  }
}
