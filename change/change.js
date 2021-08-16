import {check_strength, load_pw_name, do_query,
    parse, prove_new,return_failure, get_prover, 
    get_prid, prove_test, do_change, do_create, PMPut, PMGet, get_otp_url} from "../library.js";

let opener = null;
let url_app = null;
let step = 1;
let curr_pwname = null;
let pw = null;
let pw_n = null;
let pw_confirm = null;
let createmode = false;

document.getElementById('redo').onclick = reset_dom;
document.getElementById('compute').onclick = set_change_button(null, null, null, null, null, null, null, null);


window.onload = function() {
    // window.onblur = function(){ window.close(); };
    load_pw_name();
    window.addEventListener("message", receive_message, false);
    window.opener.postMessage("", "*");
}


// window.onload = async function() {
//     var qr = new QRious({
//         element: document.getElementById('qr'),
//         value: 'asdfsaf'
//     });
//     await test()
// }
// async function test() {
//     const dom_app = "sflab.snu.ac.kr";
//     let id= "Newtest19";
//     let url_query = "https://sflab.snu.ac.kr:92";
//     document.getElementById("user_id").value = id;
//     document.getElementById("url_query").value = new URL(url_query).origin;
//     let result = await QueryChange(id, url_query);
//     let pt = result['pt']; let ds = result['ds']; let pt_n = result['pt_n']; let ds_n = result['ds_n'];  let kh = result['kh'];
//     let data = parse(pt)(ds)
//     let data_n = parse(pt_n)(ds_n);
//     let kd = kh +';' + dom_app;
//     let pw = 'asdf';
//     let pw_n = 'asdf1234!@#$';
//     try {
//         let pr = get_prover(pt)(data, pw);
//         let [r_n, prid_n, pr_n] = prove_new(pt_n)(data_n, pw_n, kd);
//         let ret = prove_test(pt)(data, pr, r_n);
//         console.log(ret);
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
    if(id==""){
        return_failure("Insert your ID")
    }
    document.getElementById("user_info1").value = id;
    document.getElementById("url_query").value = new URL(url_query).origin;
    window.removeEventListener("message", receive_message);
    let result = await QueryChange(id, url_query);
    let aux= result['aux']; let pt = result['pt']; let ds = result['ds']; let pt_n = result['pt_n']; let ds_n = result['ds_n']; let kh = result['kh'];
    let [_0, url_hp] = get_otp_url(aux)
    if(url_hp !== url_query) {
        alert("Query URL mismatch")
        window.close();
    }
    let data = ds ? parse(pt)(ds) : null;
    let data_n = parse(pt_n)(ds_n);
    let [pwname, {}, ma, al] = PMGet(url_query, id, get_prid(pt)(data), true);
    curr_pwname = pwname
    document.getElementById('remember_sva').checked = ma;
    document.getElementById('remember_svp').checked = al;
    
    if(data === null) {
        document.getElementById('input_name').innerHTML = "Enter a new password"
        document.getElementById('input_value').innerHTML = '<input type="password" placeholder="Minimum 15 characters" id="user_info3" autocomplete="current-password" onkeypress="enter_pwd()">'
        document.getElementById('prev_id').innerHTML = ""
        document.getElementById('pw_name').autocomplete = "username"
        document.getElementById('user_info3').focus();
        step = 2
        createmode = true;
    }
    else {
        document.getElementById("dummy_id").value = pwname;
        document.getElementById("user_info2").placeholder = "PWN: " +  pwname;
    }
    document.getElementById('redo').onclick = reset_dom;
    document.getElementById('compute').onclick = set_change_button(id, url_query, aux, pt, pt_n, data, data_n, dom_app, kh);
}

async function QueryChange(id, url_query) {
    let url = url_query + '?query=change&id=' + encodeURIComponent(id) + '&url_hp=' + encodeURIComponent(url_query);
    return await do_query(url);
}

function set_change_button(id, url_query, aux, pt, pt_n, data, data_n, dom_app, kh) {
    return (async () => {
        if(step === 1) {
            pw = document.getElementById('user_info2').value;
            go_step2();
        }
        else if(step === 2) {
            pw_n = document.getElementById('user_info3').value;
            let strength = check_strength(pw_n);
            if(strength !== null) {
                alert(strength);
                reset_dom();
            }
            else {
                go_step3();
            }
        }
        else if(step === 3) {
            pw_confirm = document.getElementById('user_info4').value;
            if(pw_n !== pw_confirm) { 
                alert("The password confirmation does not match");
                reset_dom();
            }
            else {
                go_step4();
            }        
        }
        else {
            let [pw, pw_n, pwn_n, eml, ma, al] = get_userpw();
            let etc = kh + ';' + dom_app + ';' + eml;
            if((data && !(pw && pw_n)) || (!data && !pw_n)) 
                return;
            try {
                let ret =  null;
                let prid = null;
                let pr = null;
                if(data === null) [ret, prid, pr] = await do_create(aux, pt, pt_n, data_n, etc, pw_n)
                else [ret, prid, pr] = await do_change(aux, pt, data, pt_n, data_n, etc, pw, pw_n)
                // let pw_name = document.getElementById("pw_name").value;
                // PMChange(id, url_query, pw_name, null, null);
                opener.postMessage(ret, url_app);
                PMPut(url_query, id, pwn_n, prid, pr, ma, al, true);
                window.close();
            } catch(err) {
                // this event shouldn't occur
                console.log(err)
                // return_failure("Error during encryption")
            }
        }
    });
}

function reset_dom() {
    reset_state();
    if(createmode) {
        go_step2();
    }
    else {
        go_step1();
    }
}

function reset_state() {
    pw = null;
    pw_n = null;
    pw_confirm = null;
}

function go_step1() {
    document.getElementById('input_name').innerHTML = "Enter the current password"
    document.getElementById('input_value').innerHTML = '<input type="password" autofocus id="user_info2" placeholder="Minimum 15 characters" autocomplete="current-password" onkeypress="enter_pwd()">'
    document.getElementById('prev_id').innerHTML = '<input value="' + curr_pwname +'" type="text" name="dummy_id" id="dummy_id" autocomplete="username">'
    document.getElementById('pw_name').autocomplete = ""
    document.getElementById('compute').value = "Next"
    document.getElementById('user_info2').focus();
    step = 1;
}

function go_step2() {
    document.getElementById('input_name').innerHTML = "Enter a new password"
    document.getElementById('input_value').innerHTML = '<input type="password" placeholder="Minimum 15 characters" id="user_info3" autocomplete="current-password" onkeypress="enter_pwd()">'
    document.getElementById('prev_id').innerHTML = ""
    document.getElementById('pw_name').autocomplete = "username"
    document.getElementById('compute').value = "Next"
    document.getElementById('user_info3').focus();
    step = 2
}

function go_step3() {
    document.getElementById('input_name').innerHTML = "Confirm the new password"
    document.getElementById('input_value').innerHTML = '<input type="password" autofocus id="user_info4" placeholder="Minimum 15 characters" autocomplete="current-password" onkeypress="enter_pwd()">'
    document.getElementById('compute').value = "Next"
    document.getElementById('user_info4').focus();
    step = 3
}

function go_step4() {
    document.getElementById('input_name').innerHTML = '<span class="eml_info">Recovery Email <img width="15px" height="15px" style=\'display:inline;\' src=\'../img/qm.jpg\'/></span>'
    document.getElementById('input_value').innerHTML = '<input type="text" id="eml" autocomplete="off" onkeypress="enter_pwd()">'
    document.getElementById('compute').value = "Complete"
    document.getElementById('eml').focus();
    step = 4
}

function get_userpw() {
    let pwname = document.getElementById('pw_name') ? document.getElementById('pw_name').value : "Default";
    pwname = (pwname ? pwname : "Default");
    let eml = document.getElementById('eml').value;
    let sva = document.getElementById("remember_sva").checked   
    let svp = document.getElementById("remember_svp").checked   
    return [pw, pw_n, pwname, eml, sva, svp];
}
