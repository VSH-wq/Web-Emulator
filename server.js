const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { exec } = require('child_process');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configure Multer for file uploads (files are temporarily stored in the "uploads" folder)
const upload = multer({ dest: 'uploads/' });

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint for APK uploads
app.post('/upload', upload.single('apkFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const apkPath = req.file.path;
    const emulatorId = 'emulator-5554'; // Change this to your emulator ID

    // Install the APK using ADB
    exec(`adb -s ${emulatorId} install ${apkPath}`, (err, stdout, stderr) => {
        if (err) {
            console.error('Installation error:', stderr);
            return res.status(500).send('Failed to install APK.');
        }

        // Launch the app using the "monkey" tool (replace with your app's package name)
        exec(`adb -s ${emulatorId} shell monkey -p your.app.package -c android.intent.category.LAUNCHER 1`, (launchErr, launchStdout, launchStderr) => {
            if (launchErr) {
                console.error('Launch error:', launchStderr);
                return res.status(500).send('APK installed, but failed to launch.');
            }
            res.send('APK installed and app launched successfully.');
        });
    });
});

// Handle WebSocket connections (for future real-time interactions)
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
