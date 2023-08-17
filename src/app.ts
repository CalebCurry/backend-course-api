// @ts-nocheck

import express from 'express';
import Database from 'better-sqlite3';
import favorites from './routes/favorites.js';
import cors from 'cors';

const db = new Database('favorites.db');

const app = express();
const port = 3000;
app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:3001', 'http://localhost:3002'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeader: ['Content-Type', 'Accept'],
    })
);

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
//     res.setHeader(
//         'Access-Control-Allow-Methods',
//         'GET, POST, PUT, PATCH, DELETE'
//     );
//     next();
// });

app.use('/favorites', favorites);

app.get('/', (req, res) => {
    res.json({ hello: 'world' });
});

app.use((err, req, res, next) => {
    //console.log(err);
    if (err.name === 'SqliteError') {
        console.log('Db error hit!');
    }
    next(err);
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}...`);
});
