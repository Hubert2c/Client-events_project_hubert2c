const BASE_URL = "http://localhost:5000/api";

function saveToken(token, user, persistent = false) {
    if (persistent) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
    }
}

function getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function getUser() {
    let u = localStorage.getItem("user") || sessionStorage.getItem("user");
    return u ? JSON.parse(u) : null;
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location = "login.html";
}

function requireAuth() {
    if (!getToken()) window.location = "login.html";
}

function requireAdmin() {
    const u = getUser();
    if (!u || u.role !== "admin") window.location = "login.html";
}
