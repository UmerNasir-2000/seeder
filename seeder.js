import mysql from "mysql2/promise";
import axios from "axios";

async function bulkInsertMovies() {

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "dawaai_db",
    database: "yts_db",
    password: "dawaai_db",
  });

  let artistsObj = {};

  let genres = {
    'action': 1,
    'comedy': 2,
    'horror': 3,
    'animation': 4,
    'drama': 5,
    'mystery': 6,
    'crime': 7,
    'fantasy': 8,
    'adventure': 9,
    'superhero': 10,
    'sci-fi': 11,
    'thriller': 12,
    'romance': 13,
    'family': 14,
    'western': 15,
    'history': 16,
    'musical': 17,
    'biography': 18,
    'war': 19,
    'documentary': 20,
    'sport': 21,
    'film-noir': 22,
    'news': 23,
    'game-show': 24,
    'music': 25,
    'reality-tv': 26,
    'talk-show': 27,
  }

  for (let i = 1; i <= 200; i++) {
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

      if (data.data.movie.torrents !== undefined) {
        for (const torrent of data.data.movie.torrents) {
          const moviesTorrent = await connection.execute(`INSERT INTO movie_torrents(movie_id, hash, quality, type, seeds, peers, size_bytes) VALUES(${rows.insertId},"${torrent.hash}","${torrent.quality}","${torrent.type}",${torrent.seeds}, ${torrent.peers}, ${torrent.size_bytes})`)
        }
      }


      if (data.data.movie.genres !== undefined) {

        for (const genre of data.data.movie.genres) {
          await connection.execute(`INSERT INTO movie_genre_mapping(movie_id, genre_id) VALUES(${rows.insertId}, ${genres[genre.toLowerCase()]})`)
        }

      }



      if (data.data.movie.cast !== undefined) {

        for (const artist of data?.data?.movie?.cast) {

          if (!artistsObj[artist.imdb_code]) {

            let imageURL = artist.url_small_image ? artist.url_small_image : null;

            if (imageURL == null) {

              const [result, field] = await connection.execute(`INSERT INTO artists(full_name, imdb_code) VALUES("${artist.name}", "${artist.imdb_code}")`)

              if (result.insertId !== 0) artistsObj[artist.imdb_code] = result.insertId;


            } else {

              const [result, field] = await connection.execute(`INSERT INTO artists(full_name, image_url, imdb_code) VALUES("${artist.name}", "${imageURL}", "${artist.imdb_code}")`);

              if (result.insertId !== 0) artistsObj[artist.imdb_code] = result.insertId;

            }

          }



          await connection.execute(`INSERT INTO movie_cast_mapping(movie_id, artist_id, character_name) VALUES(${rows.insertId}, ${artistsObj[artist.imdb_code]}, "${artist.character_name}")`);

        }

      }

      console.log(`Movie inserted with id = ${rows.insertId}`)

    } catch (error) {
      console.log("🚀 ~ error", error)
    }



  }
}

bulkInsertMovies();
