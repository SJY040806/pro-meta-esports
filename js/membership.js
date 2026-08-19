const membershipForm =
    document.getElementById("membershipForm");

const formMessage =
    document.getElementById("formMessage");


membershipForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const error =
        validateRegistrationForm();


    // Validation failed
    if (error) {

        formMessage.textContent = error;

        formMessage.className =
            "alert alert-danger";

        return;

    }


    // Create member object
    const member = {

        fullName:
            document.getElementById("fullName").value.trim(),

        username:
            document.getElementById("username").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        phone:
            document.getElementById("phone").value.trim(),

        age:
            document.getElementById("age").value,

        gender:
            document.getElementById("gender").value,

        membershipType:
            document.getElementById("membershipType").value

    };


    // Session Storage
    saveMemberToSession(member);


    // Local Storage
    saveMembershipPreference(
        member.membershipType
    );


    // Cookie
    saveUsernameCookie(
        member.username
    );


    // Success message
    formMessage.textContent =
        "Registration successful! Welcome to Pro Meta E-Sports.";

    formMessage.className =
        "alert alert-success";


    // Clear form
    membershipForm.reset();

});