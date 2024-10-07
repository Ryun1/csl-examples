import { Buffer } from 'buffer';
import pkg from 'jsonld';
import {
    PrivateKey,
    Credential,
    EnterpriseAddress,
} from "@emurgo/cardano-serialization-lib-nodejs";
import { blake2b } from 'blakejs';
import fs from 'fs/promises';

const { toRDF } = pkg;

// Constants
const authorPrivateKeyHex = '105d2ef2192150655a926bca9cccf5e2f6e496efa9580508192e1f4a790e6f53de06529129511d1cacb0664bcf04853fdc0055a47cc6d2c6d205127020760652';
const networkTag = 1; // 1 for mainnet, 0 for testnet
const pathToMetadataDocument = './examples/CIP-136/treasury-withdrawal-unconstitutional.jsonld';

// ########### Keys ###########

// Create private and public keys
const privateKey = PrivateKey.from_hex(authorPrivateKeyHex);
const publicKey = privateKey.to_public();

// Create enterprise address
const credential = Credential.from_keyhash(publicKey.hash());
const address = (EnterpriseAddress.new(networkTag, credential)).to_address();

// ########### JSONLD ###########

// Load JSON-LD document
async function loadJSONLD(path) {
    const data = await fs.readFile(path, 'utf8');
    return JSON.parse(data);
}

// Convert body to N-Quads and hash it
async function hashJSONLDBody(doc) {
    const body = doc.body;

    // Convert body to N-Quads format
    const nquadsBody = await toRDF(body, { format: 'application/n-quads' });

    // Hash the N-Quads string using Blake2b (256-bit)
    const hash = blake2b(Buffer.from(nquadsBody), null, 32); // 32 bytes for 256-bit hash
    return Buffer.from(hash).toString('hex');
}

// Load the JSON-LD document
const doc = await loadJSONLD(pathToMetadataDocument);

// Hash the body of the JSON-LD document
const hashedBody = await hashJSONLDBody(doc);

// Sign the body with the author's private key
const signature = privateKey.sign(Buffer.from(hashedBody, 'hex'));

// Add the witness section to the JSON-LD document
doc.authors[0].witness.signature = signature.to_hex();
doc.authors[0].witness.publicKey = publicKey.to_hex();

// Final hash of complete document
const finalDocHash = blake2b(Buffer.from(JSON.stringify(doc)), null, 32); // 32 bytes for 256-bit hash

// Output the data
console.log('\n=== CIP-136 Test Vectors ===');
console.log('\n> Constants');
console.log("Using author's private key (hex):", authorPrivateKeyHex);
console.log('Network tag:', networkTag);
console.log('Path to JSON doc:', pathToMetadataDocument);

console.log('\n> Public info');
console.log("Author's Public key (hex):", publicKey.to_hex());
console.log('Address (Bech32):', address.to_bech32());
console.log('Address (hex):', address.to_hex());

console.log('\n> JSON-LD Document');
console.log('Canonized and hashed body (hex):', hashedBody);
console.log("Author's Signature over the hashed body (hex):", signature.to_hex());
console.log('Final hash of the complete document (hex):', Buffer.from(finalDocHash).toString('hex'));

console.log('\nUpdated JSON-LD Document');
console.log(JSON.stringify(doc, null, 2));
