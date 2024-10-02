import { entropyToMnemonic } from 'bip39';
import { Buffer } from 'buffer';
import {
    Bip32PrivateKey,

} from "@emurgo/cardano-serialization-lib-nodejs";
// Constants
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

// Derive coin type level key, according to CIP-1855
const coinTypeKey = rootKey.derive(harden(purpose)) 
                        .derive(harden(coin_type));

//Derive private keys for policies 0 and 1
const policy_1_PrivKey = coinTypeKey.derive(0).to_raw_key();
const policy_2_PrivKey = coinTypeKey.derive(1).to_raw_key();

// Create public keys from private keys
const policy_1_PubKey = policy_1_PrivKey.to_public();
const policy_2_PubKey = policy_2_PrivKey.to_public();


const policy_1_PubBech32 = policy_1_PubKey.to_bech32('policy_vk');
const policy_1_PubHex = policy_1_PubKey.to_hex()
const policy_1_HashPubBech32 = policy_1_PubKey.hash().to_bech32('policy_vkh')

const policy_2_PubBech32 = policy_2_PubKey.to_bech32('policy_vk');
const policy_2_PubHex = policy_2_PubKey.to_hex()
const policy_2_HashPubBech32 = policy_2_PubKey.hash().to_bech32('policy_vkh')

console.log('Mnemonic: ',mnemonic)

console.log('\n> Policy 1 keys');

console.log('\nPolicy 1 private key [bech32]',policy_1_PrivKey.to_bech32());
console.log('Policy 1 private key [hex]',policy_1_PrivKey.to_hex());
console.log('Policy 1 public key [bech32]',policy_1_PubBech32);
console.log('Policy 1 public key [hex]',policy_1_PubHex);
console.log('Policy 1 public key hash',policy_1_HashPubBech32,'\n');

console.log('\n> Policy 2 keys');

console.log('\nPolicy 2 private key [bech32]: ',policy_2_PrivKey.to_bech32());
console.log('Policy 2 private key [hex]: ',policy_2_PrivKey.to_hex());
console.log('Policy 2 public key [bech32]: ',policy_2_PubBech32);
console.log('Policy 2 public key [hex]: ',policy_2_PubHex);
console.log('Policy 2 public key hash: ',policy_2_HashPubBech32);