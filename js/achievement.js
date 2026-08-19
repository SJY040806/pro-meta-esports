let players = [];

const playerTable = document.getElementById("playerTable");
const gameFilter = document.getElementById("gameFilter");

/* =========================
   Load Player JSON
========================= */
async function loadPlayers() {
    try {
        const response = await fetch("data/player.json");
        if (!response.ok) {
            throw new Error("Failed to load player data.");
        }

        const data = await response.json();
        players = data.players;

        displayPlayers(players);
        calculateMVP();

    } catch (error) {
        console.error(error);
        if (playerTable) {
            playerTable.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger py-4">
                        Unable to load player achievements.
                    </td>
                </tr>
            `;
        }
    }
}

/* =========================
   Display Players Table
========================= */
function displayPlayers(playerList) {
    if (!playerTable) return;
    playerTable.innerHTML = "";

    if (playerList.length === 0) {
        playerTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    No player achievements found.
                </td>
            </tr>
        `;
        return;
    }

    playerList.forEach(player => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="fw-semibold">${player.name}</td>
            <td><span class="badge bg-light text-dark border">${getGameName(player.game)}</span></td>
            <td>${player.achievement}</td>
            <td>${player.matches}</td>
            <td>${player.wins}</td>
            <td class="fw-semibold text-success">${player.winRate}%</td>
            <td class="fw-bold">${player.points}</td>
        `;
        playerTable.appendChild(row);
    });
}

/* =========================
   Game Code Converter
========================= */
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

/* =========================
   Game Filter
========================= */
if (gameFilter) {
    gameFilter.addEventListener("change", function () {
        const selectedGame = this.value;

        if (selectedGame === "all") {
            displayPlayers(players);
            return;
        }

        const filteredPlayers = players.filter(player => player.game === selectedGame);
        displayPlayers(filteredPlayers);
    });
}

/* =========================
   MVP Calculation
========================= */
function calculateMVP() {
    if (!players || players.length === 0) return;

    const maxWins = Math.max(...players.map(player => player.wins));
    const maxMatches = Math.max(...players.map(player => player.matches));
    const maxWinRate = Math.max(...players.map(player => player.winRate));

    const rankedPlayers = players.map(player => {
        const normalizedWins = player.wins / maxWins;
        const normalizedMatches = player.matches / maxMatches;
        const normalizedWinRate = player.winRate / maxWinRate;

        const mvpScore = (normalizedWinRate * 0.40) + (normalizedWins * 0.35) + (normalizedMatches * 0.25);
        return { ...player, mvpScore };
    });

    const mvp = rankedPlayers.reduce((highest, player) =>
        player.mvpScore > highest.mvpScore ? player : highest
    );

    const mvpName = document.getElementById("mvpName");
    const mvpGame = document.getElementById("mvpGame");
    const mvpWins = document.getElementById("mvpWins");
    const mvpWinRate = document.getElementById("mvpWinRate");
    const mvpMatches = document.getElementById("mvpMatches");
    const mvpImage = document.getElementById("mvpImage");

    if (mvpName) mvpName.textContent = mvp.name;
    if (mvpGame) mvpGame.textContent = getGameName(mvp.game);
    if (mvpWins) mvpWins.textContent = `Wins: ${mvp.wins}`;
    if (mvpWinRate) mvpWinRate.textContent = `Win Rate: ${mvp.winRate}%`;
    if (mvpMatches) mvpMatches.textContent = `Matches: ${mvp.matches}`;
    if (mvpImage) {
        mvpImage.src = mvp.image || "images/default-avatar.png";
        mvpImage.alt = mvp.name;
    }
}

/* =========================
   Initialization
========================= */
loadPlayers();