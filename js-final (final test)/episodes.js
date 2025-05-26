async function getEpisodes(showId) {
  const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
  const episodes = await response.json();
  return episodes;
}

function displayEpisodes(episodes) {
  const episodeList = document.getElementById("episode-list");
  episodeList.innerHTML = "";

  if (episodes.length === 0) {
      episodeList.innerHTML = "<p>No episodes found.</p>";
      return;
  }

  episodes.forEach((episode) => {
      const episodeDiv = document.createElement("div");
      episodeDiv.classList.add("episode");

      const imageUrl = episode.image ? episode.image.medium : "./images/no-image.png";

      episodeDiv.innerHTML = `
          <img src="${imageUrl}" alt="${episode.name} Poster" class="episode-img" />
          <div class="episode-content">
              <div class="episode-info">
                  <h3>${episode.name} <a href="cast.html?episodeId=${episode.id}" class="cast-link">Cast Members</a></h3>
                  <p>Season: ${episode.season}, Episode: ${episode.number}</p>
              </div>
              <p class="episode-summary">${episode.summary}</p>
          </div>
      `;
      episodeList.appendChild(episodeDiv);
  });
}

const params = new URLSearchParams(window.location.search);
const showId = params.get("id");

if (showId) {
  getEpisodes(showId).then(displayEpisodes).catch(error => {
      console.error("Error fetching episodes:", error);
  });
} else {
  document.getElementById("episode-list").innerHTML = "<p>No show ID provided.</p>";
}