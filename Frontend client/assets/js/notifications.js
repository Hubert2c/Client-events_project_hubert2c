$(document).ready(function () {
    if ($("#notificationsList").length) loadNotifications();
    if ($("#notifBell").length) {
        $("#notifBell").on("click", () => {
            $("#notificationsPanel").toggleClass("hidden");
        });
    }
});

function loadNotifications() {
    api("GET", "/notifications").then(list => {
        $("#notificationsList").html("");
        if (list.length === 0) {
            $("#notificationsList").append(`<p class="text-gray-600 p-4">No notifications</p>`);
            return;
        }
        list.forEach(n => {
            let btnDelete = "";
            if (getUser().role === "admin") {
                btnDelete = `<button class="deleteNotif text-red-600 ml-2" data-id="${n.id}">Delete</button>`;
            }
            $("#notificationsList").append(`
                <div class="p-3 border-b flex justify-between items-center">
                    <div class="notifItem cursor-pointer" data-id="${n.id}">
                        <p class="font-bold">${n.title}</p>
                        <p class="text-gray-600 text-sm">${truncate(n.message, 100)}</p>
                        <p class="text-xs text-gray-400">${formatDate(n.created_at)}</p>
                    </div>
                    ${btnDelete}
                </div>
            `);
        });

        $(".notifItem").on("click", function () {
            let id = $(this).data("id");
            api("GET", `/notifications/${id}`).then(n => {
                openModal(`
                    <h2 class="text-xl font-bold mb-2">${n.title}</h2>
                    <p class="mb-2">${n.message}</p>
                    <p class="text-gray-500 text-sm">${formatDate(n.created_at)}</p>
                    ${n.metadata?.event_id ? `<a href="event_detail.html?id=${n.metadata.event_id}" class="text-blue-600 underline">View Event</a>` : ""}
                `);
            });
        });

        $(".deleteNotif").on("click", function (e) {
            e.stopPropagation();
            let id = $(this).data("id");
            api("DELETE", `/notifications/${id}`).then(() => loadNotifications());
        });
    });
}
