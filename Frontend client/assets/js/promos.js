$(document).ready(function () {
    if ($("#promosList").length) loadPromos();
    if ($("#promoDetails").length) loadPromoDetail();
    if ($("#savePromo").length) $("#savePromo").on("click", savePromo);
});

function loadPromos() {
    api("GET", "/promos").then(list => {
        $("#promosList").html("");
        list.filter(p => p.published).forEach(p => {
            $("#promosList").append(`
                <div class="bg-white shadow rounded p-4 mb-3">
                    <h3 class="font-bold text-xl mb-2">${p.title}</h3>
                    <p class="text-gray-600 mb-3">${truncate(p.description, 120)}</p>
                    <a href="promo_detail.html?id=${p.id}" class="bg-blue-600 text-white px-3 py-1 rounded">Play</a>
                </div>
            `);
        });
    });
}

function loadPromoDetail() {
    let id = queryParam("id");
    api("GET", `/promos/${id}`).then(p => {
        $("#promoDetails").html(`
            <h2 class="text-3xl font-bold mb-4">${p.title}</h2>
            <video controls class="w-full rounded mb-4">
                <source src="${p.video_url}" type="video/mp4">
                <track kind="captions" src="${p.caption_url}" srclang="en" label="English">
            </video>
            <p>${p.description}</p>
        `);
    });
}

function savePromo() {
    let fd = new FormData();
    fd.append("title", $("#title").val());
    fd.append("description", $("#description").val());
    fd.append("caption_text", $("#caption_text").val());
    fd.append("published", $("#published").is(":checked"));
    fd.append("video", $("#video")[0].files[0]);

    showLoading();
    api("POST", "/promos", fd, true).then(() => {
        hideLoading();
        showToast("Promo created");
        window.location = "promos.html";
    }).fail(() => {
        hideLoading();
        showToast("Upload failed", "error");
    });
}
