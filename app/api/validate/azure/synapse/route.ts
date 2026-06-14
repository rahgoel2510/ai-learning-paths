import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName } = await request.json();
    const output = await runCli(`az synapse workspace list --query "[?name=='${resourceName}']" --output json`);
    const workspaces = JSON.parse(output);
    if (workspaces.length === 0) {
      return NextResponse.json({ success: false, message: `Synapse workspace "${resourceName}" not found.` });
    }
    const ws = workspaces[0];
    return NextResponse.json({
      success: true,
      message: `Synapse workspace "${ws.name}" verified. Region: ${ws.location}, SQL endpoint: ${ws.connectivityEndpoints?.sql || 'configured'}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Synapse validation failed. ${error.message}` });
  }
}
