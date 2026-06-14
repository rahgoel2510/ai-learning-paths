import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');

  if (provider === 'aws') {
    try {
      const output = await runCli('aws sts get-caller-identity --output json');
      const identity = JSON.parse(output);
      let accountName = identity.Account;
      try {
        const aliases = await runCli('aws iam list-account-aliases --output json');
        const parsed = JSON.parse(aliases);
        if (parsed.AccountAliases?.length) accountName = parsed.AccountAliases[0];
      } catch { /* no alias */ }
      return NextResponse.json({ authenticated: true, accountName, accountId: identity.Account, arn: identity.Arn });
    } catch {
      return NextResponse.json({ authenticated: false });
    }
  }

  if (provider === 'azure') {
    try {
      const output = await runCli('az account show --output json');
      const account = JSON.parse(output);
      return NextResponse.json({ authenticated: true, accountName: account.name, subscriptionId: account.id, tenantId: account.tenantId });
    } catch {
      return NextResponse.json({ authenticated: false });
    }
  }

  return NextResponse.json({ error: 'Provide ?provider=aws or ?provider=azure' }, { status: 400 });
}
