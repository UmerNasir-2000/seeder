import mysql from "mysql2";
import axios from "axios";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "yts_db",
  password: "Cena@2000",
});

async function bulkInsertMovies() {
  for (let i = 1; i <= 10; i++) {
    const { data } = await axios.get(
      `https://yts.mx/api/v2/movie_details.json?movie_id=${i}`
    );

    let insertedMovieId = 0;

    connection.execute(
      `INSERT INTO movies(imdb_code, yt_trailer_code, title, released_year, rating, language, runtime_in_minutes) VALUES('${data.data.movie.imdb_code}','${data.data.movie.yt_trailer_code}','${data.data.movie.title}',${data.data.movie.year},${data.data.movie.rating},'${data.data.movie.language}',${data.data.movie.runtime})`,
      function (err, results, fields) {
        if (results?.insertId !== 0) {
          insertedMovieId = results.insertId;
          console.log(`Movie Inserted with id = ${insertedMovieId}`);

          connection.execute(
            `INSERT INTO movie_images(movie_id, background, small_cover, medium_cover, large_cover) VALUES(${insertedMovieId},"${data.data.movie.background_image_original}","${data.data.movie.small_cover_image}","${data.data.movie.medium_cover_image}","${data.data.movie.large_cover_image}")`,
            function (err, results, fields) {
              console.log(`🚀 ~ err`, err);
            }
          );
        }
      }
    );

    for (const torrent of data.data.movie.torrents) {
      connection.execute(
        `INSERT INTO movie_torrents(movie_id, hash, quality, type, seeds, peers, size_bytes) VALUES(${insertedMovieId},"${torrent.hash}","${torrent.quality}","${torrent.type}",${torrent.seeds}, ${torrent.peers}, ${torrent.size_bytes})`,
        function (err, results, fields) {
          console.log(`🚀 ~ err`, err);
        }
      );
    }
  }
}

bulkInsertMovies();
