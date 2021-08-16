import {get_hpw, generate_prvr, get_pr, compute_prvr} from './private.js';
import {to_str, from_str, encrypt_a, encrypt_s, 
        encrypt_s_text,hash, random, random_bin, 
        decrypt_s, sign, hash_bin} from './library.js';

async function prove_new_adv(data, pw, s) {
    const hpw = get_hpw(pw);
    const [pr, vr, hint] = await generate_prvr(hpw);
    const [pr_sec, vr_sec, hint_sec] = await generate_prvr(hpw);
    let s_n = to_str(data, hint + ';' + vr + ';' + hint_sec+';'+vr_sec + ';' +  s )
    return [await sign(pr, s_n) + ';' + await sign(pr_sec,s_n) + ';' + s_n, hash(hint), pr]
}

async function get_prover_adv(data,pw) {
    return await get_pr(data, get_hpw(pw))
}

async function prove_test_adv(data, pr, s) {
    let s_n = to_str(data, random(32) + ';' +  s)
    return (pr ? await sign(pr, s_n) : "")+';'+ s_n
}

function get_prid_adv(data) {
    return hash(data.hint);
}

function parse_adv(ds) {
    const [data,{}] = from_str(ds, 0);
    return data;
}
  
export {prove_new_adv, get_prover_adv, prove_test_adv, get_prid_adv, parse_adv};