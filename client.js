import { spawn } from 'child_process';

const dataToPassIn = 'send this to python script';

console.log('Data sent to python script:', dataToPassIn);

const pythonProcess = spawn('python', ['./app.py', dataToPassIn]);

pythonProcess.stdout.on('data', (data) => {
    console.log('Data received from python script:', data.toString());
});

pythonProcess.stderr.on('data', (data) => {
    console.error('Error received from python script:', data.toString());
});
