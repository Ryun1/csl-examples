import { entropyToMnemonic, mnemonicToEntropy } from 'bip39';
import { Buffer } from 'buffer';
import {
    Bip32PrivateKey,
    NativeScript,
    NativeScripts,
    TimelockStart,
    ScriptAll,
    ScriptPubkey,
    Ed25519KeyHash,
    ScriptAny,
} from "@emurgo/cardano-serialization-lib-nodejs";
import { createRequire } from "module";
import { TimelockExpiry } from '@emurgo/cardano-serialization-lib-nodejs';
const require = createRequire(import.meta.url);

let { bech32 } = require('bech32')

// Constants
// const entropy = '00000000000000000000000000000000';
// const mnemonic = entropyToMnemonic(entropy);

const mnemonic = "excess behave track soul table wear ocean cash stay nature item turtle palm soccer lunch horror start stumble month panic right must lock dress"
const entropy = mnemonicToEntropy(mnemonic);

const accountIndex = 0x80000100;
// const accountIndex = 0;

function createScript1(keyHash, timelockStart = 5001) {
    const scripts = NativeScripts.new();
    const keyHashScript = NativeScript.new_script_pubkey(
        ScriptPubkey.new(Ed25519KeyHash.from_hex(keyHash))
    );
    scripts.add(keyHashScript);

    const timelock = TimelockStart.new(timelockStart);
    const timelockScript = NativeScript.new_timelock_start(timelock);
    scripts.add(timelockScript);

    const allScripts = NativeScript.new_script_all(
        ScriptAll.new(scripts)
    );

    return allScripts;
}

function createScript2(keyHash, timelockStartSlot = 5001, timelockExpirySlot = 6001) {
    
    const scriptsAll = NativeScripts.new();
    const timelockStart = TimelockStart.new(timelockStartSlot);
    const timelockStartScript = NativeScript.new_timelock_start(timelockStart);
    scriptsAll.add(timelockStartScript);

    const timelockEnd = TimelockExpiry.new(timelockExpirySlot);
    const timelockEndScript = NativeScript.new_timelock_expiry(timelockEnd);
    scriptsAll.add(timelockEndScript);

    const allScripts = NativeScript.new_script_all(
        ScriptAll.new(scriptsAll)
    );

    const scriptsAny = NativeScripts.new();

    const keyHashScript = NativeScript.new_script_pubkey(
        ScriptPubkey.new(Ed25519KeyHash.from_hex(keyHash))
    );
    scriptsAny.add(keyHashScript);
    scriptsAny.add(allScripts);

    const anyScripts = NativeScript.new_script_any(
        ScriptAny.new(scriptsAny)
    );

    return anyScripts;
}

function encodeKeyToBech32(key, prefix, limit=256) {
    const keyBytes = key.as_bytes();
    const keyWords = bech32.toWords(Buffer.from(keyBytes));
    return bech32.encode(prefix, keyWords, limit);
}

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
                        .derive(accountIndex); // account

// Derive address level keys

// Private keys
// derive role and address index
const paymentPrivKey = accountKey.derive(0).derive(0).to_raw_key();
const stakePrivKey = accountKey.derive(2).derive(0).to_raw_key();

const dRepExtPrivKey = accountKey.derive(3).derive(0);
const ccExtColdPrivKey = accountKey.derive(4).derive(0);
const ccExtHotPrivKey = accountKey.derive(5).derive(0);

const dRepPubKey = dRepExtPrivKey.to_raw_key().to_public();
const ccColdPubKey = ccExtColdPrivKey.to_raw_key().to_public();
const ccHotPubKey = ccExtHotPrivKey.to_raw_key().to_public();

// DRep ID
const dRepIdBech32 = dRepPubKey.hash().to_bech32('drep');

console.log('\n=== CIP-1852 Keys ===');
console.log('From mnemonic:', mnemonic);
console.log('For account index:', accountIndex);

console.log('\n=== Derived keys ===');

console.log('\n> DRep keys');
console.log('');
console.log('DRep private key (hex):', dRepExtPrivKey.to_raw_key().to_hex());
console.log('DRep private key (bech32):', encodeKeyToBech32(dRepExtPrivKey.to_raw_key(), 'drep_sk'));
console.log('');
console.log('DRep public key (hex):', dRepPubKey.to_hex());
console.log('DRep public key (bech32):', encodeKeyToBech32(dRepPubKey, 'drep_vk'));
console.log('');
console.log('DRep extended private key (hex):', dRepExtPrivKey.to_hex());
console.log('DRep extended private key (bech32):', encodeKeyToBech32(dRepExtPrivKey, 'drep_xsk'));
console.log('');
console.log('DRep extended verification key (hex):', dRepExtPrivKey.to_public().to_hex());
console.log('DRep extended verification key (bech32):', encodeKeyToBech32(dRepExtPrivKey.to_public(), 'drep_xvk'));
console.log('');
console.log('DRep public key hash (hex):', dRepPubKey.hash().to_hex());
console.log('DRep public key hash (bech32):', dRepIdBech32);
console.log('');
console.log('DRep script 1 hash (hex):', createScript1(dRepPubKey.hash().to_hex()).hash().to_hex());
console.log('DRep script 1 hash (bech32):', createScript1(dRepPubKey.hash().to_hex()).hash().to_bech32('drep_script'));
console.log(' ');
console.log('DRep script 2 hash (hex):', createScript2(dRepPubKey.hash().to_hex()).hash().to_hex());
console.log('DRep script 2 hash (bech32):', createScript2(dRepPubKey.hash().to_hex()).hash().to_bech32('drep_script'));
console.log(' ');

console.log('\n> Constitutional Committee Cold keys');
console.log('');
console.log('CC cold private key (hex):', ccExtColdPrivKey.to_raw_key().to_hex());
console.log('CC cold private key (bech32):', encodeKeyToBech32(ccExtColdPrivKey.to_raw_key(), 'cc_cold_sk'));
console.log('');
console.log('CC cold public key (hex):', ccColdPubKey.to_hex());
console.log('CC cold public key (bech32):', encodeKeyToBech32(ccColdPubKey, 'cc_cold_vk'));
console.log('');
console.log('CC cold extended private key (hex):', ccExtColdPrivKey.to_hex());
console.log('CC cold extended private key (bech32):', encodeKeyToBech32(ccExtColdPrivKey, 'cc_cold_xsk'));
console.log('');
console.log('CC cold extended verification key (hex):', ccExtColdPrivKey.to_public().to_hex());
console.log('CC cold extended verification key (bech32):', encodeKeyToBech32(ccExtColdPrivKey.to_public(), 'cc_cold_xvk'));
console.log('');
console.log('CC cold public key hash (hex):', ccColdPubKey.hash().to_hex());
console.log('CC cold public key hash (bech32):', ccColdPubKey.hash().to_bech32('cc_cold'));
console.log('');
console.log('CC cold script 1 hash (hex):', createScript1(ccColdPubKey.hash().to_hex()).hash().to_hex());
console.log('CC cold script 1 hash (bech32):', createScript1(ccColdPubKey.hash().to_hex()).hash().to_bech32('cc_cold_script'));
console.log(' ');
console.log('CC cold script 2 hash (hex):', createScript2(ccColdPubKey.hash().to_hex()).hash().to_hex());
console.log('CC cold script 2 hash (bech32):', createScript2(ccColdPubKey.hash().to_hex()).hash().to_bech32('cc_cold_script'));
console.log(' ');

console.log('\n> Constitutional Committee Hot keys');
console.log('');
console.log('CC hot private key (hex):', ccExtHotPrivKey.to_raw_key().to_hex());
console.log('CC hot private key (bech32):', encodeKeyToBech32(ccExtHotPrivKey.to_raw_key(), 'cc_hot_sk'));
console.log('');
console.log('CC hot public key (hex):', ccHotPubKey.to_hex());
console.log('CC hot public key (bech32):', encodeKeyToBech32(ccHotPubKey, 'cc_hot_vk'));
console.log('');
console.log('CC hot extended private key (hex):', ccExtHotPrivKey.to_hex());
console.log('CC hot extended private key (bech32):', encodeKeyToBech32(ccExtHotPrivKey, 'cc_hot_xsk'));
console.log('');
console.log('CC hot extended verification key (hex):', ccExtHotPrivKey.to_public().to_hex());
console.log('CC hot extended verification key (bech32):', encodeKeyToBech32(ccExtHotPrivKey.to_public(), 'cc_hot_xvk'));
console.log('');
console.log('CC hot public key hash (hex):', ccHotPubKey.hash().to_hex());
console.log('CC hot public key hash (bech32):', ccHotPubKey.hash().to_bech32('cc_hot'));
console.log('');
console.log('CC hot script 1 hash (hex):', createScript1(ccHotPubKey.hash().to_hex()).hash().to_hex());
console.log('CC hot script 1 hash (bech32):', createScript1(ccHotPubKey.hash().to_hex()).hash().to_bech32('cc_hot_script'));
console.log(' ');
console.log('CC hot script 2 hash (hex):', createScript2(ccHotPubKey.hash().to_hex()).hash().to_hex());
console.log('CC hot script 2 hash (bech32):', createScript2(ccHotPubKey.hash().to_hex()).hash().to_bech32('cc_hot_script'));
console.log(' ');