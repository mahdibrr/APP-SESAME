import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import socketService from './services/socketService.cjs';

import authRoutes from './routes/authRoutes.cjs';
import userRoutes from './routes/userRoutes.cjs';
import departmentRoutes from './routes/departmentRoutes.cjs';
import leaveRoutes from './routes/leaveRoutes.cjs';
import notificationRoutes from './routes/notificationRoutes.cjs';

const app = express();

// CORS Configuration
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'https://frontsesame.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Security & Production Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined')); // Request logging
}

// Rate Limiting
// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased limit for development
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS', // Skip rate limiting for preflight requests
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

app.use(express.json());

// Health check endpoints
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Render health check endpoint
app.get('/healthz', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'leave-management-backend',
        timestamp: new Date().toISOString()
    });
});

// Keep-alive endpoint
app.get('/api/ping', (req, res) => {
    res.status(200).json({
        message: 'pong',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime())
    });
});

// Routes
app.use('/api', authRoutes); // /api/login
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', leaveRoutes); // /api/leave-requests, /api/leave-balances

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Create HTTP server and initialize WebSocket
const server = createServer(app);
socketService.init(server);

// Keep-alive function to prevent server from sleeping
const keepAlive = () => {
    const serverUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
    
    setInterval(async () => {
        try {
            const response = await fetch(`${serverUrl}/api/ping`);
            if (response.ok) {
                console.log(`🏓 Keep-alive ping successful at ${new Date().toISOString()}`);
            }
        } catch (error) {
            console.log(`❌ Keep-alive ping failed: ${error.message}`);
        }
    }, 2 * 60 * 1000); // 2 minutes
};

// Auto-setup database on startup
const setupDatabase = async () => {
    try {
        console.log('🔄 Checking database connection...');
        const db = await import('./models/index.cjs');
        await db.default.sequelize.authenticate();
        console.log('✅ Database connected successfully');
        
        // Auto-sync tables in production (be careful with this)
        if (process.env.AUTO_SYNC_DB === 'true') {
            console.log('🔨 Auto-syncing database tables...');
            await db.default.sequelize.sync({ alter: true });
            console.log('✅ Database tables synced');
        }
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('⚠️  Server starting without database connection');
    }
};

// Start Server
const PORT = process.env.PORT || 3002;
server.listen(PORT, async () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS Origin: ${corsOptions.origin}`);
    
    // Setup database
    await setupDatabase();
    
    // Start keep-alive only in production
    if (process.env.NODE_ENV === 'production' && process.env.ENABLE_KEEP_ALIVE === 'true') {
        console.log('🏓 Keep-alive service started (pinging every 2 minutes)');
        keepAlive();
    }
});
