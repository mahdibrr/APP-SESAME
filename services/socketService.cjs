const { WebSocketServer } = require('ws');

let wss;
const clients = new Map(); // userId -> Set of WebSocket connections

exports.init = (server) => {
    wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        let userId = null;

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                if (data.type === 'auth' && data.userId) {
                    userId = data.userId;
                    if (!clients.has(userId)) clients.set(userId, new Set());
                    clients.get(userId).add(ws);
                    console.log(`User ${userId} connected via WebSocket`);
                }
            } catch (e) { }
        });

        ws.on('close', () => {
            if (userId && clients.has(userId)) {
                clients.get(userId).delete(ws);
                if (clients.get(userId).size === 0) clients.delete(userId);
                console.log(`User ${userId} disconnected`);
            }
        });
    });

    return wss;
};

exports.sendToUser = (userId, data) => {
    if (clients.has(userId)) {
        const message = JSON.stringify(data);
        clients.get(userId).forEach(ws => {
            if (ws.readyState === 1) {
                ws.send(message);
            }
        });
        return true;
    }
    return false;
};
