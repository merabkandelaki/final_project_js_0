const ImgPath = "https://image.tmdb.org/t/p/w1280";

const moviesCard = document.querySelector(".movies-card");
const form = document.querySelector(".form");
const search = document.querySelector(".search");
const btn = document.querySelector(".btn");
const next = document.querySelector(".next");
const previous = document.querySelector(".prev");
const icon = document.querySelector(".icon");

const PER_PAGE = 20;
let currentPage = 1;

function scrollToTop() {
  window.scroll({
    top: 1008,
    left: 0,
    behavior: "smooth",
  });
}

getMovies();

/* fetch movies */
async function getMovies() {
  const searchTerm = search.value;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMTU1YzIwODJjNDYyY2NiYzY1OWZiNDFmYTg5MmRlNyIsInN1YiI6IjY1MjJjYzQzMGNiMzM1MTZmNjNhMzRlOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EB19zj3lIM0s10NgEXo_B4IL-fZMRFKQpr2CJ893v-A",
    },
  };

  const currentRoute = searchTerm
    ? `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=${currentPage}`
    : `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=revenue.desc`;

  const respMovies = await fetch(currentRoute, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  /* fetch genres */
  const genreResp = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  console.log(genreResp);
  showMovies(respMovies.results, genreResp.genres);

  next.classList.remove("disabled");
  previous.classList.remove("disabled");

  if (currentPage === 1) {
    previous.classList.add("disabled");
  }
  if (
    respMovies.results.length < PER_PAGE ||
    respMovies.total_results <= PER_PAGE
  ) {
    next.classList.add("disabled");
  }
}

/* render movies */
function showMovies(movies, genres) {
  moviesCard.innerHTML = "";
  movies.forEach((movie) => {
    const {
      poster_path,
      title,
      original_title,
      overview,
      genre_ids,
      release_date,
      vote_average,
    } = movie;
    movie.genre_titles = [];
    genre_ids.forEach((id) => {
      const matchedGenre = genres.find((genre) => genre.id === id);
      movie.genre_titles.push(matchedGenre.name);
    });

    // create movie card elements
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    moviesCard.appendChild(movieCard);
    // element image
    const image = document.createElement("img");
    image.classList.add("image");
    movieCard.appendChild(image);
    image.src = poster_path
      ? `${ImgPath + poster_path}`
      : "../images/movie_placeholder.jpg";
    image.alt = `${title}`;
    // element info
    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie-info");
    movieCard.appendChild(movieInfo);
    // element title
    const movieTitle = document.createElement("h3");
    movieTitle.classList.add("movie-title");
    movieInfo.appendChild(movieTitle);
    movieTitle.innerText = `${original_title}`;
    // element overview
    const movieOverview = document.createElement("h2");
    movieOverview.classList.add("movie-overview");
    movieInfo.appendChild(movieOverview);
    movieOverview.innerText = `${overview}`;
    // element genres wrapper
    const genresWrapper = document.createElement("div");
    genresWrapper.classList.add("genres-wrapper");
    movieInfo.appendChild(genresWrapper);
    // element genre
    movie.genre_titles.forEach((genre) => {
      const genreTitle = document.createElement("h3");
      genreTitle.classList.add("genre");
      genresWrapper.appendChild(genreTitle);
      genreTitle.innerText = `${genre},`;
    });
    // element date & rating
    const daterating = document.createElement("div");
    daterating.classList.add("date-rating");
    movieInfo.appendChild(daterating);
    // element release Date
    const releaseDate = document.createElement("h3");
    releaseDate.classList.add("release-date");
    daterating.appendChild(releaseDate);
    releaseDate.innerText = `${release_date}`;
    // element rating
    const rating = document.createElement("h3");
    rating.classList.add("rating");
    daterating.appendChild(rating);
    rating.innerText = parseFloat(`${vote_average}`).toFixed(1);

    `${vote_average}` >= 8
      ? (rating.style.color = "#7CFC00")
      : `${vote_average}` >= 7
      ? (rating.style.color = "yellow")
      : (rating.style.color = "red");

    moviesCard.appendChild(movieCard);
  });

  console.log(movies);
}

/* pages pagination */
const previousPage = () => {
  currentPage--;
  getMovies(currentPage);
  scrollToTop();
};

const nextPage = () => {
  currentPage++;
  getMovies(currentPage);
  scrollToTop();
};

next.addEventListener("click", nextPage, false);
previous.addEventListener("click", previousPage, false);

search.addEventListener("input", () => {
  if (search.value != "") {
    icon.style.opacity = 1;
  } else {
    icon.style.opacity = 0;
  }
});

icon.addEventListener("click", (e) => {
  search.value = "";
  icon.style.opacity = 0;
  e.preventDefault();
  currentPage = 1;
  getMovies();
  scrollToTop();
});

btn.addEventListener("click", (e) => {
  e.preventDefault();
  currentPage = 1;
  getMovies();
  scrollToTop();
});
