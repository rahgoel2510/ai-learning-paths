import { NextResponse } from 'next/server';
import { runCli } from '@/app/lib/cli';

export async function POST(request: Request) {
  try {
    const { resourceName } = await request.json();
    const output = await runCli(`az consumption budget show --budget-name "${resourceName}" --output json`);
    const budget = JSON.parse(output);
    return NextResponse.json({
      success: true,
      message: `Budget "${budget.name}" found: $${budget.amount}/${budget.timeGrain.toLowerCase()}`,
      details: { name: budget.name, amount: budget.amount, timeGrain: budget.timeGrain },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `Budget not found. Create it in Azure Portal → Cost Management → Budgets. Error: ${error.message}` });
  }
}
