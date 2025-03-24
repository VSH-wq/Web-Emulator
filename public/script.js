const socket = io();

// Handle APK file upload form submission
document.getElementById('uploadForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(message => {
        document.getElementById('status').innerText = message;
    })
    .catch(err => {
        console.error('Upload error:', err);
        document.getElementById('status').innerText = 'Error uploading APK.';
    });
});
