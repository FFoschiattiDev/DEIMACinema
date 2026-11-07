// controllers/watchlistController.js - Watchlist controller
const Watchlist = require('../models/Watchlist');
const { isApiRequest } = require('../middleware/authMiddleware');

const watchlistController = {
  /**
   * GET /watchlist - List items with search and filters + dashboard stats
   */
  async index(req, res) {
    try {
      const userId = req.session.userId;
      const { search, type, status } = req.query;

      const items = await Watchlist.findByUser(userId, { search, type, status });
      const stats = await Watchlist.getStats(userId);

      if (isApiRequest(req)) {
        return res.status(200).json({
          success: true,
          data: {
            items,
            stats
          }
        });
      }

      return res.render('watchlist/index', {
        username: req.session.username,
        items,
        stats,
        filters: { search: search || '', type: type || '', status: status || '' }
      });
    } catch (error) {
      console.error('Error listing watchlist:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  /**
   * GET /watchlist/create - Show create form
   */
  showCreate(req, res) {
    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        message: 'Formulario de creación de watchlist',
        data: {
          allowedTypes: ['movie', 'series'],
          allowedStatuses: ['pending', 'watching', 'completed', 'dropped']
        }
      });
    }
    return res.render('watchlist/create', {
      username: req.session.username
    });
  },

  /**
   * POST /watchlist - Create a new item
   */
  async create(req, res) {
    try {
      const { title, type, status, rating, comment } = req.body;

      // Validate required fields
      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El campo título es obligatorio'
        });
      }

      if (!type) {
        return res.status(400).json({
          success: false,
          message: 'El campo tipo es obligatorio'
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'El campo estado es obligatorio'
        });
      }

      // Validate type
      if (!['movie', 'series'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'El tipo debe ser "movie" o "series"'
        });
      }

      // Validate status
      if (!['pending', 'watching', 'completed', 'dropped'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'El estado debe ser "pending", "watching", "completed" o "dropped"'
        });
      }

      // Validate rating
      let parsedRating = null;
      if (rating !== undefined && rating !== null && rating !== '') {
        parsedRating = parseInt(rating, 10);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 10) {
          return res.status(400).json({
            success: false,
            message: 'La puntuación debe ser un número entre 1 y 10'
          });
        }
      }

      // Check for duplicate in user's watchlist
      const existingItems = await Watchlist.findByUser(req.session.userId, { search: title.trim() });
      const isDuplicate = existingItems.some(
        item => item.title.trim().toLowerCase() === title.trim().toLowerCase()
      );

      if (isDuplicate) {
        return res.status(409).json({
          success: false,
          message: 'Este título ya se encuentra en tu watchlist'
        });
      }

      // user_id comes from the session, NEVER from the form
      const insertId = await Watchlist.create({
        user_id: req.session.userId,
        title: title.trim(),
        type,
        status,
        rating: parsedRating,
        comment: comment ? comment.trim() : null
      });

      const newItem = {
        id: insertId,
        user_id: req.session.userId,
        title: title.trim(),
        type,
        status,
        rating: parsedRating,
        comment: comment ? comment.trim() : null
      };

      if (isApiRequest(req)) {
        return res.status(201).json({
          success: true,
          message: 'Recurso creado correctamente',
          data: newItem
        });
      }

      return res.redirect('/watchlist');
    } catch (error) {
      console.error('Error creating item:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Este título ya se encuentra en tu watchlist'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  /**
   * GET /watchlist/edit/:id or GET /watchlist/:id - Show edit form / item details
   */
  async showEdit(req, res) {
    try {
      const itemId = parseInt(req.params.id, 10);
      if (isNaN(itemId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de elemento inválido'
        });
      }

      const item = await Watchlist.findById(itemId);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Elemento no encontrado'
        });
      }

      // Check ownership
      if (item.user_id !== req.session.userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para acceder a este elemento'
        });
      }

      if (isApiRequest(req)) {
        return res.status(200).json({
          success: true,
          data: item
        });
      }

      return res.render('watchlist/edit', {
        username: req.session.username,
        item
      });
    } catch (error) {
      console.error('Error loading edit form:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  /**
   * POST /watchlist/edit/:id or PUT /watchlist/:id - Update an item
   */
  async update(req, res) {
    try {
      const itemId = parseInt(req.params.id, 10);
      if (isNaN(itemId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de elemento inválido'
        });
      }

      const item = await Watchlist.findById(itemId);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Elemento no encontrado'
        });
      }

      // Check ownership
      if (item.user_id !== req.session.userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para modificar este elemento'
        });
      }

      const { title, type, status, rating, comment } = req.body;

      // Validate required fields
      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El campo título es obligatorio'
        });
      }

      if (!type) {
        return res.status(400).json({
          success: false,
          message: 'El campo tipo es obligatorio'
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'El campo estado es obligatorio'
        });
      }

      if (!['movie', 'series'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'El tipo debe ser "movie" o "series"'
        });
      }

      if (!['pending', 'watching', 'completed', 'dropped'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'El estado debe ser "pending", "watching", "completed" o "dropped"'
        });
      }

      let parsedRating = null;
      if (rating !== undefined && rating !== null && rating !== '') {
        parsedRating = parseInt(rating, 10);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 10) {
          return res.status(400).json({
            success: false,
            message: 'La puntuación debe ser un número entre 1 y 10'
          });
        }
      }

      await Watchlist.update(itemId, {
        title: title.trim(),
        type,
        status,
        rating: parsedRating,
        comment: comment ? comment.trim() : null
      });

      if (isApiRequest(req)) {
        return res.status(200).json({
          success: true,
          message: 'Recurso actualizado correctamente',
          data: {
            id: itemId,
            user_id: req.session.userId,
            title: title.trim(),
            type,
            status,
            rating: parsedRating,
            comment: comment ? comment.trim() : null
          }
        });
      }

      return res.redirect('/watchlist');
    } catch (error) {
      console.error('Error updating item:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Conflicto con un registro duplicado'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  /**
   * POST /watchlist/delete/:id or DELETE /watchlist/:id - Delete an item
   */
  async delete(req, res) {
    try {
      const itemId = parseInt(req.params.id, 10);
      if (isNaN(itemId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de elemento inválido'
        });
      }

      const item = await Watchlist.findById(itemId);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Elemento no encontrado'
        });
      }

      // Check ownership
      if (item.user_id !== req.session.userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar este elemento'
        });
      }

      await Watchlist.delete(itemId);

      if (isApiRequest(req)) {
        return res.status(200).json({
          success: true,
          message: 'Elemento eliminado correctamente'
        });
      }

      return res.redirect('/watchlist');
    } catch (error) {
      console.error('Error deleting item:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};

module.exports = watchlistController;
