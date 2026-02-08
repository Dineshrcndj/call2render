const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');

const app = express();

// Critical: Enable CORS for WebSocket connections
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

const server = http.createServer(app);

// Create PeerJS server
const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/peerjs',
    proxied: true,
    allow_discovery: true,
    corsOptions: {
        origin: '*',
        credentials: false
    }
});

app.use('/peerjs', peerServer);

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        server: 'Render.com Free',
        connections: peerServer._clients?.size || 0,
        uptime: process.uptime()
    });
});

// Info page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>PeerJS Server</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .success { color: green; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>✅ PeerJS Signaling Server</h1>
            <p class="success">Status: Running</p>
            <p><strong>Server URL:</strong> call2render.onrender.com</p>
            <p><strong>WebSocket Endpoint:</strong> wss://call2render.onrender.com/peerjs</p>
            <p><strong>Health Check:</strong> <a href="/health">/health</a></p>
            <p><strong>Clients Connected:</strong> ${peerServer._clients?.size || 0}</p>
        </body>
        </html>
    `);
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ PeerJS WebSocket: ws://0.0.0.0:${PORT}/peerjs`);
    console.log(`✅ Health endpoint: http://0.0.0.0:${PORT}/health`);
    console.log(`✅ CORS enabled for all origins`);
});
