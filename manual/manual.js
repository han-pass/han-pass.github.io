// import {do_query, parse,  do_create, do_login, do_change} from '../library.js'

// window.onload = function() {
//     // window.onblur = function(){ window.close(); };
//     document.getElementById('compute').onclick = getResult;
// }

// async function getResult() {
//     let account_data = document.getElementById('secuni_account_data').value;
//     let arr = account_data.split(';');
//     let arr2 = arr.slice(0,2);
//     arr2.push(arr.slice(2).join(';'));
//     let [url_query, query, id] = arr2;
//     let dom_app = '';
//     let url = url_query + '?query=' + query + '&id=' + id;
//     let pw = document.getElementById('user_pw').value
//     let result = await do_query(url);
//     let ty = result['ty']; let pt = result['pt']; let ds = result['ds']; let pt_n = result['pt_n']; let ds_n = result['ds_n'];  let aux = result['aux'];
//     let data = ds ? parse(pt)(ds) : null;
//     let data_n = ds_n ? parse(pt_n)(ds_n) : null;

//     let etc = aux +';' + dom_app;

//     if(query == 'login') {
//         result = do_login(ty, pt, data, pt_n, data_n, etc, pw)
//     }
//     else if(query == 'create') {
//         result = do_create(ty, pt, pt_n, data_n, etc, pw)
//     }
//     else if(query == 'change') {
//         let pw_n = document.getElementById('user_info3').value
//         if(data_n !== null) {
//             result = do_change(ty, pt, data, pt_n, data_n, etc, pw);
//         }
//         else {
//             result = do_create(ty, pt, pt_n, data_n, etc, pw)
//         }
//     }
//     else {
//         alert('Wrong Data')
//     }
//     document.getElementById('secuni_result_row').innerHTML = '<td>Result</td><td><input id="secuni_result" disabled value="' + result + '"><span id="secuni_clip" style="cursor:pointer" onclick="copy()">&#x2398</span></td>'
// }

