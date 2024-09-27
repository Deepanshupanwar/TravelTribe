document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Login successful:', data);
        // Here, you can initialize your socket connection after successful login
        initializeSocketConnection();
    })
    .catch(error => console.error('Login error:', error));
});

function initializeSocketConnection() {
    const socket = io('http://localhost:4000'); // Adjust to your socket server URL

    socket.on('connect', () => {
        console.log('Socket connected');
        // You can now send/receive messages
    });

    socket.on('message', (msg) => {
        console.log('New message:', msg);
    });
}
