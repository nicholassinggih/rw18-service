import { doubleMetaphone } from 'double-metaphone';

const svc = {};

svc.breakIntoWords = (str) => {
    return str?.trim().split(/\s+/g) || [];
}

svc.encodeText = (text) => {
    return svc.breakIntoWords(text).map(element => doubleMetaphone(element)[1])
        .map(w => w === "A"? "AA" : w)
        .filter(x => !svc.isEmptyString(x))
        .join(" ");
}

svc.isEmptyString = (str) => {
    return str == null || str.trim() == '';
}

export default svc;