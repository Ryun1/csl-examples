import { entropyToMnemonic } from 'bip39';
import {
    Bip32PrivateKey,
} from "@emurgo/cardano-serialization-lib-nodejs";

// Constants
const entropy = '00000000000000000000000000000000';
const mnemonic = entropyToMnemonic(entropy);
const accountIndex = 0;

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
const paymentPrivKey = accountKey.derive(0).derive(0).to_raw_key(); // role and address index
const stakePrivKey = accountKey.derive(2).derive(0).to_raw_key();
const dRepPrivKey = accountKey.derive(3).derive(0).to_raw_key();
const ccColdPrivKey = accountKey.derive(4).derive(0).to_raw_key();
const ccHotPrivKey = accountKey.derive(5).derive(0).to_raw_key();
// Public keys
const paymentPubKey = paymentPrivKey.to_public();
const stakePubKey = stakePrivKey.to_public();
const dRepPubKey = dRepPrivKey.to_public();
const ccColdPubKey = ccColdPrivKey.to_public();
const ccHotPubKey = ccHotPrivKey.to_public();

// ########### Logs ###########

console.log("DRep ID:", dRepPubKey.hash().to_bech32('drep'));
console.log("mnemonic:", mnemonic);
