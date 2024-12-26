const path = require('path');
const { spawn } = require('child_process');

const runTests = () => {
    const testProcess = spawn('node', [path.join(__dirname, '../tests/system.test.js')], {
        stdio: 'inherit',
        env: { ...process.env }
    });

    testProcess.on('exit', (code) => {
        process.exit(code);
    });
};

runTests(); 