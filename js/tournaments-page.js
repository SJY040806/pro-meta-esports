const upcomingContainer =
    document.getElementById("upcoming-tournaments");

tournaments.forEach(tournament => {

    upcomingContainer.innerHTML += `
        <div class="col-md-6 col-lg-4">

            <div class="tournament-card" id="${tournament.id}">

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

                    <a href="membership.html" class="btn-tournament">
                        Join Now
                    </a>

                </div>

            </div>

        </div>
    `;
});

const params = new URLSearchParams(window.location.search);
const eventId = params.get("event");

if (eventId) {

    const targetEvent = document.getElementById(eventId);

    if (targetEvent) {

        setTimeout(() => {

            targetEvent.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 100);

    }

}