$(document).ready(function () {
    if ($("#announcementsList").length) loadAnnouncements();
    if ($("#announcementDetail").length) loadAnnouncementDetail();
    if ($("#saveAnnouncement").length) $("#saveAnnouncement").on("click", saveAnnouncement);
});

function loadAnnouncements() {
    api("GET", "/announcements").then(list => {
        let u = getUser();
        $("#announcementsList").html("");
        list.filter(a => a.published || u.role === "admin").forEach(a => {
            let btns = `<a href="announcement_detail.html?id=${a.id}" class="bg-blue-600 text-white px-3 py-1 rounded">Play</a>`;
            if (u.role === "admin") {
                btns += `<a href="announcement_form.html?id=${a.id}" class="ml-2 bg-yellow-500 text-white px-3 py-1 rounded">Edit</a>
                         <button class="deleteAnnouncement ml-2 bg-red-600 text-white px-3 py-1 rounded" data-id="${a.id}">Delete</button>`;
            }
            $("#announcementsList").append(`
                <div class="bg-white shadow p-4 rounded mb-3 flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-xl">${a.title}</h3>
                        <p class="text-gray-500 text-sm">${formatDate(a.created_at)}</p>
                        <p class="text-gray-600 text-sm">Duration: ${a.duration_seconds}s</p>
                    </div>
                    <div>${btns}</div>
                </div>
            `);
        });

        $(".deleteAnnouncement").on("click", function () {
            let id = $(this).data("id");
            api("DELETE", `/announcements/${id}`).then(() => loadAnnouncements());
        });
    });
}

function loadAnnouncementDetail() {
    let id = queryParam("id");
    api("GET", `/announcements/${id}`).then(a => {
        $("#announcementDetail").html(`
            <h2 class="text-3xl font-bold mb-4">${a.title}</h2>
            <audio controls class="w-full mb-4">
                <source src="${a.audio_url}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <p>${a.transcript || "No transcript provided."}</p>
        `);
    });
}

function saveAnnouncement() {
    let fd = new FormData();
    fd.append("title", $("#title").val());
    fd.append("published", $("#published").is(":checked"));
    fd.append("audio", $("#audio")[0].files[0]);

    showLoading();
    let id = queryParam("id");
    let method = id ? "PATCH" : "POST";
    let url = id ? `/announcements/${id}` : "/announcements";
    api(method, url, fd, true).then(() => {
        hideLoading();
        showToast("Announcement saved");
        window.location = "announcements.html";
    }).fail(() => {
        hideLoading();
        showToast("Save failed", "error");
    });
}
