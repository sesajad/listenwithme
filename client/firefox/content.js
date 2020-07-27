if (window.location.pathname.endsWith("watch")) {
        let urlParams = new URLSearchParams(window.location.search)
        let id = urlParams.get('v')
    
        browser.storage.sync.get("url").then(x => {
            browser.storage.sync.get("secret").then(y => {
                let target = `${x.url}inform?secret=${y.secret}&id=${id}`
                try {
                    let request = new XMLHttpRequest()
                    console.log(target)
                    request.open('GET', target, true)
                    request.send()
                } catch (e) {
                    console.log(e)
                }
            })
        })
}