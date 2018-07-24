import CryptoJS from 'crypto-js'

// const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
// const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
// const iterationCount = 1000
// const keySize = 128

function generateKey(salt, passPhrase, keySize, iterationCount) {
  return CryptoJS.PBKDF2(
    passPhrase,
    CryptoJS.enc.Hex.parse(salt),
    { keySize: keySize / 32, iterations: iterationCount })
}

export function encrypt(keySize, iterationCount, salt, iv, passPhrase, plainText) {
  const key = generateKey(salt, passPhrase, keySize, iterationCount)
  const encrypted = CryptoJS.AES.encrypt(
    plainText,
    key,
    { iv: CryptoJS.enc.Hex.parse(iv) })
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}

export function decrypt(keySize, iterationCount, salt, iv, passPhrase, cipherText) {
  const key = generateKey(salt, passPhrase, keySize, iterationCount)
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText)
  })
  const decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    key,
    { iv: CryptoJS.enc.Hex.parse(iv) })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
