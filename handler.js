window.addEventListener('DOMSubtreeModified', change_inner)

function change_inner() {
    Array.from(document.getElementsByClassName('pwname_info')).forEach(element => {
        window.removeEventListener ("DOMSubtreeModified", change_inner);
        element.innerHTML = "Password Name information, used to group passwords. It helps users remember which password they used for the account."
        window.addEventListener ("DOMSubtreeModified", change_inner);
    });
    Array.from(document.getElementsByClassName('eml_info')).forEach(element => {
        window.removeEventListener ("DOMSubtreeModified", change_inner);
        element.innerHTML = "Email information stored in the HanServer, which is used to send an email once the password is forgotten."
        window.addEventListener ("DOMSubtreeModified", change_inner);
    });
    Array.from(document.getElementsByClassName('remember_account_info')).forEach(element => {
        window.removeEventListener ("DOMSubtreeModified", change_inner);
        element.innerHTML = "HanClient remembers the user account if checked. It is stored so that it could be managed in the Account Manager."
        window.addEventListener ("DOMSubtreeModified", change_inner);
    });
    Array.from(document.getElementsByClassName('remember_credential_info')).forEach(element => {
        window.removeEventListener ("DOMSubtreeModified", change_inner);
        element.innerHTML = "HanClient remembers the account's credential if checked. It is used to automatically generate the token without saving user password."
        window.addEventListener ("DOMSubtreeModified", change_inner);
    });
}


function check_svp() {
    if(document.getElementById('remember_svp').checked)
        document.getElementById('remember_sva').checked = true;

    if(document.getElementById('remember_sva').checked) {
        localStorage.setItem('Manage Account', "Y");   
    }
    else {
        localStorage.setItem('Manage Account', "N");   
    }
    if(document.getElementById('remember_svp').checked) {
        localStorage.setItem('Auto Login', "Y");
    }
    else {
        localStorage.setItem('Auto Login', "N");
    }
}


function set_id() {
    let pwn = document.getElementById('pw_name').value
    if(document.getElementById("dummy_id")) {
        if(pwn === "")
            document.getElementById("dummy_id").value = "Default"
        else
            document.getElementById("dummy_id").value = document.getElementById('pw_name').value
    }
}

function check_sva() {
    if(!document.getElementById('remember_sva').checked)
        document.getElementById('remember_svp').checked = false;

    if(document.getElementById('remember_sva').checked) {
        localStorage.setItem('Manage Account', "Y");   
    }
    else {
        localStorage.setItem('Manage Account', "N");   
    }
    if(document.getElementById('remember_svp').checked) {
        localStorage.setItem('Auto Login', "Y");
    }
    else {
        localStorage.setItem('Auto Login', "N");
    }
}

function check_sva_local() {
    if(!document.getElementById('remember_sva').checked)
        document.getElementById('remember_svp').checked = false;
}

function check_svp_local() {
    if(document.getElementById('remember_svp').checked)
        document.getElementById('remember_sva').checked = true;
}

function maximize() {
    window.moveTo(0, 0);
    window.resizeTo(screen.availWidth, screen.availHeight);   
}

function entertab_pwd() {
    let k = window.event.keyCode ? window.event.keyCode : window.event.which;
    if(k===9 && !window.event.shiftKey) {
        window.event.preventDefault()
        document.activeElement.blur();
        document.getElementById("compute").click();
    }
    else if(k === 13){
        document.activeElement.blur();
        document.getElementById("compute").click();
    }
}

function enter_pwd() {
    let k = window.event.keyCode ? window.event.keyCode : window.event.which;
    if(k === 13){
        document.activeElement.blur();
        document.getElementById("compute").click();
    }
}

function enter_pwname() {
    let k = window.event.keyCode ? window.event.keyCode : window.event.which;
    if(k === 13){
        window.event.preventDefault()
        if(document.getElementById('user_info3')) document.getElementById('user_info3').focus()
        else if(document.getElementById('user_info4')) document.getElementById('user_info4').focus()
        else if(document.getElementById('eml')) document.getElementById('eml').focus()
    }
}


// function copy() {
//     let val = document.getElementById('secuni_result').value;
//     navigator.clipboard.writeText(val).then(function() {
//         document.getElementById('secuni_clip').innerHTML = '&#x2705;'
//         window.close();
//     }, function(err) {});
// }

// function paste() {
//     navigator.clipboard.readText().then((text) => {
//         document.getElementById('secuni_account_data').value = text
//         open_field();
//     });
// }

// function open_field() {
//     arr = document.getElementById('secuni_account_data').value.split(';')
//     if(arr[1] && arr[1] === 'change') {
//         document.getElementById('change_input').innerHTML = '\
//         <td>\
//             New PW\
//         </td>\
//         <td>\
//             <input type="password" id="user_info3" autocomplete="new-password" onkeypress="enter_pwd()" autofocus>\
//             <span>&nbsp;&nbsp;&nbsp;</span>\
//         </td>'
//     }
//     else {
//         document.getElementById('change_input').innerHTML = ''
//     }
// }
