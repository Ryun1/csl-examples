import {
    Bip32PrivateKey,
} from "@emurgo/cardano-serialization-lib-nodejs";

import {
    entropyToMnemonic,
} from 'bip39';

let entropy = '00000000000000000000000000000000'
let mnemonic = entropyToMnemonic(entropy);
let privateKey = Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, 'hex'),
    Buffer.from('')
);

console.log("mnemonic", mnemonic);
console.log("privateKey", (privateKey).to_bech32());