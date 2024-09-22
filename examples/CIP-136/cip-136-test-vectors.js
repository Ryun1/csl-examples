import { Buffer } from 'buffer';
import {Jsonld} from 'jsonld';
import {
    PrivateKey,
    Credential,
    EnterpriseAddress,
} from "@emurgo/cardano-serialization-lib-nodejs";

// Constants
const privateKeyHex = '105d2ef2192150655a926bca9cccf5e2f6e496efa9580508192e1f4a790e6f53de06529129511d1cacb0664bcf04853fdc0055a47cc6d2c6d205127020760652';
const messageToSignHex = '';
const networkTag = 1; // 1 for mainnet, 0 for testnet

const pathToMetadataDocument = './cip-136-test-vectors.jsonld';

// ########### Keys ###########

// Create public key from private key
const privateKey = PrivateKey.from_hex(privateKeyHex);
const publicKey = privateKey.to_public();

// Create enterprise address
const credential = Credential.from_keyhash(publicKey.hash());
const address = (EnterpriseAddress.new(networkTag, credential)).to_address();

// ########### JSONLD ###########

const doc = {
    "http://schema.org/name": "Manu Sporny",
    "http://schema.org/url": {"@id": "http://manu.sporny.org/"},
    "http://schema.org/image": {"@id": "http://manu.sporny.org/images/manu.png"}
};

const context = {
    "name": "http://schema.org/name",
    "homepage": {"@id": "http://schema.org/url", "@type": "@id"},
    "image": {"@id": "http://schema.org/image", "@type": "@id"}
};

const nquads = await jsonld.toRDF(doc, {format: 'application/n-quads'});

// ########### Signing ###########

const signature = privateKey.sign(Buffer.from(messageToSignHex, 'hex'));

// ########### Output ###########

console.log('\n=== CIP-136 Test Vectors ===');
// describe the constants used
console.log('\n> Constants');
console.log('Using private key (hex):', privateKeyHex);
console.log('Network tag:', networkTag);
console.log()

console.log('Public key (hex):', publicKey.to_hex());
console.log('Message to sign (hex):', messageToSignHex);
// address
console.log('\n> Enterprise Address');
console.log('Address (Bech32):', address.to_bech32());
console.log('Address (hex):', address.to_hex());
// signature
console.log('\n> Signature');
console.log('Signature (hex):', signature.to_hex());
