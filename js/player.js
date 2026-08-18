/* ============================================================
   PRO META E-SPORTS — player.js
   Loads player data (jQuery AJAX GET, same pattern as ranking.js)
   and renders it as filterable player cards.
   ============================================================ */

$(function () {

    let playersData = [];
    let currentFilter = "all";

    // filter buttons in the HTML call filterPlayer('ml') etc. — this
    // maps that short code to the "game" value used in player.json
    const FILTER_TO_GAME = {
        all: "all",
        cs: "cs",
        valorant: "valorant",
        ml: "mlbb",
        lol: "lol",
        apex: "apex"
    };


    /* ------------------------------------------------------------
       1. DATA LOADING
       ------------------------------------------------------------ */
    function loadPlayers() {
        $("#playerStatus").removeClass("d-none error-state").addClass("loading-state")
            .text("Loading players...");
        $("#playerGrid").addClass("d-none");

        $.getJSON("data/player.json")

            .done(function (resp) {
                playersData = resp.players;
                $("#playerStatus").addClass("d-none");
                $("#playerGrid").removeClass("d-none");
                renderPlayers();
            })
            .fail(function () {
                $("#playerStatus").removeClass("loading-state").addClass("error-state")
                    .text("Couldn't load player data. Please check that data/players.json exists and reload the page.");
            });
    }

    /* ------------------------------------------------------------
       2. RENDERING
       ------------------------------------------------------------ */
    function renderPlayers() {
        const $grid = $("#playerGrid").empty();

        const rows = currentFilter === "all"
            ? playersData
            : playersData.filter((p) => p.game === FILTER_TO_GAME[currentFilter]);

        if (rows.length === 0) {
            $grid.append('<p class="empty-state">No players match this filter.</p>');
            return;
        }

        rows.forEach((p) => {
            const achievementHtml = p.achievement !== "-"
                ? `<span class="achievement-tag">${p.achievement}</span>`
                : "";

            const card = `
                 <div class="player-card" data-game="${p.game}">
        <div class="player-card-head">
            <span class="game-pill game-pill-${p.game}">${gameLabel(p.game)}</span>
            <span class="player-region">${p.region}</span>
        </div>
        <img src="${p.image}" alt="${p.name}" class="player-photo"/>
        <h3 class="player-name">${p.name}</h3>
        <p class="player-team">${p.team}</p>
        <div class="player-stats">
            <div><span class="stat-value">${p.matches}</span><span class="stat-label">Matches</span></div>
            <div><span class="stat-value">${p.wins}</span><span class="stat-label">Wins</span></div>
            <div><span class="stat-value">${p.winRate.toFixed(1)}%</span><span class="stat-label">Win Rate</span></div>
            <div><span class="stat-value">${p.points}</span><span class="stat-label">Points</span></div>
        </div>
        ${achievementHtml}
    </div>`;

            $grid.append(card);
        });
    }

    function gameLabel(game) {
        if (game === "cs") return "Counter-Strike";
        if (game === "valorant") return "Valorant";
        if (game === "mlbb") return "Mobile Legends";
        return game;
    }

    /* ------------------------------------------------------------
       3. FILTER BUTTONS
       (player.html calls filterPlayer('all' | 'cs' | 'valorant' | 'ml')
        directly via inline onclick, so this must stay a global function)
       ------------------------------------------------------------ */
    window.filterPlayer = function (filterKey) {
        currentFilter = filterKey;
        $(".filter-btn").removeClass("active");
        $(`.filter-btn[data-filter="${filterKey}"]`).addClass("active");
        renderPlayers();
    };

    /* ------------------------------------------------------------
       4. INIT
       ------------------------------------------------------------ */
    loadPlayers();
});