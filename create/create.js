import {check_strength, load_pw_name, do_query, parse, prove_new, do_create, return_failure, PMGet, PMPut, get_otp_url} from "../library.js";
let opener = null;
let url_app = null;
let step = 1;
let pw_n = null;
let pw_confirm = null;

document.getElementById('redo').onclick = reset_dom;
document.getElementById('compute').onclick = set_create_button(null, null, null, null, null, null, null);


window.onload = function() {
    // window.onblur = function(){ window.close(); };
    load_pw_name();
    window.addEventListener("message", receive_message, false);
    window.opener.postMessage("", "*");
}


// window.onload = async function() {
//     await test()
// }

// async function test() {
//     const dom_app = "sflab.snu.ac.kr"
//     let id= "newtesting1234";
//     let url_query = "https://sflab.snu.ac.kr:92?query=create&id=asdfasd";
//     document.getElementById("user_id").value = id;
//     document.getElementById("url_query").value = new URL(url_query).origin;
//     let result = await QueryCreate(id, url_query);
//     let ty= result['ty']; let pt = result['pt']; let pt_n = result['pt_n']; let ds = result['ds_n']; let aux = result['aux'];
//     let data = parse(pt_n)(ds)
//     let etc = aux +';' + dom_app
//     // set_button(pt, id, url_query, data, kh);
//     let pw = 'asdf1234!@#$';
//     try {
//         console.log(do_create(ty, pt, pt_n, data, etc, pw))
//     } catch(err) {
//         console.log(err)
//     }
// }

async function receive_message(event) {
    opener = event.source;
    url_app = event.origin;
    const dom_app = new URL(url_app).hostname;
    let parsed = event.data.split(';',2);
    let url_query = decodeURIComponent(parsed[0]);
    let id = decodeURIComponent(parsed[1]);
    document.getElementById("user_info1").value = id;
    document.getElementById("url_query").value = new URL(url_query).origin;
    window.removeEventListener("message", receive_message);
    let result = await QueryCreate(id, url_query);
    let aux = result['aux']; let pt = result['pt']; let pt_n = result['pt_n']; let ds_n = result['ds_n'];let kh = result['kh'];
    let [_, url_hp] = get_otp_url(aux)
    if(url_hp !== url_query) {
        alert("Query URL mismatch")
        window.close();
    }
    let data_n = parse(pt_n)(ds_n)
    let [_0, _1, ma, al] = PMGet(null, null, null);
    document.getElementById('remember_sva').checked = ma;
    document.getElementById('remember_svp').checked = al;
    document.getElementById('redo').onclick = reset_dom;
    document.getElementById('compute').onclick = set_create_button(id, url_query, aux, pt, pt_n, data_n, dom_app, kh);
}

async function QueryCreate(id, url_query) {
    let url = url_query + '?query=create&id=' + encodeURIComponent(id) + '&url_hp=' + encodeURIComponent(url_query);
    return await do_query(url);
}

function set_create_button(id, url_query, aux, pt, pt_n, data_n, dom_app, kh) {
    return (async () => {
        if(step === 1) {
            pw_n = document.getElementById('user_info3').value;
            let strength = check_strength(pw_n);
            if(strength !== null) {
                alert(strength);
                reset_dom();
            }
            else   {
                go_step2();
            }
        }
        else if(step === 2 ){
            pw_confirm = document.getElementById('user_info4').value;
            if(pw_n !== pw_confirm) { 
                alert("The password confirmation does not match"); 
                reset_dom();
            }        
            else {
                go_step3();
            }
        }
        else {
            let [pw, pwn_n, eml, ma,al] = get_userpw();
            try {
                // let pw_name = document.getElementById("pw_name").value;
                // PMCreate(id, url_query, pw_name);
                let etc = kh+ ';' +dom_app + ';' + eml;
                let [ret, prid, pr] = await do_create(aux, pt, pt_n, data_n, etc, pw)
                opener.postMessage(ret, url_app);
                PMPut(url_query, id, pwn_n, prid, pr, ma, al, true);
                window.close();
            } catch(err) {
                // this event shouldn't occur
                console.log(err)
                return_failure(err);

            }
        }
    });
}

function reset_dom() {
    go_step1();
    reset_state();
}

function reset_state() {
    pw_n = null;
    pw_confirm = null;
}

function go_step1() {
    document.getElementById('input_name').innerHTML = "Enter a new password"
    document.getElementById('input_value').innerHTML = '<input type="password" autofocus id="user_info3" placeholder="Minimum 15 characters" autocomplete="current-password" onkeypress="enter_pwd()">'
    document.getElementById('compute').value = "Next"
    document.getElementById('user_info3').focus();
    step = 1;
}

function go_step2() {
    document.getElementById('input_name').innerHTML = "Confirm the new password"
    document.getElementById('input_value').innerHTML = '<input type="password" autofocus id="user_info4" placeholder="Minimum 15 characters" autocomplete="current-password" onkeypress="enter_pwd()">'
    document.getElementById('compute').value = "Next"
    document.getElementById('user_info4').focus();
    step = 2
}

function go_step3() {
    document.getElementById('input_name').innerHTML = '<span class="eml_info">Recovery Email <img width="15px" height="15px" style=\'display:inline;\' src=\'../img/qm.jpg\'/></span>'
    document.getElementById('input_value').innerHTML = '<input type="text" id="eml" autocomplete="off" onkeypress="enter_pwd()">'
    document.getElementById('compute').value = "Complete"
    document.getElementById('eml').focus();
    step = 3
}

function get_userpw() {
    let pwname = document.getElementById('pw_name').value;
    pwname = (pwname ? pwname : "Default");
    let eml = document.getElementById('eml').value;
    let sva = document.getElementById("remember_sva").checked
    let svp = document.getElementById("remember_svp").checked
    return [pw_n, pwname, eml, sva, svp];
}

