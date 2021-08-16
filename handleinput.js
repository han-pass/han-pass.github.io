
if(document.getElementById('user_info3')) {
    document.getElementById('user_info3').addEventListener('animationstart', (e) => {
        switch (e.animationName) {
            case "onAutoFillStart":
                if(document.getElementById('user_info4'))
                document.getElementById('user_info4').value = document.getElementById('user_info3').value
                return;
            case "onAutoFillCancel":
                if(document.getElementById('user_info4'))
                    document.getElementById('user_info4').value = "";
                return;
        }
    })
    document.getElementById('user_info3').addEventListener('change', (e) => {
        // ????
        window.getComputedStyle(document.getElementById('user_info3')).backgroundColor
    })
}
            

// if(localStorage.getItem('Use PM') === null) {
//     if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//         localStorage.setItem('Use PM', "Y");
//     }
//     else {
//         localStorage.setItem('Use PM', "N");
//     }
// }

// let user_info2_e = document.getElementById('user_info2');
// let user_info3_e = document.getElementById('user_info3');
// let user_info4_e = document.getElementById('user_info4');

// let user_info2="";
// let user_info3="";
// let user_info4="";


// function get_info2() {
//     if(localStorage.getItem('Use PM') === "Y")
//         return user_info2_e.value;
//     else
//         return user_info2;
// }

// function get_info3() {
//     if(localStorage.getItem('Use PM') === "Y")
//         return user_info3_e.value;
//     else
//         return user_info3
// }

// function get_info4() {
//     if(localStorage.getItem('Use PM') === "Y")
//         return user_info3_e.value;
//     else
//         return user_info4
// }

// if(localStorage.getItem('Use PM') === "Y") {
//     let inputs = document.querySelectorAll(".no_autofill");
//     inputs.forEach(e=> {
//         e.type = "password"
//         e.classList.remove("no_autofill")
//     })
//     let pm_id = document.getElementById('pm_id')
//     if(pm_id)
//         pm_id.innerHTML = '<input type="text" value="Default" name="dummy_id" id="dummy_id" autocomplete="username">'

//     if(user_info2_e) {
//         user_info2_e.id = "user_pw"
//         user_info2_e.autocomplete = "current-password"
//     }
    
//     if(user_info3_e) {
//         user_info3_e.id = "user_pw_new"
//         // for change
//         if(user_info2_e)
//             user_info3_e.autocomplete = "new-password"
//         // for create
//         else
//             user_info3_e.autocomplete = "current-password"
            
//     }
    
//     if(user_info4_e) {
//         user_info4_e.id = "user_pw_confirm"
//         user_info4_e.autocomplete = "new-password"
//         user_info4_e.style.display="none"
//     }
// }
// else {
//     if(user_info2_e) {
//         user_info2_e.addEventListener('blur', function(e){
//             user_info2 = user_info2_e.value
//             user_info2_e.value = "*".repeat(user_info2.length)
//         })
//         user_info2_e.addEventListener('focus', function(e){
//             user_info2_e.value = user_info2 
//         })
//     }
    
//     if(user_info3_e) {
//         user_info3_e.addEventListener('blur', function(e){
//             user_info3 = user_info3_e.value
//             user_info3_e.value = "*".repeat(user_info3.length)
//         })
//         user_info3_e.addEventListener('focus', function(e){
//             user_info3_e.value = user_info3 
//         })
//     }
    
//     if(user_info4_e) {
//         user_info4_e.addEventListener('blur', function(e){
//             user_info4 = user_info4_e.value
//             user_info4_e.value = "*".repeat(user_info4.length)
//         })
//         user_info4_e.addEventListener('focus', function(e){
//             user_info4_e.value = user_info4 
//         })
//     }
// }