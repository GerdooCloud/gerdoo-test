const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: err.message });
  }
});

app.get('/api/notes', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM notes ORDER BY id DESC');
  res.json(rows);
});

app.post('/api/notes', async (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'text is required' });
  const { rows } = await pool.query('INSERT INTO notes (text) VALUES ($1) RETURNING *', [text]);
  res.status(201).json(rows[0]);
});

app.delete('/api/notes/:id', async (req, res) => {
  await pool.query('DELETE FROM notes WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

const port = process.env.PORT || 3000;
pool
  .query('CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY, text TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now())')
  .then(() => app.listen(port, () => console.log(`Listening on ${port}`)))
  .catch((err) => {
    console.error('Database init failed:', err.message);
    process.exit(1);
  });
