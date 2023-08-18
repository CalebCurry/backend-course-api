import express, { Request, Response } from 'express';
import Database, { RunResult } from 'better-sqlite3';
const db = new Database('favorites.db');

const router = express.Router();

interface Favorite {
    id?: number;
    name: string;
    url: string;
}

router.get(
    '/',
    (
        req: Request<any, any, any, { sort: string }>,
        res: Response<{ favorites: Favorite[] }>
    ) => {
        let query = 'SELECT * FROM favorites';
        const sort = req.query.sort;

        if (sort === 'asc') {
            query += ' ORDER BY name ASC';
        } else if (sort === 'desc') {
            query += ' ORDER BY name DESC';
        }

        const favorites = db.prepare(query).all() as Favorite[];

        res.json({ favorites });
    }
);

router.post(
    '/',
    (
        req: Request<any, any, Favorite>,
        res: Response<{ id: number | bigint } | { error: string }>
    ) => {
        const newFavorite: Favorite = req.body;

        if (!newFavorite.name) {
            return res.status(400).json({ error: 'Name required' });
        }
        if (!newFavorite.url) {
            return res.status(400).json({ error: 'Url required' });
        }

        const result = db
            .prepare('INSERT INTO favorites (name, url) VALUES (?, ?)')
            .run(newFavorite.name, newFavorite.url);
        res.status(201).json({ id: result.lastInsertRowid });
    }
);

router.get(
    '/:id',
    (
        req: Request<{ id: string }>,
        res: Response<{ favorite: Favorite } | { error: string }>
    ) => {
        const id = parseInt(req.params.id);
        const favorite = db
            .prepare('SELECT * FROM favorites WHERE id = ?')
            .get(id) as Favorite;

        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.json({ favorite });
    }
);

router.delete(
    '/:id',
    (
        req: Request<{ id: string }>,
        res: Response<string | { error: string }>
    ) => {
        const id = parseInt(req.params.id);
        const result = db.prepare('DELETE FROM favorites WHERE id = ?').run(id);

        if (!result.changes) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.sendStatus(200);
    }
);

router.put(
    '/:id',
    (
        req: Request<{ id: string }, {}, Favorite>,
        res: Response<{ favorite: Favorite } | { error: string }>
    ) => {
        const id = parseInt(req.params.id);
        const newFavorite = req.body;

        if (!newFavorite.name) {
            return res.status(400).json({ error: 'name required' });
        }

        if (!newFavorite.url) {
            return res.status(400).json({ error: 'url required' });
        }

        const result = db
            .prepare('UPDATE favorites SET name=?, url=? WHERE id=?')
            .run(newFavorite.name, newFavorite.url, id);

        if (!result.changes) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        const favorite = db
            .prepare('SELECT * FROM favorites WHERE id = ?')
            .get(id) as Favorite;

        res.status(200).send({ favorite });
    }
);

router.patch(
    '/:id',
    (
        req: Request<{ id: string }, any, Favorite>,
        res: Response<string | { error: string }>
    ) => {
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
    }
);

export default router;
