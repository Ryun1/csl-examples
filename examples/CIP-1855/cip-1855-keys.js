import { entropyToMnemonic } from 'bip39';
import { Buffer } from 'buffer';
import {
    Bip32PrivateKey,
    BaseAddress,
    RewardAddress,
    Credential
} from "@emurgo/cardano-serialization-lib-nodejs";
// Constantsgit
const entropy = '00000000000000000000000000000000';
const mnemonic = entropyToMnemonic(entropy);
const purpose = 1855  // Forging policy keys for HD Wallets
const coin_type = 1815


//m / purpose' / coin_type' / policy_ix'
//m/1855’/1815’/0’

// Generate root key
const rootKey = Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, 'hex'),
    Buffer.from('')
);

// Helper function to harden a number
const harden = (num) => {
    return 0x80000000 + num;
};

// Derive account level key, according to CIP-1855
const accountKey = rootKey.derive(harden(purpose)) 
                        .derive(harden(coin_type));

//Derive private keys for policies 0 and 1
const policy_1_PrivKey = accountKey.derive(0).to_raw_key();
const policy_2_PrivKey = accountKey.derive(1).to_raw_key();

// Create public keys from private keys
const policy_1_PubKey = policy_1_PrivKey.to_public();
const policy_2_PubKey = policy_2_PrivKey.to_public();


const policy_1_PubBech32 = policy_1_PubKey.hash().to_bech32('policy_vk');

console.log(mnemonic,'\n');
console.log(rootKey,'\n');
console.log(accountKey,'\n');
console.log(policy_1_PrivKey,'\n');
console.log(policy_1_PrivBech32,'\n');
console.log(policy_1_PubKey,'\n');
console.log(policy_1_PubBech32,'\n');