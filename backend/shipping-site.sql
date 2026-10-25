-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 25, 2026 at 07:39 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shipping-site`
--

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int(11) NOT NULL,
  `tracker_number` varchar(255) NOT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `location` varchar(255) DEFAULT 'Unknown',
  `delivery_charge` enum('paid','not_paid') DEFAULT 'not_paid',
  `delivery_date` date DEFAULT curdate(),
  `shipped_out_date` datetime DEFAULT NULL,
  `sender_name` varchar(255) NOT NULL,
  `sender_address` varchar(255) NOT NULL,
  `recipient_address` varchar(255) NOT NULL,
  `package_information` text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `tracker_number`, `recipient_name`, `status`, `created_at`, `location`, `delivery_charge`, `delivery_date`, `shipped_out_date`, `sender_name`, `sender_address`, `recipient_address`, `package_information`) VALUES
(9, 'AAE1-12-7644093890', 'jessie maddox', 'In Transit', '2024-12-08 05:52:58', 'Queens, NY 11430, USA', 'paid', '2024-12-08', NULL, '', 'canada', '14 Awolowo Way, Ikeja, Lagos, Nigeria', ''),
(10, 'AAE1-12-6207696441', 'potato', 'hold', '2024-12-08 08:00:42', 'warri', 'paid', '2024-12-08', NULL, 'sam', 'abk', 'warri', ''),
(11, 'AAE1-12-9181284658', 'potato', 'arrived', '2024-12-08 08:04:28', 'edu', 'paid', '2024-12-08', NULL, 'sam', 'abk', 'warri', ''),
(12, 'AAE1-12-7652964491', 'Jane Smith', 'in_transit', '2024-12-08 08:37:28', 'Cityville Depot', 'paid', '2024-12-10', NULL, 'John Doe', '123 Main St, Cityville', '456 Elm St, Townsville', ''),
(13, 'AAE1-12-2887838966', 'potato', 'hold', '2024-12-08 08:38:37', 'edu', 'paid', '2024-12-08', NULL, 'sam', 'abk', 'warri', 'the packeage informtion an all t=if tat '),
(14, 'AAE1-12-6758815638', 'Alice Johnson', 'in_transit', '2025-06-03 03:36:20', 'Ikeja, Lagos', 'paid', '2025-06-10', NULL, 'Bob Smith', '12 Akinwale Street, Lagos', '45 Oyebanjo Road, Ikeja', ''),
(15, 'AAE1-12-2472601632', 'Alice Johnson', 'in_transit', '2025-06-03 03:39:05', 'Ikeja, Lagos', 'paid', '2025-06-10', NULL, 'Bob Smith', '12 Akinwale Street, Lagos', '45 Oyebanjo Road, Ikeja', 'noted '),
(16, 'AAE1-12-8827993344', 'Alice Johnson', 'in_transit', '2025-06-03 03:41:25', 'Ikeja, Lagos', 'paid', '2025-06-10', NULL, 'Bob Smith', '12 Akinwale Street, Lagos', '45 Oyebanjo Road, Ikeja', 'Fragile—handle with care. Contains electronic items.');

-- --------------------------------------------------------

--
-- Table structure for table `package_updates`
--

CREATE TABLE `package_updates` (
  `id` int(11) NOT NULL,
  `tracker_number` varchar(50) NOT NULL,
  `update_message` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package_updates`
--

INSERT INTO `package_updates` (`id`, `tracker_number`, `update_message`, `location`, `created_at`) VALUES
(1, 'AAE1-12-7644093890', 'Package received at Lagos transit hub', 'Edo, Nigeria', '2025-12-18 15:57:24'),
(2, 'AAE1-12-7644093890', 'Package received at Lagos transit hub', 'Delta, Nigeria', '2025-12-18 16:21:38'),
(3, 'AAE1-12-2887838966', 'loading the goods', 'warri', '2025-12-18 17:08:23'),
(4, 'AAE1-12-6758815638', 'yes', 'ph', '2026-02-08 15:11:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(20) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `created_at`, `role`) VALUES
(1, 'admin@admin.com', '123456', '2025-06-03 02:53:32', 'user'),
(2, '8amlight@gmail.com', '$2b$12$gtsYsOQMh.nXhjxQ/NkGkePhCSXcuV5pocp/yrorUOQBPSr48vC0a', '2026-02-08 14:24:27', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tracker_number` (`tracker_number`);

--
-- Indexes for table `package_updates`
--
ALTER TABLE `package_updates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `package_updates`
--
ALTER TABLE `package_updates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
