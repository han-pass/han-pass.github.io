let use_pass = true;
let password_details = null;
let hanpass_url = "https://han-pass.github.io/";
let dummy_pw = null;
let pw_id = [];
let server_url;
let han_hide = ['ooui-php-5', 'ooui-php-4']
let create_funcs = null
let login_funcs = null
let change_funcs = null
let button_height = null
let button_width = null
let id_func = (val) =>{return val}

function init_hanpass(url,dummy, ids, create_func_list, login_func_list, change_func_list, id_func_input=null, height=30, width=290, debug=false) {
    server_url = url;
    // hanpass_url = 'http://localhost:7998/'
    dummy_pw = dummy;
    pw_id = ids;
    create_funcs = create_func_list
    login_funcs = login_func_list
    change_funcs = change_func_list
    if(id_func_input) id_func = id_func_input
    button_height = height
    button_width = width
    if(debug) hanpass_url = "http://localhost:7998/";
    let styles = `
    #hanpass-button {
        all: initial;
        background-color: lightgray;
        color: black;
        width: ${button_width}px;
        height: ${button_height}px;
        text-align: center;
        font-size: 12px;
        border: 3px black;  
        cursor: pointer;
    }

    #hanpass-button:hover {
        all: initial;
        background-color: gray;
        color: black;
        width: ${button_width}px;
        height: ${button_height}px;
        text-align: center;
        font-size: 12px;
        border: 3px black;
        cursor: pointer;
    }

    #hanpass-button:focus {
        all: initial;
        background-color: gray;
        color: black;
        width: ${button_width}px;
        height: ${button_height}px;
        text-align: center;
        font-size: 12px;
        border: 3px black;
        cursor: pointer;
    }

    #hanpass-button-entered {
        all: initial;
        background-color: lightgreen;
        color: black;
        width: ${button_width}px;
        height: ${button_height}px;
        text-align: center;
        font-size: 12px;
        border: 3px black;
        cursor: pointer;
    }
    #hanpass-button-entered:hover {
        all: initial;
        background-color: green;
        color: black;
        width: ${button_width}px;
        height: ${button_height}px;   
        text-align: center;
        font-size: 12px;
        border: 3px black;
        cursor: pointer;
    }

    #hanpass-button-entered:hover {
        all: initial;
        background-color: green;
        color: black;
        width: ${button_width}px;
        height: ${button_height}px;   
        text-align: center;
        font-size: 12px;
        border: 3px black;
        cursor: pointer;
    }
    `

    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
}

window.onload = function(){
    let hanpass_login = document.getElementById('id_hanpassword_login');
    let hanpass_change = document.getElementById('id_hanpassword_change');
    let hanpass_create = document.getElementById('id_hanpassword_create');
    let hanpass_button = document.createElement('span');
    let whattext =
        `
            <p style="font-weight:bold;">What is HanPass?</p> 
            <span style="width:100%; display:inline-block; text-align: left">
                1. HanPass is a service replacing the previous password system.<br>
                2. Using HanPass, it is perfectly safe to use the same password over all websites.<br>
                3. HanPass enables you to change passwords over all sites in a single click
            </span>
        `
    if(hanpass_login) {
        let howtext =
        `
            <p style="font-weight:bold;">How to use</p> 
            <span style="width:100%; display:inline-block; text-align: left">
                1. If not using HanPass, log in using the bottom password field as usual<br>
                2. HanPass-change page will appear after login<br>
                3. Create HanPass for your account
            </span>
        `
        hanpass_button.innerHTML = '<button type="button" tabindex="'+ hanpass_login.tabIndex + '" id="hanpass-button" onclick="open_hanpass_login(\'' + server_url + '\')">Click to use HanPass</button><br>'
                                    + '<div class="popup" style="width: '+button_width+'px; text-align:right;font-size:12px" onclick="open_hp()">'
                                        + 'What is HanPass<img width="15px" height="15px" style="display:inline;" src="https://han-pass.github.io/img/qm.jpg"/>'
                                        + '<span id="hp_popup" class="popuptext">'
                                            + whattext + howtext
                                        + '</span>'
                                    + '</div>'
                                    // + '<br><br><div style="width: 290px;color:black; background-color:rgba(255,200,100,0.4); border:1px black solid; font-size: 12px; white-space:pre-wrap;">'+ whattext +'</div>'
                                    // + '<br>'
                                    // + '<div style="width: 290px;color:black; background-color:rgba(255,200,100,0.4); border:1px black solid; font-size: 12px; white-space:pre-wrap;">'+ howtext +'</div>'
        hanpass_login.after(hanpass_button);
        hanpass_login.type = 'hidden';
    }
    if(hanpass_create) {
        let howtext =
        `
            <p style="font-weight:bold;">How to use</p> 
            <span style="width:100%; display:inline-block; text-align: left">
                1. Click button to enter HanPass<br>
                2. Set your HanPass never used during the previous password system<br>
                3. Fill in other fields and click submit and send to website
            </span>
        `
        hanpass_button.innerHTML = '<button type="button" tabindex="'+ hanpass_create.tabIndex + '" id="hanpass-button" onclick="open_hanpass_create(\'' + server_url + '\')">Click to use HanPass</button><br>'
                                    + '<div class="popup" style="width: '+button_width+'px; text-align:right;font-size:12px" onclick="open_hp()">'
                                        + 'What is HanPass<img width="15px" height="15px" style="display:inline;" src="https://han-pass.github.io/img/qm.jpg"/>'
                                        + '<span id="hp_popup" class="popuptext">'
                                            + whattext + howtext
                                        + '</span>'
                                    + '</div>'
                                    // + '<br><br><div style="width: 290px;color:black; background-color:rgba(255,200,100,0.4); border:1px black solid; font-size: 12px; white-space:pre-wrap;">'+ whattext +'</div>'
                                    // + '<br>'
                                    // + '<div style="width: 290px;color:black; background-color:rgba(255,200,100,0.4); border:1px black solid; font-size: 12px; white-space:pre-wrap;">'+ howtext +'</div>'
        hanpass_create.after(hanpass_button);
        hanpass_create.type = 'hidden';
    }
    if(hanpass_change) {
        let howtext =
        `
            <p style="font-weight:bold;">How to use</p> 
            <span style="width:100%; display:inline-block; text-align: left">
                1. Click button to enter HanPass<br>
                2. Set your HanPass never used during the previous password system<br>
                3. Click submit and send to website
            </span>
        `
        let donottext = '<p style="color:red; font-size:15px; font-weight:bold; text-align:center">We recommend you NOT to use the previous password system</p>'
        hanpass_button.innerHTML = '<button type="button" tabindex="'+ hanpass_change.tabIndex + '" id="hanpass-button" onclick="open_hanpass_change(\'' + server_url + '\')">Click to use HanPass</button><br>'
                                    + '<div class="popup" style="width: '+button_width+'px; text-align:right;font-size:12px" onclick="open_hp()">'
                                        + 'What is HanPass<img width="15px" height="15px" style="display:inline;" src="https://han-pass.github.io/img/qm.jpg"/>'
                                        + '<span id="hp_popup" class="popuptext">'
                                            + whattext + howtext
                                        + '</span>'
                                    + '</div>'
                                    // + '<br><br><div style="width: 290px;color:black; background-color:rgba(255,200,100,0.4); border:1px black solid; font-size: 12px; white-space:pre-wrap;">'+ whattext +'</div>'
                                    // + '<br>'
                                    // + '<div style="width: 290px; color:black; background-color:rgba(255,200,100,0.4); border:1px black solid; font-size: 12px; white-space:pre-wrap;">'+ howtext +'</div>'
                                    // + '<br>'
                                    // + '<div style="width: 290px; color:black; background-color:rgba(255,200,100,0.4); border:1px black solid; font-size: 12px; white-space:pre-wrap;">'+ donottext +'</div>'

        hanpass_change.after(hanpass_button);
        hanpass_change.type = 'hidden';
    }
    pw_id.forEach(function(e) {
        pw = document.getElementById(e);
        if(pw==null || pw.type != 'password') return;
        pw.oninput = pw_alert;
        pw.onclick = pw_alert;
    })
}

document.addEventListener("DOMSubtreeModified", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hide = urlParams.get('han_hide');
    if(hide === 'true') {
        han_hide.forEach(function(e) {
            ele = document.getElementById(e);
            if(ele==null) return;
            ele.setAttribute('style', 'display:none !important');
        })
    }
});

function open_hp() {
    var popup = document.getElementById("hp_popup");
    popup.classList.toggle("show");
}

function pw_alert() {
    alert("Using this password field is insecure");
    pw_id.forEach(function(e) {
        pw = document.getElementById(e);
        if(pw==null) return;
        pw.onclick = null;
        pw.oninput = null;
    })
}

function submit_result(val) {
    if(val!=="") {
        const han_button = document.getElementById("hanpass-button")
        if(han_button !== null) {
            han_button.removeAttribute('hanpass-button')
            han_button.id = 'hanpass-button-entered'
            han_button.innerHTML = "HanPass is entered"
            han_button.addEventListener("mouseover", function(event) {
                event.target.innerHTML= "Click to reenter HanPass"
            })
            han_button.addEventListener("mouseout", function(event) {
                event.target.innerHTML= "HanPass is entered"
            })
        }
        id = document.querySelector('[id^="id_hanpassword"]');
        if(id) {
            id.value = val;
            fill_dummypw()
        }
    }
}

function fill_dummypw() {
    pw_id.forEach(function(e) {
        pw = document.getElementById(e);
        if(pw==null) return;
        pw.value = dummy_pw;
        pw.readOnly = true;
    })
}

function get_userid_login() {
    let val = null;
    login_funcs.forEach(function(f) {
        let item=null;
        try{
            item = f()
        } catch(e){}
        if(item !== null) {
            val = item
            return false;
        }
    })
    return id_func(val)
}

function get_userid_create() {
    let val = null;
    create_funcs.forEach(function(f) {
        let item=null;
        try{
            item = f()
        } catch(e){}
        if(item !== null) {
            val = item
            return false;
        }
    })
    return id_func(val)

}

function get_userid_change() {
    let val = null;
    change_funcs.forEach(function(f) {
        let item=null;
        try{
            item = f()
        } catch(e){}
        if(item !== null) {
            val = item
            return false;
        }
    })
    return id_func(val)

}

function open_hanpass(qurl, hurl) {
    var hanpass_window;
    var qurl;
    let hanpass_origin = new URL(hurl).origin;
    function initializeHanpass(event)
    {
        if (event.origin !== hanpass_origin)
            return;
        if (event.source !== hanpass_window)
            return;
        hanpass_window.postMessage(qurl, hanpass_origin);
        window.addEventListener("message", receiveHanpass, false);
        window.removeEventListener("message", initializeHanpass, false);
    }

    function receiveHanpass(event)
    {
        if (event.origin !== hanpass_origin)
            return;
        if (event.source !== hanpass_window)
            return;
        submit_result(event.data);
        window.removeEventListener("message", receiveHanpass, false);
    }

    try {
        window.removeEventListener("message", receiveHanpass, false);
    }
    catch (err) {
    }
    window.addEventListener("message", initializeHanpass, false);
    hanpass_window = popupwindow(hurl,"", 500, 280);
    // hanpass_window = window.open(hurl, "", "width=300,height=250")
}


function open_hanpass_login(qurl) {
    const username = get_userid_login();
    const origin = window.location.origin;
    const queryurl_lo = encodeURIComponent(qurl) + ";" + encodeURIComponent(username);

    const hanpass_url_login = hanpass_url + "login";
    
    return open_hanpass(queryurl_lo, hanpass_url_login);
}

function open_hanpass_create(qurl) {
    const username = get_userid_create();

    const queryurl_cr = encodeURIComponent(qurl) + ";" + encodeURIComponent(username);

    const hanpass_url_create = hanpass_url + "create";
    return open_hanpass(queryurl_cr, hanpass_url_create);
}

function open_hanpass_change(qurl) {
    const username = get_userid_change();

    const queryurl_ch = encodeURIComponent(qurl) + ";" + encodeURIComponent(username);

    const hanpass_url_change = hanpass_url + "change";
    return open_hanpass(queryurl_ch, hanpass_url_change);
}

document.getElementsByTagName("head")[0].insertAdjacentHTML(
    "beforeend",
    "<link rel=\"stylesheet\" href=\"https://han-pass.github.io/handleinput.css\" />"
);

let popupwindow = function (url, title, w, h) {
    let left = (screen.width/2)-(w/2);
    let top = (screen.height/4)-(h/4);
    let win = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    return win;
};
