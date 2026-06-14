import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST() {
  try {
    const output = await runCli('aws sts get-caller-identity --output json');
    const identity = JSON.parse(output);
    // Try to get account alias (friendly name)
    let accountName = identity.Account;
    try {
      const aliases = await runCli('aws iam list-account-aliases --output json');
      const parsed = JSON.parse(aliases);
      if (parsed.AccountAliases?.length) accountName = parsed.AccountAliases[0];
    } catch { /* no alias set */ }

    return NextResponse.json({
      success: true,
      message: `Authenticated! Account: ${accountName} (${identity.Account}), User: ${identity.Arn}`,
      details: { account: identity.Account, accountName, arn: identity.Arn, userId: identity.UserId },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `AWS credentials not configured. Run "aws configure" in terminal. Error: ${error.message}` });
  }
}
