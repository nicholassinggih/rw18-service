import { soundex } from 'soundex-code';
const svc = {};

svc.breakIntoWords = (str) => {
    return str?.trim().split(/\s+/g) || [];
}

svc.encodeText = (text) => {
    return svc.breakIntoWords(text).map(element => soundex(element)).join(" ");
}

export default svc;