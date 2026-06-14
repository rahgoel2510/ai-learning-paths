import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName } = await request.json();
    const accountOutput = await runCli('aws sts get-caller-identity --query Account --output text');
    const output = await runCli(`aws budgets describe-budget --account-id ${accountOutput} --budget-name "${resourceName}" --output json`);
    const data = JSON.parse(output);
    const budget = data.Budget;
    return NextResponse.json({
      success: true,
      message: `Budget "${budget.BudgetName}" found: $${budget.BudgetLimit.Amount}/${budget.TimeUnit.toLowerCase()}`,
      details: { name: budget.BudgetName, limit: budget.BudgetLimit.Amount, unit: budget.TimeUnit },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Budget not found. Create it in AWS Console → Billing → Budgets. Error: ${error.message}` });
  }
}
