async function getCast(showId) {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/cast`);
    if (!response.ok) {
        console.error("Error fetching cast:", response.statusText);
        return [];
    }
    const cast = await response.json();
    return cast;
}

function displayCast(cast) {
    const castList = document.getElementById("cast-list");
    castList.innerHTML = "";
    if (cast.length === 0) {
        castList.innerHTML = "<p>No cast members found.</p>";
        return;
    }

    cast.forEach((member) => {
        const castMemberDiv = document.createElement("div");
        castMemberDiv.classList.add("cast-member");

        const imageUrl = member.person.image ? member.person.image.medium : "./images/no-image.png";

        castMemberDiv.innerHTML = `
            <img src="${imageUrl}" alt="${member.person.name} Photo" class="cast-img" />
            <div class="cast-content">
                <h3>${member.person.name}</h3>
                <p>Character: ${member.character.name}</p>
            </div>
        `;
        castList.appendChild(castMemberDiv);
    });
}

const params = new URLSearchParams(window.location.search);
const showId = params.get("episodeId"); 

if (showId) {
    getCast(showId).then(displayCast).catch(error => {
        console.error("Error fetching cast:", error);
        document.getElementById("cast-list").innerHTML = "<p>Error fetching cast members.</p>";
    });
} else {
    document.getElementById("cast-list").innerHTML = "<p>No show ID provided.</p>";
}