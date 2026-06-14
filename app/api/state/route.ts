import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'state.json');

function readState() {
  if (!existsSync(DB_PATH)) return {};
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
}

function writeState(state: any) {
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) { require('fs').mkdirSync(dir, { recursive: true }); }
  writeFileSync(DB_PATH, JSON.stringify(state, null, 2));
}

export async function GET() {
  return NextResponse.json(readState());
}

export async function POST(request: Request) {
  const state = await request.json();
  writeState(state);
  return NextResponse.json({ ok: true });
}
