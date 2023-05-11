
const EC = require('elliptic')
const BN = require('bn.js')
const crypto = require('crypto')

const decryptValidatorKeyInfo = (keypairForIndex) => {
  const curve = new EC.ec("secp256k1");
  const { privateKey, publicKey } = keypairForIndex
  const stakerPublicKeyHex = "04c4fec2cca2602f5d2359d52627b60f08a2368491310dc26c4fbca104a678f7fb6d353dfc5aa0d68359168551a4a0625d3788297c8b4742997d8a616cec0db338"
  const receivedStakerPubKeyPoint = curve.keyFromPublic(stakerPublicKeyHex, "hex").getPublic();
  console.log("receivedStakerPubKeyPoint", receivedStakerPubKeyPoint.getX().toString())
  const nodeOperatorPrivKey = new BN(privateKey);

  console.log("nodeOperatorPrivKey", nodeOperatorPrivKey.toString())
  const nodeOperatorSharedSecret = receivedStakerPubKeyPoint.mul(nodeOperatorPrivKey).getX();

  console.log("nodeOperatorSharedSecret", nodeOperatorSharedSecret.toString())
  const secretAsArray = nodeOperatorSharedSecret.toArrayLike(Buffer, "be", 32)
  console.log(secretAsArray)
  //const validatorKeyString = decrypt(file["encryptedValidatorKey"], nodeOperatorSharedSecret.toArrayLike(Buffer, "be", 32));
  //const validatorKeyPassword = decrypt(file["encryptedPassword"],secretAsArray);
  const keystoreName = decrypt("3753d1206611e6ab3ef686a3e2ca1c71:83a2f9316bafde517ccba982a8979baa75211fdbec7340536c057f411eb0cd34552098ccb46c452118a8f51195ebf474", secretAsArray);
  console.log("keystoreName:", keystoreName)
  // return { validatorKeyFile: JSON.parse(validatorKeyString), validatorKeyPassword, keystoreName }
}

function decrypt(text, ENCRYPTION_KEY) {

  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

const keypairForIndex = {
  privateKey: "04653949f1185f5fc7cb441debe970c3049b7ee8e0a9d3d21d571f65d3c35fca8c3c678dfcf88afa23984596151c842f86c9856ae8c5cc6ff3f2812ce49888213a",
	publicKey: "74749212904585498199046374455021113593920534944642600239804505865032140419159"
}

decryptValidatorKeyInfo(keypairForIndex)