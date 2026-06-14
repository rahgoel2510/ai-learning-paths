import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const output = await runCli('az account show --output json');
    const account = JSON.parse(output);
    return NextResponse.json({
      success: true,
      message: `Logged in! Subscription: "${account.name}" (${account.id}), Tenant: ${account.tenantId}`,
      details: { name: account.name, subscriptionId: account.id, tenantId: account.tenantId, state: account.state },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Not logged in. Run "az login" in your terminal. Error: ${error.message}` });
  }
}
