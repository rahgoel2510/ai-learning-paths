import { exec } from 'child_process';
import { platform } from 'os';

export function runCli(command: string): Promise<string> {
  const isWindows = platform() === 'win32';

  const shell = isWindows ? 'cmd.exe' : '/bin/sh';
  const shellFlag = isWindows ? '/c' : '-c';

  const extraPath = isWindows
    ? `${process.env.PATH};C:\\Program Files\\Microsoft SDKs\\Azure\\CLI2\\wbin;C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\wbin;C:\\Program Files\\Amazon\\AWSCLIV2;C:\\Users\\${process.env.USERNAME}\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\bin;C:\\Program Files\\Docker\\Docker\\resources\\bin`
    : `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin:/usr/local/google-cloud-sdk/bin`;

  return new Promise((resolve, reject) => {
    exec(command, {
      timeout: 15000,
      shell,
      env: { ...process.env, PATH: extraPath },
    }, (error, stdout, stderr) => {
      if (error) reject(new Error(stderr || error.message));
      else resolve(stdout.trim());
    });
  });
}
