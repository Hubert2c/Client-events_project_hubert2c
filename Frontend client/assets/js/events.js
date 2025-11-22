$(document).ready(function () {
    if ($("#eventsList").length) loadEvents();
    if ($("#eventDetail").length) loadEventDetail();
    if ($("#saveEvent").length) {
        $("#image").on("change", previewImage);
        $("#saveEvent").on("click", saveEvent);
    }
});

function loadEvents() {
    api("GET", "/events").then(list => {
        let u = getUser();
        $("#eventsList").html("");
        list.filter(e => e.published || u.role === "admin").forEach(e => {
            let btns = `<a href="event_detail.html?id=${e.id}" class="bg-blue-600 text-white px-3 py-1 rounded">View</a>`;
            if (u.role === "user") {
                btns += e.registered
                    ? `<button class="cancelReg ml-2 bg-red-600 text-white px-3 py-1 rounded" data-id="${e.id}">Cancel</button>`
                    : `<button class="register ml-2 bg-green-600 text-white px-3 py-1 rounded" data-id="${e.id}">Register</button>`;
            }
            if (u.role === "admin") {
                btns += `<a href="event_form.html?id=${e.id}" class="ml-2 bg-yellow-500 text-white px-3 py-1 rounded">Edit</a>
                         <button class="deleteEvent ml-2 bg-red-600 text-white px-3 py-1 rounded" data-id="${e.id}">Delete</button>`;
            }
            $("#eventsList").append(`
                <div class="bg-white shadow p-4 rounded mb-3 flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-xl">${e.title}</h3>
                        <p class="text-gray-600">${truncate(e.description, 120)}</p>
                        <p class="text-sm text-gray-500">${formatDate(e.starts_at)} - ${formatDate(e.ends_at)}</p>
                    </div>
                    <div>${btns}</div>
                </div>
            `);
        });

        $(".register").on("click", function () {
            let id = $(this).data("id");
            api("POST", "/event-registrations", { event_id: id }).then(() => loadEvents());
        });

        $(".cancelReg").on("click", function () {
            let id = $(this).data("id");
            api("PATCH", `/event-registrations/${id}/cancel`).then(() => loadEvents());
        });

        $(".deleteEvent").on("click", function () {
            let id = $(this).data("id");
            api("DELETE", `/events/${id}`).then(() => loadEvents());
        });
    });
}

function loadEventDetail() {
    let id = queryParam("id");
    api("GET", `/events/${id}`).then(e => {
        let u = getUser();
        $("#eventDetail").html(`
            <h2 class="text-3xl font-bold mb-2">${e.title}</h2>
            <img src="${e.metadata?.image_url || ''}" class="w-full mb-4 rounded" />
            <p class="mb-2">${e.description}</p>
            <p class="text-gray-500 mb-2">${formatDate(e.starts_at)} - ${formatDate(e.ends_at)}</p>
            <p class="text-gray-500 mb-2">${e.location}</p>
        `);

        if (u.role === "user") {
            let btn = e.registered
                ? `<button id="cancelRegBtn" class="bg-red-600 text-white px-3 py-1 rounded">Cancel Registration</button>`
                : `<button id="registerBtn" class="bg-green-600 text-white px-3 py-1 rounded">Register</button>`;
            $("#eventDetail").append(`<div class="my-3">${btn}</div>`);

            $("#registerBtn").on("click", () => {
                api("POST", "/event-registrations", { event_id: e.id }).then(() => loadEventDetail());
            });
            $("#cancelRegBtn").on("click", () => {
                api("PATCH", `/event-registrations/${e.id}/cancel`).then(() => loadEventDetail());
            });
        }

        if (u.role === "admin") {
            api("GET", `/event-registrations/event/${e.id}`).then(list => {
                let html = `<h3 class="font-bold mt-4 mb-2">Registrants</h3>`;
                list.forEach(r => {
                    html += `<p>${r.user.full_name} (${r.user.email})</p>`;
                });
                $("#eventDetail").append(html);
            });
        }

        loadEventFeedback(e.id);
    });
}

function loadEventFeedback(event_id) {
    api("GET", `/event-feedback/${event_id}`).then(list => {
        $("#eventDetail").append(`<h3 class="font-bold mt-4 mb-2">Feedback</h3>`);
        if (list.length === 0) $("#eventDetail").append(`<p class="text-gray-600">No feedback yet</p>`);
        list.forEach(f => {
            $("#eventDetail").append(`
                <div class="border p-2 mb-2 rounded">
                    <p class="font-bold">${f.user.full_name}</p>
                    <p>Rating: ${f.rating}/5</p>
                    <p>${f.comment}</p>
                </div>
            `);
        });

        if (getUser().role === "user") {
            $("#eventDetail").append(`
                <div class="mt-3">
                    <h4 class="font-bold">Add Feedback</h4>
                    <input type="number" id="feedbackRating" min="1" max="5" class="border p-1 w-16" />
                    <textarea id="feedbackComment" class="border p-1 w-full mt-1"></textarea>
                    <button id="submitFeedback" class="bg-blue-600 text-white px-3 py-1 rounded mt-1">Submit</button>
                </div>
            `);
            $("#submitFeedback").on("click", () => {
                let data = {
                    event_id,
                    rating: $("#feedbackRating").val(),
                    comment: $("#feedbackComment").val()
                };
                api("POST", "/event-feedback", data).then(() => loadEventDetail());
            });
        }
    });
}

function previewImage() {
    let file = $("#image")[0].files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = e => $("#imagePreview").attr("src", e.target.result).removeClass("hidden");
    reader.readAsDataURL(file);
}

function saveEvent() {
    let fd = new FormData();
    fd.append("title", $("#title").val());
    fd.append("description", $("#description").val());
    fd.append("location", $("#location").val());
    fd.append("starts_at", $("#starts_at").val());
    fd.append("ends_at", $("#ends_at").val());
    fd.append("published", $("#published").is(":checked"));
    if ($("#image")[0].files[0]) fd.append("image", $("#image")[0].files[0]);

    showLoading();
    let id = queryParam("id");
    let method = id ? "PATCH" : "POST";
    let url = id ? `/events/${id}` : "/events";
    api(method, url, fd, true).then(() => {
        hideLoading();
        showToast("Event saved");
        window.location = "events.html";
    }).fail(() => {
        hideLoading();
        showToast("Save failed", "error");
    });
}
