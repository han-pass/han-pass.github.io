import {check_strength, load_pw_name, do_query,
    parse, prove_new,return_failure, get_prover, 
    get_prid, prove_test, do_login, PMPut, PMGet, get_otp_url} from "../library.js";
let opener = null;
let url_app = null;
let qr=null;

window.onload = async function() {
    let aux = "D2jw2GqJYmxZfe0D1yC9fXENPOr7QO/frDWPZdo59gE=;https://147.46.219.145:35258;1629084807;211.219.155.175;a"
    let pt = "adv" 
    let ds = "J5epIiCCeZrKJ3+ac6fRMg==,s6hh6CFjX8M1k0S8E8HetVN6q+wP43oxPJXQdqy9cEM=;"
    let pt_n = "adv"
    let ds_n = ""
    let etc = "LbU2iJJNrXQY/WKyT8N5lRqjhwROIM8+DoyLC9xSf1c=;147.46.219.145;"
    let data = parse(pt)(ds)
    let data_n = null;
    let res = []
    let iter = 10000
    for(let i=0; i<iter; i++) {
        let pw= makeid(5)
        let start = Date.now()
        let[ret, prid, pr] = await do_login(aux, pt, data, pt_n, data_n, etc, pw);
        let end = Date.now()
        let elapsed = end-start
        console.log("elapsed " + (i+1) +": " + elapsed)
        res.push(elapsed)
        document.getElementById('test_process').innerHTML = "elapsed " + (i+1) +": " + elapsed
    }
    res.sort(function(a, b) {
        return a - b;
    });
    console.log(res)
    document.getElementById('avg').innerHTML = "avg: " + average(res)
    document.getElementById('90P').innerHTML = "90P: " + res[Math.floor(iter*90/100)-1]
    document.getElementById('95P').innerHTML = "95P: " + res[Math.floor(iter*95/100)-1]
    document.getElementById('99P').innerHTML = "99P: " + res[Math.floor(iter*99/100)-1]

}

const average = list => list.reduce((prev, curr) => prev + curr) / list.length;
const list = [0, 10, 20, 30]
average(list) // 15

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

