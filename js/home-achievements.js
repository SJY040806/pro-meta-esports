const achievementContainer =
    document.getElementById("home-achievements");

async function loadHomeAchievements() {

    if (!achievementContainer) return;

    try {

        const response = await fetch("data/player.json");

        if (!response.ok) {
            throw new Error("Failed to load player data.");
        }

        const data = await response.json();

        const players = data.players;

        // Sort by points and take the top 4
        const topPlayers = [...players]
            .sort((a, b) => b.points - a.points)
            .slice(0, 4);

        topPlayers.forEach(player => {

            achievementContainer.innerHTML += `
                <div class="col-sm-6">

                    <div class="achievement-card">

                        <div class="achievement-icon">
                            🏆
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
                                · ${player.wins} Wins
                                · ${player.winRate}% Win Rate
                            </p>

                        </div>

                    </div>

                </div>
            `;

        });

    } catch (error) {

        console.error(error);

        achievementContainer.innerHTML = `
            <div class="col-12">
                <p class="text-muted">
                    Unable to load achievements.
                </p>
            </div>
        `;

    }
}

function getGameName(game) {

    const games = {
        valorant: "Valorant",
        mlbb: "Mobile Legends",
        lol: "League of Legends",
        cs: "Counter-Strike 2",
        apex: "Apex Legends"
    };

    return games[game] || game;
}

loadHomeAchievements();