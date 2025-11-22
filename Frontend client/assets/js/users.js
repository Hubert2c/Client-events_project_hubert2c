$(document).ready(function () {
    if ($("#usersList").length) loadUsers();
});

function loadUsers() {
    api("GET", "/users").then(list => {
        $("#usersList").html("");
        list.forEach(u => {
            $("#usersList").append(`
                <div class="bg-white p-4 shadow rounded flex justify-between items-center mb-3">
                    <div>
                        <p class="font-bold text-lg">${u.full_name}</p>
                        <p>${u.email}</p>
                        <p class="text-sm text-gray-600">${u.role}</p>
                    </div>
                    <button 
                        class="toggleUser bg-blue-600 text-white px-3 py-1 rounded" 
                        data-id="${u.id}">
                        ${u.is_active ? "Disable" : "Enable"}
                    </button>
                </div>
            `);
        });

        $(".toggleUser").on("click", function () {
            let id = $(this).data("id");
            api("PATCH", `/users/${id}/toggle`).then(() => loadUsers());
        });
    });
}
