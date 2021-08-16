window.onload = function() {
    let input = confirm("Import Account data?");
    if(input) {
        let arr = getList()
        arr.forEach((e) => {
            let key = e.id + '&' + e.url;
            let prev_val = localStorage.getItem(key);
            if(prev_val === null) {
                let val = e.time + '&' + e.pwname + '&&&'
                localStorage.setItem(key, val);
                return;
            }
            else {
                let [time_p, {}, {}, {}] = prev_val.split('&');
                if(parseInt(time_p) < parseInt(e.time)) {
                    let val = e.time + '&' + e.pwname + '&&&'
                    localStorage.setItem(key, val);    
                }
                return;
            }
        })
    }
    window.location.href = "../manager"       
}

function getList(url = window.location.href) {
    let anchor = url.split('#');
    anchor = anchor[1];
    let list = anchor.split('/')
    let res = []
    list.forEach(element => {
        if(element === "") return;
        let [key, val] = element.split('=')
        let [id, url] = key.split('&')
        let [time, pwname] = val.split('&')
        res.push({
            id: id,
            url: url,
            time: time,
            pwname: pwname,
        })
    });
    return res;
}