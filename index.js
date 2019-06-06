const crypto = require('crypto');
let fsMd5Hash;
let fsShaHash;

exports.main = (webview) => {

}

exports.createHash = () => {
  fsMd5Hash = crypto.createHash('md5');
  fsShaHash = crypto.createHash('sha1');
}

exports.updateHash = (base64String) => {
  const data = Buffer.from(base64String, 'base64');
  fsMd5Hash.update(data);
  fsShaHash.update(data);
}

exports.getHash = () => {
  const md5 = fsMd5Hash.digest('hex');
  const sha1 = fsShaHash.digest('hex');
  return {md5, sha1};
}