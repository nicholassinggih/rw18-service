import { doubleMetaphone } from 'double-metaphone';

const svc = {};

svc.breakIntoWords = (str) => {
    return str?.trim().split(/\s+/g) || [];
}

svc.encodeText = (text) => {
    return svc.breakIntoWords(text).map(element => doubleMetaphone(element)[1]).join(" ");
}

export default svc;