import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName } = await request.json();
    // Find the namespace across resource groups
    const output = await runCli(`az eventhubs namespace show --name "${resourceName}" --output json`);
    const ns = JSON.parse(output);
    return NextResponse.json({
      success: true,
      message: `Event Hubs namespace "${ns.name}" is ${ns.status}. SKU: ${ns.sku?.name}, Region: ${ns.location}`,
    });
  } catch {
    // Try listing to find it
    try {
      const list = await runCli(`az eventhubs namespace list --query "[?name=='${(await request.clone().json()).resourceName}']" --output json`);
      const namespaces = JSON.parse(list);
      if (namespaces.length > 0) {
        const ns = namespaces[0];
        return NextResponse.json({
          success: true,
          message: `Event Hubs namespace "${ns.name}" found. Status: ${ns.status}, SKU: ${ns.sku?.name}`,
        });
      }
    } catch { /* fall through */ }
    return NextResponse.json({ success: false, message: `Event Hubs namespace not found. Create it in Azure Portal → Event Hubs.` });
  }
}
