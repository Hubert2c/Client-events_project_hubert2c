$(document).ready(function () {
    if ($("#dashboardSummary").length) loadDashboardSummary();
    if ($("#activityFeed").length) loadActivityFeed();
    if ($("#usersListAdmin").length) loadAdminUsers();
});

function loadDashboardSummary() {
    showLoading();
    api("GET", "/dashboard/admin").then(data => {
        hideLoading();
        $("#totalEvents").text(data.total_events);
        $("#totalPromos").text(data.total_promos);
        $("#totalUsers").text(data.total_users);
        $("#totalRegistrations").text(data.total_registrations);
        $("#pendingRequests").text(data.pending_requests);
        $("#resolvedRequests").text(data.resolved_requests);
    }).fail(() => hideLoading());
}

function loadActivityFeed() {
    api("GET", "/dashboard/activity").then(list => {
        $("#activityFeed").html("");
        list.forEach(a => {
            let icon = "";
            if (a.type === "event") icon = "📅";
            else if (a.type === "promo") icon = "🎬";
            else if (a.type === "service_request") icon = "📝";

            $("#activityFeed").append(`
                <div class="p-3 border-b flex items-center">
                    <span class="mr-2">${icon}</span>
                    <div>
                        <p class="font-bold">${a.title}</p>
                        <p class="text-gray-500 text-sm">${formatDate(a.created_at)}</p>
                    </div>
                </div>
            `);
        });
    });
}

function loadAdminUsers() {
    api("GET", "/users").then(list => {
        $("#usersListAdmin").html("");
        list.forEach(u => {
            $("#usersListAdmin").append(`
                <div class="bg-white p-3 shadow rounded mb-2 flex justify-between items-center">
                    <div>
                        <p class="font-bold">${u.full_name}</p>
                        <p>${u.email}</p>
                        <p class="text-sm text-gray-600">${u.role}</p>
                        <p class="text-sm text-gray-500">${u.is_active ? "Active" : "Disabled"}</p>
                    </div>
                    <button class="toggleUserAdmin bg-blue-600 text-white px-3 py-1 rounded" data-id="${u.id}">
                        ${u.is_active ? "Disable" : "Enable"}
                    </button>
                </div>
            `);
        });

        $(".toggleUserAdmin").on("click", function () {
            let id = $(this).data("id");
            api("PATCH", `/users/${id}/toggle`).then(() => loadAdminUsers());
        });
    });
}
