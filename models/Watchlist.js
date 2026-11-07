// models/Watchlist.js - Watchlist model
const pool = require('../config/database');

const Watchlist = {
  /**
   * Get all items for a user, with optional search and filters
   */
  async findByUser(userId, { search, type, status } = {}) {
    let sql = 'SELECT * FROM watchlist WHERE user_id = ?';
    const params = [userId];

    if (search) {
      sql += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    if (type && ['movie', 'series'].includes(type)) {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (status && ['pending', 'watching', 'completed', 'dropped'].includes(status)) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY updated_at DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  /**
   * Find a single item by ID
   */
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM watchlist WHERE id = ?', [id]);
    return rows[0] || null;
  },

  /**
   * Create a new item
   */
  async create({ user_id, title, type, status, rating, comment }) {
    const [result] = await pool.query(
      'INSERT INTO watchlist (user_id, title, type, status, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, title, type, status, rating || null, comment || null]
    );
    return result.insertId;
  },

  /**
   * Update an item
   */
  async update(id, { title, type, status, rating, comment }) {
    const [result] = await pool.query(
      'UPDATE watchlist SET title = ?, type = ?, status = ?, rating = ?, comment = ? WHERE id = ?',
      [title, type, status, rating || null, comment || null, id]
    );
    return result.affectedRows;
  },

  /**
   * Delete an item
   */
  async delete(id) {
    const [result] = await pool.query('DELETE FROM watchlist WHERE id = ?', [id]);
    return result.affectedRows;
  },

  /**
   * Get dashboard stats for a user
   */
  async getStats(userId) {
    const [rows] = await pool.query(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN type = 'movie' THEN 1 ELSE 0 END) AS movies,
        SUM(CASE WHEN type = 'series' THEN 1 ELSE 0 END) AS series,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'watching' THEN 1 ELSE 0 END) AS watching,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed
      FROM watchlist
      WHERE user_id = ?`,
      [userId]
    );
    return rows[0];
  }
};

module.exports = Watchlist;
