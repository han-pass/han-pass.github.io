window.onload = function() {
    let anchor = window.location.href.split('#');
    anchor = anchor[1];
    let data = fromBase64URL(anchor)
    let [id,url,forget] = split_ncut('/', data, 2)
    let key = id + '&' + url;
    let stored = localStorage.getItem(key);
    if(stored) {
        let [date, pwn, prid, pr,{}] = stored.split('&');
        let val = [date,pwn,prid,pr,forget].join('&')
        localStorage.setItem(key, val)        
    }
    else {
        let val = '0&&&&' + forget;
        localStorage.setItem(key, val)
    }
    alert('Password Restored!')
    window.close()
}

function fromBase64URL(input) {
    // Replace non-url compatible chars with base64 standard chars
    input = input
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    var pad = input.length % 4;
    if(pad) {
      if(pad === 1) {
        throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
      }
      input += new Array(5-pad).join('=');
    }
    return atob(input);
}

function split_ncut(delim, s, ncut) {
    let lst = s.split(delim)
    let fst = lst.slice(0,ncut)
    let rest = lst.slice(ncut)
    return (rest.length > 0 ? fst.concat([rest.join(delim)]) : fst)
  }