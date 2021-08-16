window.addEventListener('DOMSubtreeModified', function() {
    Array.from(document.getElementsByClassName('pwname_info')).forEach(element => {
        element.title = "pwnametest"
    });
    Array.from(document.getElementsByClassName('eml_info')).forEach(element => {
        element.title = "emltest"
    });
    Array.from(document.getElementsByClassName('remember_account_info')).forEach(element => {
        element.title = "remeber account test"
    });
    Array.from(document.getElementsByClassName('remember_credential_info')).forEach(element => {
        element.title = "remeber credential test"
    });
})


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

function enter_pwd() {
    let k = window.event.keyCode;
    if(k === 13){
        document.activeElement.blur();
        document.getElementById("compute").click();
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
