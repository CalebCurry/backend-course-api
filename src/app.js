import express from 'express';
import Database from 'better-sqlite3';
import favorites from './routes/favorites.js';

const db = new Database('favorites.db');

const app = express();
const port = 3000;
app.use(express.json());

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
