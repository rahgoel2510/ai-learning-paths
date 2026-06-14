import { exec } from 'child_process';

export function runCli(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 15000, env: { ...process.env, PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin` } }, (error, stdout, stderr) => {
      if (error) reject(new Error(stderr || error.message));
      else resolve(stdout.trim());
    });
  });
}
