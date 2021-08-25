import {check_strength, load_pw_name, do_query,
        parse, prove_new,return_failure, get_prover, 
        get_prid, prove_test, do_login, PMPut, PMGet, get_otp_url} from "../library.js";
let opener = null;
let url_app = null;
let qr=null;

window.onload = function() {
    // window.onblur = function(){ window.close(); };
    load_pw_name();
    // for mobile, erase otp
    // if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    // || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    //     document.getElementById('otp_view').style.display= "none";
    // }   
    qr = new QRious({
        element: document.getElementById('qr_method'),
        size: 200,
        padding: 0
    });
    window.addEventListener("message", receive_message, false);
    window.opener.postMessage("", "*");
}


// window.onload = async function() {
//     await test()
// }


// async function test() {
//     const dom_app = "sflab.snu.ac.kr";
//     let id= "Newtesting3";
//     let url_query = "https://sflab.snu.ac.kr:92";
//     document.getElementById("user_id").value = id;
//     document.getElementById("url_query").value = new URL(url_query).origin;
//     let result = await QueryLogin(id, url_query);
//     // console.log("http://localhost:7999/qrcode?" + get_query_string(url_query, id, dom_app, result))
//     let ty= result['ty']; let pt = result['pt']; let ds = result['ds']; let pt_n = result['pt_n']; let ds_n = result['ds_n'];  let aux = result['aux'];
//     let etc = aux +';' + dom_app;
//     let data = parse(pt)(ds)
//     let data_n = ds_n !=="" ? parse(pt_n)(ds_n) : null
//     let pw = 'asdf1234!@#$';
//     try {
//         let pr = get_prover(pt)(data, pw);
//         let ret = do_login(ty, pt, data, pt_n, data_n, etc, pw);
//         console.log(ret);
//     } catch(err) {
//         console.log(err)
//     }
// }
function get_query_string(url_query, id, sec, pwname, dom_app,otp) {
    let str='&';
    str += 'url=' + encodeURIComponent(url_query) + '&';
    str += 'id=' + encodeURIComponent(id) + '&';
    str += 'sec=' + encodeURIComponent(sec) + '&';
    str += 'pwname=' + encodeURIComponent(pwname) + '&';
    str += 'otp=' + encodeURIComponent(otp) + '&';
    str += 'dom=' + encodeURIComponent(dom_app) + '&';
    return toBase64URL(str);
}

function toBase64URL(str) {
    return btoa(str.replace(/\+/g,'-').replace(/\//g,'_')).replace(/\=+$/m,'');
}

async function receive_message(event) {
    opener = event.source;
    url_app = event.origin;
    const dom_app = new URL(url_app).hostname;
    let parsed = event.data.split(';',2);
    let url_query = decodeURIComponent(parsed[0]);
    let id = decodeURIComponent(parsed[1]);
    if(id==""){
        return_failure("Your ID is empty.\nPlease type in your ID first before using HanPass!")
    }
    document.getElementById("user_info1").value = id;
    document.getElementById("url_query").value = new URL(url_query).origin;
    window.removeEventListener("message", receive_message);
    let sec = false;
    let result = await QueryLogin(id, url_query);
    let aux= result['aux']; let pt = result['pt']; let ds = result['ds']; let pt_n = result['pt_n']; let ds_n = result['ds_n'];let kh = result['kh'];
    let [otp, url_hp] = get_otp_url(aux)
    if(url_hp !== url_query) {
        alert("Query URL mismatch")
        window.close();
    }
    let etc = kh + ';' + dom_app +';' + "";
    let data = parse(pt)(ds)
    let data_n = ds_n ? parse(pt_n)(ds_n) : null
    if(data === null) {
        alert('no such user')
        window.close()
    }
    let [pwname, pr, ma, al] = PMGet(url_query, id, get_prid(pt)(data), false);
    document.getElementById("dummy_id_tag").innerHTML = '<input readonly type="text" value="'+ pwname +'" name="dummy_id" id="dummy_id" autocomplete="username">';
    document.getElementById("user_info2").placeholder = "PWN: " +  pwname;
    let otp_url = "https://han-pass.github.io/otp#" + get_query_string(url_query, id, sec, pwname, dom_app, otp);
    qr.value= otp_url;
    document.getElementById('otp_view').style.visibility= "";
    document.getElementById('remember_sva').checked = ma;
    document.getElementById('remember_svp').checked = al;
    if(pr !== "" && data_n === null) {
        setTimeout(async () => {
            let res = confirm("Use Auto Login");
            if(res) {
                let ret = aux + ';' + pt + ';' + pt_n + ';' + await prove_test(pt)(data, pr, etc);
                opener.postMessage(ret, url_app);
                window.close();
            }
        }, 10);
    }
    // document.getElementById('otp_link').onclick = () => opener.postMessage(otp_str, url_app);
    document.getElementById('compute').onclick = set_login_button(id, url_query, aux, pt, pt_n, data, data_n, etc, pwname);
    // document.getElementById('submit_otp').onclick = set_otp_button(id, url_query, aux, pt, pt_n, data, data_n, etc, pwname);
    //every 0.5s
    window.setInterval(async function(){
        let otp_hash = CryptoJS.SHA256(otp).toString(CryptoJS.enc.Hex)
        let url = url_query + '?query=poll_otphash&id=' + encodeURIComponent(id) + '&otp_hash=' + encodeURIComponent(otp_hash)+ '&url_hp=' + encodeURIComponent(url_query);
        try{
            let res = await fetch(url);
            if(res.ok) {
                document.getElementById('user_info2').value = "";
                await (set_login_button(id, url_query, aux, pt, pt_n, data, data_n, etc, pwname)());        
            }
        } catch(e){}
    }, 500);
    // document.getElementById('otp_button').onclick = set_otp_button(ty, pt, pt_n, aux, dom_app, ds, ds_n);
}

async function QueryLogin(id, url_query) {
    let url = url_query + '?query=login&id=' + encodeURIComponent(id) + '&url_hp=' + encodeURIComponent(url_query);
    return await do_query(url);
}


// function set_otp_button(ty, pt, pt_n, aux, dom_app, ds, ds_n) {
//     return (()=> {
//         let ret = 'otp;'+ty+';'+pt+';'+pt_n+';'+aux+';'+dom_app+';'+ds+ds_n;
//         opener.postMessage(ret, url_app);
//         window.close();
//     })
// }

function set_login_button(id, url_query, aux, pt, pt_n, data, data_n, etc, pwname, sec=false) {
    return(async () => {
        try { 
            let [pw, ma, al] = get_userpw();
            let ret = null;
            let prid = null;
            let pr = null;
            [ret, prid, pr] = await do_login(aux, pt, data, pt_n, data_n, etc, pw);
            [prid, pr] = sec ? [null, null] : [prid, pr]
            PMPut(url_query, id, pwname, prid, pr, ma, al, false);
            opener.postMessage(ret, url_app);
            window.close();
        } catch(err) {
            // this event shouldn't occur
            console.log(err)
            return_failure(err)
        }
    });
}

function set_otp_button(id, url_query, aux, pt, pt_n, data, data_n, etc, pwname, sec=false) {
    return (async() => {
        document.getElementById('user_info2').value = "";
        await (set_login_button(id, url_query, aux, pt, pt_n, data, data_n, etc, pwname, sec)());
    })
}

function get_userpw() {
    let pw = document.getElementById('user_info2').value;
    let sva = document.getElementById("remember_sva").checked;
    let svp = document.getElementById("remember_svp").checked;
    return [pw, sva, svp];
}

let popupwindow = function (url, title, w, h) {
    let left = (screen.width/2)-(w/2);
    let top = (screen.height/4)-(h/4);
    let win = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    return win;
};
