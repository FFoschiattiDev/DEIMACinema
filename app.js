// app.js - Main entry point for Watchlist application
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
}));

// Routes
app.use('/', authRoutes);
app.use('/watchlist', authMiddleware.ensureAuthenticated, watchlistRoutes);

// Manejador de rutas inexistentes (404)
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejador global de errores (ej. JSON mal formado en body o fallos inesperados)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'JSON mal formado en el cuerpo de la petición'
    });
  }

  console.error('Error no controlado en el servidor:', err);
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
