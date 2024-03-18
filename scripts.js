// Function to fetch movie data from OMDB API
async function searchMovies(query) {
  const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=b2c75baf`);
  const data = await response.json();
  return data.Search || [];
}

// Function to fetch detailed movie data from OMDB API
async function getMovieDetails(id) {
  const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=b2c75baf`);
  const data = await response.json();
  return data;
}

// Function to display search results
function showResults(results) {
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';

  results.forEach(async movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    const details = await getMovieDetails(movie.imdbID);

    const image = document.createElement('img');
    image.src = details.Poster;
    movieElement.appendChild(image);

    const movieDetails = document.createElement('div');
    movieDetails.classList.add('movie-details');

    const title = document.createElement('h2');
    title.textContent = details.Title;
    movieDetails.appendChild(title);

    const plot = document.createElement('p');
    plot.textContent = details.Plot;
    movieDetails.appendChild(plot);

    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = 'Add to Favorites';
    favoriteButton.classList.add('favorite-btn');
    favoriteButton.addEventListener('click', () => addToFavorites(details));
    movieDetails.appendChild(favoriteButton);

    movieElement.appendChild(movieDetails);

    // Navigate to movie page on click
    movieElement.addEventListener('click', () => {
      localStorage.setItem('selectedMovie', JSON.stringify(details));
      window.location.href = 'movie.html';
    });

    searchResults.appendChild(movieElement);
  });

}

// Function to add movie to favorites
function addToFavorites(movie) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  // Check if the movie is already in favorites
  const isAlreadyFavorite = favorites.some(favorite => favorite.imdbID === movie.imdbID);
  
  if (!isAlreadyFavorite) {
    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } 
}


// Function to remove movie from favorites
function removeFromFavorites(movieId) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(movie => movie.imdbID !== movieId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to display favorite movies
function showFavorites() {
  const favoritesList = document.getElementById('favoritesList');
  favoritesList.innerHTML = '';

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  favorites.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    const image = document.createElement('img');
    image.src = movie.Poster;
    movieElement.appendChild(image);

    const title = document.createElement('h2');
    title.textContent = movie.Title;
    movieElement.appendChild(title);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove from Favorites';
    removeButton.classList.add('favorite-btn');
    removeButton.addEventListener('click', () => {
      removeFromFavorites(movie.imdbID);
      showFavorites();
    });
    movieElement.appendChild(removeButton);

    favoritesList.appendChild(movieElement);
  });
}

// Function to initialize the app
function init() {
  const pathname = window.location.pathname;

  if (pathname.includes('index.html')) {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', async () => {
      const query = searchInput.value;
      if (query.length > 2) {
        const results = await searchMovies(query);
        showResults(results);
      }
    });
  } else if (pathname.includes('movie.html')) {
    const selectedMovie = JSON.parse(localStorage.getItem('selectedMovie'));
    const movieDetails = document.getElementById('movieDetails');

    const image = document.createElement('img');
    image.src = selectedMovie.Poster;
    movieDetails.appendChild(image);

    const title = document.createElement('h2');
    title.textContent = selectedMovie.Title;
    movieDetails.appendChild(title);

    const plot = document.createElement('p');
    plot.textContent = selectedMovie.Plot;
    movieDetails.appendChild(plot);

    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = 'Add to Favorites';
    favoriteButton.classList.add('favorite-btn');
    favoriteButton.addEventListener('click', () => addToFavorites(selectedMovie));
    movieDetails.appendChild(favoriteButton);
  } else if (pathname.includes('favorites.html')) {
    showFavorites();
  }
}

init();
