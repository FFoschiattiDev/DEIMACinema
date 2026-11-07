// middleware/authMiddleware.js - Session authentication middleware

const isApiRequest = (req) => {
  if (req.xhr) return true;
  if (req.is('json')) return true;
  const accept = req.headers.accept || '';
  if (accept.includes('application/json')) return true;
  const ua = req.headers['user-agent'] || '';
  if (ua.includes('Postman') || ua.includes('curl')) return true;
  if (req.headers['postman-token']) return true;
  if (!req.accepts('html')) return true;
  return false;
};

const authMiddleware = {
  isApiRequest,

  /**
   * Ensures the user is authenticated via session.
   * Responds with 401 JSON for API clients, redirects to /login for web browsers.
   */
  ensureAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    }
    if (isApiRequest(req)) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado: sesión no iniciada o inválida'
      });
    }
    return res.redirect('/login');
  }
};

module.exports = authMiddleware;
