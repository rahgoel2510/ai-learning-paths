import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  const { resourceName } = await request.json();
  const cmd = `az eventhubs namespace list --query "[?name=='${resourceName}']" --output json`;

  try {
    const output = await runCli(cmd);
    const namespaces = JSON.parse(output);
    if (namespaces.length > 0) {
      const ns = namespaces[0];
      return NextResponse.json({
        success: true,
        message: `Event Hubs namespace "${ns.name}" found. Status: ${ns.status || 'Active'}, SKU: ${ns.sku?.name}, Region: ${ns.location}`,
        details: { cmd },
      });
    }
    return NextResponse.json({ success: false, message: `Namespace "${resourceName}" not found. Verify the name matches exactly (case-sensitive).\n\nDebug CLI: ${cmd}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Validation failed: ${error.message}\n\nDebug CLI: ${cmd}` });
  }
}
