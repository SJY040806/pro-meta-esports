const PM_API = (function ($) {

    // Change these two lines if you ever swap to a real hosted API.
    const ENDPOINTS = {
        players: "data/player.json",
        teams: "data/teams.json"
    };


    function get(url) {
        return $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            timeout: 8000
        });
    }


    // GET all players, optionally filtered by game ("cs" | "valorant" | "mlbb" | "all")
    function getPlayers(game) {
        return get(ENDPOINTS.players).then(function (resp) {
            const all = resp.players || [];
            if (!game || game === "all") return all;
            return all.filter(function (p) { return p.game === game; });
        });
    }

    // GET all teams, optionally filtered by game
    function getTeams(game) {
        return get(ENDPOINTS.teams).then(function (resp) {
            const all = resp.teams || [];
            if (!game || game === "all") return all;
            return all.filter(function (t) { return t.game === game; });
        });
    }

    // GET a single player by id (e.g. for a future player-detail modal/page)
    function getPlayerById(id) {
        return get(ENDPOINTS.players).then(function (resp) {
            const found = (resp.players || []).find(function (p) { return p.id === id; });
            if (!found) {
                // Reject so callers can .fail() this the same way a 404 would behave
                return $.Deferred().reject({ status: 404, message: "Player not found: " + id }).promise();
            }
            return found;
        });
    }

    return {
        getPlayers: getPlayers,
        getTeams: getTeams,
        getPlayerById: getPlayerById
    };

})(jQuery);