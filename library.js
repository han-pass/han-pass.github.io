import {prove_new_adv, get_prover_adv, prove_test_adv, get_prid_adv, parse_adv} from './adv_protocol/public.js';

function get_otp_url(aux) {
    let [otp, url] = aux.split(';',2)
    return [otp, url]
}

function check_strength(pw) {
    let denylist = ["password"];
    let regex_letter = new RegExp(/^.*[A-Za-z].*$/);
    let regex_number = new RegExp(/^.*[0-9].*$/);
    let regex_symbol = new RegExp(/^.*[!@#\$%\^\&*\)\(+=._-].*$/);


    if (pw.length < 15)
        return "Passwords must be at least 15 characters";
/*
    else if (denylist.includes(pw))
        return "The pasword is too common";
    else if (!regex_letter.test(pw))
        return "Passwords must contain a minimum of 1 letters";
    else if (!regex_number.test(pw))
        return "Passwords must contain a minimum of 1 numbers";
    else if (!regex_symbol.test(pw))
        return "Passwords must contain a minimum of 1 symbols";
*/
    else
        return null
}

function load_pw_name() {
    let listdom = document.getElementById("pw_name_list");
    if(listdom == null)
        return
    let options = listdom.innerHTML;
    let pw_name_list = []
    let keys = Object.keys(localStorage);
    for(var i=0; i<keys.length; i++) {
        let pw_name = get_pw_name(keys[i])
        if(pw_name)
            pw_name_list.push(pw_name)
    }
    pw_name_list = Array.from(new Set(pw_name_list))
    pw_name_list.forEach(function (pw_name) {
        if(pw_name === "Default" || pw_name === "Special")
            return;
        options += '<option value="' + pw_name + '" />';
    });
    listdom.innerHTML = options;
}

function get_pw_name(key) {
    let [userid, path] = key.split("&");
    let origin = null;
    try{
        origin = new URL(decodeURIComponent(path)).origin;
    } catch(err) {
        return null;
    }
    let val = localStorage.getItem(key);
    let [date, pw_name, salt, pr, {}] = val.split("&");
    return decodeURIComponent(pw_name)
}

  
async function do_query(url) {
    let res = null;
    try{
        res = await fetch(url);
    } catch(err) {
        return_failure("Server error")
    }
    if (!res.ok ) {
        if(res.status === 405 )
            return_failure("User is not using HanPass")
        else
            return_failure('Query Fails');
    }
    let body = await res.json();
    return body;
}

function return_failure(err_msg) {
    alert(err_msg)
    // opener.postMessage("", url_app);
    window.close();
}

function prove_new(pt) {
    switch (pt) {
        case "adv": return prove_new_adv;
        case "" : return () => {return null}
    }
}
  
function get_prover(pt) {
    switch (pt) {
        case "adv": return get_prover_adv;
        case "" : return () => {return null}
    }
}

function prove_test(pt) {
    switch (pt) {
        case "adv": return prove_test_adv;
        case "" : return () => {return null}
    }
}

function get_prid(pt) {
    switch (pt) {
        case "adv": return get_prid_adv;
        case "" : return () => {return null}

    }
}

function parse(pt) {
    switch (pt) {
        case "adv": return parse_adv;
        case "" : return () => {return null}
    }
}

async function do_login(aux, pt, data, pt_n, data_n, etc, pw) {
    let prid = get_prid(pt)(data);
    let pr = pw !== "" ? await get_prover(pt)(data, pw) : null;
    let [r_n, prid_n, pr_n] = (data_n===null) ? [etc, prid, pr] : await prove_new(pt_n)(data_n, pw, etc);
    let ret = aux + ';' + pt + ';' + pt_n + ';' + await prove_test(pt)(data, pr, r_n);
    return [ret, prid_n, pr_n];
}

async function do_create(aux, pt, pt_n, data_n, etc, pw) {
    let [ret, prid, pr] = await prove_new(pt_n)(data_n, pw, etc);
    ret = aux + ';' + pt + ';' + pt_n + ';' + ret;
    return [ret, prid, pr];
}

async function do_change(aux, pt, data, pt_n, data_n, etc, pw, pw_n) {
    let pr = await get_prover(pt)(data, pw);
    let [r_n, prid_n, pr_n] = await prove_new(pt_n)(data_n, pw_n, etc);
    let ret = aux + ';' + pt + ';' + pt_n + ';' + await prove_test(pt)(data, pr, r_n)
    return [ret, prid_n, pr_n];
}
  
async function do_restore(aux, pt, data, pt_n, data_n, etc, pw_n) {
    let [r_n, prid_n, pr_n] = await prove_new(pt_n)(data_n, pw_n, etc);
    let ret = aux + ';' + pt + ';' + pt_n + ';' + await prove_test(pt)(data, null, r_n)
    return [ret, prid_n, pr_n];
}

function PMPut(url_query, id, pwn, prid, pr, ma, al, changedate=false) {
    const url = new URL(url_query)
    const path = url.origin + url.pathname;
    let key = [encodeURIComponent(id), encodeURIComponent(path)].join("&");
    // if(ma === true) {
    //     localStorage.setItem('Manage Account', "Y");   
    // }
    // else {
    //     localStorage.setItem('Manage Account', "N");   
    // }

    // if(al === true) {
    //     localStorage.setItem('Auto Login', "Y");
    // }
    // else {
    //     localStorage.setItem('Auto Login', "N");
    // }

    if(!al) {
        pr = ""
    }

    if(ma) {
        if(changedate) {
            let date = Date.now();
            let val = [encodeURIComponent(date), encodeURIComponent(pwn), encodeURIComponent(prid), encodeURIComponent(pr),""].join("&");
            localStorage.setItem(key, val)
        }
        else {
            let item = localStorage.getItem(key)
            if(prid === null && pr === null)
                return;
            if(item === null) {
                let date = 0;
                let val = [encodeURIComponent(date), encodeURIComponent(pwn), encodeURIComponent(prid), encodeURIComponent(pr),""].join("&");
                localStorage.setItem(key, val);
            }
            else {
                let [date_p, {}, {}, {}, {}] = item.split("&");
                let val = [date_p, encodeURIComponent(pwn), encodeURIComponent(prid), encodeURIComponent(pr),""].join("&");
                localStorage.setItem(key, val);
            }
        }
    }
    else {
        localStorage.removeItem(key);
    }
}

function PMGet(url_query, id, prid, secure=false) {
    let ma = localStorage.getItem('Manage Account')
    let al = localStorage.getItem('Auto Login')

    if(ma === null) {
        localStorage.setItem('Manage Account', "Y");
        ma = true;
    } else if( ma === "Y") {
        ma = true
    } else{
        ma = false;
    }

    if(al === null) {
        localStorage.setItem('Auto Login', "N");
        al = false;
    } else if( al === "Y") {
        al = true
    } else{
        al = false;
    }

    if(url_query !== null && id !== null && prid !== null) {
        const url = new URL(url_query)
        const path = url.origin + url.pathname;    
        let key = [encodeURIComponent(id), encodeURIComponent(path)].join("&");
        let val = localStorage.getItem(key)
        if(val === null) {
            return ["", "", ma, al]
        }
        let [{}, s_pwn, s_prid, s_pr, {}] = val.split("&");
        // if(decodeURIComponent(s_prid) !== prid && !secure) {
        //     localStorage.removeItem(key);
        //     return ["", "", ma, al]   
        // }
        return [decodeURIComponent(s_pwn), decodeURIComponent(s_pr), ma, al]
    }
    return ["", "", ma, al];
}

export {check_strength, load_pw_name, do_query,
         prove_new, get_prover, prove_test, get_prid,
        parse, return_failure, do_login, do_create, do_change,
        PMPut, PMGet, do_restore, get_otp_url};
