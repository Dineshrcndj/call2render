const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
const server = app.listen(process.env.PORT || 8080);

const peerServer = ExpressPeerServer(server, {
    path: '/peerjs',
    debug: false,
    proxied: true
});

app.use('/peerjs', peerServer);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', server: 'Render.com Free' });
});

app.get('/', (req, res) => {
    res.send(`
        <h1>✅ PeerJS Server</h1>
        <p>Use this in your HTML: <code>your-app.onrender.com</code></p>
        <p><a href="/health">Health Check</a></p>
    `);
});

console.log('Server running');