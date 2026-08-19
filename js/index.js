const gamesContainer = document.getElementById("games-container");

if (gamesContainer) {

    games.forEach(game => {

        gamesContainer.innerHTML += `
            <div class="col-md-6 col-lg-4">

                <div class="game-card">

                    <div class="game-image">
                        <img src="${game.image}" alt="${game.name}">
                    </div>

                    <div class="game-content">

                        <span class="game-category">
                            ${game.category}
                        </span>

                        <h3>
                            ${game.name}
                        </h3>

                        <p>
                            ${game.description}
                        </p>

                        <a href="tournaments.html" class="game-link">
                            Explore Tournaments →
                        </a>

                    </div>

                </div>

            </div>
        `;

    });

}

const achievementContainer =
    document.getElementById("achievement-highlights");


async function loadAchievementHighlights() {

    if (!achievementContainer) return;

    try {

        const response = await fetch("data/player.json");

        if (!response.ok) {
            throw new Error("Failed to load player data.");
        }

        const data = await response.json();

        const players = data.players;

        // Get top 4 players based on points
        const topPlayers = [...players]
            .sort((a, b) => b.points - a.points)
            .slice(0, 4);


        topPlayers.forEach(player => {

            achievementContainer.innerHTML += `

                <div class="col-sm-6">

                    <div class="achievement-card">

                        <div class="achievement-icon">

                            <img src="${player.image}"
                                 alt="${player.name}">

                        </div>

                        <div>

                            <span class="achievement-year">
                                ${getGameName(player.game)}
                            </span>

                            <h3>
                                ${player.achievement}
                            </h3>

                            <p>
                                ${player.name}
                                <br>
                                ${player.team}
                            </p>

                        </div>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error("Failed to load achievement highlights:", error);

        achievementContainer.innerHTML = `
            <div class="col-12">
                <p class="text-muted">
                    Unable to load player achievements.
                </p>
            </div>
        `;
    }
}


function getGameName(game) {

    const games = {
        valorant: "VALORANT",
        mlbb: "MOBILE LEGENDS",
        lol: "LEAGUE OF LEGENDS",
        cs: "COUNTER-STRIKE 2",
        apex: "APEX LEGENDS"
    };

    return games[game] || game;
}


loadAchievementHighlights();