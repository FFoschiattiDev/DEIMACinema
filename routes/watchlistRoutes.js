// routes/watchlistRoutes.js - Watchlist routes
const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

// List all items (with search and filters)
router.get('/', watchlistController.index);

// Create form
router.get('/create', watchlistController.showCreate);

// Create item
router.post('/', watchlistController.create);

// Edit form / Get item by ID
router.get('/edit/:id', watchlistController.showEdit);
router.get('/:id', watchlistController.showEdit);

// Update item (supports both POST from HTML forms and PUT for REST API)
router.post('/edit/:id', watchlistController.update);
router.put('/:id', watchlistController.update);

// Delete item (supports both POST from HTML forms and DELETE for REST API)
router.post('/delete/:id', watchlistController.delete);
router.delete('/:id', watchlistController.delete);

module.exports = router;
