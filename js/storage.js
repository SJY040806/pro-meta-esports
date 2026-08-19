function saveMemberToSession(member) {

    sessionStorage.setItem(
        "currentMember",
        JSON.stringify(member)
    );

}

function saveMembershipPreference(membershipType) {

    localStorage.setItem(
        "membershipType",
        membershipType
    );

}

function saveUsernameCookie(username) {

    document.cookie =
        "username=" +
        encodeURIComponent(username) +
        "; max-age=" +
        (60 * 60 * 24 * 30) +
        "; path=/";

}