-- ============================================================
-- Watchlist Database Setup
-- ============================================================

CREATE DATABASE IF NOT EXISTS watchlist_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE watchlist_db;

-- ============================================================
-- Table: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- Table: watchlist
-- ============================================================
CREATE TABLE IF NOT EXISTS watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  type ENUM('movie', 'series') NOT NULL,
  status ENUM('pending', 'watching', 'completed', 'dropped') NOT NULL DEFAULT 'pending',
  rating TINYINT UNSIGNED DEFAULT NULL,
  comment TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 10))
) ENGINE=InnoDB;

-- ============================================================
-- Insert predefined users
-- ============================================================
INSERT IGNORE INTO users (username) VALUES
  ('Lucas'),
  ('Luz'),
  ('Rami'),
  ('Foscha');

-- ============================================================
-- Sample data (optional, for testing)
-- ============================================================
INSERT INTO watchlist (user_id, title, type, status, rating, comment) VALUES
  -- Lucas
  ((SELECT id FROM users WHERE username = 'Lucas'), 'Breaking Bad', 'series', 'completed', 10, 'Una obra maestra de principio a fin.'),
  ((SELECT id FROM users WHERE username = 'Lucas'), 'Interstellar', 'movie', 'completed', 9, 'Ciencia ficción épica.'),
  ((SELECT id FROM users WHERE username = 'Lucas'), 'Dark', 'series', 'watching', 8, 'Viajes en el tiempo muy bien hechos.'),
  ((SELECT id FROM users WHERE username = 'Lucas'), 'The Batman', 'movie', 'pending', NULL, NULL),
  -- Luz
  ((SELECT id FROM users WHERE username = 'Luz'), 'Friends', 'series', 'completed', 7, 'Clásica comedia.'),
  ((SELECT id FROM users WHERE username = 'Luz'), 'Barbie', 'movie', 'completed', 8, 'Sorprendentemente buena.'),
  ((SELECT id FROM users WHERE username = 'Luz'), 'Stranger Things', 'series', 'watching', 8, NULL),
  -- Rami
  ((SELECT id FROM users WHERE username = 'Rami'), 'The Boys', 'series', 'watching', 9, 'Superhéroes con otro enfoque.'),
  ((SELECT id FROM users WHERE username = 'Rami'), 'Matrix', 'movie', 'completed', 9, 'Un clásico de ciencia ficción.'),
  ((SELECT id FROM users WHERE username = 'Rami'), 'Dune', 'movie', 'pending', NULL, 'Pendiente de ver la segunda parte.'),
  -- Foscha
  ((SELECT id FROM users WHERE username = 'Foscha'), 'Better Call Saul', 'series', 'completed', 10, 'Incluso mejor que Breaking Bad.'),
  ((SELECT id FROM users WHERE username = 'Foscha'), 'Blade Runner 2049', 'movie', 'completed', 9, 'Visualmente impresionante.'),
  ((SELECT id FROM users WHERE username = 'Foscha'), 'The Mandalorian', 'series', 'dropped', 5, 'Perdió el rumbo después de la primera temporada.');
