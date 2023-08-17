// @ts-nocheck

import express from 'express';
import Database from 'better-sqlite3';
const db = new Database('favorites.db');

const router = express.Router();

router.get('/', (req, res) => {
    let query = 'SELECT * FROM favorites';
    const sort = req.query.sort;

    if (sort === 'asc') {
        query += ' ORDER BY name ASC';
    } else if (sort === 'desc') {
        query += ' ORDER BY name DESC';
    }

    const favorites = db.prepare(query).all();

    res.json({ favorites });
});

router.post('/', (req, res) => {
    const { name, url } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name required' });
    }
    if (!url) {
        return res.status(400).json({ error: 'Url required' });
    }

    const result = db
        .prepare('INSERT INTO favorites (name, url) VALUES (?, ?)')
        .run(name, url);
    res.status(201).json({ id: result.lastInsertRowid });
});

router.get('/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    const favorite = db.prepare('SELECT * FROM favorites WHERE id = ?').get(id);

    if (!favorite) {
        return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ favorite });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const result = db.prepare('DELETE FROM favorites WHERE id = ?').run(id);

    if (!result.changes) {
        return res.status(404).json({ error: 'Favorite not found' });
    }

    res.sendStatus(200);
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, url } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'name required' });
    }

    if (!url) {
        return res.status(400).json({ error: 'url required' });
    }

    const result = db
        .prepare('UPDATE favorites SET name=?, url=? WHERE id=?')
        .run(name, url, id);

    if (!result.changes) {
        return res.status(404).json({ error: 'Favorite not found' });
    }

    res.sendStatus(200);
});

router.patch('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, url } = req.body;

    if (!name && !url) {
        return res.status(400).json({ error: 'Name or URL required' });
    }
    const result = db
        .prepare(
            'UPDATE favorites SET name=COALESCE(?, name), url=COALESCE(?, url) WHERE id=?'
        )
        .run(name, url, id);

    if (!result.changes) {
        return res.status(404).json({ error: 'Favorite not found' });
    }

    res.sendStatus(200);
});

export default router;
