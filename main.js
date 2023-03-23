// Declare an empty array to store the list of movies
let movieList = [];

// Fetch the list of all genres from the themoviedb.org API
fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=2f11f38bcc22191fe70ed49bbe0a20b8')
  .then(response => response.json())
  .then(data => {
    // Store the list of genres in a variable
    const genreList = data.genres;
    // Get a reference to the genre select element
    const genreSelect = document.querySelector('#genre-select');
    // Create an option element for "any" genre
    const anyOption = document.createElement('option');
    anyOption.value = '';
    anyOption.text = 'Any';
    // Add the "any" option to the select element
    genreSelect.add(anyOption);
    // Loop through all genres and create an option element for each one
    for (let i = 0; i < genreList.length; i++) {
      const option = document.createElement('option');
      option.value = genreList[i].id;
      option.text = genreList[i].name;
      // Add the option to the select element
      genreSelect.add(option);
    }
  });

// Loop through the first 50 pages of top-rated movies on TMDb
for (let i = 1; i <= 50; i++) {
  let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=2f11f38bcc22191fe70ed49bbe0a20b8&language=en-US&page=${i}`
  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      // Loop through all movies on the current page and add them to the movieList array
      for (i = 0; i < data.results.length; i++) {
        movieList.push({
          title: data.results[i].title,
          release_date: data.results[i].release_date,
          vote_average: data.results[i].vote_average,
          overview: data.results[i].overview,
          genre_ids: data.results[i].genre_ids,
          poster_path: data.results[i].poster_path
        });
      }
    });
}

// Add an event listener to the button that calls the pickMovie function when clicked
document.querySelector('button').addEventListener('click', pickMovie)

function pickMovie() {
  // Show the movie info container
  document.querySelector('#movieInfoContainer').style.display = 'block';

  let randomMovie = ''
  let filteredMovieList = []

  // Get the selected genre from the select element
  const selectedGenre = document.querySelector('#genre-select').value;

  // Loop through all movies in the movieList array and add them to the filteredMovieList array if they match the selected genre
  for (i = 0; i < movieList.length; i++) {
    if (selectedGenre === '' || movieList[i].genre_ids.includes(parseInt(selectedGenre))) {
      filteredMovieList.push(movieList[i]);
    }
  }

   // Check if there are any movies in the filteredMovieList array
   if (filteredMovieList.length > 0) {
    // Pick a random movie from the filteredMovieList array
    randomMovie = filteredMovieList[Math.floor(Math.random() * filteredMovieList.length)];
    // Update the page with information about the random movie
    document.querySelector('#movieTitle').innerText = `${randomMovie.title}`
    document.querySelector('#poster').src = `https://image.tmdb.org/t/p/original/${randomMovie.poster_path}`
    document.querySelector('#rating').innerText = `${randomMovie.vote_average} ✅`
    document.querySelector('#overview').innerText = `${randomMovie.overview}`
    document.querySelector('#releaseDate').innerText = `${randomMovie.release_date.substring(0, randomMovie.release_date.length - 6)}`

    // Fetch the list of all genres and find the genre names that match the random movie's genre IDs
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=2f11f38bcc22191fe70ed49bbe0a20b8')
      .then(response => response.json())
      .then(data => {
        const genreList = data.genres;
        let matchingGenres = [];
        for (let i = 0; i < randomMovie.genre_ids.length; i++) {
          const matchingGenre = genreList.find(genre => genre.id === randomMovie.genre_ids[i]);
          matchingGenres.push(matchingGenre.name);
        }
        document.querySelector('#genre').innerText = matchingGenres.join(', ');
      });
  } else {
    // If there are no movies in the filteredMovieList array, display an error message and reset the picker to its initial state
    alert('No movies found for selected genre. Please try again.');
    document.querySelector('#movieInfoContainer').style.display = 'none';
  }
}