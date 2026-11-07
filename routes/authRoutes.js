// routes/authRoutes.js - Authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isApiRequest } = require('../middleware/authMiddleware');

// Root redirect
router.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        message: 'Sesión activa',
        data: { userId: req.session.userId, username: req.session.username }
      });
    }
    return res.redirect('/watchlist');
  }
  if (isApiRequest(req)) {
    return res.status(401).json({
      success: false,
      message: 'No autenticado. Por favor inicie sesión en /login'
    });
  }
  return res.redirect('/login');
});

// Login
router.get('/login', authController.showLogin);
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
