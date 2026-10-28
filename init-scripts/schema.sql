CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `sku` varchar(100) NOT NULL COMMENT 'stock keeping unit',
  `price` decimal(10,2) UNSIGNED NOT NULL,
  `stock` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `low_stock_threshold` int(11) UNSIGNED NOT NULL DEFAULT 5,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `products`
  (`id`, `name`, `sku`, `price`, `stock`, `low_stock_threshold`)
VALUES
  (1, 'Desi Ghee', 'BUTTER_A1', 999.00, 22, 5),
  (2, 'Men\'s Wallet', 'MW-001', 40.00, 10, 5),
  (3, 'Basmati Rice 5kg', 'GR-001', 489.00, 40, 10),
  (4, 'Sunflower Oil 1L', 'GR-003', 142.00, 8, 12),
  (5, 'Sugar 1kg', 'GR-004', 46.00, 60, 20); 