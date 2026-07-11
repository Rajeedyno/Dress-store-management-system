USE dress_store;

INSERT INTO users (full_name, email, password_hash, role_id) VALUES
('System Admin', 'admin@example.com', '$2b$12$D3uU9jF6zQ4G7sKJq0nU0eQ6bNqnxiyUQ0C8Nw6JjZ8u0m5v3x6X2', 1),
('Jane Worker', 'worker@example.com', '$2b$12$D3uU9jF6zQ4G7sKJq0nU0eQ6bNqnxiyUQ0C8Nw6JjZ8u0m5v3x6X2', 2),
('John Customer', 'customer@example.com', '$2b$12$D3uU9jF6zQ4G7sKJq0nU0eQ6bNqnxiyUQ0C8Nw6JjZ8u0m5v3x6X2', 3);

INSERT INTO dresses (name, category, description, price, image_url, is_active) VALUES
('Elegant Silk Gown', 'Women', 'Formal evening wear', 89.99, 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b', TRUE),
('Classic Denim Jacket', 'Men', 'Casual outerwear', 49.99, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f', TRUE),
('Colorful Party Dress', 'Kids', 'Fun party wear for kids', 34.99, 'https://images.unsplash.com/photo-1519340241574-2cec6a7b0d6d', TRUE),
('Navy Formal Suit', 'Formal', 'Sharp office wear', 119.99, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', TRUE),
('Summer Floral Dress', 'Casual', 'Lightweight summer style', 39.99, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c', TRUE);

INSERT INTO inventory (dress_id, stock_quantity, low_stock_threshold) VALUES
(1, 12, 5),
(2, 8, 5),
(3, 3, 5),
(4, 15, 5),
(5, 7, 5);
