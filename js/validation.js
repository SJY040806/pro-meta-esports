function validateRegistrationForm() {

    const fullName = document.getElementById("fullName").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const membershipType = document.getElementById("membershipType").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (fullName === "") {
        return "Please enter your full name.";
    }

    if (username === "") {
        return "Please enter your username.";
    }

    if (email === "") {
        return "Please enter your email.";
    }

    if (!email.includes("@")) {
        return "Please enter a valid email address.";
    }

    if (phone === "") {
        return "Please enter your phone number.";
    }

    if (age === "" || age < 13) {
        return "You must be at least 13 years old.";
    }

    if (gender === "Select") {
        return "Please select your gender.";
    }

    if (membershipType === "") {
        return "Please select a membership type.";
    }

    if (password.length < 8) {
        return "Password must contain at least 8 characters.";
    }

    if (password !== confirmPassword) {
        return "Passwords do not match.";
    }



    return null;
}