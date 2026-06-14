import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  const { resourceName } = await request.json();
  const cmd = `az synapse workspace list --query "[?name=='${resourceName}']" --output json`;

  try {
    const output = await runCli(cmd);
    const workspaces = JSON.parse(output);
    if (workspaces.length === 0) {
      return NextResponse.json({ success: false, message: `Synapse workspace "${resourceName}" not found.\n\nDebug CLI: ${cmd}` });
    }
    const ws = workspaces[0];
    return NextResponse.json({
      success: true,
      message: `Synapse workspace "${ws.name}" verified. Region: ${ws.location}, SQL: ${ws.connectivityEndpoints?.sql || 'configured'}`,
      details: { cmd },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Validation failed: ${error.message}\n\nDebug CLI: ${cmd}` });
  }
}
