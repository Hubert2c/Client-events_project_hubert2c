function api(method, endpoint, data = null, isForm = false) {
    return $.ajax({
        method,
        url: BASE_URL + endpoint,
        data: isForm ? data : JSON.stringify(data),
        processData: !isForm,
        contentType: isForm ? false : "application/json",
        headers: { Authorization: "Bearer " + getToken() }
    }).fail(err => {
        if (err.status === 401) logout();
    });
}
