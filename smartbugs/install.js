const { exec } = require('child_process');
const os = require('os');

const platform = os.platform();

if (platform === 'win32') {
  // Windows
  exec('cmd /c install-win.bat', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  });
} else if (platform === 'linux' || platform === 'darwin') {
  // Unix/Linux/Mac
  exec('sh install-unix.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  });
} else {
  console.error(`Unsupported platform: ${platform}`);
}
