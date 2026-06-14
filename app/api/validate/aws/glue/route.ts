import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName, region } = await request.json();
    const output = await runCli(`aws glue get-database --name "${resourceName}" --region ${region} --output json`);
    const data = JSON.parse(output);
    const db = data.Database;
    return NextResponse.json({
      success: true,
      message: `Glue database "${db.Name}" exists. Created: ${db.CreateTime || 'yes'}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Glue database not found. ${error.message}` });
  }
}
