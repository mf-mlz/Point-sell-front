import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

const secretKey = environment.secret_key; 


export const encrypt = (text: string): string => {
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return iv.toString() + ':' + encrypted.toString();
}

export const decrypt = (text: string): string => {
  const textParts = text.split(':');
  const iv = CryptoJS.enc.Hex.parse(textParts.shift()!); 
  const encryptedText = textParts.join(':');

  const decrypted = CryptoJS.AES.decrypt(encryptedText, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8); 
}
