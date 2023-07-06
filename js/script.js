const state = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
  },
  api: {
    apiLink: "https://api.themoviedb.org/3/",
    apiKey: "0e8b738957464ad5a5c4e0e354eeb499",
  },
};

function highlightActivePage() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === state.currentPage) {
      link.classList.add("active");
    }
  });
}

async function getMovies(endpoint) {
  spinnerShow();

  const apiLink = state.api.apiLink;
  const apiKey = state.api.apiKey;
  const dbApi = await fetch(
    `${apiLink}${endpoint}?api_key=${apiKey}&language=en-US${apiLink}`
  );
  const data1 = await dbApi.json();

  spinnerNoShow();

  return data1;
}

async function searchMovies() {
  spinnerShow();

  const apiLink = state.api.apiLink;
  const apiKey = state.api.apiKey;
  const dbApi = await fetch(
    `${apiLink}search/${state.search.type}?api_key=${apiKey}&language=en-US&query=${state.search.term}&page=${state.search.page}`
  );
  const data1 = await dbApi.json();

  console.log(data1);

  spinnerNoShow();

  return data1;
}

async function getTvShows() {
  const { results } = await getMovies("tv/top_rated");
  results.forEach((result) => {
    const popular = document.querySelector("#popular-shows");
    const div = document.createElement("div");
    div.innerHTML = `<div class="card">
    <a href="tv-details.html?id=${result.id}">
      <img
        src="https://image.tmdb.org/t/p/w500${result.poster_path}"
        class="card-img-top"
        alt="Show Title"
      />
    </a>
    <div class="card-body">
      <h5 class="card-title">${result.name}</h5>
      <p class="card-text">
        <small class="text-muted">Aired: ${result.first_air_date}</small>
      </p>
    </div>
  </div>`;
    popular.appendChild(div);
  });
}

async function getPopularMovies() {
  const { results } = await getMovies("movie/popular");
  results.forEach((result) => {
    const popular = document.querySelector("#popular-movies");
    const div = document.createElement("div");
    div.innerHTML = `<div class="card">
                      <a href="movie-details.html?id=${result.id}">
                        <img
                          src="https://image.tmdb.org/t/p/w500${result.poster_path}"
                          class="card-img-top"
                          alt="Movie Title"
                        />
                      </a>
                      <div class="card-body">
                        <h5 class="card-title">${result.title}</h5>
                        <p class="card-text">
                          <small class="text-muted">Release:${result.release_date}</small>
                        </p>
                      </div>
                    </div>
                    `;
    popular.appendChild(div);
  });
}

async function getMovieDetail() {
  const movieid = window.location.search.split("=")[1];
  const movie = await getMovies(`movie/${movieid}`);
  const div = document.createElement("div");

  div.innerHTML = ` <div class="details-top">
  <div>
    <img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      class="card-img-top"
      alt="${movie.title}"
    />
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>${movie.overview}</p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${movie.budget}</li>
    <li><span class="text-secondary">Revenue:</span> $${movie.revenue}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group"> 
  ${movie.production_companies
    .map((movie) => `<span>${movie.name}</span>`)
    .join(", ")}
 </div>`;

  document.getElementById("movie-details").appendChild(div);

  console.log(movie);
}

async function getTvShowDetail() {
  const tvid = window.location.search.split("=")[1];
  const TV = await getMovies(`tv/${tvid}`);
  const div = document.createElement("div");

  div.innerHTML = ` <div class="details-top">
  <div>
    <img
      src="https://image.tmdb.org/t/p/w500${TV.poster_path}"
      class="card-img-top"
      alt="${TV.name}"
    />
  </div>
  <div>
    <h2>${TV.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${TV.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${TV.first_air_date}</p>
    <p>${TV.overview}</p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${TV.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      TV.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Number of Episodes:</span> ${
      TV.number_of_episodes
    }</li>
    <li><span class="text-secondary">Last Episode to Air:</span> ${
      TV.last_episode_to_air.name
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${TV.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group"> 
  ${TV.production_companies.map((TV) => `<span>${TV.name}</span>`).join(", ")}
 </div>`;

  document.getElementById("show-details").appendChild(div);

  console.log(TV);
}

async function runSwiper() {
  const { results } = await getMovies("movie/now_playing");
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  console.log(results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = ` 
    <a href="movie-details.html?id=${movie.id}">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
        1
      )}
    </h4>
 `;
    swiperWrapper.appendChild(div);
  });
  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    freeMode: true,
    effect: "scroll",
    loop: true,
    speed: 400,
    autoplay: {
      delay: 2000,
    },
    cubeEffect: {
      slideShadows: false,
    },
    // using "ratio" endpoints
    breakpoints: {
      "@0.75": {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      "@1.00": {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      "@1.50": {
        slidesPerView: 4,
        spaceBetween: 50,
      },
    },
  });
}

async function search() {
  const queryString = window.location.search;
  const URLParams = new URLSearchParams(queryString);

  state.search.term = URLParams.get("search-term");
  state.search.type = URLParams.get("type");

  if (state.search.term !== "" && state.search.term !== null) {
    const { results, page, total_pages, total_results } = await searchMovies();

    state.search.page = page;
    state.search.totalPages = total_pages;
    state.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No Results Found", "alert-error");
      return;
    }

    displaySearchResults(results);
  } else {
    showAlert("Please Enter a Search Term", "alert-error");
  }
}

function displayPagination() {
  const pagination = document.getElementById("pagination");
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${state.search.page} of ${state.search.totalPages}</div>`;

  pagination.appendChild(div);

  if (state.search.page === 1) {
    document.getElementById("prev").disabled = true;
  }
  if (state.search.page === state.search.totalPages) {
    document.getElementById("next").disabled = true;
  }
  document.getElementById("next").addEventListener("click", async () => {
    state.search.page++;
    const { results, total_pages } = await searchMovies();
    displaySearchResults(results);
  });
  document.getElementById("prev").addEventListener("click", async () => {
    state.search.page--;
    const { results, total_pages } = await searchMovies();
    displaySearchResults(results);
  });
}

function displaySearchResults(results) {
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const search = document.querySelector("#search-results");
    const div = document.createElement("div");
    div.innerHTML = `<div class="card">
                      <a href="${state.search.type}-details.html?id=${
      result.id
    }">
                        <img
                          src="https://image.tmdb.org/t/p/w500${
                            result.poster_path
                          }"
                          class="card-img-top"
                          alt="${
                            state.search.type === "movie"
                              ? result.title
                              : result.name
                          }"
                        />
                      </a>
                      <div class="card-body">
                        <h5 class="card-title">${
                          state.search.type === "movie"
                            ? result.title
                            : result.name
                        }</h5>
                        <p class="card-text">
                          <small class="text-muted">Release:${
                            state.search.type === "movie"
                              ? result.release_date
                              : result.first_air_date
                          }</small>
                        </p>
                      </div>
                    </div>
                    `;
    document.querySelector("#search-results-heading").innerHTML = `
    <h2>${results.length} Of ${state.search.totalResults} results for ${state.search.term}</h2>
    `;
    search.appendChild(div);
  });
  displayPagination();
}

function showAlert(message, className) {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));

  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

function spinnerShow() {
  const spinner = document.querySelector(".spinner");
  spinner.classList.add("show");
}

function spinnerNoShow() {
  const spinner = document.querySelector(".spinner");
  spinner.classList.remove("show");
}

// Website Page Router
function init() {
  switch (state.currentPage) {
    case "/":
    case "/index.html":
      getPopularMovies();
      runSwiper();
      break;
    case "/shows.html":
      getTvShows();
      break;
    case "/tv-details.html":
      getTvShowDetail();
      break;
    case "/movie-details.html":
      getMovieDetail();
      break;
    case "/search.html":
      search();
      break;
  }

  highlightActivePage();
}

window.addEventListener("DOMContentLoaded", init);
