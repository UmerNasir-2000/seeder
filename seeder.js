import mysql from "mysql2/promise";
import axios from "axios";



async function bulkInsertMovies() {

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "dawaai_db",
    database: "yts_db",
    password: "dawaai_db",
  });

  let artists = {};

  let genres = {
    'action': 1,
    'comedy': 2,
    'horror': 3,
    'animation': 4,
    'drama': 5,
    'mystrey': 6,
    'crime': 7,
    'fantasy': 8,
    'adventure': 9,
    'superhero': 10,
    'sci-fi': 11,
    'thriller': 12,
    'romance': 13,
  }

  for (let i = 300; i <= 320; i++) {
    const { data } = await axios.get(
      `https://yts.mx/api/v2/movie_details.json?movie_id=${i}&with_cast=true&with_images=true`
    );


    try {

      const [rows, fields] = await connection.execute(
        `INSERT INTO movies(imdb_code, yt_trailer_code, title, released_year, rating, language, runtime_in_minutes) VALUES('${data.data.movie.imdb_code}','${data.data.movie.yt_trailer_code}',"${data.data.movie.title}",${data.data.movie.year},${data.data.movie.rating},'${data.data.movie.language}',${data.data.movie.runtime})`
      );

      const moviePosters = await connection.execute(
        `INSERT INTO movie_posters(movie_id, background, small_cover, medium_cover, large_cover) VALUES(${rows.insertId},"${data.data.movie.background_image_original}","${data.data.movie.small_cover_image}","${data.data.movie.medium_cover_image}","${data.data.movie.large_cover_image}")`
      );

      await connection.execute(
        `INSERT INTO movie_images(movie_id, image, image_quality) VALUES(${rows.insertId},"${data.data.movie.medium_screenshot_image1}","medium")`
      );

      await connection.execute(
        `INSERT INTO movie_images(movie_id, image, image_quality) VALUES(${rows.insertId},"${data.data.movie.medium_screenshot_image2}","medium")`
      );

      await connection.execute(
        `INSERT INTO movie_images(movie_id, image, image_quality) VALUES(${rows.insertId},"${data.data.movie.medium_screenshot_image3}","medium")`
      );

      await connection.execute(
        `INSERT INTO movie_images(movie_id, image, image_quality) VALUES(${rows.insertId},"${data.data.movie.large_screenshot_image1}","large")`
      );

      await connection.execute(
        `INSERT INTO movie_images(movie_id, image, image_quality) VALUES(${rows.insertId},"${data.data.movie.large_screenshot_image2}","large")`
      );

      await connection.execute(
        `INSERT INTO movie_images(movie_id, image, image_quality) VALUES(${rows.insertId},"${data.data.movie.large_screenshot_image3}","large")`
      );

      for (const torrent of data.data.movie.torrents) {
        const moviesTorrent = await connection.execute(`INSERT INTO movie_torrents(movie_id, hash, quality, type, seeds, peers, size_bytes) VALUES(${rows.insertId},"${torrent.hash}","${torrent.quality}","${torrent.type}",${torrent.seeds}, ${torrent.peers}, ${torrent.size_bytes})`)
      }

      console.log(`Movie inserted with id = ${rows.insertId}`)

    } catch (error) {
      console.log("🚀 ~ error", error)
    }



  }
}

bulkInsertMovies();
