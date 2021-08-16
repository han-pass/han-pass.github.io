import {rsa_encrypt} from './encryption.js';

let HASH_REPS = 30000

class HANData{
  constructor(hint) {
      this.hint = hint;
  }
}

function split_ncut(delim, s, ncut) {
  let lst = s.split(delim)
  let fst = lst.slice(0,ncut)
  let rest = lst.slice(ncut)
  return (rest.length > 0 ? fst.concat([rest.join(delim)]) : fst)
}

function to_str(data, s) {
  return (data ? data.hint : '') + ';' + s;
}

function from_str(ds, ncut) {
  const [hint, s] = split_ncut(';', ds, 1);
  return [ds === '' ? null : new HANData(hint), split_ncut(';', s, ncut)];
}

function encrypt_a(pubkey, txt) {
  let sym_key = random()
  let enc_s = encrypt_s_text(sym_key,txt)
  let sym_key_enc = rsa_encrypt(pubkey, sym_key)
  let enc = sym_key_enc + ';' + enc_s
  return enc
}

function encrypt_s_text(key, data) {
  const iv = CryptoJS.lib.WordArray.random(128/8);
  const encdata = CryptoJS.AES.encrypt(data,  CryptoJS.enc.Base64.parse(key), { 
    iv: iv, 
    padding: CryptoJS.pad.NoPadding,
    mode: CryptoJS.mode.CBC
  });
  return iv.toString(CryptoJS.enc.Base64) + ',' + encdata.toString()
}

function encrypt_s(key, data) {
  const iv = CryptoJS.lib.WordArray.random(128/8);
  const encdata = CryptoJS.AES.encrypt(data, key, { 
    iv: iv, 
    padding: CryptoJS.pad.NoPadding,
    mode: CryptoJS.mode.CBC
  });
  return iv.toString(CryptoJS.enc.Base64) + ',' + encdata.toString()
}

function decrypt_s(key, data) {
  const [ivstr, encdatastr] = data.split(',');
  const iv = CryptoJS.enc.Base64.parse(ivstr);
  const encdata = CryptoJS.enc.Base64.parse(encdatastr);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: encdata }, key, {
    iv: iv, 
    padding: CryptoJS.pad.NoPadding,
    mode: CryptoJS.mode.CBC
  })
  // decrypted.sigBytes = 32;
  // const seedbyte = CryptoJS.lib.WordArray.create(decrypted.words.slice(0,8))
  // return seedbyte
  decrypted.sigBytes = 32;
  return decrypted
}

function hash(data) {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Base64)
}

async function hash_many(data, salt) {
  return await pbkdf2(data, salt, HASH_REPS)
}

async function pbkdf2(password, salt, iterations=1e6, bytes=64) {
  const pwUtf8 = new TextEncoder().encode(password);                                           // encode pw as UTF-8
  const pwKey = await crypto.subtle.importKey('raw', pwUtf8, 'PBKDF2', false, ['deriveBits']); // create pw key
  // const saltUint8 = new Uint8Array(_base64ToArrayBuffer(salt));                             // get random salt;
  const saltUint8 = new TextEncoder().encode(salt);                             // get random salt;

  const params = { name: 'PBKDF2', hash: 'SHA-512', salt: saltUint8, iterations: iterations }; // pbkdf2 params
  const keyBuffer = await crypto.subtle.deriveBits(params, pwKey, bytes*8);                        // derive key
  return _arrayBufferToBase64(keyBuffer);                                                                  // return composite key
}

function _base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function _arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

function hash_bin(data) {
  return CryptoJS.SHA256(data)
}

async function hash_many_bin(data, salt) {
  return CryptoJS.enc.Base64.parse(await pbkdf2(data, salt, HASH_REPS))
}

async function sign(pr, s) {
  const [salt, sk_str] = split_ncut(',',pr,1);
  let sk = "-----BEGIN PRIVATE KEY-----\n" + sk_str.substr(0,64) + "\n" + sk_str.substr(64,64) + "\n" + sk_str.substr(128) + "\n-----END PRIVATE KEY-----"
  const sig = new KJUR.crypto.Signature({'alg':'SHA256withECDSA'});
  sig.init(sk)
  return hexToBase64(sig.signString(await hash_many(s, salt)));
}

function random_bin(bytes=32) {
  return CryptoJS.lib.WordArray.random(bytes);
}

function random(bytes=32) {
  return CryptoJS.lib.WordArray.random(bytes).toString(CryptoJS.enc.Base64);
}

function hexToBase64(hexstring) {
  return btoa(hexstring.match(/\w{2}/g).map(function(a) {
    return String.fromCharCode(parseInt(a, 16));
  }).join(""));
}

function constructKeyPairHex(ec, seed) {
  var biN = ec.ecparams['n'];
  var biPrv = new BigInteger(seed,16);
  var epPub = ec.ecparams['G'].multiply(biPrv);
  var biX = epPub.getX().toBigInteger();
  var biY = epPub.getY().toBigInteger();

  var charlen = ec.ecparams['keylen'] / 4;
  var hPrv = ("0000000000" + biPrv.toString(16)).slice(- charlen);
  var hX   = ("0000000000" + biX.toString(16)).slice(- charlen);
  var hY   = ("0000000000" + biY.toString(16)).slice(- charlen);

  var hPub = "04" + hX + hY;

  ec.setPrivateKeyHex(hPrv);
  ec.setPublicKeyHex(hPub);
  return {'ecprvhex': hPrv, 'ecpubhex': hPub};
}

export {to_str, from_str, encrypt_a, encrypt_s, 
      encrypt_s_text, hash, random, random_bin, 
      decrypt_s, sign, hash_bin, hash_many, hash_many_bin, constructKeyPairHex}