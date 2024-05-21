import { entropyToMnemonic } from 'bip39';
import { Buffer } from 'buffer';
import {
    Bip32PrivateKey,
    Address,
    Credential,
    make_vkey_witness,
    TransactionHash,
    EnterpriseAddress,
} from "@emurgo/cardano-serialization-lib-nodejs";
import {
    HeaderMap,
    Label,
    AlgorithmId,
    CBORValue,
    ProtectedHeaderMap,
    COSESign1Builder,
    COSEKey,
    KeyType,
    BigNum,
    Int,
    Headers,
} from "@emurgo/cardano-message-signing-nodejs"

// Constants
const entropy = '00000000000000000000000000000000';
const mnemonic = entropyToMnemonic(entropy);
const accountIndex = 0;
const messageToSign = 'cc4ab8ead604ddb498ed4b2916af7b454c65ac783b5d836fddf388e72a40eccb'

// ########### Keys ###########

// Following CIP-1852

// Generate root key
const rootKey = Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, 'hex'),
    Buffer.from('')
);

// Derive account key
const harden = (num) => {
    return 0x80000000 + num;
};

const accountKey = rootKey.derive(harden(1852)) // purpose
                        .derive(harden(1815)) // coin type
                        .derive(harden(parseInt(accountIndex))); // account

// Derive address level keys

// Private keys
// derive role and address index
const paymentPrivKey = accountKey.derive(0).derive(0).to_raw_key();
const stakePrivKey = accountKey.derive(2).derive(0).to_raw_key();
const dRepPrivKey = accountKey.derive(3).derive(0).to_raw_key();

const ccColdPrivKey = accountKey.derive(4).derive(0);
const ccHotPrivKey = accountKey.derive(5).derive(0);
// Public keys
const paymentPubKey = paymentPrivKey.to_public();
const stakePubKey = stakePrivKey.to_public();
const dRepPubKey = dRepPrivKey.to_public();
const ccColdPubKey = ccColdPrivKey.to_public();
const ccHotPubKey = ccHotPrivKey.to_public();

console.log('\n=== CC COLD KEY DETAILS ===')

const coldChaincode = ccColdPrivKey.chaincode()

console.log('chainCode', Buffer.from(coldChaincode).toString('hex'))
console.log('ccColdKey', Buffer.from(ccColdPrivKey.to_128_xprv()).toString('hex'))
// console.log('ccColdPubKey', ccColdPubKey.to_hex())
// console.log('ccColdPubKeyHash', ccColdPubKey.hash().to_hex())

console.log('=== CC HOT KEY DETAILS ===')

const hotChaincode = ccHotPrivKey.chaincode()

console.log('chainCode', Buffer.from(hotChaincode).toString('hex'))
console.log('ccHotKey', Buffer.from(ccHotPrivKey.to_128_xprv()).toString('hex'))
// console.log('ccHotPubKey', ccHotPubKey.to_hex())
// console.log('ccHotPubKeyHash', ccHotPubKey.hash().to_hex())

// ########### Witnesses ###########

// const ed25519Signature = paymentPrivKey.sign(Buffer.from(messageToSign, 'hex'));

// // cip-08

// const payload = messageToSign;
// const addressHex = (EnterpriseAddress.new(1, Credential.from_keyhash(paymentPubKey.hash()))).to_address().to_hex();
// const publicKey = paymentPubKey;
// const paymentAccountKey = paymentPrivKey;

// const protectedHeaders = HeaderMap.new();
//   protectedHeaders.set_algorithm_id(
//     Label.from_algorithm_id(AlgorithmId.EdDSA)
// );

// protectedHeaders.set_header(
//     Label.new_text('address'),
//     CBORValue.new_bytes(Buffer.from(addressHex, 'hex'))
// );

// const protectedSerialized =
//     ProtectedHeaderMap.new(protectedHeaders);
// const unprotectedHeaders = HeaderMap.new();
// const headers = Headers.new(
//     protectedSerialized,
//     unprotectedHeaders
// );
// const builder = COSESign1Builder.new(
//     headers,
//     Buffer.from(payload, 'hex'),
//     false
// );

// const toSign = builder.make_data_to_sign().to_bytes();
// const signedSigStruc = paymentAccountKey.sign(toSign).to_bytes();
// const coseSign1 = builder.build(signedSigStruc);

// const key = COSEKey.new(
//     Label.from_key_type(KeyType.OKP)
// );

// key.set_algorithm_id(
//     Label.from_algorithm_id(AlgorithmId.EdDSA)
// );

// key.set_header(
//     Label.new_int(
//       Int.new_negative(BigNum.from_str('1'))
//     ),
//     CBORValue.new_int(
//       Int.new_i32(6)
//     )
// ); 
// key.set_header(
//     Label.new_int(
//       Int.new_negative(BigNum.from_str('2'))
//     ),
//     CBORValue.new_bytes(publicKey.as_bytes())
// );

// const coseSig = Buffer.from(coseSign1.to_bytes()).toString('hex')

// // ########### Logs ###########

// console.log('keys')
// console.log('Payment private key:', paymentPrivKey.to_hex());
// console.log('Payment public key:', paymentPubKey.to_hex());
// console.log('Payment public key hash:', paymentPubKey.hash().to_hex());
// console.log('Payment Address:', addressHex);

// console.log('\nSignatures')
// console.log('ed25519Signature:', ed25519Signature.to_hex());
// console.log('coseSig:', coseSig);

// console.log("mnemonic:", mnemonic);


