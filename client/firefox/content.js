var lastParam = ""
function send() {
    if (window.location.pathname.endsWith("watch")) {
        let urlParams = new URLSearchParams(window.location.search)
        let id = urlParams.get('v')

        browser.storage.sync.get("url").then(x => {
            browser.storage.sync.get("secret").then(y => {
                let target = `${x.url}inform?secret=${y.secret}&id=${id}`
                let request = new XMLHttpRequest()
                console.log(target)
                request.open('GET', target, true)
                request.onload = function() {
                    // nothing
                }
                request.onerror = function(e) {
                    console.log(e, "error 16")
                }
                request.send()
            })
        })
    }
}

function repeater() {
    console.log("hi!")
    if (window.location.search != lastParam)
        send()
    setTimeout(10000, repeater)
}

repeater()