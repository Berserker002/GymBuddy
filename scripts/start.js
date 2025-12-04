const { spawn } = require('child_process');

const cwd = process.cwd();
const isWindows = process.platform === 'win32';
const isWslUnc = isWindows && (cwd.startsWith('\\\\wsl.localhost\\') || cwd.startsWith('\\\\wsl$\\'));

if (isWslUnc) {
  console.error(
    `Expo cannot start from a UNC-mounted WSL path (current directory: ${cwd}).\n` +
      'Run the project from a Linux shell inside WSL with a Linux Node/Expo install, or move the repo under a Windows drive (e.g. C:\\Users\\...\\GymBuddy).'
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const child = spawn('npx', ['expo', 'start', ...args], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('error', (error) => {
  console.error('Failed to start Expo:', error);
  process.exit(1);
});

child.on('exit', (code) => process.exit(code ?? 0));
