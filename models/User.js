// models/User.js - User model
const pool = require('../config/database');

const User = {
  /**
   * Get all users
   */
  async findAll() {
    const [rows] = await pool.query('SELECT id, username, created_at FROM users ORDER BY id');
    return rows;
  },

  /**
   * Find a user by ID
   */
  async findById(id) {
    const [rows] = await pool.query('SELECT id, username, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }
};

module.exports = User;
