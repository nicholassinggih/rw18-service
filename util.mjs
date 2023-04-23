import { soundex } from 'soundex-code';
const svc = {};

svc.breakIntoWords = (str) => {
    return str?.trim().split(/\s+/g) || [];
}

svc.soundexText = (text) => {
    return svc.breakIntoWords(text).map(element => soundex(element)).join(" ");
}

export default svc;