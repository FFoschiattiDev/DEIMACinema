// controllers/authController.js - Authentication controller
const User = require('../models/User');
const { isApiRequest } = require('../middleware/authMiddleware');

const authController = {
  /**
   * GET /login - Show user selection screen
   */
  async showLogin(req, res) {
    try {
      // If already logged in, redirect to watchlist or return session info
      if (req.session && req.session.userId) {
        if (isApiRequest(req)) {
          return res.status(200).json({
            success: true,
            message: 'Ya tienes una sesión activa',
            data: { userId: req.session.userId, username: req.session.username }
          });
        }
        return res.redirect('/watchlist');
      }

      const users = await User.findAll();

      if (isApiRequest(req)) {
        return res.status(200).json({
          success: true,
          data: users
        });
      }

      return res.render('auth/login', { users });
    } catch (error) {
      console.error('Error loading login:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  /**
   * POST /login - Log in as selected user
   */
  async login(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'El campo userId es requerido'
        });
      }

      const parsedId = parseInt(userId, 10);
      if (isNaN(parsedId)) {
        return res.status(400).json({
          success: false,
          message: 'El campo userId debe ser un número válido'
        });
      }

      // Validate that the user exists in the database
      const user = await User.findById(parsedId);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado o credenciales inválidas'
        });
      }

      // Store user info in session
      req.session.userId = user.id;
      req.session.username = user.username;

      if (isApiRequest(req)) {
        return res.status(200).json({
          success: true,
          message: `Sesión iniciada correctamente como ${user.username}`,
          data: { id: user.id, username: user.username }
        });
      }

      return res.redirect('/watchlist');
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  /**
   * POST /logout - Destroy session and redirect to login
   */
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({
          success: false,
          message: 'Error al cerrar la sesión'
        });
      }
      if (isApiRequest(req)) {
        return res.status(200).json({
          success: true,
          message: 'Sesión cerrada correctamente'
        });
      }
      return res.redirect('/login');
    });
  }
};

module.exports = authController;
