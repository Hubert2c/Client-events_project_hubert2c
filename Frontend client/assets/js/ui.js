function showToast(msg, type = "success") {
    let color = type === "error" ? "bg-red-600" : "bg-green-600";
    let t = $(`
        <div class="fixed top-4 right-4 px-4 py-2 text-white rounded shadow ${color} z-50 opacity-0 transition">
            ${msg}
        </div>
    `);
    $("body").append(t);
    setTimeout(() => t.addClass("opacity-100"), 50);
    setTimeout(() => t.remove(), 3000);
}

function showLoading() {
    if ($("#loadingOverlay").length) return;
    $("body").append(`
        <div id="loadingOverlay" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div class="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
        </div>
    `);
}

function hideLoading() {
    $("#loadingOverlay").remove();
}

function setupNavbar() {
    let u = getUser();
    if (!u) return;

    if ($("#navUserName").length) $("#navUserName").text(u.full_name);
    if ($("#navAdminLink").length) {
        if (u.role === "admin") $("#navAdminLink").removeClass("hidden");
    }

    $("#logoutBtn").on("click", () => logout());
}

function updateNotifBadge() {
    if (!$("#notifBadge").length) return;
    api("GET", "/notifications/unread-count").then(r => {
        $("#notifBadge").text(r.count);
        if (r.count === 0) $("#notifBadge").addClass("hidden");
        else $("#notifBadge").removeClass("hidden");
    });
}

function setPageTitle(title) {
    if ($("#pageTitle").length) $("#pageTitle").text(title);
    document.title = "CivicEvents | " + title;
}

function openModal(html) {
    $("body").append(`
        <div id="modalOverlay" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div id="modalBox" class="bg-white rounded p-6 w-full max-w-lg shadow">${html}</div>
        </div>
    `);
}

function closeModal() {
    $("#modalOverlay").remove();
}

function queryParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}

function truncate(text, max = 120) {
    return text.length > max ? text.substring(0, max) + "..." : text;
}

function formatDate(d) {
    return new Date(d).toLocaleString();
}

$(document).ready(function () {
    setupNavbar();
    updateNotifBadge();
});
