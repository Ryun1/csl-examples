import { entropyToMnemonic } from 'bip39';
import { Buffer } from 'buffer';
import {
    Bip32PrivateKey,
    BaseAddress,
    RewardAddress,
    Credential
} from "@emurgo/cardano-serialization-lib-nodejs";

// Constants
const entropy = '00000000000000000000000000000000';
const mnemonic = entropyToMnemonic(entropy);
const accountIndex = 0;
const keyIndex = 0;
const networkTag = 0;

// ########### Keys ###########

// Following CIP-1852

// Generate root key
const rootKey = Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, 'hex'),
    Buffer.from('')
);

// Helper function to harden a number
const harden = (num) => {
    return 0x80000000 + num;
};

// Derive account level key, according to CIP-1852
const accountKey = rootKey.derive(harden(1852)) // purpose
                        .derive(harden(1815)) // coin type
                        .derive(harden(parseInt(accountIndex))); // account

// Derive address level keys

// Private keys
// derive role and address index
const paymentPrivKey = accountKey.derive(0).derive(keyIndex).to_raw_key();
const stakePrivKey = accountKey.derive(2).derive(keyIndex).to_raw_key();
const dRepPrivKey = accountKey.derive(3).derive(keyIndex).to_raw_key();
const ccColdPrivKey = accountKey.derive(4).derive(keyIndex).to_raw_key();
const ccHotPrivKey = accountKey.derive(5).derive(keyIndex).to_raw_key();

// Create public keys from private keys
const paymentPubKey = paymentPrivKey.to_public();
const stakePubKey = stakePrivKey.to_public();
const dRepPubKey = dRepPrivKey.to_public();
const ccColdPubKey = ccColdPrivKey.to_public();
const ccHotPubKey = ccHotPrivKey.to_public();

// Create data from keys

// Credentials
const paymentCredential = Credential.from_keyhash(paymentPubKey.hash());
const stakeCredential = Credential.from_keyhash(stakePubKey.hash());

// Payment address
const baseAddress = BaseAddress.new(networkTag, paymentCredential, stakeCredential);
const paymentAddressBech32 = baseAddress.to_address().to_bech32();

// Stake/ Rewards address
// Described via CIP-11 (https://github.com/cardano-foundation/CIPs/tree/master/CIP-0011)
// Bech32 encoding prefix defined via CIP-05 (https://github.com/cardano-foundation/CIPs/tree/master/CIP-0005)
const stakeAddressBech32 = (RewardAddress.new(networkTag, stakeCredential)).to_address().to_bech32();

// DRep ID
// Described via CIP-105 (https://github.com/cardano-foundation/CIPs/tree/master/CIP-0105)
// Bech32 encoding prefix defined via CIP-05 (https://github.com/cardano-foundation/CIPs/tree/master/CIP-0005)
const dRepIdBech32 = dRepPubKey.hash().to_bech32('drep');

console.log('\n=== CIP-1852 Keys ===');
console.log('From mnemonic:', mnemonic);
console.log('For account index:', accountIndex);

console.log('\n> Payment keys');
console.log('Payment private key (hex):', paymentPrivKey.to_hex());
console.log('Payment public key (hex):', paymentPubKey.to_hex());

console.log('\n> Stake keys');
console.log('Stake private key (hex):', stakePrivKey.to_hex());
console.log('Stake public key (hex):', stakePubKey.to_hex());

console.log('\n> DRep keys');
console.log('DRep private key (hex):', dRepPrivKey.to_hex());
console.log('DRep public key (hex):', dRepPubKey.to_hex());

console.log('\n> Constitutional Committee Cold keys');
console.log('CC cold private key (hex):', ccColdPrivKey.to_hex());
console.log('CC cold public key (hex):', ccColdPubKey.to_hex());

console.log('\n> Constitutional Committee Hot keys');
console.log('CC hot private key (hex):', ccHotPrivKey.to_hex());
console.log('CC hot public key (hex):', ccHotPubKey.to_hex());

console.log('\n=== From keys create associated data ===');

console.log('\n> Payment Address (network tag + payment pub key hash + stake pub key hash)');
console.log('Payment Address (Bech32 encoded):', paymentAddressBech32);

console.log('\n> Stake (rewards) Address (network tag + stake pub key hash)');
console.log('Stake Address (Bech32 encoded):', stakeAddressBech32);

console.log('\n> DRep ID (DRep key hash)');
console.log('DRep ID (Bech32 encoded):', dRepIdBech32);
