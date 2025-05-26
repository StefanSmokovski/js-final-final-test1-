document.addEventListener("DOMContentLoaded", () => {
  const favoritesList = document.getElementById("favorites-list");
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

  if (bookmarks.length === 0) {
    favoritesList.innerHTML = "<p>No favorite shows found.</p>";
  } else {
    bookmarks.forEach((showId) => {
      fetchShowDetails(showId)
        .then((show) => {
          const showDivElement = createShowElement(show);
          favoritesList.appendChild(showDivElement);
        })
        .catch((error) => console.error("Error fetching show details:", error));
    });
  }
});

async function fetchShowDetails(showId) {
  const response = await fetch(`https://api.tvmaze.com/shows/${showId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch show details");
  }
  return response.json();
}

function createShowElement(show) {
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
        </div>
    `;

  showDivElement.addEventListener("click", () => {
    window.location.href = `episodes.html?id=${show.id}`;
  });

  const bookmarkIcon = showDivElement.querySelector(".fa-bookmark");
  bookmarkIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleBookmark(show.id);
    showDivElement.remove();
  });

  updateBookmarkIcon(show.id);

  return showDivElement;
}

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
