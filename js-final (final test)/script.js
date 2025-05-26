async function getPopularShows() {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows`);
    if (!response.ok) {
      throw new Error("Failed to fetch shows");
    }
    const shows = await response.json();
    return shows.slice(0, 66);
  } catch (error) {
    console.error("Error fetching shows:", error);
    return [];
  }
}

const showsContainer = document.getElementById("shows");
const noResultsContainer = document.getElementById("no-results");

function populateShows(shows) {
  console.log("Shows data:", shows);
  showsContainer.innerHTML = "";
  noResultsContainer.style.display = "none";

  if (shows.length === 0) {
    noResultsContainer.innerHTML = `
            <img src="noresult.jpg" alt="No Results" />
            <h2>No Results</h2>
            <p>Please change your search keyword</p>
        `;
    noResultsContainer.style.display = "flex";
  } else {
    shows.forEach((show) => {
      console.log("Show:", show);
      const showDivElement = document.createElement("div");
      showDivElement.classList.add("show");
      showDivElement.innerHTML = `
                <div style="position: relative;">
                    <img class="show-img" src="${
                      show.image ? show.image.medium : "./images/no-image.png"
                    }" alt="${show.name} Poster" />
                    <i class="fa-solid fa-bookmark" data-show-id="${
                      show.id
                    }" style="position: absolute; left: 10px; color: #FFD43B;"></i>
                </div>
                <div class="rating">
                    <i class="fa-solid fa-star"></i> ${
                      show.rating ? show.rating.average : "N/A"
                    }
                </div>
                <div class="show-data">
                    <h2>${show.name}</h2>
                    <div class="genres">
                        ${show.genres
                          .map((genre) => `<span class="genre">${genre}</span>`)
                          .join("")}
                    </div>
                    <div class="links">
                        <a href="${show.url}" target="_blank">Learn More</a>
                    </div>
                </div>`;

      showDivElement.addEventListener("click", () => {
        window.location.href = `episodes.html?id=${show.id}`;
      });

      const bookmarkIcon = showDivElement.querySelector(".fa-bookmark");
      bookmarkIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleBookmark(show.id);
      });

      showsContainer.appendChild(showDivElement);
      updateBookmarkIcon(show.id);
    });
  }
}

async function getShows(searchTerm) {
  try {
    const response = await fetch(
      `https://api.tvmaze.com/search/shows?q=${searchTerm}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch shows");
    }
    const data = await response.json();
    return data.map((item) => item.show);
  } catch (error) {
    console.error("Error fetching shows:", error);
    return [];
  }
}

getPopularShows().then((shows) => {
  populateShows(shows);
});

const searchInput = document.getElementById("search-input");

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function getData() {
  const searchValue = searchInput.value.trim();
  if (searchValue) {
    getShows(searchValue).then((shows) => {
      populateShows(shows);
    });
  } else {
    showsContainer.innerHTML = "";
    noResultsContainer.style.display = "none";
  }
}

searchInput.addEventListener("input", debounce(getData, 500));

function updateAuthButtons() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const signInButton = document.getElementById("sign-in-btn");
  const signUpButton = document.getElementById("sign-up-btn");
  const logOutButton = document.getElementById("log-out-btn");

  if (isLoggedIn) {
    signInButton.style.display = "none";
    signUpButton.style.display = "none";
    logOutButton.style.display = "block";
  } else {
    signInButton.style.display = "block";
    signUpButton.style.display = "block";
    logOutButton.style.display = "none";
  }
}

updateAuthButtons();

document.getElementById("log-out-btn").addEventListener("click", function () {
  localStorage.removeItem("isLoggedIn");

  updateAuthButtons();
});

document.getElementById("sign-in-btn").addEventListener("click", function () {
  window.location.href = "login.html";
});

document.getElementById("sign-up-btn").addEventListener("click", function () {
  window.location.href = "register.html";
});

function toggleBookmark(showId) {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  const index = bookmarks.indexOf(showId);

  if (index === -1) {
    bookmarks.push(showId);
  } else {
    bookmarks.splice(index, 1);
  }

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  updateBookmarkIcon(showId);
}

function updateBookmarkIcon(showId) {
  const bookmarkIcon = document.querySelector(
    `.fa-bookmark[data-show-id="${showId}"]`
  );
  if (bookmarkIcon) {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    if (bookmarks.includes(showId)) {
      bookmarkIcon.style.color = "#bd7d08";
    } else {
      bookmarkIcon.style.color = "#FFD43B";
    }
  }
}

function initializeBookmarks() {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  bookmarks.forEach((showId) => {
    updateBookmarkIcon(showId);
  });
}

initializeBookmarks();
