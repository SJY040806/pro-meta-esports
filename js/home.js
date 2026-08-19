const tournamentContainer = document.getElementById("home-tournaments");

if (tournamentContainer) {

    tournaments.slice(0, 3).forEach(tournament => {

        tournamentContainer.innerHTML += `
            <div class="col-md-6 col-lg-4">

                <div class="tournament-card">

                    <div class="tournament-image">
                        <img src="${tournament.image}" 
                             alt="${tournament.game} Tournament">
                    </div>

                    <div class="tournament-header">

                        <span class="tournament-game">
                            ${tournament.game}
                        </span>

                        <span class="tournament-status">
                            ${tournament.status}
                        </span>

                    </div>

                    <div class="tournament-content">

                        <h3>
                            ${tournament.name}
                        </h3>

                        <div class="tournament-info">

                            <p>📅 ${tournament.date}</p>
                            <p>🎮 ${tournament.format}</p>
                            <p>👥 ${tournament.teams}</p>
                            <p>🏆 ${tournament.prize}</p>

                        </div>

                        <a href="tournaments.html#${tournament.id}" 
                           class="btn btn-tournament">
                            View Tournament
                        </a>

                    </div>

                </div>

            </div>
        `;

    });

}