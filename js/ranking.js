/* ============================================================
   PRO META E-SPORTS — ranking.js
   Handles: data loading (jQuery AJAX GET), game/type tabs,
   search, sort, and the three storage technologies required
   by the assignment rubric (cookie / localStorage / sessionStorage).
   ============================================================ */

$(function () {

    /* ------------------------------------------------------------
       0. STATE
       currentGame : "valorant" | "mlbb" | "cs"
       currentType : "player"   | "team"
       ------------------------------------------------------------ */
    let playersData = [];
    let teamsData = [];

    let state = {
        game: "valorant",
        type: "player",
        search: "",
        sort: "rank"
    };

    /* ------------------------------------------------------------
       1. COOKIE HELPER (plain JS — no library needed for a simple
          preference flag). The assignment says: use a cookie to
          remember that the user has visited the ranking page.
          A cookie (unlike localStorage) is automatically attached
          to any request sent back to a server, which is the
          textbook reason to reach for it over localStorage here.
       ------------------------------------------------------------ */
    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }
    function getCookie(name) {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith(name + "="))
            ?.split("=")[1];
    }

    const hasVisitedBefore = getCookie("pm_visited_ranking") === "true";
    setCookie("pm_visited_ranking", "true", 30); // remembered for 30 days
    if (hasVisitedBefore) {
        console.log("Welcome back to the Ranking page! (read from cookie)");
    }

    /* ------------------------------------------------------------
       2. LOCALSTORAGE — persists ACROSS browser sessions.
          Used here for the user's last-selected game and ranking
          type, so refreshing (or returning tomorrow) keeps their
          choice instead of resetting to Valorant/Player every time.
       ------------------------------------------------------------ */
    const savedGame = localStorage.getItem("pm_selectedGame");
    const savedType = localStorage.getItem("pm_rankingType");
    if (savedGame) state.game = savedGame;
    if (savedType) state.type = savedType;

    function persistPreferences() {
        localStorage.setItem("pm_selectedGame", state.game);
        localStorage.setItem("pm_rankingType", state.type);
    }

    /* ------------------------------------------------------------
       3. SESSIONSTORAGE — cleared when the browser tab closes.
          Used here for: (a) the current search text, so it survives
          a tab switch/sort click within the same visit but doesn't
          linger tomorrow, and (b) the last player row the user
          clicked on, so it can be highlighted when the list re-renders.
       ------------------------------------------------------------ */
    const savedSearch = sessionStorage.getItem("pm_currentSearch");
    if (savedSearch) {
        state.search = savedSearch;
    }

    function rememberRecentlyViewed(playerId) {
        sessionStorage.setItem("pm_recentPlayerId", playerId);
    }
    function getRecentlyViewedId() {
        return sessionStorage.getItem("pm_recentPlayerId");
    }

    /* ------------------------------------------------------------
       4. DATA LOADING
          Uses jQuery's $.getJSON (a GET-based AJAX call — the same
          pattern used to call a real RESTful API, just pointed at a
          local JSON file for this demo). See the chat explanation
          for why a local file was used instead of a live public API.
       ------------------------------------------------------------ */
    function loadData() {
        $("#rankingStatus").removeClass("error-state").addClass("loading-state")
            .text("Loading ranking data...").removeClass("d-none");
        $("#rankingTable").addClass("d-none");

        $.when(
            $.getJSON("data/player.json"),
            $.getJSON("data/teams.json")
        ).done(function (playersResp, teamsResp) {
            playersData = playersResp[0].players;
            teamsData = teamsResp[0].teams;
            $("#rankingStatus").addClass("d-none");
            $("#rankingTable").removeClass("d-none");
            renderTable();
        }).fail(function () {
            $("#rankingStatus").removeClass("loading-state").addClass("error-state")
                .text("Couldn't load ranking data. Please check that players.json and teams.json exist in /data and reload the page.");
        });
    }

    /* ------------------------------------------------------------
       5. RENDERING
       ------------------------------------------------------------ */
    const PLAYER_COLUMNS = ["Rank", "Player", "Team", "Region", "Matches", "Wins", "Win Rate", "Points", "Achievement"];
    const TEAM_COLUMNS = ["Rank", "Team", "Region", "Matches", "Wins", "Losses", "Win Rate", "Points"];

    function rankBadgeClass(position) {
        if (position === 1) return "gold";
        if (position === 2) return "silver";
        if (position === 3) return "bronze";
        return "";
    }

    function getFilteredSorted() {
        const source = state.type === "player" ? playersData : teamsData;
        let rows = source.filter((r) => r.game === state.game);

        // search (by player name / team name)
        if (state.search.trim() !== "") {
            const q = state.search.trim().toLowerCase();
            rows = rows.filter((r) => {
                const nameField = state.type === "player" ? r.name : r.team;
                return nameField.toLowerCase().includes(q) || r.team.toLowerCase().includes(q);
            });
        }

        // sort — "rank" defaults to points descending (the dataset's natural ranking order)
        const key = state.sort === "rank" ? "points" : state.sort;
        rows = rows.slice().sort((a, b) => b[key] - a[key]);

        return rows;
    }

    function renderTable() {
        const columns = state.type === "player" ? PLAYER_COLUMNS : TEAM_COLUMNS;
        const rows = getFilteredSorted();
        const recentId = getRecentlyViewedId();

        // header
        const $thead = $("#rankingHead").empty();
        const $headRow = $("<tr></tr>");
        columns.forEach((col) => {
            const sortable = ["Rank", "Points", "Win Rate"].includes(col);
            const sortKeyMap = { Rank: "rank", Points: "points", "Win Rate": "winRate" };
            const $th = $("<th></th>").text(col);
            if (sortable) {
                $th.addClass("sortable").attr("data-sort-key", sortKeyMap[col]);
                if (state.sort === sortKeyMap[col]) $th.append('<span class="sort-arrow">▼</span>');
            }
            $headRow.append($th);
        });
        $thead.append($headRow);

        // body
        const $tbody = $("#rankingBody").empty();

        if (rows.length === 0) {
            $tbody.append(`<tr><td colspan="${columns.length}" class="empty-state">No results match your search.</td></tr>`);
            return;
        }

        rows.forEach((row, index) => {
            const position = index + 1;
            const badgeClass = rankBadgeClass(position);
            const $tr = $("<tr></tr>");
            if (state.type === "player" && row.id === recentId) {
                $tr.css("outline", "2px solid var(--cyan-400)");
            }

            const rankCell = `<td data-label="Rank"><span class="rank-badge ${badgeClass}">${position}</span></td>`;
            $tr.append(rankCell);

            if (state.type === "player") {
                $tr.append(`<td data-label="Player" class="name-cell">${row.name}</td>`);
                $tr.append(`<td data-label="Team">${row.team}</td>`);
                $tr.append(`<td data-label="Region">${row.region}</td>`);
                $tr.append(`<td data-label="Matches">${row.matches}</td>`);
                $tr.append(`<td data-label="Wins">${row.wins}</td>`);
                $tr.append(`<td data-label="Win Rate">${row.winRate.toFixed(1)}%</td>`);
                $tr.append(`<td data-label="Points">${row.points}</td>`);
                $tr.append(`<td data-label="Achievement">${row.achievement !== "-" ? `<span class="achievement-tag">${row.achievement}</span>` : "-"}</td>`);

                // clicking a player row saves it to sessionStorage as "recently viewed"
                $tr.css("cursor", "pointer").on("click", function () {
                    rememberRecentlyViewed(row.id);
                    renderTable();
                });
            } else {
                $tr.append(`<td data-label="Team" class="name-cell">${row.team}</td>`);
                $tr.append(`<td data-label="Region">${row.region}</td>`);
                $tr.append(`<td data-label="Matches">${row.matches}</td>`);
                $tr.append(`<td data-label="Wins">${row.wins}</td>`);
                $tr.append(`<td data-label="Losses">${row.losses}</td>`);
                $tr.append(`<td data-label="Win Rate">${row.winRate.toFixed(1)}%</td>`);
                $tr.append(`<td data-label="Points">${row.points}</td>`);
            }

            $tbody.append($tr);
        });
    }

    /* ------------------------------------------------------------
       6. EVENT WIRING
       ------------------------------------------------------------ */
    function applyStateToUI() {
        $(".game-tab-btn").removeClass("active").attr("aria-selected", "false");
        $(`.game-tab-btn[data-game="${state.game}"]`).addClass("active").attr("aria-selected", "true");

        $(".rank-type-btn").removeClass("active").attr("aria-selected", "false");
        $(`.rank-type-btn[data-type="${state.type}"]`).addClass("active").attr("aria-selected", "true");

        $("#rankingSearch").val(state.search);
        $("#rankingSort").val(state.sort);
    }

    $(".game-tab-btn").on("click", function () {
        state.game = $(this).data("game");
        persistPreferences();
        applyStateToUI();
        renderTable();
    });

    $(".rank-type-btn").on("click", function () {
        state.type = $(this).data("type");
        persistPreferences();
        applyStateToUI();
        renderTable();
    });

    let searchTimer;
    $("#rankingSearch").on("input", function () {
        clearTimeout(searchTimer);
        const value = $(this).val();
        searchTimer = setTimeout(() => {
            state.search = value;
            sessionStorage.setItem("pm_currentSearch", value); // temporary filter setting
            renderTable();
        }, 200);
    });

    $("#rankingSort").on("change", function () {
        state.sort = $(this).val();
        renderTable();
    });

    // clicking a sortable column header also updates the sort
    $("#rankingHead").on("click", "th.sortable", function () {
        state.sort = $(this).data("sort-key");
        $("#rankingSort").val(state.sort);
        renderTable();
    });

    /* ------------------------------------------------------------
       7. INIT
       ------------------------------------------------------------ */
    applyStateToUI();
    loadData();
});