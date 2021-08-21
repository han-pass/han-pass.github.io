import {check_strength, load_pw_name, do_query,
    parse, prove_new,return_failure, get_prover, 
    get_prid, prove_test, do_change, do_create, PMPut, PMGet, do_restore, get_otp_url} from "../library.js";


// function PMChange(id, url_query, pw_name, salt, pr) {
//     const url = new URL(url_query)
//     const path = url.origin + url.pathname;
//     let key = [id, path].join(";");
//     let [date_p, pw_name_p, salt_p, pr_p] = localStorage.getItem(key).split(";")
//     if(pw_name === "")
//         pw_name = pw_name_p;
//     let time = new Date();
//     let date = time.getFullYear() + "-" + (time.getMonth()+1) + "-" + time.getDate()
//     let val = [date, pw_name, salt, pr].join(";");
//     localStorage.setItem(key, val);
//     return date;
// }

// function PMCreate(id, url_query, pw_name) {
//     const url = new URL(url_query)
//     const path = url.origin + url.pathname;
//     let key = [id, path].join(";");
//     let time = new Date();
//     let date = time.getFullYear() + "-" + (time.getMonth()+1) + "-" + time.getDate()
//     let val = [date, pw_name, null, null].join(";");
//     localStorage.setItem(key, val);
//     return date;
// }

let entries = {};

document.getElementById('select_global').onchange = select_global;
// document.getElementById('compute').onclick = do_update_all;
// document.getElementById('export_data').onclick = export_data;
// document.getElementById('import_data').onclick = import_data;
document.getElementById('clear_all').onclick = clear_all;
document.getElementById('rename').onclick = rename;
document.getElementById('do_change').onclick = click_change;
document.getElementById('do_reset').onclick = click_reset;
document.getElementById('request_restore').onclick = request_restore;
document.getElementById('global_pw_name').oninput = select_by_pwname;

// window.parse_file = parse_file
window.do_update_all = do_update_all;
window.do_reset_all = do_reset_all;
window.redo_change = redo_change;
window.redo_reset = redo_reset;

function select_by_pwname() {
    let val = document.getElementById('global_pw_name').value;
    if(val === "")
        return;
    let keys = Object.keys(entries);
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        let entry = entries[key]
        if (entry.pw_name.nodeValue === val) {
            entry.checked.checked = true;
        }
        else
            entry.checked.checked = false;
    }   
}

let pw=null;
let pw_n = null;
let pw_confirm = null;
let step = 1;

function get_pwname() {
    let keys = Object.keys(entries);
    let pwname = "Default";
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        if (entries[key].checked.checked === true) {
            pwname = entries[key].pw_name.nodeValue;
            break;
        }
    }
    return pwname;
}

let change = false;

function click_change() {
    if(!change){
        let keys = Object.keys(entries);
        let all_unchecked = true;
        for(var i=0; i<keys.length; i++) {
            let key = keys[i];
            if (entries[key].checked.checked === true) {
                all_unchecked = false;
                break;
            }
        }
        if(all_unchecked) {
            alert("Select a website to change");
            return;
        }
        disable_selection("Change");
        reset_state();
        step = 1;
        document.getElementById('user_request').innerHTML = `
        <h4 style="margin-left: 70px;">
            Change the selected passwords at once
        </h4>

        <table style="text-align: center;margin-left: 70px;">
            <tr id="pwname_tr">
                <td>
                    <div style="display:none !important; visibility:hidden; pointer-events: none;">
                        <input style="width:160px" type="text" name="dummy_id" id="dummy_id" autocomplete="username">
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="2" id="input_name" style="text-align:right; font-weight:bold"> Enter the current password </td>
            </tr>
            <tr>
            <td></td>

                <td id="input_value"> <input type="password" id="user_info2" autocomplete="current-password" onkeypress="enter_pwd()"> </td>
            </tr>  
            <tr>
            <td>          
                <td style="float:right;">
                <input type="button" id="redo" onclick="redo_change()" value="&#8634;">
                <input type="button" id="compute" value="Next" onclick="do_update_all()">
                </td>
            </td>
            </tr>
        </table>
        `
        let pwname = get_pwname()
        document.getElementById('user_info2').placeholder = "PWN: " + pwname;
        document.getElementById('dummy_id').value = pwname
        document.getElementById('user_info2').focus()
        change = true;
    }
    else {
        enable_selection();
        reset_state();
        step = 1;
        document.getElementById('user_request').innerHTML = '';
        change = false;
    }

}

let reset = false;

function click_reset() {
    if(!reset){
        let keys = Object.keys(entries);
        let all_unchecked = true;
        for(var i=0; i<keys.length; i++) {
            let key = keys[i];
            if (entries[key].checked.checked === true && entries[key].restored.checked === true) {
                all_unchecked = false;
                break;
            }
        }
        if(all_unchecked) {
            alert("Select a restored website to reset");
            return;
        }
        disable_selection("Reset");
        reset_state();
        step = 1;
        document.getElementById('user_request').innerHTML = `
        <h4 style="margin-left: 70px;">
            Reset the selected passwords at once
        </h4>

        <table style="text-align: center;margin-left: 70px;">
        <tr id="pwname_tr">
            <td>
                <div class="popup" onclick="open_pwn()">
                    PWN <img width="15px" height="15px" style='display:inline;' src='../img/qm.jpg'/>
                    <span id="pwn_popup" class="popuptext pwname_info"></span>
                </div>
            </td>
            <td>
                <input list="pw_name_list" type="text" id="pw_name" autocomplete="username" placeholder="Default" onkeypress="enter_pwd()">
            </td>
        </tr>
        <tr>
            <td colspan="2" id="input_name" style="text-align:right; font-weight:bold"> Enter a new password </td>
        </tr>
        <tr>
            <td></td>
            <td id="input_value"> <input type="password" placeholder="Minimum 15 characters" id="user_info3" autocomplete="current-password" onkeypress="enter_pwd()"> </td>
        </tr>  
        <tr>
            <td>          
            <td style="float:right;">
                <input type="button" id="redo" onclick="redo_reset()" value="&#8634;">
                <input type="button" id="compute" value="Next" onclick="do_reset_all()">
            </td>
            </td>
        </tr>
        </table>
        `
        document.getElementById('user_info3').focus()
        reset = true;
    }   
    else {
        enable_selection();
        reset_state();
        step = 1;
        document.getElementById('user_request').innerHTML = '';
        reset = false;
    }

}

function rename() {
    let keys = Object.keys(entries);
    let empty = true;
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        if(entries[key].checked.checked == true) {
            empty = false;
            break;
        }
    }
    if(empty) {
        alert('Select an account to rename')
        return;
    }
    let name = prompt("Enter your new PW Name")
    if(name === null)
        return;
    if(name === "") {
        name = "Default"
    }
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        let entry = entries[key]
        if(entry.checked.checked == true) {
            entry.pw_name.nodeValue = name;
            let [userid, qurl] = key.split('&')
            let time = new Date();
            let date = time.getFullYear() + "/" + (time.getMonth()+1) + "/" + time.getDate()
            let [_0, _1, prid, pr, _2] = localStorage.getItem(key).split('&')
            PMPut(decodeURIComponent(qurl), decodeURIComponent(userid), name, decodeURIComponent(prid), decodeURIComponent(pr), true, document.getElementById('remember_svp').checked, true);
            entry.date.nodeValue = date;
            entry.date.parentElement.title = time
        }
    }
    load_pw_name()
}


window.onload = function() {
    load_pw_name();
    let dom_entries = document.getElementById("entries");
    let keys = Object.keys(localStorage);
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        if((localStorage.getItem(key).split(";").length - 1) === 3) {
            localStorage.removeItem(key);
            continue;
        }
        let [tr, entry] = key_to_entry(key, localStorage.getItem(key));
        if( tr!== null && entry !== null) {
            dom_entries.appendChild(tr);
            entries[key] = entry;
        }
    }
    document.getElementById('export_url').onclick = copy;
    let [_0, _1, ma, al] = PMGet(null, null, null);
    document.getElementById('remember_sva').checked = ma
    document.getElementById('remember_svp').checked = al
}

function copy() {
    let keyval = ""
    let arr = [];
    let keys = Object.keys(entries);
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        if(entries[key].checked.checked == false) continue;
        let [date, pw_name, {}, {}, {}] = localStorage.getItem(key).split("&");
        keyval += key + "=" + date + "&" + pw_name + "/"
    }
    if (keyval === ""){
        alert("Select a website to export");
        return;
    }
    document.getElementById("user_request").innerHTML = '<div style="text-align:center;"><h4>URL for exportation is copied to clipboard</h4><canvas id="qr_method"></canvas></div>'
    // let val = "http://localhost:7999/import#" + keyval;
    let val = "https://han-pass.github.io/import#" + keyval;
    navigator.clipboard.writeText(val).then(function() {}, function(err) {});
    let qr = new QRious({
        element: document.getElementById('qr_method'),
        size: 300,
        value: val
    });
}

function reset_state() {
    pw = null;
    pw_n = null;
    pw_confirm = null;
}

function go_step1_change() {
    step = 1;
    document.getElementById('input_name').innerHTML = "Enter the current password"
    document.getElementById('input_value').innerHTML = '<input type="password" id="user_info2" autocomplete="current-password" onkeypress="enter_pwd()">'
    document.getElementById('pwname_tr').innerHTML = `<td>
    <div style="display:none !important; visibility:hidden; pointer-events: none;">
        <input style="width:160px" type="text" name="dummy_id" id="dummy_id" autocomplete="username">
    </div></td>`
    let pwname = get_pwname();
    document.getElementById('user_info2').placeholder = "PWN: " + pwname;
    document.getElementById('dummy_id').value = pwname
    document.getElementById('compute').value = "Next"
    document.getElementById('user_info2').focus();
}

function go_step2_change() {
    document.getElementById('input_name').innerHTML = "Enter a new password"
    document.getElementById('input_value').innerHTML = '<input type="password" placeholder="Minimum 15 characters" id="user_info3" autocomplete="current-password" onkeypress="enter_pwd()">'
    document.getElementById('pwname_tr').innerHTML = 
    `<td>
        <div class="popup" onclick="open_pwn()">
            PWN <img width="15px" height="15px" style='display:inline;' src='../img/qm.jpg'/>
            <span id="pwn_popup" class="popuptext pwname_info"></span>
        </div>
    </td>
    <td>
        <input list="pw_name_list" type="text" id="pw_name" autocomplete="username" placeholder="Default" onkeypress="enter_pwd()">
    </td>`
    document.getElementById('user_info3').focus();
    step = 2
}

function go_step3_change(){
    document.getElementById('input_name').innerHTML = "Confirm the new password"
    document.getElementById('input_value').innerHTML = '<input type="password" autofocus id="user_info4" placeholder="Minimum 15 characters" autocomplete="current-password" onkeypress="enter_pwd()">'
    document.getElementById('compute').value = "Next"
    document.getElementById('user_info4').focus();
    step = 3
}

function go_step4_change(){
    document.getElementById('input_name').innerHTML = `
    <div class="popup" onclick="open_eml()">
        Recovery Email<img width="15px" height="15px" style="display:inline;" src="../img/qm.jpg"/>
        <span id="eml_popup" class="popuptext eml_info">
        </span>           
    </div>
    `    
    document.getElementById('input_value').innerHTML = '<input type="text" id="eml" autocomplete="off" onkeypress="enter_pwd()">'
    document.getElementById('compute').value = "Change All"
    document.getElementById('eml').focus();
    step = 4
}

function redo_change() {
    reset_state();
    go_step1_change();
}

async function do_update_all() {
    if(step === 1) {
        pw = document.getElementById('user_info2').value;
        go_step2_change();
    }
    else if(step === 2) {
        pw_n = document.getElementById('user_info3').value;
        let strength = check_strength(pw_n);
        if(strength !== null) {
            alert(strength); 
            redo_change();
        }
        else
            go_step3_change();
    }
    else if(step === 3) {
        pw_confirm = document.getElementById('user_info4').value;
        if(pw_n !== pw_confirm) { 
            alert("The password confirmation does not match");
            redo_change();
        }
        else
            go_step4_change();
    }
    else {
        let keys = Object.keys(entries);
        let [pw, pw_n, pwn_n, eml, al] = get_userpw();
        disable_all();

        if(document.getElementById('status') === null) {
            let th = document.createElement('th');
            th.id = "status"
            th.style.width = "100px";
            th.innerHTML = "Status"
            document.getElementById("entry_title").appendChild(th)
        }
        
        await Promise.all(keys.map( async (key) => {
            let entry = entries[key];
            if(entry.status === null)
            add_status(key);
            if (entry.checked.checked === true) {
                entry.status.nodeValue = "querying..."
                if(await entry_query(key, eml))
                await entry_change(key, pw, pw_n, pwn_n, al);
            }
        }));

        enable_all();
        enable_selection();
        document.getElementById('pw_name_list').innerHTML = '<option value="Default">Default</option><option value="Special">Special</option>';
        load_pw_name()
        document.getElementById('user_request').innerHTML=''
        change = false;
    }
}

function go_step1_reset() {
    document.getElementById('input_name').innerHTML = "Enter a new password"
    document.getElementById('input_value').innerHTML = '<input type="password" placeholder="Minimum 15 characters" id="user_info3" autocomplete="current-password" onkeypress="enter_pwd()">'
    document.getElementById('compute').value = "Next"
    document.getElementById('user_info3').focus();
    step = 1;
}

function go_step2_reset() {
    document.getElementById('input_name').innerHTML = "Confirm the new password"
    document.getElementById('input_value').innerHTML = '<input type="password" autofocus id="user_info4" placeholder="Minimum 15 characters" autocomplete="current-password" onkeypress="enter_pwd()">'
    document.getElementById('compute').value = "Next"
    document.getElementById('user_info4').focus();
    step = 2
}

function go_step3_reset() {
    document.getElementById('input_name').innerHTML = `
    <div class="popup" onclick="open_eml()">
        Recovery Email<img width="15px" height="15px" style="display:inline;" src="../img/qm.jpg"/>
        <span id="eml_popup" class="popuptext eml_info">
        </span>           
    </div>`
    document.getElementById('input_value').innerHTML = '<input type="text" id="eml" autocomplete="off" onkeypress="enter_pwd()">'
    document.getElementById('compute').value = "Reset All"
    document.getElementById('eml').focus();
    step = 3
}

function redo_reset() {
    reset_state();
    go_step1_reset();
}

async function do_reset_all() {
    if(step === 1) {
        pw_n = document.getElementById('user_info3').value;
        let strength = check_strength(pw_n);
        if(strength !== null) {
            alert(strength); 
            redo_reset();
        }
        else    
            go_step2_reset();
    }
    else if(step === 2) {
        pw_confirm = document.getElementById('user_info4').value;
        if(pw_n !== pw_confirm) { 
            alert("The password confirmation does not match");
            redo_reset();
        }
        else
            go_step3_reset();
    }
    else {
        let keys = Object.keys(entries);        
        let [pw, pw_n, pwn_n, eml, al] = get_userpw();
        disable_all();

    
        if(document.getElementById('status') === null) {
            let th = document.createElement('th');
            th.id = "status"
            th.style.width = "100px";
            th.innerHTML = "Status"
            document.getElementById("entry_title").appendChild(th)
        }
        
        await Promise.all(keys.map( async (key) => {
            let entry = entries[key];
            if(entry.status === null)
                add_status(key);
                if(entry.restored.checked === false)
                    return;
                if (entry.checked.checked === true) {
                    entry.status.nodeValue = "querying..."
                if(await restore_query(key, eml))
                await restore_change(key, pw_n, pwn_n, al);
            }
        }));
        enable_all();
        enable_selection();
        document.getElementById('pw_name_list').innerHTML = '<option value="Default">Default</option><option value="Special">Special</option>';
        load_pw_name()
        document.getElementById('user_request').innerHTML = ''
        reset = false;
    }
}

function disable_selection(name) {
    let keys = Object.keys(entries);
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        entries[key].checked.disabled = true;
    }
    document.getElementById('select_global').disabled = true;
    document.getElementById('global_pw_name').disabled = true;
    let elems = document.getElementsByTagName('button');
    let len = elems.length;
    for (let i = 0; i < len; i++) {
        if(elems[i].innerHTML !== name)
            elems[i].disabled = true;
    }  
}

function disable_all() {
    let elems = document.getElementsByTagName('input');
    let len = elems.length;
    for (let i = 0; i < len; i++) {
        elems[i].disabled = true;
    }
    elems = document.getElementsByTagName('button');
    len = elems.length;

    for (let i = 0; i < len; i++) {
        elems[i].disabled = true;
    }    
}

function enable_all() {
    let elems = document.getElementsByTagName('input');
    let len = elems.length;
    for (let i = 0; i < len; i++) {
        if(!elems[i].classList.contains("permanent_disable"))
            elems[i].disabled = false;
    }
    elems = document.getElementsByTagName('button');
    len = elems.length;

    for (let i = 0; i < len; i++) {
        elems[i].disabled = false;
    }    
}


function enable_selection() {
    let keys = Object.keys(entries);
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        entries[key].checked.disabled = false;
    }
    document.getElementById('select_global').disabled = false;
    document.getElementById('global_pw_name').disabled = false;
    let elems = document.getElementsByTagName('button');
    let len = elems.length;
    for (let i = 0; i < len; i++) {
        elems[i].disabled = false;
    }  
}


// function export_data() {
//     let arr = [];
//     let keys = Object.keys(entries);
//     for(var i=0; i<keys.length; i++) {
//         let key = keys[i];
//         if(entries[key].checked.checked == false) continue;
//         let [userid, url_query] = key.split(";");
//         let [date, pw_name, {}, {}] = localStorage.getItem(key).split("&");
//         let object = {
//             'id' : userid,
//             'url_query' : url_query,
//             'date' : date,
//             'pw_name' : pw_name,
//         }
//         arr.push(JSON.stringify(object));
//     }
//     if(arr.length !== 0){
//         document.getElementById("input_file").innerHTML = "";
//         let blob = new Blob([JSON.stringify(arr)], {type: "application/json"});
//         let url = URL.createObjectURL(blob);
//         let a = document.getElementById("export_result");
//         a.innerHTML = "Download file"
//         a.href = url;
//         a.download = "export.json"
//     }
//     else{
//         alert("Select a website to export");
//     }
// }

// function import_data() {
//     document.getElementById("export_result").innerHTML = "";
//     document.getElementById("input_file").innerHTML = '<input type="file" onchange="parse_file(this.files[0])">'
// }

// async function parse_file(file) {
//     let arrstr = await file.text();
//     let arr = JSON.parse(arrstr)
//     arr.forEach(function (element) {
//         let object = JSON.parse(element)
//         let key = object.id + ';' + object.url_query;
//         let prev_val = localStorage.getItem(key);
//         if(prev_val === null) {
//             let val = object.date + ';' + object.pw_name + ';;'
//             localStorage.setItem(key, val);
//         }
//         else {
//             let [prev_date, {}, {}, {}] = prev_val.split(';');
//             if(prev_date === "UNKNOWN") {
//                 let val = object.date + ';' + object.pw_name + ';;'
//                 localStorage.setItem(key, val);
//             }
//             else if(object.date !== "UNKNOWN") {
//                 let date_parts = object.date.split('-')
//                 let json_date = new Date(date_parts[0], date_parts[1]-1, date_parts[2]);
//                 let date_parts2 = prev_date.split('-')
//                 let prev_val_date = new Date(date_parts2[0], date_parts2[1]-1, date_parts2[2]);
//                 if(json_date > prev_val_date) {
//                     let val = object.date + ';' + object.pw_name + ';;'
//                     localStorage.setItem(key, val);
//                 }
//             }
//         }
//     })
//     document.getElementById("input_file").innerHTML = "";
//     refresh_view();
// }

function select_global() {
    let keys = Object.keys(entries);
    if(document.getElementById('select_global').checked) {
        for(var i=0; i<keys.length; i++) {
            let key = keys[i];
            let entry = entries[key];
            entry.checked.checked = true;
        }
    } else {
        for(var i=0; i<keys.length; i++) {
            let key = keys[i];
            let entry = entries[key];
            entry.checked.checked = false;
        }
    }
}

function get_userpw() {
    let pw_name = document.getElementById('pw_name').value;
    pw_name = pw_name ? pw_name : "Default";
    let eml = document.getElementById('eml').value;
    let svp = document.getElementById("remember_svp").checked;

    return [pw, pw_n, pw_name, eml, svp];
}

function key_to_entry(key, val) {
    if(!key.includes('&')) return [null,null];
    let [userid, path] = key.split("&");
    let [time, pw_name, prid, pr, forget] = val.split("&");
    let date = ""
    if(time === "0") {
        time = ""
        date = ""
    }
    else {
        time = new Date(parseInt(time))
        date = time.getFullYear() + "/" + (time.getMonth()+1) + "/" + time.getDate()
    }
    let host = null;
    try{
        host = new URL(decodeURIComponent(path)).host;
    } catch(err) {
        return [null,null];
    }
    let tr = document.createElement("tr");
    
    let td_checked = document.createElement("td");
    td_checked.style.textAlign = "center";
    td_checked.onchange = select_entry;
    let td_checked_val = document.createElement("input");
    td_checked_val.type = "checkbox";
    td_checked_val.checked = false;
    td_checked.appendChild(td_checked_val);
    tr.appendChild(td_checked);

    let td_host = document.createElement("td");
    td_host.title = decodeURIComponent(path);
    let td_host_val = document.createTextNode(host);
    td_host.appendChild(td_host_val);
    tr.appendChild(td_host);

    let td_userid = document.createElement("td");
    let td_userid_val = document.createTextNode(decodeURIComponent(userid));
    td_userid.appendChild(td_userid_val);
    tr.appendChild(td_userid);

    let td_pw_name = document.createElement("td");
    let td_pw_name_val = document.createTextNode(decodeURIComponent(pw_name));
    td_pw_name.appendChild(td_pw_name_val);
    tr.appendChild(td_pw_name);

    let td_date = document.createElement("td");
    let td_date_val = document.createTextNode(date);
    td_date.appendChild(td_date_val);
    td_date.title = time;
    tr.appendChild(td_date);
    
    let td_saved = document.createElement("td");
    td_saved.style.textAlign = "center";
    let td_saved_val = document.createElement("input");
    td_saved_val.type = "checkbox";
    td_saved_val.disabled = true;
    td_saved_val.classList.add("permanent_disable")
    td_saved_val.checked = pr !== ""
    td_saved.appendChild(td_saved_val);
    tr.appendChild(td_saved);

    let td_restored = document.createElement("td");
    td_restored.style.textAlign = "center";
    let td_restored_val = document.createElement("input");
    td_restored_val.type = "checkbox";
    td_restored_val.disabled = true;
    td_restored_val.classList.add("permanent_disable")
    td_restored_val.checked = forget !== ""
    td_restored.appendChild(td_restored_val);
    tr.appendChild(td_restored);

    let entry = {
        node: tr,
        userid: td_userid_val,
        host: td_host_val,
        pw_name: td_pw_name_val,
        date: td_date_val,
        saved: td_saved_val,
        checked: td_checked_val,
        restored: td_restored_val,
        status: null,
    }
    return [tr, entry];
}

function add_status(key) {
    let entry = entries[key];
    let tr = entry.node;
    let td_status = document.createElement("td");
    let td_status_val = document.createTextNode("");
    td_status.appendChild(td_status_val);
    tr.appendChild(td_status);
    entry.status = td_status_val
}

async function entry_query(key, eml) {
    let [userid, url_query] = key.split("&");
    userid = decodeURIComponent(userid)
    url_query = decodeURIComponent(url_query)
    let entry = entries[key];
    let result = await QueryManager(userid, url_query, entry);
    if (result === null)
        return false;
    let aux= result['aux']; let pt = result['pt']; let ds = result['ds']; let pt_n = result['pt_n']; let ds_n = result['ds_n'];let kh = result['kh'];
    let etc = kh + ';' +"" +';' + eml;
    let data = ds ? parse(pt)(ds) : null;
    let data_n = parse(pt_n)(ds_n)
    entries[key] = {...entry, aux, pt, data, pt_n, data_n, etc}
    return true;
}

function restore_query(key, eml) {
    let val = localStorage.getItem(key);
    let [_0, _1, _2, _3, restore] = val.split("&");
    let [userid, url_query] = key.split("&");
    let [aux, pt, pt_n, ds, ds_n, kh] = restore.split('/');
    userid = decodeURIComponent(userid);
    url_query = decodeURIComponent(url_query);
    aux = decodeURIComponent(aux);
    pt = decodeURIComponent(pt);
    pt_n = decodeURIComponent(pt_n);
    ds = decodeURIComponent(ds);
    ds_n = decodeURIComponent(ds_n);
    kh = decodeURIComponent(kh);
    let entry = entries[key];
    let etc = kh + ';' +"" +';' + eml;
    let data = ds ? parse(pt)(ds) : null;
    let data_n = parse(pt_n)(ds_n)
    entries[key] = {...entry, aux, pt, data, pt_n, data_n, etc,}
    return true;
}

async function QueryManager(id, url_query, entry) {
    let url = url_query + '?query=change&id=' + encodeURIComponent(id) + '&url_hp=' + encodeURIComponent(url_query);
    return await do_query_manager(url, entry);
}

async function do_query_manager(url, entry) {
    let res = null;
    try{
        res = await fetch(url);
    } catch(err) {
        entry.status.nodeValue = "query failed";
        return null;
    }
    if (!res.ok ) {
        //TODO exception when no user
        if(res.status === 405 ) {
            // delete entry?
            entry.status.nodeValue = "query failed";
            return null;
        }
        else {
            entry.status.nodeValue = "query failed";
            return null;
        }
    }
    let body = await res.json();
    return body;
}

async function entry_change(key, pw, pw_n, pwn_n, al) {
    let [userid, path] = key.split("&");
    userid = decodeURIComponent(userid)
    path = decodeURIComponent(path)
    const qurl = path + "?query=change_all";
    let entry = entries[key];
    let [_0, url_hp] = get_otp_url(entry.aux)
    if(url_hp !== path) {
        entry.status.nodeValue = "update failed";
        return
    }
    try {
        let [ret, prid_n, pr_n] = await do_change(entry.aux, entry.pt, entry.data, entry.pt_n, entry.data_n, entry.etc, pw, pw_n)
        let res = await fetch(qurl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'omit',
            headers: {},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify({ id : userid, r: ret }),
        })
        if (res.ok) {
            entry.status.nodeValue = "success";
            entry.pw_name.nodeValue = pwn_n;
            let time = new Date();
            let date = time.getFullYear() + "/" + (time.getMonth()+1) + "/" + time.getDate()
            PMPut(qurl, userid, pwn_n, prid_n, pr_n, true, al, true);
            entry.saved.checked = al
            entry.restored.checked = false;
            entry.date.nodeValue = date;
            entry.date.parentElement.title = time
        }
        else {
            entry.status.nodeValue = "update failed";
        }
    }
    catch (err) {
        console.log(err)
        entry.status.nodeValue = "update failed";
    }
}

async function restore_change(key, pw_n, pwn_n, al) {
    let [userid, path] = key.split("&");
    userid = decodeURIComponent(userid)
    path = decodeURIComponent(path)
    const qurl = path + "?query=restore&id=" + userid;
    let entry = entries[key];
    let [_0, url_hp] = get_otp_url(entry.aux)
    if(url_hp !== path) {
        entry.status.nodeValue = "update failed";
        return
    }
    try {
        let [ret, prid_n, pr_n] = await do_restore(entry.aux, entry.pt, entry.data, entry.pt_n, entry.data_n, entry.etc, pw_n)
        let res = await fetch(qurl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'omit',
            headers: {},
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify({ id : userid, r: ret }),
        })
        if (res.ok) {
            entry.status.nodeValue = "success";
            entry.pw_name.nodeValue = pwn_n;
            let time = new Date();
            let date = time.getFullYear() + "/" + (time.getMonth()+1) + "/" + time.getDate()
            PMPut(qurl, userid, pwn_n, prid_n, pr_n, true, al, true);
            entry.saved.checked = al
            entry.restored.checked = false
            entry.date.nodeValue = date;
            entry.date.parentElement.title = time
        }
        else {
            entry.status.nodeValue = "update failed";
        }
    }
    catch (err) {
        console.log(err)
        entry.status.nodeValue = "update failed";
    }
}

function select_entry() {
    const select_global = document.getElementById('select_global');
    let keys = Object.keys(entries);
    let all_checked = true;
    let all_unchecked = true;
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        let entry = entries[key];
        if(entry.checked.checked) {
            all_unchecked = false;
        } else {
            all_checked = false;
        }
        if(!all_checked && !all_unchecked) break;
    }
    if(all_checked) select_global.checked = true;
    if(all_unchecked) select_global.checked = false;
}

function clear_all() {
    let keys = Object.keys(entries);
    let empty = true;
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        if(entries[key].checked.checked == true) {
            empty = false;
            break;
        }
    }
    if(empty) {
        alert('Select an account to remove')
        return;
    }
    let check = confirm("Are you sure to remove selected accounts?")
    if(!check) return;
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        let entry = entries[key];
        if (entry.checked.checked === true) {
            localStorage.removeItem(key);
            entry.node.remove();
            delete(entries[key])
            document.getElementById('pw_name_list').innerHTML = '';
            load_pw_name()
        }
    }
    document.getElementById("select_global").checked = false;
}

// function refresh_view() {
//     let dom_entries = document.getElementById("entries")
//     dom_entries.innerHTML = 
//     '<tr id="entry_title">\
//     <th>\
//         <input type="checkbox" id="select_global" onchange="select_global()"/>\
//     </th>\
//     <th>Site</th>\
//     <th>ID</th>\
//     <th colspan="2">PW Name</th>\
//     <th>Auto Login</th>\
//     </tr>';
//     let keys = Object.keys(localStorage);
//     for(var i=0; i<keys.length; i++) {
//         let key = keys[i];
//         let [tr, entry] = key_to_entry(key, localStorage.getItem(key));
//         if( tr!== null && entry !== null) {
//             dom_entries.appendChild(tr);
//             entries[key] = entry;
//         }
//     }
//     document.getElementById('pw_name_list').innerHTML = '';
//     load_pw_name()
// }

async function request_restore() {
    let keys = Object.keys(entries);
    let all_unchecked = true;    
    for(var i=0; i<keys.length; i++) {
        let key = keys[i];
        if (entries[key].checked.checked === true) {
            all_unchecked = false;
            break;
        }
    }
    if(all_unchecked) {
        alert("Select a website to request");
        return;
    }

    let eml = prompt("Enter Your Email Address");
    if(eml === null)
        return;

    if(document.getElementById('status') === null) {
        let th = document.createElement('th');
        th.id = "status"
        th.style.width = "100px";
        th.innerHTML = "Status"
        document.getElementById("entry_title").appendChild(th)
    }

    await Promise.all(keys.map( async (key) => {
        let entry = entries[key];
        if(entry.status === null)
            add_status(key);
        if (entry.checked.checked === true) {
            entry.status.nodeValue = "requesting..."
            await send_request(key, eml)
        }
    }));
}

async function send_request(key, eml) {
    let [userid, url_hp] = key.split('&');
    let entry = entries[key];
    userid = decodeURIComponent(userid);
    url_hp = decodeURIComponent(url_hp);
    const qurl = url_hp + "?query=request_restore";
    let res = await fetch(qurl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {},
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify({ id : userid, url_hp : url_hp, eml : eml }),
    })
    if (res.ok) {
        entry.status.nodeValue = "request sent"
    }
    else {
        entry.status.nodeValue = "request failed"
    }
}
