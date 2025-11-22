$(document).ready(function () {
    if ($("#saveProfile").length) loadProfile();
});

function loadProfile() {
    let u = getUser();
    $("#full_name").val(u.full_name);
    $("#email").val(u.email);

    $("#saveProfile").on("click", () => {
        api("PATCH", "/users/me", {
            full_name: $("#full_name").val(),
            email: $("#email").val()
        }).then(user => {
            saveToken(getToken(), user, true);
            alert("Profile updated!");
        });
    });
}
