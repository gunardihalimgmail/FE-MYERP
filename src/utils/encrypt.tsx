import CryptoJS from 'crypto-js';

export const encryptData = (data: any, salt: string | CryptoJS.lib.WordArray) => CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();


export const decryptData = (ciphertext: string | CryptoJS.lib.CipherParams, salt: string | CryptoJS.lib.WordArray) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, salt);
    try {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    catch (err) {
        return null;
    }
}