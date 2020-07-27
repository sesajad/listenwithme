document.addEventListener("DOMContentLoaded", function() {
    let url = document.getElementById("url")
    browser.storage.sync.get("url").then(r => {
        url.value =  r.url
    })
    url.addEventListener("input", function() {
        browser.storage.sync.set({ url : url.value })
    })

    let secret = document.getElementById("secret")
    browser.storage.sync.get("secret").then(r => {
        secret.value = r.secret
    })
    secret.addEventListener("input", function() {
        browser.storage.sync.set({ secret : secret.value })
    })
}) 