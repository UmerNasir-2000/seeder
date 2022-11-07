CREATE DATABASE IF NOT EXISTS `yts_db`;

CREATE TABLE `movies`(
    `id` INT AUTO_INCREMENT,
    `imdb_code` CHAR(9) NOT NULL,
    `yt_trailer_code` CHAR(11) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `released_year` YEAR(4) NOT NULL,
    `rating` DECIMAL(2,1) NOT NULL,
    `language` VARCHAR(10) NOT NULL,
    `status` ENUM('released', 'upcoming') DEFAULT 'released',
    `runtime_in_minutes` INT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
     primary key (`id`)
);

CREATE TABLE `movie_posters`(
    `id` INT AUTO_INCREMENT,
    `movie_id` INT NOT NULL,
    `background` VARCHAR(255) NOT NULL,
    `small_cover` VARCHAR(255) NOT NULL,
    `medium_cover` VARCHAR(255) NOT NULL,
    `large_cover` VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
     primary key (`id`)
);

CREATE TABLE `movie_torrents`(
    `id` INT AUTO_INCREMENT,
    `movie_id` INT NOT NULL,
    `hash` TEXT NOT NULL,
    `quality` VARCHAR(20) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `seeds` INT NOT NULL,
    `peers` INT NOT NULL,
    `size_bytes` INT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
     primary key (`id`)
);

CREATE TABLE `movie_genres`(
    `id` INT AUTO_INCREMENT,
    `type` ENUM('action', 'comedy', 'horror', 'animation', 'drama', 'mystrey', 'crime', 'fantasy', 'adventure', 'superhero', 'sci-fi', 'thriller', 'romance') NOT NULL,
     primary key (`id`)
);

CREATE TABLE `artists`(
    `id` INT AUTO_INCREMENT,
    `full_name` VARCHAR(255) NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `imdb_code` CHAR(7) UNIQUE NOT NULL,
     primary key (`id`)
);
INSERT INTO yts_db.movie_genres (`type`) VALUES
	 ('action'),
	 ('comedy'),
	 ('horror'),
	 ('animation'),
	 ('drama'),
	 ('mystrey'),
	 ('crime'),
	 ('fantasy'),
	 ('adventure'),
	 ('superhero');
INSERT INTO yts_db.movie_genres (`type`) VALUES
	 ('sci-fi'),
	 ('thriller'),
	 ('romance');


CREATE TABLE `movie_cast_mapping`(
    `id` INT AUTO_INCREMENT,
    `movie_id` INT NOT NULL,
    `artist_id` INT NOT NULL,
    `imdb_code` CHAR(7) NOT NULL,
     primary key (`id`)
);

CREATE TABLE `movie_genre_mapping`(
    `id` INT AUTO_INCREMENT,
    `movie_id` INT NOT NULL,
    `genre_id` INT NOT NULL,
     primary key (`id`)
);

CREATE TABLE `movie_images`(
    `id` INT AUTO_INCREMENT,
    `movie_id` INT NOT NULL,
    `image` TEXT NOT NULL,
    `image_quality` ENUM('medium', 'large') NOT NULL,
     primary key(`id`)
);
